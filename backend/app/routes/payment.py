from flask import Blueprint, request, jsonify
from app import db
from app.models import Order
import razorpay
import hmac
import hashlib
import os

payment_bp = Blueprint('payment', __name__)

def get_razorpay_client():
    return razorpay.Client(
        auth=(os.getenv('RAZORPAY_KEY'), os.getenv('RAZORPAY_SECRET'))
    )

@payment_bp.route('/razorpay/create-order', methods=['POST'])
def create_razorpay_order():
    data = request.get_json()
    amount = data.get('amount')  # in paise
    order_id = data.get('order_id')

    if not amount or not order_id:
        return jsonify({'error': 'amount and order_id are required'}), 400

    try:
        client = get_razorpay_client()
        razorpay_order = client.order.create({
            'amount': int(float(amount) * 100),  # convert to paise
            'currency': 'INR',
            'receipt': f'order_{order_id}',
            'notes': {'order_id': str(order_id)}
        })

        # Store razorpay order ID
        db_order = Order.query.get(order_id)
        if db_order:
            db_order.razorpay_order_id = razorpay_order['id']
            db.session.commit()

        return jsonify({
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': os.getenv('RAZORPAY_KEY')
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payment_bp.route('/verify-payment', methods=['POST'])
def verify_payment():
    data = request.get_json()
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    order_id = data.get('order_id')

    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id]):
        return jsonify({'error': 'Missing payment verification data'}), 400

    # Verify signature
    secret = os.getenv('RAZORPAY_SECRET', '').encode('utf-8')
    message = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
    expected_signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

    if expected_signature != razorpay_signature:
        return jsonify({'error': 'Payment verification failed'}), 400

    # Update order
    order = Order.query.get(order_id)
    if order:
        order.payment_status = 'paid'
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        db.session.commit()

    return jsonify({'message': 'Payment verified successfully', 'order': order.to_dict() if order else None}), 200

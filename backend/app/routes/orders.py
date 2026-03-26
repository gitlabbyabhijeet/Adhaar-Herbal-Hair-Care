from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app import db
from app.models import Order, OrderItem, Product
import uuid
import datetime

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    return f"ADH-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"

@orders_bp.route('/create-order', methods=['POST'])
def create_order():
    data = request.get_json()

    # Validate required fields
    required = ['customer_name', 'customer_email', 'customer_phone',
                'address', 'pincode', 'payment_method', 'items']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    items_data = data.get('items', [])
    if not items_data:
        return jsonify({'error': 'Cart is empty'}), 400

    # Calculate totals and validate stock
    subtotal = 0
    order_items = []
    for item in items_data:
        product = Product.query.get(item.get('product_id'))
        if not product:
            return jsonify({'error': f"Product {item.get('product_id')} not found"}), 404
        if product.stock < item.get('quantity', 1):
            return jsonify({'error': f"Insufficient stock for {product.name}"}), 400

        price = float(product.price)
        quantity = int(item.get('quantity', 1))
        subtotal += price * quantity
        order_items.append({'product': product, 'quantity': quantity, 'price': price})

    shipping_fee = 0 if subtotal >= 499 else 49
    total_amount = subtotal + shipping_fee

    # Get optional user_id
    user_id = None
    auth_header = request.headers.get('Authorization')
    # (actual JWT check is optional for guest checkout)

    order = Order(
        order_number=generate_order_number(),
        user_id=user_id,
        customer_name=data['customer_name'],
        customer_email=data['customer_email'],
        customer_phone=data['customer_phone'],
        address=data['address'],
        pincode=data['pincode'],
        city=data.get('city', ''),
        state=data.get('state', ''),
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total_amount=total_amount,
        payment_method=data['payment_method'],
        payment_status='paid' if data['payment_method'] == 'cod' else 'pending',
        order_status='processing'
    )
    db.session.add(order)
    db.session.flush()  # Get order ID before committing

    for item_data in order_items:
        item_data['product'].stock -= item_data['quantity']
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product'].id,
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.session.add(order_item)

    db.session.commit()
    return jsonify({'message': 'Order created', 'order': order.to_dict()}), 201


@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    claims = get_jwt()
    if claims.get('role') == 'admin':
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]}), 200


@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({'order': order.to_dict()}), 200


@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    status = data.get('order_status')
    valid_statuses = ['processing', 'shipped', 'delivered', 'cancelled']
    if status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400

    order.order_status = status
    db.session.commit()
    return jsonify({'message': 'Order status updated', 'order': order.to_dict()}), 200

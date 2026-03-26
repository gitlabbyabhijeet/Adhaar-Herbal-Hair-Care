from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app import db
from app.models import User, Product, Order

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def dashboard():
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    pending_orders = Order.query.filter_by(order_status='processing').count()
    total_revenue = db.session.query(db.func.sum(Order.total_amount)).filter_by(payment_status='paid').scalar() or 0

    return jsonify({
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'pending_orders': pending_orders,
        'total_revenue': float(total_revenue)
    }), 200

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    status = request.args.get('status')
    query = Order.query
    if status:
        query = query.filter_by(order_status=status)
    orders = query.order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]}), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200

@admin_bp.route('/seed', methods=['POST'])
@admin_required
def seed_products():
    """Seed initial product data"""
    sample_products = [
        {
            'name': 'Adhaar Herbal Hair Oil',
            'description': 'Nourishing herbal hair oil infused with Bhringraj, Amla, and Brahmi extracts. Promotes hair growth, reduces hair fall, and adds natural shine.',
            'price': 449,
            'original_price': 599,
            'stock': 100,
            'category': 'Hair Oil',
            'ingredients': 'Bhringraj Extract, Amla Oil, Brahmi Extract, Sesame Oil, Coconut Oil, Neem Extract',
            'benefits': 'Reduces hair fall, Promotes hair growth, Nourishes scalp, Adds natural shine',
            'is_featured': True,
            'rating': 4.8,
            'reviews_count': 324,
            'image_url': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500'
        },
        {
            'name': 'Adhaar Protein Hair Mask',
            'description': 'Deep conditioning herbal hair mask with eggs protein, Shikakai and Reetha for silky, frizz-free hair.',
            'price': 349,
            'original_price': 449,
            'stock': 80,
            'category': 'Hair Mask',
            'ingredients': 'Shikakai, Reetha, Egg Protein, Aloe Vera, Fenugreek Extract',
            'benefits': 'Deep conditioning, Reduces frizz, Strengthens hair, Improves texture',
            'is_featured': True,
            'rating': 4.7,
            'reviews_count': 218,
            'image_url': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'
        },
        {
            'name': 'Adhaar Scalp Serum',
            'description': 'Lightweight scalp serum with Rosemary, Peppermint and Vitamin E for healthy scalp and stronger roots.',
            'price': 549,
            'original_price': 699,
            'stock': 60,
            'category': 'Serum',
            'ingredients': 'Rosemary Extract, Peppermint Oil, Vitamin E, Niacinamide, Ginger Root Extract',
            'benefits': 'Stimulates hair follicles, Improves scalp health, Strengthens roots, Reduces dandruff',
            'is_featured': True,
            'rating': 4.9,
            'reviews_count': 156,
            'image_url': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500'
        },
        {
            'name': 'Adhaar Herbal Shampoo',
            'description': 'Sulfate-free herbal shampoo with Reetha, Amla and Hibiscus. Gentle cleansing while maintaining natural oils.',
            'price': 299,
            'original_price': 399,
            'stock': 120,
            'category': 'Shampoo',
            'ingredients': 'Reetha Extract, Amla Extract, Hibiscus Flower Extract, Aloe Vera Gel',
            'benefits': 'Gentle cleansing, Maintains natural oils, Strengthens hair, Adds volume',
            'is_featured': False,
            'rating': 4.6,
            'reviews_count': 428,
            'image_url': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500'
        },
        {
            'name': 'Adhaar Hair Growth Kit',
            'description': 'Complete hair care ritual kit including Hair Oil, Shampoo, and Scalp Serum for maximum results.',
            'price': 1099,
            'original_price': 1497,
            'stock': 40,
            'category': 'Kit',
            'ingredients': 'See individual products',
            'benefits': 'Complete hair care, Best value, 3-step ritual, Maximum results',
            'is_featured': True,
            'rating': 4.9,
            'reviews_count': 89,
            'image_url': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500'
        }
    ]

    created = 0
    for p_data in sample_products:
        if not Product.query.filter_by(name=p_data['name']).first():
            product = Product(**p_data)
            db.session.add(product)
            created += 1

    db.session.commit()
    return jsonify({'message': f'Seeded {created} products'}), 201

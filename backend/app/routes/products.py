from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app import db
from app.models import Product

products_bp = Blueprint('products', __name__)

def admin_required():
    claims = get_jwt()
    return claims.get('role') == 'admin'

@products_bp.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    featured = request.args.get('featured')
    search = request.args.get('search')

    query = Product.query
    if category:
        query = query.filter(Product.category == category)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if featured == 'true':
        query = query.filter(Product.is_featured == True)
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))

    products = query.order_by(Product.created_at.desc()).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200


@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({'product': product.to_dict()}), 200


@products_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    if not admin_required():
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()
    required = ['name', 'description', 'price', 'category']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        original_price=data.get('original_price'),
        stock=data.get('stock', 0),
        image_url=data.get('image_url'),
        category=data['category'],
        ingredients=data.get('ingredients'),
        benefits=data.get('benefits'),
        is_featured=data.get('is_featured', False),
        rating=data.get('rating', 4.5),
        reviews_count=data.get('reviews_count', 0)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Product created', 'product': product.to_dict()}), 201


@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    if not admin_required():
        return jsonify({'error': 'Admin access required'}), 403

    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    for field in ['name', 'description', 'price', 'original_price', 'stock',
                  'image_url', 'category', 'ingredients', 'benefits', 'is_featured',
                  'rating', 'reviews_count']:
        if field in data:
            setattr(product, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Product updated', 'product': product.to_dict()}), 200


@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    if not admin_required():
        return jsonify({'error': 'Admin access required'}), 403

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    return jsonify({'categories': [c[0] for c in categories]}), 200

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
import os
import cloudinary
import cloudinary.uploader

upload_bp = Blueprint('upload', __name__)

def configure_cloudinary():
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

@upload_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        configure_cloudinary()
        result = cloudinary.uploader.upload(
            file,
            folder='adhaar',
            transformation=[{'width': 800, 'height': 800, 'crop': 'limit'}]
        )
        return jsonify({'url': result['secure_url']}), 200
    except Exception as e:
        # Fallback: return a placeholder URL if Cloudinary not configured
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

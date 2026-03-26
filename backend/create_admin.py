"""
Create the admin user and initialize the database.
Run this once after setting up your PostgreSQL database.

Usage:
    python create_admin.py
"""
from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Database tables created")

    # Create admin if not exists
    admin_email = 'admin@adhaar.in'
    if not User.query.filter_by(email=admin_email).first():
        admin = User(name='Adhaar Admin', email=admin_email, role='admin')
        admin.set_password('Admin@123')   # ← Change this password!
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin user created: {admin_email} / Admin@123")
        print("⚠️  CHANGE THE PASSWORD after first login!")
    else:
        print("ℹ️  Admin user already exists")

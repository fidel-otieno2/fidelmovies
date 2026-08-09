from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

def _tokens(user):
    return {
        'access_token': create_access_token(identity=str(user.id)),
        'refresh_token': create_refresh_token(identity=str(user.id)),
        'user': user.to_dict(),
    }

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(
        name=name,
        email=email,
        password=bcrypt.generate_password_hash(password).decode('utf-8'),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({**_tokens(user), 'message': 'Registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify(_tokens(user))

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    return jsonify({'access_token': create_access_token(identity=get_jwt_identity())})

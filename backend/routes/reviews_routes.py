from flask import Blueprint, request, jsonify
from extensions import db
from models.movie import Review
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/<int:movie_id>', methods=['GET'])
def get_reviews(movie_id):
    reviews = Review.query.filter_by(movie_id=movie_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

@reviews_bp.route('/<int:movie_id>', methods=['POST'])
@jwt_required()
def add_review(movie_id):
    user_id = int(get_jwt_identity())
    data = request.json or {}
    rating = data.get('rating')
    comment = data.get('comment', '').strip()

    if not rating or not (1 <= int(rating) <= 5):
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    existing = Review.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing:
        existing.rating = int(rating)
        existing.comment = comment
        db.session.commit()
        return jsonify(existing.to_dict())

    review = Review(user_id=user_id, movie_id=movie_id, rating=int(rating), comment=comment)
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201

@reviews_bp.route('/<int:movie_id>/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(movie_id, review_id):
    user_id = int(get_jwt_identity())
    review = Review.query.filter_by(id=review_id, user_id=user_id, movie_id=movie_id).first()
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'})

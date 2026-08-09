from flask import Blueprint, request, jsonify
from extensions import db
from models.movie import WatchlistItem
from flask_jwt_extended import jwt_required, get_jwt_identity

watchlist_bp = Blueprint('watchlist', __name__)

@watchlist_bp.route('/', methods=['GET'])
@jwt_required()
def get_watchlist():
    user_id = int(get_jwt_identity())
    items = WatchlistItem.query.filter_by(user_id=user_id).order_by(WatchlistItem.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items])

@watchlist_bp.route('/', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    user_id = int(get_jwt_identity())
    data = request.json or {}
    movie_id = data.get('movie_id')
    if not movie_id:
        return jsonify({'error': 'movie_id is required'}), 400

    existing = WatchlistItem.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing:
        return jsonify({'error': 'Already in watchlist'}), 409

    item = WatchlistItem(
        user_id=user_id,
        movie_id=movie_id,
        title=data.get('title'),
        poster_path=data.get('poster_path'),
        vote_average=data.get('vote_average'),
        release_date=data.get('release_date'),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@watchlist_bp.route('/<int:movie_id>', methods=['DELETE'])
@jwt_required()
def remove_from_watchlist(movie_id):
    user_id = int(get_jwt_identity())
    item = WatchlistItem.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if not item:
        return jsonify({'error': 'Not in watchlist'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Removed from watchlist'})

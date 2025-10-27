# """Flask backend for Rookie Play."""

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import requests
from game import GameService
from play import PlayService
from team import TeamService
from player import PlayerService

app = Flask(__name__)
CORS(app)

game_service = GameService()
play_service = PlayService()
team_service = TeamService()
player_service = PlayerService()


@app.route('/api')
def hello_world():
    """Root API endpoint used for a quick health check and quick info.

    Returns:
      JSON with message and available endpoints.
    """
    return jsonify(
        message="Rookie Play API",
        version="0.1",
        endpoints=[
            "/api/games",
            "/api/games/<game_id>",
            "/api/games/<game_id>/plays",
            "/api/games/<game_id>/explain-play",
            "/api/teams",
            "/api/players/<player_id>",
            "/api/users/<uid>/favorites",
            "/api/health",
        ],
    )

@app.route('/api/games')
def list_games():
    try:
        games = game_service.list_games(request)
        return jsonify(games=games)
    except Exception:
        abort(502, description='Failed to fetch games')


@app.route('/api/games/<game_id>')
def get_game(game_id: str):
    try:
        game = game_service.get_game(game_id)
        return jsonify(game=game)
    except Exception:
        abort(502, description='Failed to fetch game')

@app.route('/api/games/<game_id>/plays')
def game_plays(game_id: str):
    try:
        plays = play_service.game_plays(game_id, request)
        return jsonify(plays=plays)
    except Exception:
        abort(502, description='Failed to fetch plays')

@app.route('/api/games/<game_id>/explain-play')
def explain_play(game_id: str):
    """Explain a single play for beginners.

    Query params:
      - play_id

    Response (sample): {play_id, explanation: {what_happened, why_the_play_happened, possible_alternatives, numbers_explained}}
    """
    play_id = request.args.get('play_id')
    if not play_id:
        abort(400, description="play_id required in query params")

    try:
        play_obj = play_service.explain_play(game_id, play_id)
        return jsonify(play_id=play_id, explanation=play_obj)
    except Exception:
        abort(502, description='Failed to explain play')

@app.route('/api/teams')
def list_teams():
    try:
        teams = team_service.list_teams()
        return jsonify(teams=teams)
    except Exception:
        abort(502, description='Failed to fetch teams')

@app.route('/api/teams/<team_id>')
def get_team(team_id: str):
    try:
        team = team_service.get_team(team_id)
        return jsonify(team=team)
    except Exception:
        abort(502, description='Failed to fetch team')

@app.route('/api/players/<player_id>')
def get_player(player_id: str):
    try:
        player = player_service.get_player(player_id)
        return jsonify(player=player)
    except Exception:
        abort(502, description='Failed to fetch player')

@app.route('/api/users/<uid>/favorites', methods=['GET', 'POST', 'DELETE'])
def user_favorites(uid: str):
    """GET returns favorites, POST adds a favorite, DELETE removes.

    POST body: {type: "team|player|game", id: "..."}
    Response: {success: true, favorites: [...]}
    """
    if request.method == 'GET':
        # placeholder
        return jsonify(favorites=[{"type": "team", "id": "10"}])
    body = request.get_json(silent=True) or {}
    if request.method == 'POST':
        if 'type' not in body or 'id' not in body:
            abort(400, "body must include type and id")
        # In prod: write to Firebase
        return jsonify(success=True, added=body), 201
    if request.method == 'DELETE':
        # In prod: remove from Firebase
        return jsonify(success=True, removed=body)

@app.route('/api/users/<uid>/notes', methods=['GET', 'POST'])
def user_notes(uid: str):
    """Simple user notes for plays or games.

    POST body: {game_id, play_id(optional), note}
    """
    if request.method == 'GET':
        return jsonify(notes=[])
    body = request.get_json(silent=True) or {}
    if 'note' not in body:
        abort(400, "note required")
    # In prod: persist to Firebase
    return jsonify(success=True, note=body), 201


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
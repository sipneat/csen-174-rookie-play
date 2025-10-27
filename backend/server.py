# """Flask backend for Rookie Play."""

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from typing import Dict, Any
import requests

app = Flask(__name__)
CORS(app)


def fetch_json(url: str, params: dict | None = None) -> dict:
    """
    Fetch JSON from a URL with basic error handling.
    """
    params = params or {}

    try:
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print("Error fetching %s: %s", url, e)
        raise

    return data


def sample_game(game_id: str) -> Dict[str, Any]:
    """Return a sample game object (placeholder).

    Contract (sample):
    - input: game_id (string)
    - output: {id, home_team, away_team, status, start_time}
    """
    return {
        "id": game_id,
        "home_team": {"id": "10", "name": "Home Hawks", "abbr": "HH"},
        "away_team": {"id": "20", "name": "Away Eagles", "abbr": "AE"},
        "status": "STATUS_SCHEDULED",
        "start_time": "2025-10-22T20:20:00Z",
    }


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


@app.route('/api/health')
def health():
    """Simple health endpoint used by pipelines/containers.

    Returns 200 and simple json.
    """
    return jsonify(status="ok")


@app.route('/api/games')
def list_games():
    """List recent/upcoming games.

    Query params:
      - date (YYYY-MM-DD) optional
      - week, season optional

    Response (sample): {games: [ {id, home_team, away_team, status, start_time}, ... ]}
    """
    # Use ESPN scoreboard endpoint from gist
    # Accepts ?dates=YYYYMMDD or ?dates=YYYY
    date = request.args.get('date')
    params = {}
    if date:
        params['dates'] = date
    url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
    try:
        data = fetch_json(url, params=params)
        # Map to simplified game objects
        games = []
        for ev in data.get('events', []):
            gid = ev.get('id')
            competitions = ev.get('competitions', [])
            if competitions:
                comp = competitions[0]
                competitors = comp.get('competitors', [])
                home = next((c for c in competitors if c.get('homeAway') == 'home'), {})
                away = next((c for c in competitors if c.get('homeAway') == 'away'), {})
                games.append({
                    'id': gid,
                    'home_team': {'id': home.get('team', {}).get('id'), 'name': home.get('team', {}).get('displayName'), 'abbr': home.get('team', {}).get('abbrev')},
                    'away_team': {'id': away.get('team', {}).get('id'), 'name': away.get('team', {}).get('displayName'), 'abbr': away.get('team', {}).get('abbrev')},
                    'status': ev.get('status', {}).get('type', {}).get('name'),
                    'start_time': ev.get('date'),
                })
        return jsonify(games=games)
    except Exception:
        abort(502, description='Failed to fetch games from upstream')


@app.route('/api/games/<game_id>')
def get_game(game_id: str):
    """Return detailed metadata for a single game.

    Response (sample): {id, teams, venue, status, scoreboard, officials}
    """
    # Fetch full game object from cdn.espn.com/core/nfl/game which has detailed info
    url = 'https://cdn.espn.com/core/nfl/game'
    params = {'xhr': 1, 'gameId': game_id}
    try:
        data = fetch_json(url, params=params)
        # return the raw payload under a 'game' key for now
        return jsonify(game=data)
    except Exception:
        abort(502, description='Failed to fetch game from upstream')


@app.route('/api/games/<game_id>/plays')
def game_plays(game_id: str):
    """Return play-by-play list for a given game_id.

    Query params:
      - limit (int) number of plays to return

    Response (sample): {plays: [ {id, clock, down, description, teams, stats}, ... ]}
    """
    limit = int(request.args.get('limit', 300))
    # ESPN play-by-play (partners/core) endpoint
    url = f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/{game_id}/competitions/{game_id}/plays'
    params = {'limit': limit}
    try:
        data = fetch_json(url, params=params)
        plays = data.get('items') or data.get('plays') or data.get('entries') or data.get('play', [])
        # some endpoints return items, some return plays; normalize minimally
        if isinstance(plays, dict):
            # try to find a list inside
            for key in ['plays', 'items', 'entries']:
                if key in plays and isinstance(plays[key], list):
                    plays = plays[key]
                    break
        return jsonify(plays=plays)
    except Exception:
        # fallback to cdn playbyplay endpoint as alternative
        try:
            url2 = 'https://cdn.espn.com/core/nfl/playbyplay'
            params2 = {'xhr': 1, 'gameId': game_id}
            data2 = fetch_json(url2, params=params2)
            plays2 = data2.get('play', []) or data2.get('plays', [])
            return jsonify(plays=plays2)
        except Exception:
            abort(502, description='Failed to fetch plays from upstream')


@app.route('/api/games/<game_id>/explain-play', methods=['POST'])
def explain_play(game_id: str):
    """Explain a single play for beginners.

    Request JSON:
      - play_id (string) or complete play object

    Response (sample): {play_id, explanation: {what_happened, why_the_play_happened, possible_alternatives, numbers_explained}}
    """
    body = request.get_json(silent=True) or {}
    play_id = body.get('play_id') or body.get('id')
    play_obj = body.get('play')
    if not play_id and not play_obj:
        abort(400, description="play_id or play object required in body")

    # If only play_id given, try to fetch it from the plays endpoint
    if not play_obj and play_id:
        try:
            # many ESPN play ids are event-specific; try to fetch all plays and locate the one with matching id
            url = f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/{game_id}/competitions/{game_id}/plays'
            data = fetch_json(url, params={'limit': 500})
            items = data.get('items') or data.get('plays') or []
            for p in items:
                if str(p.get('id')) == str(play_id) or str(p.get('displayId')) == str(play_id):
                    play_obj = p
                    break
        except Exception:
            # best-effort only; continue to template explanation
            play_obj = None

    # Build an explanation using fields available. Keep it light and beginner-friendly.
    what = 'A brief summary could not be built.'
    why = 'Context not available.'
    numbers = {}
    alternatives = []
    if play_obj:
        desc = play_obj.get('text') or play_obj.get('description') or play_obj.get('playDescription') or ''
        what = desc
        # extract basic metadata
        quarter = play_obj.get('period') or play_obj.get('quarter')
        down = play_obj.get('down')
        distance = play_obj.get('distance')
        offense = play_obj.get('team', {}).get('id') if isinstance(play_obj.get('team'), dict) else play_obj.get('offense')
        why = f"It was {('in quarter ' + str(quarter)) if quarter else ''} "
        if down:
            why += f"with {down} down"
        if distance:
            why += f" and {distance} to go"
        # numbers: yards
        yards = play_obj.get('yards') or play_obj.get('yardage') or play_obj.get('yardsToGo')
        if yards is not None:
            numbers['yards'] = yards
        # suggest simple alternatives based on down/distance
        if down and distance is not None:
            if int(down) >= 4:
                alternatives = ['Punt', 'Attempt a long field goal', 'Go for it on 4th down']
            elif int(down) in (1, 2):
                alternatives = ['Run to gain yards and keep possession', 'Short pass to the sideline']

    explanation = {
        'play_id': play_id,
        'what_happened': what,
        'why_the_play_happened': why,
        'possible_alternatives': alternatives,
        'numbers_explained': numbers,
    }
    return jsonify(explanation=explanation)


@app.route('/api/teams')
def list_teams():
    """Return list of teams with ids, names, and logos.

    Response (sample): {teams: [{id,name,abbr,logo}, ...]}
    """
    # Fetch teams catalog
    url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
    try:
        data = fetch_json(url)
        teams = []
        for t in data.get('teams', []):
            team = t.get('team') or t
            teams.append({'id': team.get('id'), 'name': team.get('displayName') or team.get('name'), 'abbr': team.get('abbrev'), 'logo': team.get('logos')[0]['href'] if team.get('logos') else None})
        return jsonify(teams=teams)
    except Exception:
        abort(502, description='Failed to fetch teams from upstream')


@app.route('/api/teams/<team_id>')
def get_team(team_id: str):
    """Return team details and roster (placeholder).

    Response (sample): {id, name, abbr, roster: [{id,name,position}, ...]}
    """
    # Detailed team endpoint (roster via site.api)
    url = f'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{team_id}'
    try:
        data = fetch_json(url)
        return jsonify(team=data)
    except Exception:
        abort(502, description='Failed to fetch team from upstream')


@app.route('/api/players/<player_id>')
def get_player(player_id: str):
    """Return player metadata and sample stats.

    Response (sample): {id, fullName, position, team, stats}
    """
    # Try common ESPN player endpoints
    urls = [
        f'https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{player_id}/overview',
        f'https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{player_id}',
        f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/{player_id}',
    ]
    last_err = None
    for url in urls:
        try:
            data = fetch_json(url)
            return jsonify(player=data)
        except Exception as e:
            last_err = e
            continue
    print('Failed to fetch player %s: %s', player_id, last_err)
    abort(502, description='Failed to fetch player from upstream')


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
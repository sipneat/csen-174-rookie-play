from common import fetch_json

class GameService:
    def __init__(self, fetch_func=None):
        self.fetch_json = fetch_func or fetch_json

    def list_games(self, request):
        """List recent/upcoming games.

        Query params:
        - date (YYYY-MM-DD) optional

        Response (sample): {games: [ {id, home_team, away_team, status, start_time}, ... ]}
        """
        date = request.args.get('date')
        params = {}
        if date:
            params['dates'] = date
        url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
        try:
            data = self.fetch_json(url, params=params)
            games = []
            for ev in data.get('events', []):
                if not isinstance(ev, dict):
                    raise TypeError("Invalid event type")
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
            return games
        except Exception as e:
            print(f"Error listing games: {e}")
            raise

    def get_game(self, game_id: str):
        """Return detailed metadata for a single game.

        Response (sample): {id, teams, venue, status, scoreboard, officials}
        """
        url = 'https://cdn.espn.com/core/nfl/game'
        params = {'xhr': 1, 'gameId': game_id}
        try:
            data = self.fetch_json(url, params=params)
            return data
        except Exception as e:
            print(f"Error fetching game {game_id}: {e}")
            raise
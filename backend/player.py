from common import fetch_json

class PlayerService:
    def __init__(self, fetch_func=None):
        self.fetch_json = fetch_func or fetch_json

    def get_player(self, player_id: str):
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
                data = self.fetch_json(url)
                return data
            except Exception as e:
                last_err = e
                continue
        print('Failed to fetch player %s: %s', player_id, last_err)
        raise Exception(f'Failed to fetch player {player_id}')
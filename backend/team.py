from common import fetch_json

class TeamService:
    def __init__(self, fetch_func=None):
        self.fetch_json = fetch_func or fetch_json

    def list_teams(self):
        """Return list of teams with ids, names, and logos.

        Response (sample): {teams: [{id,name,abbr,logo}, ...]}
        """
        # Fetch teams catalog
        url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
        try:
            data = self.fetch_json(url)
            sports = data.get('sports', [])
            if not sports:
                return []
            leagues = sports[0].get('leagues', [])
            if not leagues:
                return []
            teams = []
            for t in leagues[0].get('teams', []):
                team = t.get('team') or t
                teams.append({'id': team.get('id'), 'name': team.get('displayName') or team.get('name'), 'abbr': team.get('abbrev'), 'logo': team.get('logos')[0]['href'] if team.get('logos') else None})
            return teams
        except Exception as e:
            print("Error fetching teams catalog: %s", e)
            raise

    def get_team(self, team_id: str):
        """Return team details and roster.

        Response (sample): {id, name, abbr, roster: [{id,name,position}, ...]}
        """
        url = f'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{team_id}'
        try:
            data = self.fetch_json(url)
            return data
        except Exception as e:
            print("Error fetching team %s: %s", team_id, e)
            raise
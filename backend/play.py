from common import fetch_json

class PlayService:
    def __init__(self, fetch_func=None):
        self.fetch_json = fetch_func or fetch_json

    def explain_play_obj(self, play_obj):
        # 1. What happened
        what = (
            play_obj.get('text')
            or play_obj.get('shortText')
            or play_obj.get('alternativeText')
            or play_obj.get('shortAlternativeText')
            or ''
        )
        if play_obj.get('scoringType', {}).get('displayName'):
            what += f" ({play_obj['scoringType']['displayName']})"

        # 2. Why the play happened
        start = play_obj.get('start', {})
        down = start.get('down')
        distance = start.get('distance')
        yardline = start.get('yardLine')
        quarter = play_obj.get('period', {}).get('number')
        clock = play_obj.get('clock', {}).get('displayValue')
        # Team: try to extract just the numeric id
        offense_team_ref = play_obj.get('team', {}).get('$ref', '')
        offense_team_id = None
        if offense_team_ref:
            # Extract just the numeric id (e.g., .../teams/23?lang=... -> 23)
            import re
            match = re.search(r'/teams/(\d+)', offense_team_ref)
            if match:
                offense_team_id = match.group(1)
        # Optionally, you could look up the team name from a cache or mapping

        # Format down/distance for natural language
        if down is not None and distance is not None:
            down_str = {1: "1st", 2: "2nd", 3: "3rd"}.get(down, f"{down}th")
            down_distance = f"{down_str} & {distance}"
        else:
            down_distance = "Unknown down & distance"

        why = f"It was {down_distance} at the {yardline} yard line"
        if quarter:
            suffix = {1: "st", 2: "nd", 3: "rd"}.get(quarter, "th")
            why += f", in the {quarter}{suffix} quarter"
        if clock:
            why += f" with {clock} left"

        # 3. Numbers explained
        numbers = {}
        if play_obj.get('statYardage') is not None:
            numbers['yards'] = play_obj['statYardage']
        score = {}
        if play_obj.get('homeScore') is not None:
            score['home'] = play_obj.get('homeScore')
        if play_obj.get('awayScore') is not None:
            score['away'] = play_obj.get('awayScore')
        if play_obj.get('scoreValue') is not None:
            score['change'] = play_obj.get('scoreValue')
        if score:
            numbers['score'] = score

        # 4. Alternatives (add more context for 3rd/4th down)
        alternatives = []
        try:
            if down == 4:
                alternatives = [
                    'Punt',
                    'Go for it (attempt to convert on 4th down)',
                    'Attempt a field goal',
                    'Try to draw the defense offsides',
                    'Fake punt',
                    'Call a timeout to reconsider options'
                ]
            elif down == 3 and distance is not None:
                if distance >= 7:
                    alternatives = [
                        'Short pass',
                        'Screen pass',
                        'Run up the middle',
                        'Draw play',
                        'Deep pass (take a shot downfield)',
                        'Quarterback scramble',
                        'Try to get a defensive penalty'
                    ]
                elif distance <= 2:
                    alternatives = [
                        'Quarterback sneak',
                        'Power run',
                        'Short quick pass',
                        'Play-action pass',
                        'Jet sweep'
                    ]
                else:
                    alternatives = [
                        'Standard run',
                        'Short pass',
                        'Screen pass',
                        'Play-action pass',
                        'Quarterback rollout'
                    ]
        except Exception:
            pass

        return {
            'what_happened': what,
            'why_the_play_happened': why,
            'possible_alternatives': alternatives,
            'numbers_explained': numbers,
        }

    def game_plays(self, game_id: str, request):
        """Return play-by-play list for a given game_id.

        Query params:
        - limit (int) number of plays to return

        Response (sample): {plays: [ {id, clock, down, description, teams, stats}, ... ]}
        """
        limit = int(request.args.get('limit', 300))
        url = f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/{game_id}/competitions/{game_id}/plays'
        params = {'limit': limit}
        try:
            data = self.fetch_json(url, params=params)
            plays = data.get('items') or data.get('plays') or data.get('entries') or data.get('play', [])
            # some endpoints return items, some return plays
            if isinstance(plays, dict):
                for key in ['plays', 'items', 'entries']:
                    if key in plays and isinstance(plays[key], list):
                        plays = plays[key]
                        break
            return plays
        except Exception:
            # fallback to cdn playbyplay endpoint as alternative
            try:
                url2 = 'https://cdn.espn.com/core/nfl/playbyplay'
                params2 = {'xhr': 1, 'gameId': game_id}
                data2 = self.fetch_json(url2, params=params2)
                plays2 = data2.get('play', []) or data2.get('plays', [])
                return plays2
            except Exception as e:
                print("Error fetching CDN play-by-play for game %s: %s", game_id, e)
                raise

    def explain_play(self, game_id: str, play_id: str):
        """Explain a single play for beginners.

        Query params:
        - play_id

        Response (sample): {play_id, explanation: {what_happened, why_the_play_happened, possible_alternatives, numbers_explained}}
        """
        try:
            url = f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/{game_id}/competitions/{game_id}/plays'
            data = self.fetch_json(url, params={'limit': 500})
            items = data.get('items') or data.get('plays') or []
            for p in items:
                if str(p.get('id')) == str(play_id) or str(p.get('displayId')) == str(play_id):
                    play_obj = p
                    break
        except Exception:
            play_obj = None
        
        if play_obj:
            return self.explain_play_obj(play_obj)
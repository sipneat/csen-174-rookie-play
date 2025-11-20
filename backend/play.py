from common import fetch_json
import os
from groq import Groq

class PlayService:
    def __init__(self, fetch_func=None):
        self.fetch_json = fetch_func or fetch_json
        # Initialize Groq client
        self.groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        # Cache for AI explanations to avoid re-generating on refresh
        self.ai_explanation_cache = {}

    def _generate_ai_explanation(self, play_obj):
        """Generate AI explanation for a play using Groq."""
        # Extract play details
        what = (
            play_obj.get('text')
            or play_obj.get('shortText')
            or play_obj.get('alternativeText')
            or play_obj.get('shortAlternativeText')
            or 'Unknown play'
        )
        
        start = play_obj.get('start', {})
        down = start.get('down')
        distance = start.get('distance')
        yardline = start.get('yardLine')
        quarter = play_obj.get('period', {}).get('number')
        clock = play_obj.get('clock', {}).get('displayValue')
        yards = play_obj.get('statYardage')
        
        # Build context for the LLM
        context = f"Play description: {what}\n"
        if down and distance:
            context += f"Situation: {down} down and {distance} yards to go at the {yardline} yard line\n"
        if quarter:
            context += f"Quarter: {quarter}\n"
        if clock:
            context += f"Time remaining: {clock}\n"
        if yards is not None:
            context += f"Result: {yards} yards gained\n"
        
        prompt = f"""You are explaining an NFL play to someone new to football. Keep it concise (2-3 sentences max).

{context}

Explain:
1. What happened in simple terms
2. Why this play made sense in this situation
3. What the team was trying to accomplish

Be conversational and educational. Avoid jargon unless you explain it. the "END GAME" play means the game is over, not that a play happened to end the game."""

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a friendly NFL coach explaining plays to beginners. Be concise, clear, and educational."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=200,
            )
            
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error generating AI explanation: {e}")
            return None

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

        # 4. Generate AI explanation (cached)
        play_id = str(play_obj.get('id', ''))
        ai_explanation = None
        
        if play_id and play_id not in self.ai_explanation_cache:
            ai_explanation = self._generate_ai_explanation(play_obj)
            if ai_explanation:
                self.ai_explanation_cache[play_id] = ai_explanation
        elif play_id:
            ai_explanation = self.ai_explanation_cache.get(play_id)

        return {
            'what_happened': what,
            'why_the_play_happened': why,
            'ai_explanation': ai_explanation,
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

        Response (sample): {play_id, explanation: {what_happened, why_the_play_happened, ai_explanation, numbers_explained}}
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
        return {
            'what_happened': 'Play not found',
            'why_the_play_happened': '',
            'ai_explanation': None,
            'numbers_explained': {}
        }
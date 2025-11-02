import unittest
from unittest.mock import MagicMock
from game import GameService
from play import PlayService
from team import TeamService
from player import PlayerService

class TestGameService(unittest.TestCase):
    def setUp(self):
        self.service = GameService(fetch_func=MagicMock())

    def test_list_games_normal(self):
        self.service.fetch_json.return_value = {'events': [{'id': '1', 'competitions': [{'competitors': [{'homeAway': 'home', 'team': {'id': '10', 'displayName': 'Packers', 'abbrev': 'GB'}}, {'homeAway': 'away', 'team': {'id': '20', 'displayName': 'Bears', 'abbrev': 'CHI'}}]}], 'status': {'type': {'name': 'pre'}}, 'date': '2025-10-26T20:00Z'}]}
        class DummyReq: args = {}
        games = self.service.list_games(DummyReq())
        self.assertEqual(len(games), 1)
        self.assertEqual(games[0]['home_team']['name'], 'Packers')

    def test_list_games_empty(self):
        self.service.fetch_json.return_value = {'events': []}
        class DummyReq: args = {}
        games = self.service.list_games(DummyReq())
        self.assertEqual(games, [])

    def test_list_games_missing_fields(self):
        self.service.fetch_json.return_value = {'events': [{}]}
        class DummyReq: args = {}
        games = self.service.list_games(DummyReq())
        self.assertEqual(len(games), 0)

    def test_list_games_invalid_type(self):
        self.service.fetch_json.return_value = {'events': 'notalist'}
        class DummyReq: args = {}
        with self.assertRaises(TypeError):
            self.service.list_games(DummyReq())

    def test_get_game_normal(self):
        self.service.fetch_json.return_value = {'id': '1', 'teams': []}
        game = self.service.get_game('1')
        self.assertEqual(game['id'], '1')

class TestPlayService(unittest.TestCase):
    def setUp(self):
        self.service = PlayService()
        self.service.fetch_json = MagicMock()

    def test_explain_play_obj_normal(self):
        play = {'text': 'Pass complete', 'start': {'down': 1, 'distance': 10, 'yardLine': 25}, 'period': {'number': 1}, 'clock': {'displayValue': '15:00'}}
        result = self.service.explain_play_obj(play)
        self.assertIn('what_happened', result)

    def test_explain_play_obj_missing_fields(self):
        play = {}
        result = self.service.explain_play_obj(play)
        self.assertIn('what_happened', result)

    def test_explain_play_obj_fourth_down(self):
        play = {'start': {'down': 4, 'distance': 1, 'yardLine': 50}}
        result = self.service.explain_play_obj(play)
        self.assertTrue(any('Punt' in alt for alt in result['possible_alternatives']))

    def test_game_plays_normal(self):
        self.service.fetch_json.return_value = {'items': [{'id': 'p1'}]}
        class DummyReq: args = {'limit': '1'}
        plays = self.service.game_plays('1', DummyReq())
        self.assertEqual(len(plays), 1)

    def test_game_plays_fallback(self):
        self.service.fetch_json.side_effect = [Exception("fail"), {'play': [{'id': 'p2'}]}]
        class DummyReq: args = {'limit': '1'}
        plays = self.service.game_plays('1', DummyReq())
        self.assertEqual(plays[0]['id'], 'p2')

class TestTeamService(unittest.TestCase):
    def setUp(self):
        self.service = TeamService()
        self.service.fetch_json = MagicMock()

    def test_list_teams_normal(self):
        self.service.fetch_json.return_value = {'sports': [{'leagues': [{'teams': [{'team': {'id': '10', 'displayName': 'Packers'}}]}]}]}
        teams = self.service.list_teams()
        self.assertTrue(any(t['id'] == '10' for t in teams))

    def test_list_teams_empty(self):
        self.service.fetch_json.return_value = {'sports': []}
        teams = self.service.list_teams()
        self.assertEqual(teams, [])

    def test_get_team_normal(self):
        self.service.fetch_json.return_value = {'team': {'id': '10', 'displayName': 'Packers'}}
        team = self.service.get_team('10')
        self.assertEqual(team['team']['id'], '10')

    def test_get_team_not_found(self):
        self.service.fetch_json.return_value = {}
        team = self.service.get_team('999')
        self.assertEqual(team, {})

    def test_list_teams_invalid(self):
        self.service.fetch_json.return_value = {}
        teams = self.service.list_teams()
        self.assertEqual(teams, [])

class TestPlayerService(unittest.TestCase):
    def setUp(self):
        self.service = PlayerService()
        self.service.fetch_json = MagicMock()

    def test_get_player_normal(self):
        self.service.fetch_json.return_value = {'athlete': {'id': '12', 'displayName': 'Aaron Rodgers'}}
        player = self.service.get_player('12')
        self.assertEqual(player['athlete']['id'], '12')

    def test_get_player_not_found(self):
        self.service.fetch_json.return_value = {}
        player = self.service.get_player('999')
        self.assertEqual(player, {})

    def test_get_player_invalid(self):
        self.service.fetch_json.return_value = None
        player = self.service.get_player('999')
        self.assertIsNone(player)

    def test_get_player_large_id(self):
        self.service.fetch_json.return_value = {'athlete': {'id': '999999999999', 'displayName': 'Big Player'}}
        player = self.service.get_player('999999999999')
        self.assertEqual(player['athlete']['id'], '999999999999')

    def test_get_player_wrong_type(self):
        self.service.fetch_json.return_value = {'athlete': {'id': 12, 'displayName': 'Aaron Rodgers'}}
        player = self.service.get_player(12)
        self.assertEqual(str(player['athlete']['id']), '12')

class TestApiEdgeCases(unittest.TestCase):
    def setUp(self):
        from server import app
        self.client = app.test_client()

    def test_invalid_game_id(self):
        resp = self.client.get('/api/games/invalid')
        self.assertIn(resp.status_code, (400, 404, 502))

    def test_invalid_player_id(self):
        resp = self.client.get('/api/players/invalid')
        self.assertIn(resp.status_code, (400, 404, 502))

    def test_large_game_id(self):
        resp = self.client.get('/api/games/999999999999')
        self.assertIn(resp.status_code, (400, 404, 502))

    def test_missing_note(self):
        resp = self.client.post('/api/users/testuser/notes', json={})
        self.assertEqual(resp.status_code, 400)

    def test_invalid_favorites_post(self):
        resp = self.client.post('/api/users/testuser/favorites', json={})
        self.assertIn(resp.status_code, (400, 422, 500))

if __name__ == '__main__':
    unittest.main()
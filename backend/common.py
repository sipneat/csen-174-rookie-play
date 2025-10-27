import requests

def fetch_json(url: str, params: dict | None = None) -> dict:
    """
    Fetch JSON from a URL with basic error handling.
    """
    params = params or {}
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=8)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print("Error fetching %s: %s", url, e)
        raise

    return data
import json
import subprocess
from urllib.parse import urlencode


def fetch_json(url: str, params: dict | None = None) -> dict:
    """
    Fetch JSON from a URL using curl.
    """
    params = params or {}
    if params:
        url = f"{url}?{urlencode(params)}"

    result = subprocess.run(
        [
            "curl",
            "--silent",
            "--show-error",
            "--location",
            "--max-time",
            "8",
            url,
        ],
        check=True,
        capture_output=True,
        text=True,
    )

    return json.loads(result.stdout)
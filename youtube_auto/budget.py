"""
月額予算トラッカー（概算ベース）
OpenAIの実請求額はAPIキーの権限上ここから直接取得できないため、
既知の公開単価から呼び出しごとの概算コストを積み上げて管理する。
GitHub Actions は毎回まっさらな環境で実行されるため、この集計を意味あるものにするには
data/spend_tracker.json をワークフロー側でコミットして永続化する必要がある
（youtube_shorts.yml / youtube_video.yml 参照）。
"""
import json
import os
from datetime import date

BUDGET_FILE = os.path.join(os.path.dirname(__file__), "data", "spend_tracker.json")

MONTHLY_BUDGET_JPY = 5000
USD_TO_JPY = 155  # 概算レート。実勢と多少ずれる可能性がある

# 既知のAPI呼び出し単価の概算（USD、2026年7月時点の公開料金表ベース）
COST_SORA_4S = 0.40          # Sora 2, 720x1280, 4秒
COST_IMAGE_HIGH = 0.25       # gpt-image-1, high quality
COST_TTS_PER_CALL = 0.01     # gpt-4o-mini-tts, 30秒前後のナレーション1本あたり


def _current_month() -> str:
    return date.today().strftime("%Y-%m")


def _load() -> dict:
    if os.path.exists(BUDGET_FILE):
        try:
            with open(BUDGET_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            if data.get("month") == _current_month():
                return data
        except Exception:
            pass
    return {"month": _current_month(), "spent_usd": 0.0}


def _save(data: dict):
    os.makedirs(os.path.dirname(BUDGET_FILE), exist_ok=True)
    with open(BUDGET_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f)


def add_cost(usd: float):
    """API呼び出し1回分の概算コストを月間集計に加算する。"""
    data = _load()
    data["spent_usd"] = data.get("spent_usd", 0.0) + usd
    _save(data)


def get_status_jpy() -> tuple[float, float]:
    """(今月の概算支出円, 月間予算円) を返す。"""
    data = _load()
    return data.get("spent_usd", 0.0) * USD_TO_JPY, MONTHLY_BUDGET_JPY


def is_budget_exceeded() -> bool:
    spent_jpy, budget_jpy = get_status_jpy()
    return spent_jpy >= budget_jpy

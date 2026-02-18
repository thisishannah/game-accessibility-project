"""
배치 영상 분석기: data/user_id/ 내 모든 mp4를 순차 분석 후 종합 리포트 생성

- 각 영상에서 조작 로그 추출·저장
- user_id 기준 정렬 후 summary.json 생성 (평균 반응 속도, 오류 횟수)
- 1단계 구글 시트 데이터와 user_id로 매칭 가능
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from detector import (
    find_controller_ui_region,
    get_first_frame,
    iter_video_frames,
)

DATA_ROOT = Path(__file__).resolve().parent / "data"
DEFAULT_TEMPLATE_PATHS: Optional[List[str]] = None  # 필요 시 템플릿 경로 설정
GRID_ROWS = 4
GRID_COLS = 6
BRIGHTNESS_THRESHOLD = 35
STEP_MS = 80


def _brightness(crop: Any) -> float:
    """크롭 영역 평균 밝기 (0~255)."""
    import cv2
    import numpy as np

    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    return float(np.mean(gray))


def extract_operation_log(
    video_path: str,
    region: Tuple[int, int, int, int],
    step_ms: float = STEP_MS,
) -> Tuple[List[Dict], float, int]:
    """
    영상에서 UI 영역의 색상/밝기 변화를 추적하여 조작 로그를 추출합니다.

    Args:
        video_path: 영상 경로
        region: (x, y, w, h) UI 영역
        step_ms: 프레임 샘플링 간격(ms)

    Returns:
        (operation_log, avg_reaction_ms, error_count)
    """
    import numpy as np

    x, y, w, h = region
    grid_h, grid_w = h // GRID_ROWS, w // GRID_COLS

    prev_cells: List[float] = [0.0] * (GRID_ROWS * GRID_COLS)
    events: List[Dict] = []
    stimulus_times: Dict[int, float] = {}
    reaction_times: List[float] = []

    for ts_ms, frame in iter_video_frames(video_path, step_ms=step_ms):
        crop = frame[y : y + h, x : x + w]
        if crop.size == 0:
            continue

        for row in range(GRID_ROWS):
            for col in range(GRID_COLS):
                r1, r2 = row * grid_h, (row + 1) * grid_h
                c1, c2 = col * grid_w, (col + 1) * grid_w
                cell = crop[r1:r2, c1:c2]
                if cell.size == 0:
                    continue

                idx = row * GRID_COLS + col
                bright = _brightness(cell)
                prev = prev_cells[idx]
                prev_cells[idx] = bright

                delta = bright - prev
                if abs(delta) < BRIGHTNESS_THRESHOLD:
                    continue

                if delta > 0:  # 밝아짐 = 활성화(자극)
                    stimulus_times[idx] = ts_ms
                    events.append({
                        "timestamp_ms": ts_ms,
                        "cell": idx,
                        "state": "active",
                    })
                else:  # 어두워짐 = 비활성화(응답)
                    if idx in stimulus_times:
                        rt = ts_ms - stimulus_times[idx]
                        if 50 < rt < 2000:
                            reaction_times.append(rt)
                        del stimulus_times[idx]
                    events.append({
                        "timestamp_ms": ts_ms,
                        "cell": idx,
                        "state": "inactive",
                    })

    avg_reaction = sum(reaction_times) / len(reaction_times) if reaction_times else 0.0
    error_count = max(0, len(stimulus_times))
    return events, round(avg_reaction, 1), error_count


def analyze_video(
    video_path: str,
    user_id: str,
    template_paths: Optional[List[str]] = None,
    output_dir: Optional[Path] = None,
) -> Optional[Dict]:
    """
    단일 영상 분석: UI 탐지 → 조작 로그 추출 → 저장.

    Returns:
        { video, user_id, region, avg_reaction_ms, error_count, log_path } 또는 None
    """
    output_dir = output_dir or (DATA_ROOT / user_id)
    output_dir.mkdir(parents=True, exist_ok=True)

    frame = get_first_frame(video_path)
    if frame is None:
        return None

    region = find_controller_ui_region(
        frame,
        template_path=template_paths or DEFAULT_TEMPLATE_PATHS,
    )
    if region is None:
        region = (0, int(frame.shape[0] * 0.65), frame.shape[1], int(frame.shape[0] * 0.35))

    events, avg_reaction_ms, error_count = extract_operation_log(video_path, region)

    stem = Path(video_path).stem
    log_path = output_dir / f"{stem}_log.json"
    log_data = {
        "video": str(video_path),
        "user_id": user_id,
        "region": list(region),
        "operation_log": events,
        "avg_reaction_ms": avg_reaction_ms,
        "error_count": error_count,
    }
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(log_data, f, ensure_ascii=False, indent=2)

    return {
        "video": stem + ".mp4",
        "video_path": str(video_path),
        "user_id": user_id,
        "region": list(region),
        "avg_reaction_ms": avg_reaction_ms,
        "error_count": error_count,
        "log_path": str(log_path),
    }


def find_all_videos() -> List[Tuple[str, str]]:
    """
    data/user_id/ 내 모든 mp4 파일을 탐색합니다.

    Returns:
        [(user_id, video_path), ...] user_id 기준 정렬
    """
    if not DATA_ROOT.exists():
        return []

    pairs: List[Tuple[str, str]] = []
    for user_dir in sorted(DATA_ROOT.iterdir()):
        if not user_dir.is_dir():
            continue
        user_id = user_dir.name
        for mp4 in sorted(user_dir.glob("*.mp4")):
            pairs.append((user_id, str(mp4)))
    return pairs


def run_batch(
    template_paths: Optional[List[str]] = None,
    verbose: bool = True,
) -> Dict:
    """
    전체 배치 분석 실행 후 summary.json 생성.

    Returns:
        summary 데이터
    """
    pairs = find_all_videos()
    if not pairs:
        if verbose:
            print(f"[경고] {DATA_ROOT} 내 mp4 파일이 없습니다.")
        return {"users": [], "summary_path": None}

    results_by_user: Dict[str, List[Dict]] = {}
    for user_id, video_path in pairs:
        if user_id not in results_by_user:
            results_by_user[user_id] = []
        if verbose:
            print(f"[분석] {user_id} / {Path(video_path).name}")
        r = analyze_video(video_path, user_id, template_paths=template_paths)
        if r:
            results_by_user[user_id].append(r)

    users_sorted = sorted(results_by_user.keys())
    summary_rows: List[Dict] = []
    for user_id in users_sorted:
        rows = results_by_user[user_id]
        if not rows:
            continue
        total_errors = sum(x["error_count"] for x in rows)
        reactions = [x["avg_reaction_ms"] for x in rows if x["avg_reaction_ms"] > 0]
        overall_avg = sum(reactions) / len(reactions) if reactions else 0.0
        summary_rows.append({
            "user_id": user_id,
            "video_count": len(rows),
            "videos": [
                {
                    "video": x["video"],
                    "avg_reaction_ms": x["avg_reaction_ms"],
                    "error_count": x["error_count"],
                    "log_path": x["log_path"],
                }
                for x in rows
            ],
            "overall_avg_reaction_ms": round(overall_avg, 1),
            "total_error_count": total_errors,
        })

    summary = {"users": summary_rows}
    summary_path = DATA_ROOT / "summary.json"
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    summary["summary_path"] = str(summary_path)

    if verbose:
        print(f"[완료] {len(pairs)}개 영상 분석 → {summary_path}")

    return summary


if __name__ == "__main__":
    import sys

    templates = None
    if len(sys.argv) > 1:
        templates = sys.argv[1:]

    run_batch(template_paths=templates)

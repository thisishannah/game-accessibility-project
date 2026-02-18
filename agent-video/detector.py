"""
영상 분석 모듈: 게임 컨트롤러/키보드 UI 영역 탐지 및 크롭

OpenCV를 사용하여 영상의 첫 프레임에서 게임 내 UI가 배치된 위치(가변)를
템플릿 매칭으로 전체 화면에서 탐색하고, 해당 영역을 크롭하여 저장합니다.
향후 버튼 색상 변화 추적에 활용됩니다.
"""

import cv2
import numpy as np
from pathlib import Path
from typing import Iterator, List, Optional, Tuple, Union


def get_first_frame(video_path: str) -> Optional[np.ndarray]:
    """
    영상에서 첫 번째 프레임을 가져옵니다.

    Args:
        video_path: 영상 파일 경로

    Returns:
        첫 프레임 (BGR), 실패 시 None
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None
    ret, frame = cap.read()
    cap.release()
    return frame if ret else None


def iter_video_frames(
    video_path: str,
    step_ms: float = 100,
) -> Iterator[Tuple[float, np.ndarray]]:
    """
    영상을 프레임 단위로 순회합니다.

    Args:
        video_path: 영상 경로
        step_ms: 샘플링 간격(ms). 예: 100 = 0.1초마다 1프레임

    Yields:
        (timestamp_ms, frame) 튜플
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step_frames = max(1, int(fps * step_ms / 1000.0))
    frame_idx = 0
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % step_frames == 0:
                ts_ms = (frame_idx / fps) * 1000.0
                yield ts_ms, frame
            frame_idx += 1
    finally:
        cap.release()


def find_controller_ui_region(
    frame: np.ndarray,
    template_path: Optional[Union[str, List[str]]] = None,
    search_bottom_ratio: float = 0.35,
    match_threshold: float = 0.65,
    scales: Optional[list] = None,
) -> Optional[Tuple[int, int, int, int]]:
    """
    화면 내 게임 컨트롤러/키보드 UI 영역을 템플릿 매칭으로 탐색합니다.
    UI 위치가 가변적이므로 전체 프레임을 검색합니다.
    컨트롤러·키보드 둘 다 지원: 여러 템플릿을 주면 가장 잘 맞는 것을 반환합니다.

    Args:
        frame: 검색할 프레임 (BGR)
        template_path: 템플릿 경로 1개 또는 리스트(예: [컨트롤러, 키보드])
        search_bottom_ratio: 템플릿 없을 때 사용, 하단 몇 %를 UI로 간주할지 (0~1)
        match_threshold: 템플릿 매칭 최소 유사도 (0~1)
        scales: 검색할 스케일 비율 목록. None이면 기본값 사용

    Returns:
        (x, y, width, height) 또는 None
    """
    h, w = frame.shape[:2]
    paths = (
        [template_path] if isinstance(template_path, str) else (template_path or [])
    )

    if not paths:
        return _fallback_bottom_region(frame, search_bottom_ratio)

    scale_list = scales or [0.5, 0.65, 0.8, 0.95, 1.0, 1.1, 1.25]
    best_val = 0
    best_region = None

    for tp in paths:
        if not tp or not Path(tp).exists():
            continue
        template = cv2.imread(tp)
        if template is None:
            continue

        th, tw = template.shape[:2]
        if tw > w or th > h:
            continue

        roi = frame
        for scale in scale_list:
            nw = max(15, int(tw * scale))
            nh = max(15, int(th * scale))
            if nw > w or nh > h:
                continue
            resized = cv2.resize(template, (nw, nh), interpolation=cv2.INTER_AREA)

            result = cv2.matchTemplate(roi, resized, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

            if max_val > best_val and max_val >= match_threshold:
                best_val = max_val
                x, y = max_loc
                best_region = (x, y, nw, nh)

    if best_region is not None:
        return best_region

    return _fallback_bottom_region(frame, search_bottom_ratio)


def _fallback_bottom_region(
    frame: np.ndarray,
    bottom_ratio: float = 0.35,
) -> Tuple[int, int, int, int]:
    """
    템플릿이 없을 때 하단 영역을 UI로 간주합니다.
    """
    h, w = frame.shape[:2]
    region_h = int(h * bottom_ratio)
    return (0, h - region_h, w, region_h)


def crop_and_save_controller_region(
    video_path: str,
    output_path: str,
    template_path: Optional[Union[str, List[str]]] = None,
    region: Optional[Tuple[int, int, int, int]] = None,
) -> Optional[Tuple[Tuple[int, int, int, int], str]]:
    """
    영상 첫 프레임에서 컨트롤러 UI 영역을 탐색·크롭하여 저장합니다.

    Args:
        video_path: 입력 영상 경로
        output_path: 크롭된 이미지 저장 경로
        template_path: 템플릿 경로 또는 [컨트롤러, 키보드] 리스트
        region: 미리 알려진 영역 (x, y, w, h). 지정 시 탐색 생략

    Returns:
        ((x, y, w, h), output_path) 또는 None
    """
    frame = get_first_frame(video_path)
    if frame is None:
        return None

    if region is not None:
        x, y, w, h = region
    else:
        found = find_controller_ui_region(frame, template_path=template_path)
        if found is None:
            return None
        x, y, w, h = found

    cropped = frame[y : y + h, x : x + w]

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(out), cropped)

    return ((x, y, w, h), str(out))


def detect_and_report(
    video_path: str,
    output_path: Optional[str] = None,
    template_path: Optional[Union[str, List[str]]] = None,
    verbose: bool = True,
) -> Optional[Tuple[int, int, int, int]]:
    """
    영상에서 컨트롤러 UI 영역을 탐색하고, 좌표 출력 및 크롭 저장을 수행합니다.

    Args:
        video_path: 입력 영상 경로
        output_path: 저장 경로. None이면 video_path 기반 자동 생성
        template_path: 템플릿 경로 또는 [컨트롤러, 키보드] 리스트
        verbose: 좌표 출력 여부

    Returns:
        (x, y, w, h) 또는 None
    """
    if output_path is None:
        base = Path(video_path).stem
        output_path = str(Path(video_path).parent / f"{base}_controller_ui.png")

    result = crop_and_save_controller_region(
        video_path,
        output_path,
        template_path=template_path,
    )
    if result is None:
        if verbose:
            print(f"[실패] 영상을 열거나 UI 영역을 찾을 수 없습니다: {video_path}")
        return None

    (x, y, w, h), saved = result
    if verbose:
        print(f"[탐색 완료] x={x}, y={y}, width={w}, height={h}")
        print(f"[저장 완료] {saved}")

    return (x, y, w, h)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("사용법: python detector.py <영상경로> [템플릿1] [템플릿2...] [출력경로]")
        print("  - 템플릿: UI 모양이 보이는 이미지. 컨트롤러·키보드 둘 다 줄 수 있음.")
        print("예: python detector.py gameplay.mp4 controller.png keyboard.png out.png")
        sys.exit(1)

    video = sys.argv[1]
    args = sys.argv[2:]
    if len(args) >= 2:
        templates, output = args[:-1], args[-1]
        templates = templates[0] if len(templates) == 1 else templates
    elif len(args) == 1:
        templates, output = args[0], None
    else:
        templates, output = None, None

    detect_and_report(video, output_path=output, template_path=templates)

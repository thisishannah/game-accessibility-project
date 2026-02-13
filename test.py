#!/usr/bin/env python3
"""
구글 시트 URL 연동 테스트: 가짜 데이터를 한 줄 전송하여 시트에 찍히는지 확인합니다.
"""
import json
import urllib.request
import urllib.error
from datetime import datetime

# summary.html과 동일한 URL
DEPLOYED_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxpzl0a9g-zJJ_vH0MghogtE6DNts036TudVKGzIETHjeek4z2WycCZL_Gj35j6qwsE/exec"

# summary.html buildSheetsRowPayload와 동일한 키 구조 (가짜 데이터)
# target_sheet: Apps Script에서 Level3_data 시트로 기록할 때 참고
# SHEETS_HEADER_ORDER 순서와 일치시켜 시트 첫 행 헤더와 매칭
FAKE_PAYLOAD = {
    "target_sheet": "Level3_data",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "user_id": "test_py_verify",
    "age": "30대",
    "gender": "테스트",
    "monitor_inch": 27,
    "resolution": "2560x1440",
    "viewing_distance": 60,
    "disability_type": "테스트",
    "vision_rt_avg": 280,
    "vision_aim_avg": 450,
    "fov_blind_rate": 0.05,
    "readable_font_size": 14,
    "readable_font_size_mm": 3.7,
    "contrast_threshold": 8,
    "contrast_sensitivity": {"contrast_threshold": 8, "unit": "%", "recordedAt": datetime.utcnow().isoformat() + "Z"},
    "motor_rt_avg": 290,
    "motor_aim_avg": 420,
    "motor_switch_latency": 180,
    "key_reach_score": 5,
    "burst_speed_peak": 8.2,
    "fatigue_index": 102,
    "motor_precision_error_mm": 2.1,
    "seq_memory_score": 4,
    "go_nogo_accuracy": 0.925,
    "hearing_hearing_number_left": 25,
    "hearing_hearing_number_right": 22,
    "hearing_capacity_left": 85,
    "hearing_capacity_right": 90,
    "hearing_speech_clarity_percent": 95,
    "hearing_articulation_match_rate": 88,
    "hearing_observer_clarity_rating": 4,
    "input_device": "키보드+마우스",
    "assistive_device": "",
    "calibration_mm_per_px": 0.264,
    "color_rt_avg": 275,
    "color_blindness_type": "녹색약 (제2색각이상)",
    "color_confusion_detail": "이 사용자는 녹색 계열을 구분하는 데 어려움이 있습니다. 명도가 같은 빨강과 초록의 경계를 구분하기 어려워합니다.",
    "color_confusion_score": 0.75,
    "color_confusion_matrix": {"ishihara": {"classification": "deuteranomaly"}, "deepDiscrimination": {"luminanceBoundary": False, "complementaryCorrectCount": 3, "complementaryTotal": 4}},
    "raw_vision_data": {"_test": "fake"},
    "raw_motor_data": {"_test": "fake"},
    "raw_cognitive_data": {"_test": "fake"},
    "raw_hearing_data": {"_test": "fake"},
    "raw_color_data": {"_test": "fake", "reactionTime": {"average": 275}, "color_confusion_matrix": {"_test": "fake"}},
    "observer_report": {"_test": "fake"},
}


def main():
    print("구글 시트 URL 연동 테스트")
    print("=" * 50)
    print(f"URL: {DEPLOYED_SHEETS_URL[:60]}...")
    print(f"전송 시각: {FAKE_PAYLOAD['timestamp']}")
    print(f"user_id: {FAKE_PAYLOAD['user_id']}")
    print()

    data = json.dumps(FAKE_PAYLOAD).encode("utf-8")
    req = urllib.request.Request(
        DEPLOYED_SHEETS_URL,
        data=data,
        headers={"Content-Type": "text/plain"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            body = res.read().decode()
            status = res.status
            print(f"HTTP {status}")
            try:
                parsed = json.loads(body)
                if parsed.get("ok"):
                    print("✓ 응답: ok=true")
                    print()
                    print("성공: 시트에 데이터가 추가되었는지 확인해 주세요.")
                else:
                    print(f"응답: {parsed}")
            except json.JSONDecodeError:
                if "오류" in body or "Error" in body or "<html" in body.lower():
                    print("✗ 서버가 HTML 에러 페이지를 반환했습니다.")
                    print("  Apps Script의 doPost 함수 또는 배포 설정을 확인해 주세요.")
                    if "Script function not found" in body or "doGet" in body:
                        print("  → doPost 함수가 없거나 배포가 잘못되었습니다.")
                    print(f"  본문 일부: {body[body.find('<title>')+7:body.find('</title>')] if '<title>' in body else body[:200]}")
                else:
                    print(f"응답 본문: {body[:300]}")
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"✗ HTTP {e.code} {e.reason}")
        print(f"응답: {body[:300]}")
        print()
        print("실패: URL이 유효한지, Apps Script doPost가 배포되어 있는지 확인해 주세요.")
    except urllib.error.URLError as e:
        print(f"✗ 네트워크 오류: {e.reason}")
        print()
        print("실패: 네트워크 연결 또는 URL을 확인해 주세요.")
    except Exception as e:
        print(f"✗ 오류: {e}")


if __name__ == "__main__":
    main()

# 구글 시트 전송 설정 가이드

summary.html의 "구글 시트 전송" 기능을 사용하려면 Google Apps Script Web App을 배포해야 합니다.

## 1. Google 스프레드시트 생성

1. [sheets.new](https://sheets.new)에서 새 스프레드시트 생성
2. 첫 행에 아래 **헤더 순서**와 동일하게 입력 (순서가 틀리면 열이 밀립니다)

## 2. 전송 payload 구조 (summary.html 기준)

**키 순서 (SHEETS_HEADER_ORDER):**
```
timestamp | user_id | age | gender | monitor_inch | resolution | viewing_distance | disability_type |
vision_rt_avg | vision_aim_avg | fov_blind_rate | readable_font_size | readable_font_size_mm |
motor_rt_avg | motor_aim_avg | motor_switch_latency | key_reach_score | burst_speed_peak | fatigue_index | motor_precision_error_mm |
seq_memory_score | go_nogo_accuracy |
hearing_hearing_number_left | hearing_hearing_number_right | hearing_capacity_left | hearing_capacity_right |
hearing_speech_clarity_percent | hearing_articulation_match_rate | hearing_observer_clarity_rating |
input_device | assistive_device |
calibration_mm_per_px |
raw_vision_data | raw_motor_data | raw_cognitive_data | raw_hearing_data | observer_report
```

- **요약 필드**: vision_rt_avg, motor_rt_avg 등 수치
- **청각**: 히어링 넘버·청각 수용력은 좌(L)/우(R) 각각, 수음 명료도·발화 인식 일치도·관찰자 발화 명료도는 단일 값
- **raw_*_data**: 시각/운동/인지/청각 전체 객체 (JSON 문자열로 저장 권장)
- **observer_report**: 관찰자 리포트 객체 (JSON 문자열로 저장 권장)

## 3. Apps Script 작성

스프레드시트에서 **확장 프로그램 > Apps Script** 열기

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    // 옵션 A: JSON 전체를 한 셀에
    sheet.appendRow([new Date(), JSON.stringify(data)]);
    // 옵션 B: 프로필 + summary 컬럼 + raw는 JSON 문자열로
    // var row = [data.userId, data.gender, data.disabilityType];
    // if (data.summary) row = row.concat([data.summary.vision_rt_avg, data.summary.fov_blind_rate, ...]);
    // row.push(JSON.stringify(data.raw_vision_data || {}), JSON.stringify(data.raw_motor_data || {}), ...);
    // sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 4. 배포

1. **배포 > 새 배포**
2. 유형: **웹 앱**
3. 실행 사용자: **나**
4. 액세스: **모든 사용자** (익명 접근 허용)
5. **배포** 클릭 후 Web App URL 복사

## 5. summary.html 사용

summary.html의 **전송** 버튼을 누르면 지정된 Web App URL로 POST 전송됩니다. URL은 코드 내 `DEPLOYED_SHEETS_URL` 상수로 고정되어 있습니다.

- **전송 형식**: `Content-Type: text/plain`으로 JSON 문자열 전송 (CORS preflight 없이 동작하여 가장 안정적)
- `mode: 'no-cors'` 또는 `credentials` 옵션은 사용하지 마세요 (응답을 읽을 수 없음)
- CORS 오류 시: Apps Script에서 `doPost`가 `ContentService.MimeType.JSON`을 반환하는지, 배포 액세스가 "모든 사용자"인지 확인하세요.

## 6. "Failed to fetch" / 전송 실패가 날 때

브라우저에 **Failed to fetch** 또는 **전송 실패** 메시지가 뜨는 경우, 아래를 순서대로 확인하세요.

1. **페이지를 어떻게 열었는지**
   - `file:///...` 로 HTML을 직접 열면 대부분의 브라우저가 외부 URL(구글)로 보내는 요청을 막습니다. **반드시 웹 서버로 접속**하세요 (예: `http://localhost:8080/...` 또는 실제 호스팅 주소).

2. **구글 Apps Script 배포 URL**
   - `summary.html` 안의 `DEPLOYED_SHEETS_URL`이 **현재 사용 중인 Web App 배포 URL과 같은지** 확인하세요. 스크립트를 다시 배포하면 URL이 바뀌므로, 새 URL을 코드에 넣어야 합니다.

3. **배포 설정**
   - 배포 유형: **웹 앱**
   - 액세스: **모든 사용자** (또는 "Anyone")로 되어 있어야 합니다. "나만"이면 다른 환경에서의 요청이 거절될 수 있습니다.

4. **네트워크/방화벽**
   - 회사·학교 네트워크나 VPN, 광고 차단 확장 프로그램이 `script.google.com` 접속을 막는 경우가 있습니다. 다른 네트워크나 시크릿 창에서 시도해 보세요.

5. **Apps Script 쪽 오류**
   - 스크립트 실행 시 예외가 나면 브라우저에는 네트워크 오류처럼 보일 수 있습니다. Apps Script 편집기에서 **실행** > **실행 로그** 또는 **배포** > **실행** 기록을 확인해 보세요.

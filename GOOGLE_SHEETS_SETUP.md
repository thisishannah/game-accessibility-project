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
seq_memory_score | go_nogo_accuracy | hearing_intelligibility |
input_device | assistive_device |
calibration_mm_per_px |
raw_vision_data | raw_motor_data | raw_cognitive_data | raw_hearing_data | observer_report
```

- **요약 필드**: vision_rt_avg, motor_rt_avg 등 수치
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

> CORS 오류가 발생하면 Apps Script에서 `doPost`가 `ContentService.MimeType.JSON`을 반환하는지, 배포 액세스가 "모든 사용자"인지 확인하세요.

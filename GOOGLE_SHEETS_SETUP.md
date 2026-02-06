# 구글 시트 전송 설정 가이드

summary.html의 "구글 시트 전송" 기능을 사용하려면 Google Apps Script Web App을 배포해야 합니다.

## 1. Google 스프레드시트 생성

1. [sheets.new](https://sheets.new)에서 새 스프레드시트 생성
2. 첫 행에 헤더 입력 (예: userId, gender, disabilityType, ... 또는 JSON 전체를 한 열에 저장)

## 2. Apps Script 작성

스프레드시트에서 **확장 프로그램 > Apps Script** 열기

**전송 payload 구조 (Summary + Raw 분리)**

- **프로필**: `userId`, `gender`, `ageRange`, `disabilityType`, `platform`, `inputDevice`, `recordedAt`
- **summary**: 요약 값 객체
  - `vision_rt_avg`, `fov_blind_rate`, `vision_font_min_px`, `vision_aim_avg_ms`
  - `motor_rt_avg`, `motor_aim_avg_ms`, `motor_precision_avg_error`, `motor_fatigue_index`
  - `cognitive_sequence_max_level`, `cognitive_go_nogo_success_rate`, `cognitive_divided_star_rate`, `cognitive_reading_success_rate`
  - `hearing_overall_db`, `hearing_speech_clarity_pct`, `hearing_speech_rating`
- **raw_vision_data**, **raw_motor_data**, **raw_cognitive_data**, **raw_hearing_data**: 차수별 상세 객체(JSON)

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

## 3. 배포

1. **배포 > 새 배포**
2. 유형: **웹 앱**
3. 실행 사용자: **나**
4. 액세스: **모든 사용자** (익명 접근 허용)
5. **배포** 클릭 후 Web App URL 복사

## 4. summary.html에 URL 입력

복사한 URL을 summary.html의 "구글 시트 전송" 입력란에 붙여넣고 **구글 시트로 전송** 버튼 클릭.

> CORS 오류가 발생하면 Apps Script에서 `doPost`가 `ContentService.MimeType.JSON`을 반환하는지, 배포 액세스가 "모든 사용자"인지 확인하세요.

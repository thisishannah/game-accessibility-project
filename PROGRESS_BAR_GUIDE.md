# 진행바 추가 가이드

모든 테스트 페이지에 진행바를 추가하는 방법입니다.

## HTML 추가

각 테스트 페이지의 `<body>` 태그 바로 다음에 다음 코드를 추가하세요:

```html
<div class="test-progress-bar">
  <div class="test-progress-fill" id="test-progress-fill" style="width: 0%"></div>
</div>
<div class="test-progress-info" id="test-progress-info">0/총횟수</div>
```

## JavaScript 추가

각 테스트 페이지의 스크립트에 다음 함수를 추가하세요:

```javascript
function updateProgress() {
  const progress = (완료횟수 / 총횟수) * 100;
  const progressFill = document.getElementById("test-progress-fill");
  const progressInfo = document.getElementById("test-progress-info");
  if (progressFill) progressFill.style.width = progress + "%";
  if (progressInfo) progressInfo.textContent = 완료횟수 + "/" + 총횟수;
}
```

그리고 진행이 업데이트될 때마다 `updateProgress()`를 호출하세요.

## 예시: reaction-time.html

- 총 4회 시행
- 각 시행 완료 시 `currentTrial++` 후 `updateProgress()` 호출
- 페이지 로드 시 초기화를 위해 `updateProgress()` 호출

## 각 테스트별 총 횟수

- reaction-time.html: 4회
- motor-reaction-time.html: 4회
- aim-trainer.html: 30개 타겟
- motor-aim-trainer.html: 30개 타겟
- font.html: 1회 (진행바 불필요하거나 0/1로 표시)
- fov.html: 4회 (라운드별)
- motor-precision.html: 20회 클릭
- motor-burst-speed.html: 5초 (시간 기반)
- motor-simultaneous-input.html: 여러 조합 (동적)
- motor-hold-duration.html: 1회 (진행바 불필요)
- motor-fatigue.html: 60초 (시간 기반)
- cognitive-sequence-memory.html: 레벨별 (동적)
- cognitive-go-no-go.html: 여러 시행 (동적)
- cognitive-divided-attention.html: 시간 기반
- cognitive-reading-speed.html: 여러 시행 (동적)

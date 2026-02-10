# 청각언어 측정 리디자인 계획

## 완료된 작업
- ✅ **청각언어 허브(hearing_hub.html)** 생성 - 시각/운동/인지처럼 카드 클릭 방식
- ✅ **hub.html** - 청각 클릭 시 `hearing_hub.html`로 이동하도록 변경

## 남은 작업 및 구현 방안

### 1. 청력 측정 결과 입력 (hearing-input.html)
- **Mimi 스타일 UI**: Mimi 앱 결과 화면과 동일한 레이아웃(측정 출처, 전체 dB, 좌/우 귀 × 250/500/1k/2k/4k/8kHz)으로 직관적 입력
- **스크린샷 업로드 → 자동 추출**
  - **가능 여부**: 기술적으로 가능합니다.
  - **구현 방식**:
    1. `<input type="file" accept="image/*">`로 이미지 업로드
    2. 서버/클라우드 함수(AWS Lambda, Vercel Functions 등)에 전송
    3. Google Cloud Vision API, AWS Textract, Tesseract OCR 등으로 텍스트 추출
    4. Mimi 결과 화면의 고정 레이아웃(Hz 라벨, dB 값)을 파싱해 입력란 자동 채우기
  - **현재 한계**: 프로젝트가 정적 HTML/JS만 있어 백엔드가 없음. 스크린샷 분석을 위해서는 서버리스 함수 또는 외부 API 연동 필요
  - **권장**: 우선 Mimi 형식에 맞춘 수동 입력 UI를 완성하고, "스크린샷 업로드(추후 연동)" 버튼을 placeholder로 추가

### 2. 언어 명료도 테스트 (hearing-speech-clarity.html)
- **고품질 음성**: Web Speech API `SpeechSynthesisUtterance`에서
  - `getVoices()`로 한국어 보이스 선택 (localService=true인 로컬 보이스 우선)
  - `rate: 0.9`, `pitch: 1.0`, `volume: 1.0`으로 안정적 발화
- **4글자 이상 단어, 카테고리 랜덤**: 예) 동물(코끼리, 바다표범), 음식(스트로베리), 기술(컴퓨터, 키보드) 등 카테고리별 단어 풀을 두고 `sort(() => Math.random() - 0.5)`로 섞어 5~8개 추출

### 3. 발화 명료도 테스트 (hearing-articulation.html)
- **참여자 화면 흐름**:
  1. 마이크 권한 요청 → 실시간 볼륨 미터(Web Audio API AnalyserNode)로 입력 여부 확인
  2. 문장 표시: 게임 채팅 스타일 문장 (예: "이번 라운드 잘했어요, 다음에도 화이팅!", "탱크는 앞에 서주시고, 딜러는 뒤에서 공격해주세요")
  3. "지금 말하세요" 안내 → 녹음 시작 (MediaRecorder)
  4. 녹음 종료 → Web Speech API `SpeechRecognition`(또는 브라우저 지원 시) 또는 외부 STT API로 텍스트 변환
  5. 목표 문장과 인식 결과 비교 → Levenshtein 유사도 또는 단어 일치율로 matchRate 계산
  6. 결과 표시 및 `hearing_results.articulationTest` 저장
- **문장 구성**: 완전한 문장, 15~30자 내외, 비하/조롱/욕설 없음

### 4. 관찰자 발화 명료도 평가 UI 및 데이터 연동

**방안 A: 같은 세션 내 2단계**
- 발화 명료도 테스트 완료 후 "관찰자 평가" 단계로 전환
- 참여자가 녹음한 클립을 재생 버튼으로 들을 수 있게 하고, 관찰자가 1~5점 라디오 버튼으로 평가
- 데이터: `hearing_results.speechClarityRating` (1~5), `hearing_results.articulationTest.observerRating` 등

**방안 B: 별도 관찰자 페이지**
- `observer_report.html` 또는 `hearing-observer-rating.html`에서
- 세션 ID 입력 → 해당 세션의 articulationTest 녹음 URL(또는 base64) 불러오기
- 재생 + 1~5점 주관 평가 입력 → `writeSession({ hearing: { ... 기존, speechClarityRating: N } })`로 병합

**방안 C: 녹음 파일 저장 이슈**
- 현재 프로젝트는 localStorage/sessionStorage만 사용. 녹음 Blob은 용량 제한으로 저장 어려움
- 대안: (1) 녹음 직후 재생만 하고, 관찰자가 그 자리에서 바로 평가 (방안 A), (2) 서버에 녹음 업로드 후 URL 저장 (백엔드 필요)

**권장**: 방안 A — 참여자 테스트 직후 "관찰자님, 위 녹음을 들어보시고 명료도를 평가해 주세요" 화면을 보여 주고, 1~5점 입력 후 함께 저장. 별도 페이지 없이 같은 플로우에서 처리.

---

## 다음 단계
1. `hearing-input.html` 생성 (청력 입력 폼만, Mimi 스타일)
2. `hearing-speech-clarity.html` 생성 (4글자+ 단어, 고품질 TTS)
3. `hearing-articulation.html` 생성 (볼륨미터, 문장, 녹음, 일치도, 관찰자 평가)
4. 기존 `hearing.html`은 deprecated 처리 또는 hearing_hub으로 리다이렉트

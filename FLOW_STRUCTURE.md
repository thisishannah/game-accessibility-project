# 게임 접근성 프로젝트 — 전체 흐름 구조

## 1. 진입점: 정보 입력

```
index.html  (게임 접근성 평가 대시보드)
├── Step 1~5: 참가자 ID, 성별, 연령, 장애 유형, 플랫폼, PC 스펙, 게임/장르 등
└── [저장 및 테스트 시작]  →  hub.html
    (필수 항목 검증 → sessionStorage "user_data" 저장 → 이동)
```

---

## 2. 측정 허브 (메인 메뉴)

```
hub.html  (측정 항목 허브)
├── [시각 측정]        →  vision_hub.html
├── [운동 측정]        →  motor_hub.html
├── [청각언어장애 측정] →  hearing.html
├── [인지 측정]        →  cognitive_hub.html
└── [최종 결과 확인 및 전송]  →  summary.html
    (필수 측정 모두 완료 시에만 활성화)
```

---

## 3. 시각 측정 (vision_hub.html)

```
vision_hub.html
├── 반응속도     →  reaction-time.html   →  완료 후 vision_hub
├── 가독 폰트    →  font.html            →  완료 후 vision_hub
├── 에임 트레이너 →  aim-trainer.html     →  완료 후 vision_hub
├── 9포인트 FOV  →  fov.html             →  완료 후 vision_hub
└── [허브로 돌아가기]  →  hub.html
    (4개 테스트 완료 시 시각 항목 '완료' 표시)
```

---

## 4. 운동 측정 (motor_hub.html)

```
motor_hub.html
├── 반응속도       →  motor-reaction-time.html     →  완료 후 motor_hub
├── 에임 트레이너   →  motor-aim-trainer.html      →  완료 후 motor_hub
├── 최대 홀드 시간  →  motor-hold-duration.html    →  완료 후 motor_hub
├── 동시 입력      →  motor-simultaneous-input.html →  완료 후 motor_hub
├── 정밀도         →  motor-precision.html         →  완료 후 motor_hub
├── Burst Speed   →  motor-burst-speed.html       →  완료 후 motor_hub
├── 피로도         →  motor-fatigue.html           →  완료 후 motor_hub
└── [허브로 돌아가기]  →  hub.html
```

---

## 5. 청각·언어장애 측정

```
hearing.html  (단일 페이지에서 측정)
└── [허브로 돌아가기]  →  hub.html
```

---

## 6. 인지 측정 (cognitive_hub.html)

```
cognitive_hub.html
├── Sequence Memory   →  cognitive-sequence-memory.html  →  완료 후 cognitive_hub
├── Go/No-Go         →  cognitive-go-no-go.html        →  완료 후 cognitive_hub
├── Divided Attention →  cognitive-divided-attention.html →  완료 후 cognitive_hub
├── Reading Speed    →  cognitive-reading-speed.html    →  완료 후 cognitive_hub
└── [허브로 돌아가기]  →  hub.html
```

---

## 7. 결과·리포트

```
summary.html  (접근성 분석 리포트)
├── User Profile & System Spec
├── Diagnostic Data (시각 / 운동 / 인지 / 청각)
└── [관찰자 리포트로]  →  observer_report.html

observer_report.html  (관찰자 리포트)
├── [저장 후 결과 보기]  →  summary.html
└── [허브로]            →  hub.html
```

---

## 8. 한눈에 보는 전체 흐름도

```
                    index.html
                         │
              [저장 및 테스트 시작]
                         ▼
                    hub.html
           ┌────────────┬────────────┬────────────┬────────────┐
           ▼            ▼            ▼            ▼            ▼
    vision_hub    motor_hub    hearing    cognitive_hub   [최종 결과]
           │            │            │            │            │
    4개 테스트    7개 테스트   단일 페이지  4개 테스트        │
           │            │            │            │            │
           └────────────┴────────────┴────────────┘            │
                         │                                     │
                  [허브로 돌아가기]                             │
                         │                                     │
                         └─────────────────────────────────────┘
                                         │
                                         ▼
                                  summary.html
                                         │
                              [관찰자 리포트로]
                                         ▼
                                observer_report.html
```

---

## 9. 데이터 흐름

| 구간 | 저장소 | 용도 |
|------|--------|------|
| index → hub | `sessionStorage["user_data"]` | 참가자 정보·설정 (GAStorage도 동기) |
| 각 측정 완료 | `GAStorage.writeProgress("visual"\|"motor"\|"audio"\|"cognitive", ...)` | 허브에서 완료 수 표시 (예: 2/4) |
| 최종 결과 | `GAStorage.readSession()` / `readProgress()` | summary·observer_report에서 리포트 생성 |

---

## 10. 페이지별 역할 요약

| 페이지 | 역할 |
|--------|------|
| **index.html** | 참가자·환경 정보 입력, 저장 후 테스트 시작 |
| **hub.html** | 4개 영역(시각/운동/청각/인지) 측정 메뉴, 완료 시 최종 결과로 이동 |
| **vision_hub.html** | 시각 관련 4개 테스트 진입점, 완료 시 hub에 반영 |
| **motor_hub.html** | 운동 관련 7개 테스트 진입점 |
| **hearing.html** | 청각·언어장애 측정 (단일 페이지) |
| **cognitive_hub.html** | 인지 관련 4개 테스트 진입점 |
| **summary.html** | 접근성 분석 리포트 (프로필·진단 데이터) |
| **observer_report.html** | 관찰자용 리포트 작성 후 summary 또는 hub로 이동 |

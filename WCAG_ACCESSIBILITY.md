# WCAG 2.1/2.2 접근성 가이드 (NVDA 호환)

이 프로젝트는 WCAG 2.1 및 2.2 기준에 맞춰 접근성을 적용했습니다.

## 적용된 접근성 기능

### 1. 공통 (style.css)
- **스킵 링크**: 본문으로 바로 이동 (`<a href="#main-content" class="skip-link">`)
- **포커스 표시**: `:focus-visible` 2px 링 (WCAG 2.2 Focus Not Obscured)
- **최소 타깃 크기**: 24×24px (WCAG 2.2 2.5.8)
- **prefers-reduced-motion**: 애니메이션/전환 최소화
- **스크린 리더 전용 텍스트**: `.sr-only` 클래스

### 2. 페이지별 마크업
- `lang="ko"` on `<html>`
- 하나의 `<h1>` per page (페이지 제목)
- `<main id="main-content" role="main">` (스킵 링크 대상)
- `aria-label`, `aria-describedby`, `aria-live` (동적 콘텐츠)
- `<label for="...">` (입력 필드)
- `role="button"` + `tabindex="0"` (클릭 카드, 키보드 활성화)
- `aria-hidden="true"` (장식용 아이콘)

### 3. 폼·입력
- 필수 입력 표시 (`aria-required`, `required`)
- 오류 메시지 `aria-live="polite"`
- `aria-describedby` (도움말 텍스트)
- `aria-invalid` (오류 시)

### 4. Canvas/이미지
- `role="img"` + `aria-label` (의미 있는 시각 콘텐츠)

### 5. NVDA 테스트 체크리스트
- [ ] 스킵 링크: Tab 첫 포커스에서 "본문으로 건너뛰기" 인식
- [ ] 헤딩: H 키로 h1/h2 순서 탐색
- [ ] 포커스: Tab 이동 시 포커스 링 보임
- [ ] 라이브 영역: 상태 변경 시 자동 안내
- [ ] 버튼/링크: 이름·역할·상태 명확
- [ ] 폼: 레이블 연결, 오류 안내

## 주의사항
- 시각/색각 테스트는 본질적으로 시각 의존적이어서, 스크린 리더 사용자가 동일한 방식으로 수행하기 어려울 수 있음
- 그럼에도 UI 요소(버튼, 입력, 안내 텍스트)는 모두 인식 가능해야 함

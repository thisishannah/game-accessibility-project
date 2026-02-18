# 수정사항이 웹 페이지에 반영되지 않을 때

## 원인

**브라우저 캐시**가 가장 흔한 원인입니다.
- HTML, CSS, JavaScript를 이전 버전으로 캐시함
- `file://`로 열 때 일부 브라우저가 캐시를 강하게 적용

## 해결 방법

### 1. 강력 새로고침 (가장 간단)

| OS | 단축키 |
|----|--------|
| Windows / Linux | `Ctrl` + `Shift` + `R` |
| macOS | `Cmd` + `Shift` + `R` |

또는 개발자 도구(F12) → Network 탭 → **Disable cache** 체크 후 새로고침

### 2. 로컬 서버 사용 (권장)

프로젝트 루트에서:

```bash
# Python 3
python -m http.server 8000

# 또는 Node.js (npx)
npx serve -p 8000
```

브라우저에서 `http://localhost:8000` 접속 후 `index.html` 열기

### 3. 캐시 완전 삭제

- Chrome: 설정 → 개인정보 및 보안 → 인터넷 사용 기록 삭제 → **캐시된 이미지 및 파일** 선택
- 또는 시크릿/프라이빗 창에서 `index.html` 열기

### 4. 파일 직접 열기 vs 서버

- `file:///Users/.../index.html` → 캐시가 강하게 적용될 수 있음
- `http://localhost:8000/index.html` → 상대적으로 캐시 영향이 적음

## 확인 방법

수정한 코드가 적용됐는지:

1. **개발자 도구(F12) → Sources** 에서 해당 파일 열기
2. **내용이 최신인지** 확인
3. 예: `ga-storage.js`에서 `_progressKey` 함수가 보이면 새 버전이 로드된 것

# 색각 이상 용어 및 판정 기준 레퍼런스

이 문서는 본 프로젝트의 색각 테스트 구현에 사용된 의학적 용어, 판정 기준, 분류 체계의 출처와 검증 상태를 정리합니다. 웹상의 비전문적 표현을 배제하고, 가능한 한 검증된 의학·임상 자료를 기준으로 합니다.

---

## 1. 의학적 용어 및 분류 (한국어)

### 1.1 공식 출처

| 출처 | 용어 | 비고 |
|------|------|------|
| **연세의대 의학백과** (연세대학교 의과대학) | 제1이상: 적색약(protanomaly), 적색맹(protanopia)<br>제2이상: 녹색약(deuteranomaly), 녹색맹(deuteranopia)<br>제3이상: 청색약(tritanomaly), 청색맹(tritanopia)<br>전색맹(achromatopsia) | [출처](https://medicine.yonsei.ac.kr/health/encyclopedia/disease/body_board.do?mode=view&articleNo=120307&title=색각이상+[Dyschromatopsia]) |
| **위키백과 한국어** (Cassin & Solomon, *Dictionary of Eye Terminology* 인용) | 제1색각이상: 적색맹, 적색약<br>제2색각이상: 녹색맹, 녹색약<br>제3색각이상: 황청색맹(tritanopia), 청색약(tritanomaly)<br>전색맹(단색형 색각이상) | [출처](https://ko.wikipedia.org/wiki/색각_이상) |
| **National Eye Institute (NEI)** | Protanopia/Protanomaly, Deuteranopia/Deuteranomaly (red-green)<br>Tritanopia/Tritanomaly (blue-yellow)<br>Achromatopsia (complete) | [출처](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness/types-color-vision-deficiency) |

### 1.2 용어 정리 (본 프로젝트 채택)

- **색맹 (-opia)**: 해당 원뿔세포의 완전 결핍. 색을 전혀 구분하지 못함.
- **색약 (-omaly)**: 해당 원뿔세포의 기능 약화. 색 구분이 어렵지만 완전히 상실되지는 않음.
- **적록색약**: 비공식·일반 용어. 의학적으로는 **적색약** 또는 **녹색약**으로 구분해야 함.

| 영문 (의학) | 한글 (채택) | ICD-10 | 설명 |
|-------------|-------------|--------|------|
| Protanopia | 적색맹 (제1색각이상) | H53.54 | 적색 수용체(L-원뿔) 완전 결핍 |
| Protanomaly | 적색약 (제1색각이상) | - | 적색 수용체 기능 약화 |
| Deuteranopia | 녹색맹 (제2색각이상) | H53.53 | 녹색 수용체(M-원뿔) 완전 결핍 |
| Deuteranomaly | 녹색약 (제2색각이상) | - | 녹색 수용체 기능 약화 |
| Tritanopia | 황청색맹 (제3색각이상) | H53.55 | 청색 수용체(S-원뿔) 완전 결핍, 청-녹·황-분홍 구분 불가 |
| Tritanomaly | 황청색약 (제3색각이상) | - | 청색 수용체 기능 약화 |
| Achromatopsia | 전색맹 | H53.51 | 모든 색 구분 불가, 흑백만 인지 |

**참고**: 제3이상의 한글 표기는 “청색맹/청색약”과 “황청색맹/황청색약”이 혼용됩니다. 본 프로젝트는 영향을 받는 색채 영역(청-황)을 반영해 **황청색맹/황청색약**을 사용합니다.

---

## 2. 테스트 방식 및 판정 기준

### 2.1 Ishihara 검사 (기본 색약 검사)

- **공식 Ishihara 검사**: 38판(또는 24판, 14판 단축판), 75cm 거리, 일광 또는 그에 준하는 조명.
- **판정 기준 (참고)**: 14판 중 12판 이상 정답 시 정상, 이하면 적록색각 이상 의심. [Stanford plate instructions, TTUHSC EP-3]
- **제한점**: 적록색각(1형·2형)만 평가. **황청색맹/황청색약(3형)은 검출 불가**.
- **본 프로젝트 구현**: 6판의 **시뮬레이션 판정판**(Canvas 기반). 공식 Ishihara 판정판이 아니며, 1차 분류용 스크리닝 수준이며, 임상 진단을 대체할 수 없습니다.

### 2.2 심층 색상 식별 검사 (명도 경계·보색 혼동)

- **명도 일치 경계선**: 적·녹색을 동일 sRGB 상대 명도(WCAG 2.1: L=0.2126R+0.7152G+0.0722B)로 맞춘 후, 경계의 세로 줄무늬(적|녹|적|녹 교대) 인지 여부 확인.
- **보색 혼동**: 분홍-회색, 보라-파랑 등 혼동 가능 색쌍에서 “붉은 기운” 선택.
- **원리·출처**: 적록색맹/색약은 L·M 원뿔 결핍으로 동일 명도의 적-녹을 구분 못함(경계·무늬 안 보임). 정안은 색상으로 구분 가능. NEI, MedlinePlus Genetics, NBK217820, WCAG 2.1 Relative Luminance.
- **본 프로젝트 구현**: Canvas에서 동일 명도의 적·녹을 세로 5px 줄무늬로 교대 배치(경계 영역만). 1차 스크리닝용이며 임상 진단을 대체하지 않습니다.

---

## 3. 본 프로젝트의 한계 및 고지사항

1. **임상 진단 불가**: 본 테스트는 스크리닝 목적이며, 공식 Ishihara·Farnsworth·색각검사경(Nagel anomaloscope) 등과 동일한 수준의 진단을 제공하지 않습니다.
2. **3형(황청색맹/황청색약) 미검출**: 현재 구현된 Ishihara 스타일 검사는 적록색각(1형·2형)만 대상으로 합니다.
3. **전색맹 미검출**: 전색맹(achromatopsia)을 별도로 검출·판정하는 로직은 포함되어 있지 않습니다.
4. **모니터/조명 의존성**: 색각·대비 검사 결과는 모니터 밝기, 색온도, 환경광 등에 영향을 받습니다.

---

## 4. 참고 문헌 및 링크

- [국제질병분류 ICD-10] H53.5 Color vision deficiencies
- [National Eye Institute] Types of Color Vision Deficiency
- [MedlinePlus Genetics] Color vision deficiency
- [NCBI NBK217820] CHAPTER 2 Classification of Color Vision Defects (equal luminance, protanopia/deuteranopia)
- [W3C WCAG 2.1] Relative Luminance (0.2126R+0.7152G+0.0722B)
- [연세의대 의학백과] 색각이상 [Dyschromatopsia]
- [위키백과 한국어] 색각 이상
- Cassin, B. and Solomon, S. *Dictionary of Eye Terminology*. Triad Publishing, 1990.

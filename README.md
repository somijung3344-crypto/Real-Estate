# 🏢 대구 Real Estate (Daegu Real Estate)

> **공공데이터와 Supabase를 결합한 스마트 대구 아파트 실거래가 조회 및 북마크 서비스**
> 
> 대구광역시의 주요 핵심 권역(수성구, 중구, 달서구, 북구)의 아파트 정보를 대화형 SVG 지도와 상세 차트를 통해 직관적으로 분석하고, 실시간 관심 아파트 저장 및 회원 인증을 지원하는 모던 웹 애플리케이션입니다.

---

## 🛠️ Tech Stack (기술 스택)

- **Frontend**: ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black)
- **Database & Auth**: ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Map API**: [Kakao Maps API](https://apis.map.kakao.com/)

---

## ✨ Key Features (주요 기능)

### 1. 🗺️ 대화형 구역 탐색 (Interactive Explorer)
- 대구시 핵심 4대 권역(**수성구, 중구, 달서구, 북구**)을 나타내는 대화형 SVG 미니 지도를 탑재하여, 원하는 자치구를 클릭하면 즉시 해당 권역의 실거래 분석실로 진입합니다.
- 자치구별 평균 평당 시세 카드가 함께 표시되어 대구 전체의 흐름을 한눈에 조망할 수 있습니다.

### 2. 📊 아파트 시세 추이 분석 (Price Trend Analysis)
- 권역별 대표 아파트의 상세 정보(세대수, 준공년도, 주소 등) 제공.
- **59㎡, 84㎡, 114㎡** 등 다양한 평형 선택 옵션 지원.
- 최근 4개년(2023년 ~ 2026년) 실거래 가격 추이를 막대형 시각화(CSS Grid/Flex 기반 컴포넌트)로 한눈에 비교 가능.
- 실제 거래 날짜, 층수, 거래 가격을 일자별 타임라인 형태로 표시.

### 3. 🔒 Supabase 기반 회원 시스템 (Authentication)
- 이메일/비밀번호 기반의 간편 회원가입 및 로그인 지원.
- 마이페이지를 통해 계정 정보 확인 및 비밀번호 변경, 회원 탈퇴 기능 탑재.

### 4. 💾 실시간 북마크 시스템 (Realtime Bookmarks)
- 로그인한 유저는 관심 아파트를 클릭 한 번으로 내 저장소(북마크)에 저장할 수 있습니다.
- 저장된 아파트는 Supabase DB에 실시간 저장되어, 언제 어디서나 동일한 북마크 상태를 유지하고 클릭 시 해당 분석 페이지로 바로 이동합니다.

---

## 📂 Project Structure (프로젝트 구조)

```
├── .agents/               # 에이전트 전용 가이드라인 및 규칙 정의 폴더
│   └── AGENTS.md
├── index.html             # 메인 마크업 (홈, 분석실, 북마크, 모달 UI)
├── style.css              # 커스텀 테마 변수 및 반응형 CSS 레이아웃
├── app.js                 # 핵심 애플리케이션 비즈니스 로직 및 Supabase 연동
├── config.js              # Supabase & Map API API Key 설정 파일 (로컬)
├── config.example.js      # 설정 파일 예시 템플릿
├── supabase_schema.sql    # Supabase 테이블 및 RLS 설정용 SQL 덤프
└── README.md              # 프로젝트 소개서 (본 파일)
```

---

## 🚀 Getting Started (시작하기)

### 1. 로컬 환경 설정
1. 이 프로젝트는 정적 웹 페이지로 별도의 빌드 과정 없이 즉시 실행 가능합니다.
2. Supabase 연동 및 지도 서비스를 정상 동작시키기 위해, 프로젝트 루트 폴더에 `config.js` 파일을 생성하고 발급받은 API 키 정보를 입력해 주세요.

```javascript
// config.js 예시
const CONFIG = {
  SUPABASE_URL: "https://your-supabase-project-url.supabase.co",
  SUPABASE_ANON_KEY: "your-supabase-anon-key",
  KAKAO_MAP_API_KEY: "your-kakao-map-app-key" // Kakao Maps 연동 시 입력
};
```
*(예시 템플릿은 `config.example.js`를 참고하시기 바랍니다.)*

### 2. 실행 방법
- 라이브 서버를 사용하거나 `index.html` 파일을 웹 브라우저에서 직접 열어 실행할 수 있습니다.
- VS Code 사용자라면 `Live Server` 확장을 이용해 가상 로컬 호스트 서버에서 테스트하는 것을 권장합니다.

---

## 🗄️ Database Setup (Supabase)
이 프로젝트의 실시간 관심 아파트 저장(북마크) 기능을 사용하려면 Supabase 테이블이 필요합니다.  
프로젝트 루트에 위치한 `supabase_schema.sql` 스크립트를 Supabase SQL Editor에 실행하여 테이블 및 보안(RLS) 설정을 쉽게 완료할 수 있습니다.

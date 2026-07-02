// ==================== GLOBAL APP STATE ====================
let supabaseClient = null;
let isDummyAuth = true;
let currentUser = null;

let selectedDistrict = 'suseong'; // 기본값 대구 수성구
let apartments = [];
let selectedApartment = null;
let selectedPyeong = 84; // 기본 84㎡ 선택

let isDummyMap = true;
let kakaoMapInstance = null;
let mapMarkers = [];

// ==================== EXTENDED REAL ESTATE DATASET (대구 피벗 및 매물 연동) ====================
const DISTRICT_DATA = {
  suseong: {
    name: '대구 수성구',
    lat: 35.8443,
    lng: 128.6111,
    apts: [
      { 
        id: 'ss-1', 
        name: '두산위브더제니스', 
        lat: 35.8601, 
        lng: 128.6212, 
        mockX: 55, 
        mockY: 45, 
        address: '수성구 범어동 179', 
        year: '2009년',
        households: '1,494세대',
        trend: 'up',
        priceHistory59: [{ year: '2023', price: 7.2 }, { year: '2024', price: 7.6 }, { year: '2025', price: 8.0 }, { year: '2026', price: 8.5 }],
        priceHistory84: [{ year: '2023', price: 9.8 }, { year: '2024', price: 10.5 }, { year: '2025', price: 11.2 }, { year: '2026', price: 12.0 }],
        priceHistory114: [{ year: '2023', price: 13.5 }, { year: '2024', price: 14.2 }, { year: '2025', price: 15.0 }, { year: '2026', price: 16.2 }],
        transactions: [
          { date: '06.28', price: 12.0, floor: 32 },
          { date: '06.12', price: 11.8, floor: 18 },
          { date: '05.29', price: 11.5, floor: 25 },
          { date: '05.10', price: 11.0, floor: 40 },
          { date: '04.28', price: 10.8, floor: 12 }
        ]
      },
      { 
        id: 'ss-2', 
        name: '범어센트럴푸르지오', 
        lat: 35.8589, 
        lng: 128.6234, 
        mockX: 65, 
        mockY: 50, 
        address: '수성구 범어동 556-12', 
        year: '2019년',
        households: '705세대',
        trend: 'up',
        priceHistory59: [{ year: '2023', price: 5.8 }, { year: '2024', price: 6.2 }, { year: '2025', price: 6.5 }, { year: '2026', price: 6.9 }],
        priceHistory84: [{ year: '2023', price: 8.0 }, { year: '2024', price: 8.5 }, { year: '2025', price: 8.8 }, { year: '2026', price: 9.3 }],
        priceHistory114: [{ year: '2023', price: 10.5 }, { year: '2024', price: 11.0 }, { year: '2025', price: 11.5 }, { year: '2026', price: 12.2 }],
        transactions: [
          { date: '06.26', price: 9.3, floor: 22 },
          { date: '06.10', price: 9.1, floor: 14 },
          { date: '05.24', price: 8.9, floor: 8 },
          { date: '05.08', price: 8.7, floor: 28 },
          { date: '04.20', price: 8.8, floor: 17 }
        ]
      },
      { 
        id: 'ss-3', 
        name: '만촌 헤리티지 단독주택', 
        lat: 35.8523, 
        lng: 128.6385, 
        mockX: 75, 
        mockY: 35, 
        address: '수성구 만촌동 412-5', 
        year: '2018년',
        households: '단독 1가구',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 11.0 }, { year: '2024', price: 11.5 }, { year: '2025', price: 12.0 }, { year: '2026', price: 12.5 }],
        priceHistory84: [{ year: '2023', price: 13.5 }, { year: '2024', price: 14.0 }, { year: '2025', price: 14.5 }, { year: '2026', price: 15.0 }],
        priceHistory114: [{ year: '2023', price: 16.0 }, { year: '2024', price: 16.5 }, { year: '2025', price: 17.0 }, { year: '2026', price: 17.5 }],
        transactions: [
          { date: '06.18', price: 15.0, floor: 1 },
          { date: '04.05', price: 14.2, floor: 1 }
        ]
      },
      { 
        id: 'ss-4', 
        name: '범어 라온프라이빗', 
        lat: 35.8631, 
        lng: 128.6189, 
        mockX: 52, 
        mockY: 30, 
        address: '수성구 범어동 100-3', 
        year: '2016년',
        households: '175세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 5.2 }, { year: '2024', price: 5.4 }, { year: '2025', price: 5.6 }, { year: '2026', price: 5.8 }],
        priceHistory84: [{ year: '2023', price: 7.0 }, { year: '2024', price: 7.3 }, { year: '2025', price: 7.5 }, { year: '2026', price: 7.8 }],
        priceHistory114: [{ year: '2023', price: 9.0 }, { year: '2024', price: 9.2 }, { year: '2025', price: 9.5 }, { year: '2026', price: 9.8 }],
        transactions: [
          { date: '06.20', price: 7.8, floor: 15 },
          { date: '05.11', price: 7.5, floor: 8 },
          { date: '03.28', price: 7.4, floor: 18 }
        ]
      },
      { 
        id: 'ss-5', 
        name: '수성동일하이빌 레이크시티', 
        lat: 35.8285, 
        lng: 128.6134, 
        mockX: 45, 
        mockY: 75, 
        address: '수성구 상동 555', 
        year: '2009년',
        households: '1,411세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 4.8 }, { year: '2024', price: 4.9 }, { year: '2025', price: 5.1 }, { year: '2026', price: 5.2 }],
        priceHistory84: [{ year: '2023', price: 6.8 }, { year: '2024', price: 7.0 }, { year: '2025', price: 7.2 }, { year: '2026', price: 7.4 }],
        priceHistory114: [{ year: '2023', price: 8.5 }, { year: '2024', price: 8.8 }, { year: '2025', price: 9.0 }, { year: '2026', price: 9.2 }],
        transactions: [
          { date: '06.22', price: 7.4, floor: 12 },
          { date: '05.30', price: 7.3, floor: 19 },
          { date: '04.15', price: 7.1, floor: 6 }
        ]
      }
    ]
  },
  junggu: {
    name: '대구 중구',
    lat: 35.8694,
    lng: 128.6062,
    apts: [
      { 
        id: 'jg-1', 
        name: '남산자이하늘채', 
        lat: 35.8612, 
        lng: 128.5834, 
        mockX: 35, 
        mockY: 55, 
        address: '중구 남산동 2951-1', 
        year: '2022년',
        households: '1,368세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 3.8 }, { year: '2024', price: 3.9 }, { year: '2025', price: 4.1 }, { year: '2026', price: 4.1 }],
        priceHistory84: [{ year: '2023', price: 5.5 }, { year: '2024', price: 5.6 }, { year: '2025', price: 5.8 }, { year: '2026', price: 5.8 }],
        priceHistory114: [{ year: '2023', price: 7.0 }, { year: '2024', price: 7.2 }, { year: '2025', price: 7.5 }, { year: '2026', price: 7.5 }],
        transactions: [
          { date: '06.27', price: 5.8, floor: 15 },
          { date: '06.14', price: 5.7, floor: 9 },
          { date: '05.30', price: 5.8, floor: 20 },
          { date: '05.15', price: 5.6, floor: 11 },
          { date: '04.30', price: 5.7, floor: 6 }
        ]
      },
      { 
        id: 'jg-2', 
        name: '대구역센트럴자이', 
        lat: 35.8772, 
        lng: 128.5912, 
        mockX: 45, 
        mockY: 35, 
        address: '중구 수창동 1', 
        year: '2017년',
        households: '1,005세대',
        trend: 'down',
        priceHistory59: [{ year: '2023', price: 3.5 }, { year: '2024', price: 3.3 }, { year: '2025', price: 3.1 }, { year: '2026', price: 3.0 }],
        priceHistory84: [{ year: '2023', price: 4.8 }, { year: '2024', price: 4.5 }, { year: '2025', price: 4.3 }, { year: '2026', price: 4.2 }],
        priceHistory114: [{ year: '2023', price: 6.2 }, { year: '2024', price: 5.9 }, { year: '2025', price: 5.6 }, { year: '2026', price: 5.5 }],
        transactions: [
          { date: '06.28', price: 4.2, floor: 19 },
          { date: '06.15', price: 4.3, floor: 10 },
          { date: '06.01', price: 4.2, floor: 25 },
          { date: '05.18', price: 4.4, floor: 8 },
          { date: '05.02', price: 4.5, floor: 12 }
        ]
      },
      { 
        id: 'jg-3', 
        name: '삼덕동 단독 상가주택', 
        lat: 35.8654, 
        lng: 128.6087, 
        mockX: 62, 
        mockY: 48, 
        address: '중구 삼덕동3가 120-4', 
        year: '1995년',
        households: '점포 및 주택',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 7.8 }, { year: '2024', price: 8.0 }, { year: '2025', price: 8.2 }, { year: '2026', price: 8.5 }],
        priceHistory84: [{ year: '2023', price: 9.0 }, { year: '2024', price: 9.3 }, { year: '2025', price: 9.5 }, { year: '2026', price: 9.8 }],
        priceHistory114: [{ year: '2023', price: 11.0 }, { year: '2024', price: 11.2 }, { year: '2025', price: 11.5 }, { year: '2026', price: 11.8 }],
        transactions: [
          { date: '06.05', price: 9.8, floor: 1 },
          { date: '03.12', price: 9.3, floor: 1 }
        ]
      },
      { 
        id: 'jg-4', 
        name: '대봉동 리모델링 한옥', 
        lat: 35.8592, 
        lng: 128.6021, 
        mockX: 58, 
        mockY: 60, 
        address: '중구 대봉동 712-14', 
        year: '1975년(올수리)',
        households: '단층 단독',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 5.2 }, { year: '2024', price: 5.5 }, { year: '2025', price: 6.0 }, { year: '2026', price: 6.2 }],
        priceHistory84: [{ year: '2023', price: 6.0 }, { year: '2024', price: 6.2 }, { year: '2025', price: 6.3 }, { year: '2026', price: 6.5 }],
        priceHistory114: [{ year: '2023', price: 7.2 }, { year: '2024', price: 7.5 }, { year: '2025', price: 7.8 }, { year: '2026', price: 8.0 }],
        transactions: [
          { date: '05.28', price: 6.5, floor: 1 }
        ]
      },
      { 
        id: 'jg-5', 
        name: '남산롯데캐슬센트럴스카이', 
        lat: 35.8582, 
        lng: 128.5872, 
        mockX: 38, 
        mockY: 65, 
        address: '중구 남산동 130-2', 
        year: '2021년',
        households: '987세대',
        trend: 'up',
        priceHistory59: [{ year: '2023', price: 4.8 }, { year: '2024', price: 5.2 }, { year: '2025', price: 5.5 }, { year: '2026', price: 5.8 }],
        priceHistory84: [{ year: '2023', price: 6.5 }, { year: '2024', price: 6.8 }, { year: '2025', price: 7.0 }, { year: '2026', price: 7.2 }],
        priceHistory114: [{ year: '2023', price: 8.0 }, { year: '2024', price: 8.3 }, { year: '2025', price: 8.6 }, { year: '2026', price: 8.9 }],
        transactions: [
          { date: '06.29', price: 7.2, floor: 18 },
          { date: '05.12', price: 7.0, floor: 25 },
          { date: '04.05', price: 6.8, floor: 9 }
        ]
      }
    ]
  },
  dalseo: {
    name: '대구 달서구',
    lat: 35.8299,
    lng: 128.5323,
    apts: [
      { 
        id: 'ds-1', 
        name: '월성푸르지오', 
        lat: 35.8262, 
        lng: 128.5289, 
        mockX: 45, 
        mockY: 60, 
        address: '달서구 월성동 1810', 
        year: '2008년',
        households: '1,824세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 2.8 }, { year: '2024', price: 2.9 }, { year: '2025', price: 3.0 }, { year: '2026', price: 3.0 }],
        priceHistory84: [{ year: '2023', price: 3.8 }, { year: '2024', price: 3.9 }, { year: '2025', price: 4.0 }, { year: '2026', price: 4.1 }],
        priceHistory114: [{ year: '2023', price: 5.0 }, { year: '2024', price: 5.1 }, { year: '2025', price: 5.2 }, { year: '2026', price: 5.3 }],
        transactions: [
          { date: '06.25', price: 4.1, floor: 11 },
          { date: '06.12', price: 4.0, floor: 23 },
          { date: '05.28', price: 4.0, floor: 7 },
          { date: '05.14', price: 3.9, floor: 15 },
          { date: '04.28', price: 3.8, floor: 19 }
        ]
      },
      { 
        id: 'ds-2', 
        name: '송현동 마당 넓은 주택', 
        lat: 35.8192, 
        lng: 128.5434, 
        mockX: 68, 
        mockY: 72, 
        address: '달서구 송현동 580-12', 
        year: '2002년',
        households: '단독 1가구',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 4.2 }, { year: '2024', price: 4.5 }, { year: '2025', price: 4.8 }, { year: '2026', price: 5.0 }],
        priceHistory84: [{ year: '2023', price: 5.0 }, { year: '2024', price: 5.2 }, { year: '2025', price: 5.3 }, { year: '2026', price: 5.5 }],
        priceHistory114: [{ year: '2023', price: 6.0 }, { year: '2024', price: 6.2 }, { year: '2025', price: 6.4 }, { year: '2026', price: 6.6 }],
        transactions: [
          { date: '06.11', price: 5.5, floor: 1 },
          { date: '03.02', price: 5.1, floor: 1 }
        ]
      },
      { 
        id: 'ds-3', 
        name: '상인동 임대수익 상가주택', 
        lat: 35.8211, 
        lng: 128.5312, 
        mockX: 50, 
        mockY: 65, 
        address: '달서구 상인동 221-3', 
        year: '2010년',
        households: '상가 및 4가구',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 7.5 }, { year: '2024', price: 7.8 }, { year: '2025', price: 8.2 }, { year: '2026', price: 8.5 }],
        priceHistory84: [{ year: '2023', price: 8.2 }, { year: '2024', price: 8.5 }, { year: '2025', price: 8.7 }, { year: '2026', price: 8.9 }],
        priceHistory114: [{ year: '2023', price: 9.8 }, { year: '2024', price: 10.0 }, { year: '2025', price: 10.2 }, { year: '2026', price: 10.5 }],
        transactions: [
          { date: '05.20', price: 8.9, floor: 1 }
        ]
      },
      { 
        id: 'ds-4', 
        name: '이곡동 리모델링 빌라', 
        lat: 35.8512, 
        lng: 128.5089, 
        mockX: 20, 
        mockY: 25, 
        address: '달서구 이곡동 1024-5', 
        year: '1998년',
        households: '8세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 1.8 }, { year: '2024', price: 1.9 }, { year: '2025', price: 2.0 }, { year: '2026', price: 2.1 }],
        priceHistory84: [{ year: '2023', price: 2.1 }, { year: '2024', price: 2.1 }, { year: '2025', price: 2.1 }, { year: '2026', price: 2.1 }],
        priceHistory114: [{ year: '2023', price: 2.5 }, { year: '2024', price: 2.5 }, { year: '2025', price: 2.6 }, { year: '2026', price: 2.6 }],
        transactions: [
          { date: '04.14', price: 2.1, floor: 2 }
        ]
      },
      { 
        id: 'ds-5', 
        name: '월배아이파크2차', 
        lat: 35.8085, 
        lng: 128.5276, 
        mockX: 42, 
        mockY: 90, 
        address: '달서구 유천동 365', 
        year: '2016년',
        households: '2,074세대',
        trend: 'up',
        priceHistory59: [{ year: '2023', price: 3.2 }, { year: '2024', price: 3.4 }, { year: '2025', price: 3.6 }, { year: '2026', price: 3.8 }],
        priceHistory84: [{ year: '2023', price: 4.2 }, { year: '2024', price: 4.4 }, { year: '2025', price: 4.6 }, { year: '2026', price: 4.8 }],
        priceHistory114: [{ year: '2023', price: 5.5 }, { year: '2024', price: 5.8 }, { year: '2025', price: 6.0 }, { year: '2026', price: 6.3 }],
        transactions: [
          { date: '06.28', price: 4.8, floor: 22 },
          { date: '06.05', price: 4.6, floor: 14 },
          { date: '04.19', price: 4.5, floor: 7 }
        ]
      }
    ]
  },
  bukgu: {
    name: '대구 북구',
    lat: 35.8967,
    lng: 128.5812,
    apts: [
      { 
        id: 'bg-1', 
        name: '침산푸르지오 1차', 
        lat: 35.8867, 
        lng: 128.5989, 
        mockX: 50, 
        mockY: 40, 
        address: '북구 침산동 269-10', 
        year: '2005년',
        households: '1,140세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 2.3 }, { year: '2024', price: 2.4 }, { year: '2025', price: 2.5 }, { year: '2026', price: 2.5 }],
        priceHistory84: [{ year: '2023', price: 3.3 }, { year: '2024', price: 3.4 }, { year: '2025', price: 3.5 }, { year: '2026', price: 3.5 }],
        priceHistory114: [{ year: '2023', price: 4.5 }, { year: '2024', price: 4.6 }, { year: '2025', price: 4.7 }, { year: '2026', price: 4.7 }],
        transactions: [
          { date: '06.27', price: 3.5, floor: 18 },
          { date: '06.11', price: 3.5, floor: 9 },
          { date: '05.29', price: 3.4, floor: 25 },
          { date: '05.12', price: 3.4, floor: 12 },
          { date: '04.25', price: 3.3, floor: 6 }
        ]
      },
      { 
        id: 'bg-2', 
        name: '칠성동 태양광 복층주택', 
        lat: 35.8812, 
        lng: 128.5912, 
        mockX: 42, 
        mockY: 55, 
        address: '북구 칠성동2가 302-5', 
        year: '2020년',
        households: '단독 1가구',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 5.5 }, { year: '2024', price: 5.8 }, { year: '2025', price: 6.2 }, { year: '2026', price: 6.5 }],
        priceHistory84: [{ year: '2023', price: 6.2 }, { year: '2024', price: 6.4 }, { year: '2025', price: 6.6 }, { year: '2026', price: 6.8 }],
        priceHistory114: [{ year: '2023', price: 7.5 }, { year: '2024', price: 7.8 }, { year: '2025', price: 8.2 }, { year: '2026', price: 8.5 }],
        transactions: [
          { date: '06.14', price: 6.8, floor: 1 },
          { date: '04.02', price: 6.3, floor: 1 }
        ]
      },
      { 
        id: 'bg-3', 
        name: '복현동 경북대인근 원룸빌딩', 
        lat: 35.8945, 
        lng: 128.6212, 
        mockX: 85, 
        mockY: 45, 
        address: '북구 복현동 340-10', 
        year: '2015년',
        households: '원룸 12가구',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 9.5 }, { year: '2024', price: 9.8 }, { year: '2025', price: 10.5 }, { year: '2026', price: 11.0 }],
        priceHistory84: [{ year: '2023', price: 10.2 }, { year: '2024', price: 10.5 }, { year: '2025', price: 10.8 }, { year: '2026', price: 11.0 }],
        priceHistory114: [{ year: '2023', price: 11.5 }, { year: '2024', price: 12.0 }, { year: '2025', price: 12.5 }, { year: '2026', price: 13.0 }],
        transactions: [
          { date: '05.29', price: 11.0, floor: 1 }
        ]
      },
      { 
        id: 'bg-4', 
        name: '침산동 리모델링 빌라', 
        lat: 35.8892, 
        lng: 128.5834, 
        mockX: 30, 
        mockY: 35, 
        address: '북구 침산동 123-5', 
        year: '2001년(싹올수리)',
        households: '10세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 2.1 }, { year: '2024', price: 2.3 }, { year: '2025', price: 2.4 }, { year: '2026', price: 2.5 }],
        priceHistory84: [{ year: '2023', price: 2.4 }, { year: '2024', price: 2.4 }, { year: '2025', price: 2.4 }, { year: '2026', price: 2.5 }],
        priceHistory114: [{ year: '2023', price: 2.8 }, { year: '2024', price: 2.9 }, { year: '2025', price: 2.9 }, { year: '2026', price: 3.0 }],
        transactions: [
          { date: '06.01', price: 2.5, floor: 3 }
        ]
      },
      { 
        id: 'bg-5', 
        name: '동변 테라스 타운하우스', 
        lat: 35.9285, 
        lng: 128.5985, 
        mockX: 55, 
        mockY: 15, 
        address: '북구 동변동 650', 
        year: '2012년',
        households: '32세대',
        trend: 'stable',
        priceHistory59: [{ year: '2023', price: 4.5 }, { year: '2024', price: 4.8 }, { year: '2025', price: 5.0 }, { year: '2026', price: 5.2 }],
        priceHistory84: [{ year: '2023', price: 5.0 }, { year: '2024', price: 5.1 }, { year: '2025', price: 5.2 }, { year: '2026', price: 5.2 }],
        priceHistory114: [{ year: '2023', price: 6.0 }, { year: '2024', price: 6.2 }, { year: '2025', price: 6.4 }, { year: '2026', price: 6.5 }],
        transactions: [
          { date: '06.05', price: 5.2, floor: 1 }
        ]
      }
    ]
  }
};

// Mock 데이터셋 속성 초기화
function initMockDataset() {
  for (const districtKey in DISTRICT_DATA) {
    const district = DISTRICT_DATA[districtKey];
    if (district.apts) {
      district.apts.forEach(apt => {
        apt.pyeong = 84;
        if (apt.priceHistory84 && apt.priceHistory84.length > 0) {
          apt.recentPrice = apt.priceHistory84[apt.priceHistory84.length - 1].price;
        } else {
          apt.recentPrice = 0;
        }
      });
    }
  }
}

// 로컬 저장소 API 키 병합 (setup.html에서 입력한 키를 읽어옴)
function applyConfigOverrides() {
  // setup.html에서 저장한 키 우선 읽기
  const primary = localStorage.getItem('ESTATE_API_CONFIG');
  // 구버전 키 폴백
  const legacy = localStorage.getItem('APP_CONFIG_OVERRIDE');
  const raw = primary || legacy;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.SUPABASE_URL) window.APP_CONFIG.SUPABASE_URL = parsed.SUPABASE_URL;
      if (parsed.SUPABASE_ANON_KEY) window.APP_CONFIG.SUPABASE_ANON_KEY = parsed.SUPABASE_ANON_KEY;
      if (parsed.KAKAO_MAP_CLIENT_KEY) window.APP_CONFIG.KAKAO_MAP_CLIENT_KEY = parsed.KAKAO_MAP_CLIENT_KEY;
    } catch (e) {
      console.error('로컬 API 설정 불러오기 실패', e);
    }
  }
}

// ==================== APP INITIALIZATION ====================
function initApp() {
  // 0. 로컬 저장소 API 키 오버라이드 병합
  applyConfigOverrides();

  // 0-B. 로컬 더미 데이터 초기화
  initMockDataset();
  initListingsDataset();

  // 1. Supabase 연동 초기화
  initSupabase();

  // 2. 인증 세션 복원 및 UI 업데이트
  checkAuthSession();

  // 3. 탭 네비게이션 복원 (기본 홈 화면 로드)
  switchSection('home');

  // 4. Lucide 아이콘 초기 활성화
  lucide.createIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Supabase 초기 설정
function initSupabase() {
  const config = window.APP_CONFIG;
  if (config && config.SUPABASE_URL && !config.SUPABASE_URL.includes('dummy-project')) {
    try {
      supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      isDummyAuth = false;
      console.log('Supabase 초기화 완료 (실 서비스 모드)');
    } catch (e) {
      console.error('Supabase 연동 실패. 더미 회원 모드로 실행합니다.', e);
      isDummyAuth = true;
    }
  } else {
    isDummyAuth = true;
    console.log('Supabase 더미 모드로 구동');
  }
}

// ==================== TAB NAVIGATION SERVICE ====================
function switchSection(sectionId) {
  // 1. 모든 페이지 숨김 처리
  document.getElementById('section-home').classList.add('hidden');
  document.getElementById('section-analysis').classList.add('hidden');
  document.getElementById('section-marketplace').classList.add('hidden');
  document.getElementById('section-bookmarks').classList.add('hidden');

  // 2. 모든 네비게이션 비활성화 (데스크톱 & 모바일)
  document.getElementById('nav-home').classList.remove('active');
  document.getElementById('nav-analysis').classList.remove('active');
  document.getElementById('nav-marketplace').classList.remove('active');
  document.getElementById('nav-bookmarks').classList.remove('active');

  const navHomeMobile = document.getElementById('nav-home-mobile');
  const navAnalysisMobile = document.getElementById('nav-analysis-mobile');
  const navMarketplaceMobile = document.getElementById('nav-marketplace-mobile');
  const navBookmarksMobile = document.getElementById('nav-bookmarks-mobile');
  if (navHomeMobile) navHomeMobile.classList.remove('active');
  if (navAnalysisMobile) navAnalysisMobile.classList.remove('active');
  if (navMarketplaceMobile) navMarketplaceMobile.classList.remove('active');
  if (navBookmarksMobile) navBookmarksMobile.classList.remove('active');

  // 3. 대상 페이지 노출 및 활성화 (데스크톱 & 모바일)
  document.getElementById(`section-${sectionId}`).classList.remove('hidden');
  document.getElementById(`nav-${sectionId}`).classList.add('active');
  
  const activeMobileNav = document.getElementById(`nav-${sectionId}-mobile`);
  if (activeMobileNav) activeMobileNav.classList.add('active');

  // 4. 저장소 탭 로드 시 북마크 리스트 새로 렌더링
  if (sectionId === 'bookmarks') {
    renderBookmarksView();
  }

  // 5. 분석실 로드 시 아파트 미선택 상태 대응
  if (sectionId === 'analysis') {
    changeDistrict(selectedDistrict);
  }

  // 6. 매물 거래소 로드 시 목록 렌더링
  if (sectionId === 'marketplace') {
    renderListings();
  }

  lucide.createIcons();
}

// ==================== MAP FLOATING SEARCH & AUTOCOMPLETE ====================
function handleAnalysisSearch(val) {
  const searchVal = val.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear-btn');
  const autocompleteBox = document.getElementById('analysis-autocomplete-box');

  if (searchVal.length === 0) {
    clearBtn.classList.add('hidden');
    autocompleteBox.classList.add('hidden');
    autocompleteBox.innerHTML = '';
    return;
  }

  clearBtn.classList.remove('hidden');
  
  // 대구 데이터셋 내에서 아파트 이름 및 주소 매칭 스캔
  let matches = [];
  Object.keys(DISTRICT_DATA).forEach(districtKey => {
    const district = DISTRICT_DATA[districtKey];
    district.apts.forEach(apt => {
      if (apt.name.toLowerCase().includes(searchVal) || apt.address.toLowerCase().includes(searchVal)) {
        matches.push({ ...apt, districtKey });
      }
    });
  });

  if (matches.length === 0) {
    autocompleteBox.innerHTML = `
      <div class="p-3 text-[11px] text-slate-400 text-center">
        일치하는 아파트가 없습니다.
      </div>
    `;
  } else {
    let itemsHtml = '';
    matches.forEach(apt => {
      itemsHtml += `
        <button onclick="selectSearchApartment('${apt.districtKey}', '${apt.id}')" class="autocomplete-item">
          <div>
            <span class="font-bold text-slate-700">${apt.name}</span>
            <span class="text-slate-400 text-[10px] ml-1.5">${apt.address}</span>
          </div>
          <span class="item-sub">${apt.recentPrice}억</span>
        </button>
      `;
    });
    autocompleteBox.innerHTML = itemsHtml;
  }
  
  autocompleteBox.classList.remove('hidden');
}

function clearAnalysisSearch() {
  const searchInput = document.getElementById('analysis-search-input');
  searchInput.value = '';
  handleAnalysisSearch('');
}

// 홈화면 대형 검색창 및 자동완성 제어
function handleHomeSearch(val) {
  const searchVal = val.trim().toLowerCase();
  const autocompleteBox = document.getElementById('desktop-home-autocomplete-box');
  if (!autocompleteBox) return;

  if (searchVal.length === 0) {
    autocompleteBox.classList.add('hidden');
    autocompleteBox.innerHTML = '';
    return;
  }

  let matches = [];
  Object.keys(DISTRICT_DATA).forEach(districtKey => {
    const district = DISTRICT_DATA[districtKey];
    district.apts.forEach(apt => {
      if (apt.name.toLowerCase().includes(searchVal) || apt.address.toLowerCase().includes(searchVal)) {
        matches.push({ ...apt, districtKey });
      }
    });
  });

  if (matches.length === 0) {
    autocompleteBox.innerHTML = `
      <div class="p-3 text-[11px] text-slate-400 text-center">
        일치하는 아파트가 없습니다.
      </div>
    `;
  } else {
    let itemsHtml = '';
    matches.forEach(apt => {
      itemsHtml += `
        <button onclick="selectSearchApartment('${apt.districtKey}', '${apt.id}'); switchSection('analysis'); closeHomeAutocomplete();" class="autocomplete-item">
          <div>
            <span class="font-bold text-slate-700">${apt.name}</span>
            <span class="text-slate-400 text-[10px] ml-1.5">${apt.address}</span>
          </div>
          <span class="item-sub text-xs text-secondary font-mono">${apt.recentPrice}억</span>
        </button>
      `;
    });
    autocompleteBox.innerHTML = itemsHtml;
  }
  
  autocompleteBox.classList.remove('hidden');
}

function closeHomeAutocomplete() {
  const autocompleteBox = document.getElementById('desktop-home-autocomplete-box');
  if (autocompleteBox) {
    autocompleteBox.classList.add('hidden');
  }
  const input = document.getElementById('desktop-home-search-input');
  if (input) {
    input.value = '';
  }
}

function submitHomeSearch() {
  const input = document.getElementById('desktop-home-search-input');
  if (!input) return;
  const val = input.value.trim();
  if (val.length === 0) return;
  
  // 첫 번째 매치 찾아서 바로 이동
  let firstMatch = null;
  Object.keys(DISTRICT_DATA).forEach(districtKey => {
    const district = DISTRICT_DATA[districtKey];
    const matched = district.apts.find(apt => apt.name.toLowerCase().includes(val.toLowerCase()) || apt.address.toLowerCase().includes(val.toLowerCase()));
    if (matched && !firstMatch) {
      firstMatch = { ...matched, districtKey };
    }
  });

  if (firstMatch) {
    selectSearchApartment(firstMatch.districtKey, firstMatch.id);
    switchSection('analysis');
    closeHomeAutocomplete();
  } else {
    alert('일치하는 아파트 단지를 찾을 수 없습니다.');
  }
}

// 자동완성 아이템 클릭 시 지도 포커스 연동
function selectSearchApartment(districtKey, aptId) {
  // 1. 자치구 변경 저장 및 검색창 청소
  selectedDistrict = districtKey;
  document.getElementById('select-district').value = districtKey;
  
  clearAnalysisSearch();
  
  // 2. 자치구 데이터를 활성화
  changeDistrict(districtKey);

  // 3. 해당 아파트 선택 활성화
  const apt = apartments.find(a => a.id === aptId);
  if (apt) {
    selectApartment(apt);
  }
}

// 홈 화면 미니 맵 / 퀵 카드 클릭 연동
function selectHomeDistrict(districtKey) {
  selectedDistrict = districtKey;
  document.getElementById('select-district').value = districtKey;
  switchSection('analysis');
}

// ==================== MODAL MANAGEMENT ====================
function openModal(modalId) {
  const activeModals = document.querySelectorAll('.modal-card');
  activeModals.forEach(modal => {
    modal.classList.remove('active');
    modal.classList.add('hidden');
  });

  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modal-overlay');
  
  if (modal && overlay) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    void modal.offsetWidth; // Force reflow
    overlay.classList.add('bg-black/20');
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modal-overlay');
  
  if (modal) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
  }
  
  if (overlay) {
    overlay.classList.remove('bg-black/20');
    overlay.classList.add('hidden');
  }
  clearMessageBoxes();
}

function closeAllModals() {
  const activeModals = document.querySelectorAll('.modal-card');
  activeModals.forEach(modal => {
    modal.classList.remove('active');
    modal.classList.add('hidden');
  });
  
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('bg-black/20');
    overlay.classList.add('hidden');
  }
  clearMessageBoxes();
}

function switchModal(fromId, toId) {
  closeModal(fromId);
  openModal(toId);
}

function clearMessageBoxes() {
  document.querySelectorAll('.error-box, .success-box').forEach(box => {
    box.style.display = 'none';
    box.innerHTML = '';
  });
  document.querySelectorAll('input').forEach(input => {
    if (input.type !== 'submit') input.value = '';
  });
}

function showBoxMessage(boxId, message, type = 'error') {
  const box = document.getElementById(boxId);
  if (box) {
    box.style.display = 'block';
    box.className = type === 'error' ? 'error-box' : 'success-box';
    box.innerHTML = `<span>${message}</span>`;
  }
}

// ==================== AUTH SERVICE LOGIC ====================
const getDummyDB = () => {
  const data = localStorage.getItem('dummy_users_db');
  return data ? JSON.parse(data) : [{ email: 'test@example.com', password: '123456' }];
};

const saveDummyDB = (db) => {
  localStorage.setItem('dummy_users_db', JSON.stringify(db));
};

async function checkAuthSession() {
  if (isDummyAuth) {
    const session = localStorage.getItem('dummy-session-user');
    if (session) {
      currentUser = { email: session };
    }
  } else {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      currentUser = user;
    } catch (e) {
      console.error(e);
    }
  }
  updateAuthUI();
}

function updateAuthUI() {
  const loggedOutDiv = document.getElementById('auth-logged-out');
  const loggedInDiv = document.getElementById('auth-logged-in');
  const userEmailSpan = document.getElementById('user-display-email');
  
  if (currentUser) {
    loggedOutDiv.classList.add('hidden');
    loggedInDiv.classList.remove('hidden');
    userEmailSpan.textContent = currentUser.email;
    document.getElementById('mypage-email').textContent = currentUser.email;
  } else {
    loggedOutDiv.classList.remove('hidden');
    loggedInDiv.classList.add('hidden');
  }
  lucide.createIcons();
}

async function submitLogin(e) {
  e.preventDefault();
  const errorBox = 'login-error-box';
  const emailInput = document.getElementById('login-email').value.trim();
  const passwordInput = document.getElementById('login-password').value;

  if (isDummyAuth) {
    const db = getDummyDB();
    const matched = db.find(u => u.email === emailInput && u.password === passwordInput);
    if (matched) {
      currentUser = { email: emailInput };
      localStorage.setItem('dummy-session-user', emailInput);
      updateAuthUI();
      closeModal('login-modal');
      switchSection('analysis'); // 로그인 성공 시 시장 분석 탭으로 자동 리다이렉트
    } else {
      showBoxMessage(errorBox, '이메일 또는 비밀번호가 잘못되었습니다.');
    }
  } else {
    const submitBtn = document.getElementById('login-submit-btn');
    submitBtn.disabled = true;
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput
      });
      if (error) throw error;
      currentUser = data.user;
      updateAuthUI();
      closeModal('login-modal');
      switchSection('analysis'); // 로그인 성공 시 시장 분석 탭으로 자동 리다이렉트
    } catch (err) {
      showBoxMessage(errorBox, err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
    }
  }
}

async function submitSignup(e) {
  e.preventDefault();
  const errorBox = 'signup-error-box';
  const successBox = 'signup-success-box';
  const emailInput = document.getElementById('signup-email').value.trim();
  const passwordInput = document.getElementById('signup-password').value;
  const confirmInput = document.getElementById('signup-confirm').value;

  if (passwordInput !== confirmInput) {
    showBoxMessage(errorBox, '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }
  if (passwordInput.length < 6) {
    showBoxMessage(errorBox, '비밀번호는 6자리 이상이어야 합니다.');
    return;
  }

  if (isDummyAuth) {
    const db = getDummyDB();
    if (db.some(u => u.email === emailInput)) {
      showBoxMessage(errorBox, '이미 가입된 이메일 주소입니다.');
      return;
    }
    db.push({ email: emailInput, password: passwordInput });
    saveDummyDB(db);
    showBoxMessage(successBox, '가입 성공! 로그인하여 서비스를 시작하세요.');
    setTimeout(() => {
      switchModal('signup-modal', 'login-modal');
    }, 1500);
  } else {
    const submitBtn = document.getElementById('signup-submit-btn');
    submitBtn.disabled = true;
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: emailInput,
        password: passwordInput
      });
      if (error) throw error;
      // 이메일 인증 없이 세션이 바로 생성된 경우(autoconfirm ON) -> 자동 로그인
      if (data && data.session) {
        currentUser = data.user;
        updateAuthUI();
        closeModal('signup-modal');
        switchSection('analysis');
      } else {
        showBoxMessage(successBox, '가입 완료! 이메일 인증 후 로그인하세요.<br><small style="opacity:.7">메일이 안 오면 스팸함을 확인해 주세요.</small>');
        setTimeout(() => { switchModal('signup-modal', 'login-modal'); }, 3000);
      }
    } catch (err) {
      showBoxMessage(errorBox, err.message || '가입 도중 에러가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
    }
  }
}

function submitFindEmail(e) {
  e.preventDefault();
  const errorBox = 'find-email-error-box';
  const successBox = 'find-email-success-box';
  const hint = document.getElementById('find-email-hint').value.trim();

  const db = getDummyDB();
  const matched = db.filter(u => u.email.includes(hint));

  if (matched.length === 0) {
    showBoxMessage(errorBox, '입력하신 힌트에 해당하는 이메일을 찾을 수 없습니다.');
  } else {
    const maskedList = matched.map(u => {
      const parts = u.email.split('@');
      const maskUser = parts[0].slice(0, 3) + '*'.repeat(Math.max(0, parts[0].length - 3));
      return `${maskUser}@${parts[1]}`;
    });
    showBoxMessage(successBox, `가입된 계정 발견:<br>${maskedList.join('<br>')}`);
  }
}

async function submitChangePassword(e) {
  e.preventDefault();
  const errorBox = 'password-error-box';
  const successBox = 'password-success-box';
  const password = document.getElementById('change-password-new').value;
  const confirm = document.getElementById('change-password-confirm').value;

  if (password !== confirm) {
    showBoxMessage(errorBox, '비밀번호가 일치하지 않습니다.');
    return;
  }
  if (password.length < 6) {
    showBoxMessage(errorBox, '비밀번호는 최소 6자 이상이어야 합니다.');
    return;
  }

  if (isDummyAuth) {
    const db = getDummyDB();
    const idx = db.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      db[idx].password = password;
      saveDummyDB(db);
      showBoxMessage(successBox, '비밀번호가 변경되었습니다. (로컬 더미)');
    }
  } else {
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      showBoxMessage(successBox, '비밀번호가 성공적으로 업데이트되었습니다.');
    } catch (err) {
      showBoxMessage(errorBox, err.message || '업데이트에 실패했습니다.');
    }
  }
}

async function submitWithdraw() {
  if (isDummyAuth) {
    const db = getDummyDB();
    const filtered = db.filter(u => u.email !== currentUser.email);
    saveDummyDB(filtered);
    
    // 세션 클리어 및 관련 데이터 삭제
    localStorage.removeItem(`dummy_bookmarks_${currentUser.email}`);
    currentUser = null;
    localStorage.removeItem('dummy-session-user');
    updateAuthUI();
    closeAllModals();
    switchSection('home');
    alert('회원 탈퇴가 정상 완료되었습니다.');
  } else {
    try {
      alert('실제 프로덕션 환경 회원 탈퇴는 관리자 권한 API 연동이 필요하여, 로컬 환경 상 가상 탈퇴 처리되었습니다.');
      currentUser = null;
      await supabaseClient.auth.signOut();
      updateAuthUI();
      closeAllModals();
      switchSection('home');
    } catch (err) {
      alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
    }
  }
}

async function handleLogout() {
  if (isDummyAuth) {
    currentUser = null;
    localStorage.removeItem('dummy-session-user');
    updateAuthUI();
    switchSection('home');
  } else {
    await supabaseClient.auth.signOut();
    currentUser = null;
    updateAuthUI();
    switchSection('home');
  }
}

function toggleWithdrawConfirm(show) {
  const confirmArea = document.getElementById('withdraw-confirm-area');
  const checkArea = document.getElementById('withdraw-check-area');
  if (show) {
    confirmArea.classList.add('hidden');
    checkArea.classList.remove('hidden');
  } else {
    confirmArea.classList.remove('hidden');
    checkArea.classList.add('hidden');
  }
}

// 홈 화면에서 지역 선택 시 분석실 탭으로 전환 및 자치구 설정
function selectHomeDistrict(districtCode) {
  selectedDistrict = districtCode;
  
  // 자치구 select 엘리먼트 값 변경
  const selectElem = document.getElementById('select-district');
  if (selectElem) {
    selectElem.value = districtCode;
  }
  
  switchSection('analysis');
}

// ==================== REAL ESTATE CONTROLLERS ====================
function changeDistrict(districtCode) {
  selectedDistrict = districtCode;
  apartments = DISTRICT_DATA[districtCode].apts;
  
  document.getElementById('region-tag').textContent = DISTRICT_DATA[districtCode].name;

  renderApartmentList();
  loadMapAndMarkers();
  
  // 첫 아파트 기본 선택
  if (apartments.length > 0) {
    selectApartment(apartments[0]);
  } else {
    resetDetailPanel();
  }
}

function renderApartmentList() {
  const container = document.getElementById('apartment-list-container');
  container.innerHTML = '';

  apartments.forEach(apt => {
    const isSelected = selectedApartment?.id === apt.id;
    const trendText = apt.trend === 'up' ? '상승' : apt.trend === 'down' ? '하락' : '보합';
    const trendClass = apt.trend === 'up' ? 'text-red-650 font-bold' : apt.trend === 'down' ? 'text-indigo-600 font-bold' : 'text-slate-400';
    const trendIcon = apt.trend === 'up' ? '▲' : apt.trend === 'down' ? '▼' : '━';

    const card = document.createElement('div');
    card.className = `apartment-card ${isSelected ? 'active' : ''}`;
    card.onclick = () => selectApartment(apt);

    card.innerHTML = `
      <div class="card-header-row">
        <div class="flex items-center gap-2">
          <i data-lucide="building" class="w-4 h-4 text-indigo-600"></i>
          <h4 class="font-bold text-sm text-slate-800">${apt.name}</h4>
        </div>
        <span class="text-[10px] ${trendClass}">${trendIcon} ${trendText}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
        <span class="font-mono">${apt.address}</span>
      </div>
      <div class="card-footer-row mt-2 pt-2.5 border-t border-slate-100">
        <span class="text-[11px] text-slate-400">${apt.pyeong}평형</span>
        <span class="text-xs font-semibold text-slate-850 font-mono">최근 실거래 <strong class="text-indigo-600 text-sm">${apt.recentPrice}억</strong></span>
      </div>
    `;

    container.appendChild(card);
  });
  lucide.createIcons();
}

function selectApartment(apt) {
  selectedApartment = apt;
  renderApartmentList();

  // 1. 아파트 정보 및 요약 카드 업데이트
  document.getElementById('detail-apt-name').textContent = apt.name;
  document.getElementById('detail-apt-year').textContent = apt.year;
  document.getElementById('detail-apt-households').textContent = apt.households;
  document.getElementById('detail-apt-address').textContent = apt.address;

  // 2. 찜하기 하트 아이콘 상태 활성화 여부 확인
  updateBookmarkHeartUI();

  // 3. 지도 중심이동
  if (!isDummyMap && kakaoMapInstance) {
    const moveLatLon = new window.kakao.maps.LatLng(apt.lat, apt.lng);
    kakaoMapInstance.panTo(moveLatLon);
  } else {
    renderDummyMap();
  }

  // 4. 평형별 차트 및 거래이력 테이블 리로드
  loadAptDetails();
}

function resetDetailPanel() {
  selectedApartment = null;
  document.getElementById('detail-apt-name').textContent = '단지를 선택하세요';
  document.getElementById('detail-apt-year').textContent = '-';
  document.getElementById('detail-apt-households').textContent = '-';
  document.getElementById('detail-apt-address').textContent = '-';
  
  document.getElementById('trend-chart-canvas').innerHTML = `
    <div class="text-slate-400 text-xs text-center flex flex-col items-center gap-2">
      <i data-lucide="bar-chart-3" class="w-7 h-7 opacity-50"></i>
      <span>아파트 단지를 선택하면 거래 가격 추이가 여기에 시각화됩니다.</span>
    </div>
  `;
  document.getElementById('transaction-table-body').innerHTML = `
    <tr><td colspan="3" class="p-6 text-center text-slate-400">조회된 거래 내역이 없습니다.</td></tr>
  `;
  lucide.createIcons();
}

// 평형 선택 토글 제어
function selectPyeong(pyeongSize) {
  selectedPyeong = pyeongSize;
  
  const sizes = [59, 84, 114];
  sizes.forEach(size => {
    const btn = document.getElementById(`pyeong-${size}`);
    if (btn) {
      if (size === pyeongSize) {
        btn.className = "px-2.5 py-1 text-[11px] font-bold bg-secondary text-white rounded-lg";
      } else {
        btn.className = "px-2.5 py-1 text-[11px] font-bold bg-white border border-outline-variant text-slate-600 rounded-lg hover:border-secondary";
      }
    }
  });

  if (selectedApartment) {
    loadAptDetails();
  }
}

// 차트 및 거래 내역 렌더링
function loadAptDetails() {
  if (!selectedApartment) return;
  
  // 1. 선택 평형에 맞는 가격 이력 취득
  let history = selectedApartment.priceHistory84;
  if (selectedPyeong === 59) history = selectedApartment.priceHistory59;
  if (selectedPyeong === 114) history = selectedApartment.priceHistory114;

  // 2. 동적 SVG 차트 그리기
  drawTrendChart(selectedApartment, history);

  // 3. 거래이력 테이블 렌더링
  const tableBody = document.getElementById('transaction-table-body');
  tableBody.innerHTML = '';

  selectedApartment.transactions.forEach(tx => {
    // 평형별로 비례한 실거래가로 매치하여 렌더링
    const multiplier = selectedPyeong === 59 ? 0.8 : selectedPyeong === 114 ? 1.15 : 1.0;
    const txPrice = (tx.price * multiplier).toFixed(1);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-2.5 text-center text-slate-500 font-mono">2026.${tx.date}</td>
      <td class="p-2.5 text-right font-bold text-indigo-600 font-mono">${txPrice}억</td>
      <td class="p-2.5 text-center text-slate-650 font-mono">${tx.floor}층</td>
    `;
    tableBody.appendChild(row);
  });
}

// ==================== MAP SERVICE LOGIC (REAL KAKAO & MOCK) ====================
function loadMapAndMarkers() {
  const container = document.getElementById('map-area-container');
  const apiKey = window.APP_CONFIG.KAKAO_MAP_CLIENT_KEY;

  if (!apiKey || apiKey === '' || apiKey.includes('your-kakao')) {
    isDummyMap = true;
    renderDummyMap();
    return;
  }

  isDummyMap = false;
  // 플로팅 검색창을 보존하기 위해 canvas 영역만 갈아끼우기
  let canvasDiv = document.getElementById('kakao-map-canvas');
  if (!canvasDiv) {
    canvasDiv = document.createElement('div');
    canvasDiv.id = 'kakao-map-canvas';
    canvasDiv.className = 'w-full h-full';
    container.insertBefore(canvasDiv, container.firstChild);
  }

  if (window.kakao && window.kakao.maps) {
    initKakaoMapInstance();
  } else {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        initKakaoMapInstance();
      });
    };
  }
}

function initKakaoMapInstance() {
  const mapDiv = document.getElementById('kakao-map-canvas');
  if (!mapDiv) return;

  const currentDistrict = DISTRICT_DATA[selectedDistrict];
  const centerPosition = new window.kakao.maps.LatLng(currentDistrict.lat, currentDistrict.lng);

  const options = {
    center: centerPosition,
    level: 4
  };

  kakaoMapInstance = new window.kakao.maps.Map(mapDiv, options);
  
  mapMarkers.forEach(m => m.setMap(null));
  mapMarkers = [];

  apartments.forEach(apt => {
    const markerPosition = new window.kakao.maps.LatLng(apt.lat, apt.lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: kakaoMapInstance,
      title: apt.name
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      selectApartment(apt);
    });

    mapMarkers.push(marker);
  });
}

function renderDummyMap() {
  renderLeafletMap();
}

function selectApartmentById(aptId) {
  const apt = apartments.find(a => a.id === aptId);
  if (apt) selectApartment(apt);
}

// ==================== KAKAO ROADVIEW SERVICE INTEGRATION (로드뷰) ====================
function triggerRoadviewAction() {
  if (!selectedApartment) {
    alert('로드뷰를 확인하실 아파트를 먼저 선택해 주세요.');
    return;
  }
  
  // 모달 타이틀 업데이트
  document.getElementById('roadview-modal-title').textContent = `${selectedApartment.name} 주변 거리 전경 (로드뷰)`;
  openModal('roadview-modal');

  // 로드뷰 컨테이너 초기화 및 기동
  setTimeout(() => {
    initKakaoRoadview(selectedApartment.lat, selectedApartment.lng);
  }, 150);
}

function initKakaoRoadview(lat, lng) {
  const container = document.getElementById('roadview-canvas');
  if (!container) return;
  
  if (window.kakao && window.kakao.maps && window.kakao.maps.Roadview) {
    try {
      const position = new window.kakao.maps.LatLng(lat, lng);
      container.innerHTML = '';
      
      const roadview = new window.kakao.maps.Roadview(container);
      const roadviewClient = new window.kakao.maps.RoadviewClient();
      
      roadviewClient.getNearestPanoId(position, 50, function(panoId) {
        if (panoId === null) {
          showRoadviewFallback(container, lat, lng);
        } else {
          roadview.setPanoId(panoId, position);
        }
      });
    } catch (e) {
      console.error(e);
      showRoadviewFallback(container, lat, lng);
    }
  } else {
    showRoadviewFallback(container, lat, lng);
  }
}

function showRoadviewFallback(container, lat, lng) {
  const aptImgUrl = selectedApartment ? getAptImage(selectedApartment.id) : '';
  let imageHtml = '';
  if (aptImgUrl) {
    imageHtml = `
      <div class="relative w-full max-w-sm h-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm mx-auto mb-3">
        <img class="w-full h-full object-cover" src="${aptImgUrl}" alt="아파트 대표 사진">
        <div class="absolute inset-0 bg-slate-900/10"></div>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center p-6 gap-3 text-slate-500">
      <span class="material-symbols-outlined text-secondary text-[36px] mb-2">image</span>
      <span class="text-sm font-bold text-slate-700">${selectedApartment ? selectedApartment.name : '단지'} 전경 사진</span>
      ${imageHtml}
      <p class="text-xs text-text-muted leading-relaxed mb-3">
        카카오 지도 SDK 미작동 상태로 모의 구동 중입니다.<br>
        실제 3D 거리 뷰를 감상하려면 아래 공식 카카오 맵 서비스를 연결하세요.
      </p>
      <a href="https://map.kakao.com/link/roadview/${lat},${lng}" target="_blank" class="px-5 py-2.5 bg-[#0058be] hover:opacity-90 rounded-xl text-xs font-bold text-white transition-all shadow-md inline-flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px]">open_in_new</span> 카카오맵에서 3D 로드뷰 바로 보기
      </a>
    </div>
  `;
}

// ==================== PRICE TREND CHART LOGIC (PURE SVG) ====================
function drawTrendChart(apt, history) {
  const badge = document.getElementById('chart-trend-badge');
  badge.classList.remove('hidden');
  
  if (apt.trend === 'up') {
    badge.className = 'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-650 border border-red-100';
    badge.innerHTML = '<span>▲ 시세 상승세</span>';
  } else if (apt.trend === 'down') {
    badge.className = 'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-indigo-600 border border-blue-100';
    badge.innerHTML = '<span>▼ 시세 하락세</span>';
  } else {
    badge.className = 'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200';
    badge.innerHTML = '<span>━ 보합세</span>';
  }

  const canvas = document.getElementById('trend-chart-canvas');

  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices) * 0.9;
  const maxPrice = Math.max(...prices) * 1.1;
  const priceRange = maxPrice - minPrice;

  const width = 600;
  const height = 180;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = history.map((data, index) => {
    const x = paddingLeft + (index / (history.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;
    return { x, y, year: data.year, price: data.price };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  let areaPath = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    linePath += ` L ${points[i].x} ${points[i].y}`;
    areaPath += ` L ${points[i].x} ${points[i].y}`;
  }

  areaPath += ` L ${points[points.length - 1].x} ${height - paddingBottom}`;
  areaPath += ` L ${points[0].x} ${height - paddingBottom} Z`;

  const yLines = 3;
  let gridLines = '';
  for (let i = 0; i <= yLines; i++) {
    const ratio = i / yLines;
    const yVal = paddingTop + chartHeight * ratio;
    const priceVal = (maxPrice - ratio * priceRange).toFixed(1);
    gridLines += `
      <line x1="${paddingLeft}" y1="${yVal}" x2="${width - paddingRight}" y2="${yVal}" stroke="#f1f5f9" stroke-width="1.5"></line>
      <text x="${paddingLeft - 10}" y="${yVal + 4}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">${priceVal}억</text>
    `;
  }

  let markers = '';
  points.forEach((pt) => {
    markers += `
      <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" class="chart-dot"></circle>
      <text x="${pt.x}" y="${height - 10}" fill="#94a3b8" font-size="11" text-anchor="middle" font-weight="500">${pt.year}년</text>
      <text x="${pt.x}" y="${pt.y - 10}" fill="#1e293b" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">${pt.price}억</text>
    `;
  });

  canvas.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full">
      ${gridLines}
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb" stop-opacity="0.15"></stop>
          <stop offset="100%" stop-color="#2563eb" stop-opacity="0.00"></stop>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#chart-grad)"></path>
      <path d="${linePath}" fill="none" stroke="url(#line-grad)" stroke-width="3" stroke-linecap="round" class="chart-line"></path>
      <defs>
        <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3b82f6"></stop>
          <stop offset="100%" stop-color="#059669"></stop>
        </linearGradient>
      </defs>
      ${markers}
    </svg>
  `;
}

// ==================== BOOKMARK (FAVORITE APARTMENT) LOGIC ====================

// 로그인 계정 기반 북마크 리스트 취득
function getBookmarksFromStorage() {
  if (!currentUser) return [];
  const key = `dummy_bookmarks_${currentUser.email}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveBookmarksToStorage(bookmarks) {
  if (!currentUser) return;
  const key = `dummy_bookmarks_${currentUser.email}`;
  localStorage.setItem(key, JSON.stringify(bookmarks));
}

// 북마크 활성 하트 UI 동기화
function updateBookmarkHeartUI() {
  const heartIcon = document.getElementById('bookmark-heart-icon');
  if (!selectedApartment) return;

  const isBookmarked = checkIsBookmarked(selectedApartment.id);

  if (isBookmarked) {
    heartIcon.classList.add('text-red-500', 'fill-current');
    heartIcon.classList.remove('text-slate-400');
  } else {
    heartIcon.classList.remove('text-red-500', 'fill-current');
    heartIcon.classList.add('text-slate-400');
  }
}

function checkIsBookmarked(aptId) {
  const bookmarks = getBookmarksFromStorage();
  return bookmarks.some(b => b.aptId === aptId);
}

// 북마크 토글 액션
async function toggleBookmarkAction() {
  if (!currentUser) {
    alert('북마크 기능은 로그인 후 이용하실 수 있습니다.');
    openModal('login-modal');
    return;
  }

  const heartIcon = document.getElementById('bookmark-heart-icon');
  const apt = selectedApartment;
  if (!apt) return;

  const isBookmarked = checkIsBookmarked(apt.id);
  let bookmarks = getBookmarksFromStorage();

  if (isDummyAuth) {
    // 1. 더미 모드 저장소 액션
    if (isBookmarked) {
      bookmarks = bookmarks.filter(b => b.aptId !== apt.id);
      heartIcon.classList.remove('text-red-500', 'fill-current');
      heartIcon.classList.add('text-slate-400');
    } else {
      bookmarks.push({
        aptId: apt.id,
        aptName: apt.name,
        recentPrice: `${apt.recentPrice}억`,
        districtKey: selectedDistrict,
        address: apt.address,
        pyeong: apt.pyeong
      });
      heartIcon.classList.add('text-red-500', 'fill-current');
      heartIcon.classList.remove('text-slate-400');
    }
    saveBookmarksToStorage(bookmarks);
  } else {
    // 2. Supabase DB 실제 연동 액션
    try {
      if (isBookmarked) {
        const { error } = await supabaseClient
          .from('bookmarks')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('apt_id', apt.id);
        
        if (error) throw error;
        heartIcon.classList.remove('text-red-500', 'fill-current');
        heartIcon.classList.add('text-slate-400');
      } else {
        const { error } = await supabaseClient
          .from('bookmarks')
          .insert({
            user_id: currentUser.id,
            apt_id: apt.id,
            apt_name: apt.name,
            recent_price: `${apt.recentPrice}억`
          });
        
        if (error) throw error;
        heartIcon.classList.add('text-red-500', 'fill-current');
        heartIcon.classList.remove('text-slate-400');
      }
    } catch (err) {
      console.error('Supabase bookmarks sync error:', err);
      alert('북마크 동기화 중 오류가 발생했습니다: ' + err.message);
    }
  }
}

// 아파트 대표 이미지 반환
function getAptImage(aptId) {
  const images = {
    'ss-1': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    'ss-2': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'ss-3': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'ss-4': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'ss-5': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'jg-1': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'jg-2': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    'jg-3': 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
    'jg-4': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    'jg-5': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    'ds-1': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'ds-2': 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=800&q=80',
    'ds-3': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    'ds-4': 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    'ds-5': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    'bg-1': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'bg-2': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'bg-3': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'bg-4': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    'bg-5': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  };
  return images[aptId] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
}

// 북마크 객체 규격화
function normalizeBookmark(item) {
  let meta = null;
  let districtKey = item.districtKey || 'suseong';
  
  Object.keys(DISTRICT_DATA).forEach(key => {
    const matched = DISTRICT_DATA[key].apts.find(a => a.id === (item.aptId || item.apt_id));
    if (matched) {
      meta = matched;
      districtKey = key;
    }
  });

  return {
    aptId: item.aptId || item.apt_id,
    aptName: item.aptName || item.apt_name || (meta ? meta.name : '아파트'),
    recentPrice: item.recentPrice || item.recent_price || (meta ? `${meta.recentPrice}억` : '0억'),
    districtKey: districtKey,
    address: meta ? meta.address : (item.address || '주소 정보 없음'),
    pyeong: meta ? meta.pyeong : (item.pyeong || 84),
    year: meta ? meta.year : '2010년',
    households: meta ? meta.households : '1,000세대'
  };
}

// 내 저장소 (북마크 탭) 대시보드 빌드
async function renderBookmarksView() {
  const container = document.getElementById('bookmarks-grid-container');
  const emptyView = document.getElementById('bookmarks-empty-view');
  const countBadge = document.getElementById('bookmark-count-badge');

  container.innerHTML = '';

  if (!currentUser) {
    countBadge.textContent = '0개 단지 저장됨';
    emptyView.classList.remove('hidden');
    emptyView.innerHTML = `
      <span class="material-symbols-outlined text-[48px] text-slate-300">lock</span>
      <span class="text-sm font-semibold text-slate-700">로그인이 필요한 메뉴입니다.</span>
      <p class="text-xs text-slate-400">북마크 기능을 이용해 나만의 관심 단지 목록을 안전하게 저장해 보세요.</p>
      <button onclick="openModal('login-modal')" class="mt-2 px-4 py-2 bg-primary hover:opacity-90 rounded-lg text-xs font-semibold text-white transition-all shadow-md">
        로그인 하기
      </button>
    `;
    return;
  }

  let list = [];

  if (isDummyAuth) {
    list = getBookmarksFromStorage().map(normalizeBookmark);
  } else {
    try {
      const { data, error } = await supabaseClient
        .from('bookmarks')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      list = data.map(normalizeBookmark);
    } catch (err) {
      console.error(err);
      list = getBookmarksFromStorage().map(normalizeBookmark);
    }
  }

  countBadge.textContent = `${list.length}개 단지 저장됨`;

  if (list.length === 0) {
    emptyView.classList.remove('hidden');
  } else {
    emptyView.classList.add('hidden');
    
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'premium-card rounded-xl overflow-hidden flex flex-col group border border-outline-variant/30 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative';
      
      const regionText = item.address.split(' ')[1] || '대구시';
      
      card.innerHTML = `
        <div class="relative h-40 w-full overflow-hidden bg-slate-100">
          <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${getAptImage(item.aptId)}" alt="${item.aptName}">
          <div class="absolute top-3 left-3 bg-primary-container/85 backdrop-blur-md px-2.5 py-0.5 rounded-full">
            <span class="text-[10px] font-semibold text-white">${regionText}</span>
          </div>
          <button onclick="removeBookmarkDirectly('${item.aptId}')" class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-heart-accent shadow-md hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
          </button>
        </div>
        <div class="p-5 flex flex-col flex-grow justify-between space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-title-md text-title-md text-primary font-bold mb-1">${item.aptName}</h3>
              <p class="text-[11px] text-on-surface-variant font-light">${item.year} 준공 · ${item.households}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-end">
              <span class="text-xs text-on-surface-variant">최근 실거래가 (${item.pyeong}평형)</span>
              <span class="font-headline-md text-headline-md text-primary font-bold">${item.recentPrice}</span>
            </div>
            
            <!-- Sparkline 막대 차트 시뮬레이션 (데스크톱 데코레이션) -->
            <div class="hidden sm:flex sparkline-container bg-surface-container-low rounded-lg p-2 items-end gap-1">
              <div class="w-full h-[60%] bg-primary/20 rounded-t-sm"></div>
              <div class="w-full h-[40%] bg-primary/20 rounded-t-sm"></div>
              <div class="w-full h-[70%] bg-primary/20 rounded-t-sm"></div>
              <div class="w-full h-[55%] bg-primary/20 rounded-t-sm"></div>
              <div class="w-full h-[85%] bg-primary rounded-t-sm"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mt-2">
            <button onclick="removeBookmarkDirectly('${item.aptId}')" class="py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30">
              <span class="material-symbols-outlined text-[16px]">delete</span> 삭제
            </button>
            <button onclick="selectSearchApartment('${item.districtKey}', '${item.aptId}')" class="py-2.5 rounded-lg bg-primary text-white hover:opacity-90 font-label-md text-label-md transition-opacity flex items-center justify-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">analytics</span> 분석실 이동
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  lucide.createIcons();
}

// 저장소(대시보드) 내부에서 즉시 북마크 지우기
async function removeBookmarkDirectly(aptId) {
  let bookmarks = getBookmarksFromStorage();
  
  if (isDummyAuth) {
    bookmarks = bookmarks.filter(b => b.aptId !== aptId);
    saveBookmarksToStorage(bookmarks);
    renderBookmarksView();
  } else {
    try {
      const { error } = await supabaseClient
        .from('bookmarks')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('apt_id', aptId);
      if (error) throw error;
      renderBookmarksView();
    } catch (err) {
      alert('북마크 삭제에 실패했습니다: ' + err.message);
    }
  }
}

// ==================== REAL ESTATE MARKETPLACE (매물 거래소) ====================

let LISTINGS_DATA = [];

const DEFAULT_LISTINGS = [
  {
    id: 'lst-1',
    aptId: 'ss-1',
    title: '두산위브더제니스 초고층 로얄층 매물',
    district: 'suseong',
    type: 'apt',
    price: 12.8,
    pyeong: 34,
    floor: '41층 / 54층',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: '앞산과 수성못 조망이 매우 우수한 최고급 세대입니다. 거실 대리석 마감 및 프리미엄 올수리 상태입니다.',
    broker: '제니스명품공인중개사',
    contact: '053-745-1234',
    tags: ['초고층', '전망최고', '즉시입주']
  },
  {
    id: 'lst-2',
    aptId: 'ss-1',
    title: '두산위브더제니스 대형 평형 급매물',
    district: 'suseong',
    type: 'apt',
    price: 16.5,
    pyeong: 45,
    floor: '28층 / 54층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: '소유주 사정상 급매로 진행하는 특가 매물입니다. 방 4개, 욕실 2개 구조로 넓고 아늑합니다.',
    broker: '수성탑공인중개사',
    contact: '053-741-5588',
    tags: ['급매', '대형평형', '협의입주']
  },
  {
    id: 'lst-3',
    aptId: 'ss-2',
    title: '범어센트럴푸르지오 범어역 초역세권 신축급',
    district: 'suseong',
    type: 'apt',
    price: 9.5,
    pyeong: 34,
    floor: '18층 / 49층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    description: '2호선 범어역 도보 2분 거리의 초역세권 대단지입니다. 젊은 신혼부부에게 강력 추천하는 깨끗한 매물입니다.',
    broker: '범어푸르지오공인',
    contact: '053-752-9900',
    tags: ['역세권', '신축급', '로얄층']
  },
  {
    id: 'lst-4',
    aptId: 'ss-2',
    title: '범어센트럴푸르지오 전망 좋은 고층 매물',
    district: 'suseong',
    type: 'apt',
    price: 9.8,
    pyeong: 34,
    floor: '35층 / 49층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    description: '채광과 통풍이 우수한 판상형 구조입니다. 선호 학군인 범어초 배정 단지로 입지가 최상입니다.',
    broker: '학군단지전문중개',
    contact: '053-759-4400',
    tags: ['초등배정', '고층전망', '일조권우수']
  },
  {
    id: 'lst-5',
    aptId: 'ss-3',
    title: '수성구 만촌동 명품 단독형 전원주택',
    district: 'suseong',
    type: 'house',
    price: 15.0,
    pyeong: 65,
    floor: '지하 1층 ~ 지상 2층',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: '만촌동 고급 단독주택지 내에 위치한 대저택입니다. 넓은 전용 마당과 2대 전용 차고지가 완비되어 있습니다.',
    broker: '만촌헤리티지공인중개사',
    contact: '053-744-8899',
    tags: ['마당보유', '차고지완비', '독점입지']
  },
  {
    id: 'lst-6',
    aptId: 'ss-4',
    title: '수성구 범어동 신축 고급 다세대 빌라',
    district: 'suseong',
    type: 'house',
    price: 4.8,
    pyeong: 28,
    floor: '3층 / 5층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    description: '최신 트렌드 인테리어와 엘리베이터가 완비된 신축 빌라입니다. 주차 대수 세대당 1.2대 가능합니다.',
    broker: '범어에셋공인',
    contact: '053-756-1122',
    tags: ['신축빌라', '엘리베이터', '주차편리']
  },
  {
    id: 'lst-7',
    aptId: 'jg-1',
    title: '남산자이하늘채 로얄동 고층 프리미엄',
    district: 'junggu',
    type: 'apt',
    price: 5.9,
    pyeong: 34,
    floor: '22층 / 36층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: '남산동 대장 단지로 준공 4년 차의 명품 자이 대단지입니다. 막힘없는 해가 잘 드는 로얄 매물입니다.',
    broker: '남산자이공인중개사',
    contact: '053-255-8800',
    tags: ['대단지', '일조권우수', '신축급']
  },
  {
    id: 'lst-8',
    aptId: 'jg-1',
    title: '남산자이하늘채 59타입 신혼강추 세대',
    district: 'junggu',
    type: 'apt',
    price: 4.3,
    pyeong: 24,
    floor: '12층 / 36층',
    direction: '동향',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    description: '군더더기 없는 확장형 평면 구조로 관리비가 저렴하고 매우 깨끗한 컨디션입니다.',
    broker: '가온공인중개사',
    contact: '053-253-1133',
    tags: ['신혼부부추천', '소형평형', '깔끔컨디션']
  },
  {
    id: 'lst-9',
    aptId: 'jg-2',
    title: '대구역센트럴자이 교통 최강 초역세권',
    district: 'junggu',
    type: 'apt',
    price: 4.5,
    pyeong: 34,
    floor: '15층 / 39층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    description: '대구역 도보 5분 거리로 출퇴근 및 상권 이용이 매우 극대화된 최고 명문 대단지 아파트입니다.',
    broker: '센트럴자이공인',
    contact: '053-424-7700',
    tags: ['초역세권', '상권중심', '대중교통편리']
  },
  {
    id: 'lst-10',
    aptId: 'jg-3',
    title: '중구 삼덕동 감성 골목 단독 상가주택',
    district: 'junggu',
    type: 'house',
    price: 9.8,
    pyeong: 40,
    floor: '지상 1층 ~ 2층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
    description: '삼덕동 핫플레이스 내에 위치한 단독주택으로, 1층을 이색 카페나 공방으로 개조하기 적합합니다.',
    broker: '삼덕부동산 공인중개사',
    contact: '053-252-0088',
    tags: ['카페개조용', '유동인구풍부', '코너상가']
  },
  {
    id: 'lst-11',
    aptId: 'jg-4',
    title: '중구 대봉동 한옥 리모델링 단독주택',
    district: 'junggu',
    type: 'house',
    price: 6.5,
    pyeong: 32,
    floor: '1층 단층 한옥',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    description: '전통 한옥의 목조 서까래를 그대로 보존하며 내부 화장실과 주방을 전면 현대식 올수리한 유니크한 주택입니다.',
    broker: '한옥전문 공인중개사',
    contact: '053-421-4900',
    tags: ['전통한옥', '목조서까래', '올수리완료']
  },
  {
    id: 'lst-12',
    aptId: 'ds-1',
    title: '월성푸르지오 조용한 내부동 로얄층',
    district: 'dalseo',
    type: 'apt',
    price: 4.2,
    pyeong: 34,
    floor: '14층 / 30층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    description: '소음 없는 안동에 자리하여 조용하고 쾌적합니다. 단지 내 커뮤니티 및 헬스장 이용이 편리합니다.',
    broker: '월성푸른공인중개사',
    contact: '053-631-8811',
    tags: ['조용한동', '쾌적한조경', '로얄동호수']
  },
  {
    id: 'lst-13',
    aptId: 'ds-1',
    title: '월성푸르지오 대형평형 초급매물',
    district: 'dalseo',
    type: 'apt',
    price: 5.2,
    pyeong: 45,
    floor: '9층 / 30층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: '시세 대비 저렴한 초급매물입니다. 넓은 다용도실 보유로 수납력이 좋습니다.',
    broker: '달서탑공인중개사',
    contact: '053-636-0099',
    tags: ['초급매', '가격파괴', '넓은수납']
  },
  {
    id: 'lst-14',
    aptId: 'ds-2',
    title: '달서구 송현동 앞산 인근 마당 넓은 주택',
    district: 'dalseo',
    type: 'house',
    price: 5.5,
    pyeong: 48,
    floor: '지상 1층 ~ 2층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=800&q=80',
    description: '앞산 순환도로와 근접해 쾌적한 숲세권 혜택을 누리는 단독주택입니다. 정원에 아름다운 나무가 심겨 있습니다.',
    broker: '송현힐링부동산',
    contact: '053-625-7722',
    tags: ['마당넓음', '앞산숲세권', '자연친화']
  },
  {
    id: 'lst-15',
    aptId: 'ds-3',
    title: '달서구 상인동 상인역 도보 8분 상가주택',
    district: 'dalseo',
    type: 'house',
    price: 8.9,
    pyeong: 38,
    floor: '지상 1층 ~ 3층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    description: '1층 소형 상가에서 안정적인 월세 임대수익이 나오고 있는 상가주택 매물입니다.',
    broker: '상인빌딩전문공인',
    contact: '053-644-3311',
    tags: ['임대수익형', '상인역부근', '직접거주가능']
  },
  {
    id: 'lst-16',
    aptId: 'ds-4',
    title: '달서구 이곡동 조용하고 쾌적한 다세대 빌라',
    district: 'dalseo',
    type: 'house',
    price: 2.1,
    pyeong: 24,
    floor: '2층 / 4층',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    description: '학군 인근의 조용하고 실속 있는 소형 빌라로 누수 방수 수리가 전면 완료되었습니다.',
    broker: '성서사랑공인',
    contact: '053-582-8989',
    tags: ['방수수리', '학군밀집', '실속매물']
  },
  {
    id: 'lst-17',
    aptId: 'bg-1',
    title: '침산푸르지오1차 강변 조망 로얄동 고층',
    district: 'bukgu',
    type: 'apt',
    price: 3.8,
    pyeong: 34,
    floor: '25층 / 30층',
    direction: '동향',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    description: '신천 강변 산책로가 바로 내다보이는 막힘없는 뷰를 자랑하는 추천 세대입니다.',
    broker: '침산강변부동산',
    contact: '053-353-9000',
    tags: ['강변전망', '신천산책', '고층매물']
  },
  {
    id: 'lst-18',
    aptId: 'bg-1',
    title: '침산푸르지오1차 단지 내 조경 조망 저층 매물',
    district: 'bukgu',
    type: 'apt',
    price: 3.3,
    pyeong: 34,
    floor: '4층 / 30층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: '단지 내의 정원이 앞마당처럼 보이고 해가 잘 드는 가성비 우수 저층 아파트입니다.',
    broker: '푸르지오탑공인',
    contact: '053-356-8844',
    tags: ['정원조망', '가성비최고']
  },
  {
    id: 'lst-19',
    aptId: 'bg-2',
    title: '북구 칠성동 단독 복층 전원주택',
    district: 'bukgu',
    type: 'house',
    price: 6.8,
    pyeong: 44,
    floor: '1~2층 복층형',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    description: '대구역 유통단지 인근의 목조 단독주택으로 태양광 발전기 완비되어 전기세가 대폭 절약됩니다.',
    broker: '칠성대구공인중개사',
    contact: '053-352-7711',
    tags: ['태양광발전', '복층설계', '유통단지부근']
  },
  {
    id: 'lst-20',
    aptId: 'bg-3',
    title: '북구 복현동 경북대 테크노문 인근 원룸건물',
    district: 'bukgu',
    type: 'house',
    price: 11.0,
    pyeong: 70,
    floor: '지상 1층 ~ 4층',
    direction: '남향',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: '경북대 테크노문 바로 인근에 있어 대학생 원룸 임대 수요가 일 년 내내 가득 차는 알짜배기 건물입니다.',
    broker: '경북대원룸하우스',
    contact: '053-954-2200',
    tags: ['경북대인근', '대학생수요', '안정수익']
  },
  {
    id: 'lst-21',
    aptId: 'bg-4',
    title: '북구 침산동 조용한 골목의 리모델링 빌라',
    district: 'bukgu',
    type: 'house',
    price: 2.5,
    pyeong: 26,
    floor: '4층 / 5층',
    direction: '남서향',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    description: '샷시부터 내외부 화장실 타일까지 최근 인테리어 리모델링을 싹 끝내어 새집 같습니다.',
    broker: '침산하우징부동산',
    contact: '053-355-1100',
    tags: ['싹올수리', '샷시교체', '가성비빌라']
  },
  {
    id: 'lst-22',
    aptId: 'bg-5',
    title: '북구 동변동 테라스 타운하우스',
    district: 'bukgu',
    type: 'house',
    price: 5.2,
    pyeong: 38,
    floor: '1층 단독 테라스 세대',
    direction: '남동향',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    description: '단독 야외 테라스가 설치되어 있어 텃밭 가꾸기나 바비큐장으로 이용 가능한 동변동 타운하우스입니다.',
    broker: '타운하우스월드',
    contact: '053-982-1200',
    tags: ['테라스보유', '텃밭가능', '타운하우스']
  }
];

function initListingsDataset() {
  const saved = localStorage.getItem('dummy_listings_db');
  if (saved) {
    LISTINGS_DATA = JSON.parse(saved);
  } else {
    LISTINGS_DATA = [...DEFAULT_LISTINGS];
    localStorage.setItem('dummy_listings_db', JSON.stringify(LISTINGS_DATA));
  }
}

function renderListings() {
  const grid = document.getElementById('listings-grid-container');
  const emptyView = document.getElementById('listings-empty-view');
  if (!grid) return;

  const districtFilter = document.getElementById('filter-district').value;
  const typeFilter = document.getElementById('filter-type').value;
  const sortFilter = document.getElementById('filter-sort').value;

  let filtered = [...LISTINGS_DATA];
  
  if (districtFilter !== 'all') {
    filtered = filtered.filter(item => item.district === districtFilter);
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter(item => item.type === typeFilter);
  }

  if (sortFilter === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortFilter === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => {
      const numA = parseInt(a.id.replace(/[^0-9]/g, '')) || 0;
      const numB = parseInt(b.id.replace(/[^0-9]/g, '')) || 0;
      return numB - numA;
    });
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyView.classList.remove('hidden');
    return;
  }
  emptyView.classList.add('hidden');

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'premium-card rounded-xl overflow-hidden flex flex-col group border border-outline-variant/30 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative';
    
    const badgeText = item.type === 'apt' ? '아파트' : '단독주택/빌라';
    const districtText = DISTRICT_DATA[item.district]?.name || '대구시';
    
    // 관심매물 저장 상태 확인
    const isBookmarked = item.aptId ? checkIsBookmarked(item.aptId) : false;
    
    let tagsHtml = '';
    if (item.tags) {
      item.tags.forEach(tag => {
        tagsHtml += `<span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">#${tag}</span>`;
      });
    }

    card.innerHTML = `
      <div class="relative h-44 w-full overflow-hidden bg-slate-100">
        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${item.image}" alt="${item.title}">
        <div class="absolute top-3 left-3 bg-primary-container/85 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 z-10">
          <span class="text-[9px] font-bold text-white">${districtText}</span>
        </div>
        <div class="absolute top-3 right-12 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-secondary-container shadow-sm border border-slate-200 z-10">
          ${badgeText}
        </div>
        <!-- 찜하기(관심매물) 버튼 -->
        <button onclick="toggleListingBookmarkAction(event, '${item.aptId}', '${item.title}', '${item.price}', '${item.district}')" class="absolute top-2.5 right-2.5 w-8 h-8 bg-black/35 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:scale-110 transition-all z-20" title="관심매물 저장">
          <span class="material-symbols-outlined text-[18px] ${isBookmarked ? 'text-rose-500 fill-current' : ''}">favorite</span>
        </button>
      </div>
      <div class="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div class="space-y-2">
          <h3 class="font-bold text-sm text-primary line-clamp-1 group-hover:text-secondary transition-colors" title="${item.title}">${item.title}</h3>
          <p class="text-[10px] text-text-muted line-clamp-2 leading-relaxed">${item.description}</p>
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${tagsHtml}
          </div>
        </div>
        
        <div class="border-t border-slate-100 pt-3 space-y-2">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-[9px] text-text-muted">매매가</p>
              <p class="text-base font-bold text-secondary font-mono">${item.price}억 원</p>
            </div>
            <div class="text-right text-[10px] text-slate-500 font-light">
              ${item.pyeong}평형 · ${item.floor}<br>
              방향: <strong class="text-slate-700">${item.direction}</strong>
            </div>
          </div>
        </div>

        <button onclick="openInquiryModal('${item.id}')" class="w-full py-2.5 rounded-lg bg-primary text-white hover:opacity-90 font-bold text-xs transition-opacity flex items-center justify-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-[16px]">real_estate_agent</span> 매물 거래 문의하기
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openRegisterListingModal() {
  if (!currentUser) {
    alert('매물 등록은 로그인 후 이용하실 수 있습니다.');
    openModal('login-modal');
    return;
  }
  document.getElementById('register-error-box').style.display = 'none';
  document.getElementById('register-success-box').style.display = 'none';
  document.getElementById('register-broker').value = currentUser.email.split('@')[0] + ' 공인중개사';
  
  document.getElementById('register-name').value = '';
  document.getElementById('register-price').value = '';
  document.getElementById('register-pyeong').value = '';
  document.getElementById('register-floor').value = '';
  document.getElementById('register-direction').value = '';
  document.getElementById('register-contact').value = '';
  document.getElementById('register-description').value = '';

  openModal('register-listing-modal');
}

function submitListing(e) {
  e.preventDefault();
  const errorBox = 'register-error-box';
  const successBox = 'register-success-box';

  const type = document.getElementById('register-type').value;
  const district = document.getElementById('register-district').value;
  const name = document.getElementById('register-name').value.trim();
  const price = parseFloat(document.getElementById('register-price').value);
  const pyeong = parseInt(document.getElementById('register-pyeong').value);
  const floor = document.getElementById('register-floor').value.trim();
  const direction = document.getElementById('register-direction').value.trim();
  const broker = document.getElementById('register-broker').value.trim();
  const contact = document.getElementById('register-contact').value.trim();
  const description = document.getElementById('register-description').value.trim();

  if (isNaN(price) || price <= 0) {
    showBoxMessage(errorBox, '올바른 매매 가격을 입력해 주세요.');
    return;
  }
  if (isNaN(pyeong) || pyeong <= 0) {
    showBoxMessage(errorBox, '올바른 평형을 입력해 주세요.');
    return;
  }

  const newListing = {
    id: 'lst-' + Date.now(),
    aptId: '',
    title: `[직거래] ${name} ${pyeong}평형 매매`,
    district,
    type,
    price,
    pyeong,
    floor,
    direction,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHK9nEjDKpky8XrzSy1Clg0FvVKs1S1xCUKQZgrvxMJGl-yDvs3pufihRgNO4hWm-DrNF5iZ669q9E1jhEDPunqrPvywrNvqIiG1pjYNypbVL4NjnOeMH6K5BGmjc84Fx_pLCyYPgoK8jL9QUJITBU9x6di2x20_vgv7n9s3M-GJzLUyQIsqwNn_4wgl_KAQs0g83RAvUwpHOTrHvj9ZGG0xbq2r6kHENN-28OXS_RgwKzjfQcq4-oNqi9t5BCshqrQIq_aRyXysY',
    description,
    broker,
    contact,
    tags: ['직거래추천', '신규등록', '안전보장']
  };

  LISTINGS_DATA.unshift(newListing);
  localStorage.setItem('dummy_listings_db', JSON.stringify(LISTINGS_DATA));

  showBoxMessage(successBox, '매물이 성공적으로 장터에 등록되었습니다!', 'success');
  setTimeout(() => {
    closeModal('register-listing-modal');
    renderListings();
  }, 1500);
}

let selectedListingForInquiry = null;

function openInquiryModal(listingId) {
  const listing = LISTINGS_DATA.find(item => item.id === listingId);
  if (!listing) return;

  selectedListingForInquiry = listing;

  document.getElementById('inquiry-error-box').style.display = 'none';
  document.getElementById('inquiry-success-box').style.display = 'none';

  document.getElementById('inquiry-listing-img').src = listing.image;
  document.getElementById('inquiry-listing-badge').textContent = listing.type === 'apt' ? '아파트' : '주택/빌라';
  document.getElementById('inquiry-listing-title').textContent = listing.title;
  document.getElementById('inquiry-listing-details').textContent = `${listing.pyeong}평형 · ${listing.floor} · ${listing.direction}`;
  document.getElementById('inquiry-listing-price').textContent = `${listing.price}억 원`;
  document.getElementById('inquiry-listing-broker').textContent = `${listing.broker} (${listing.contact})`;

  const defaultLoanAmount = Math.round(listing.price * 10000 * 0.7);
  document.getElementById('loan-amount').value = defaultLoanAmount;
  document.getElementById('loan-rate').value = '3.5';
  document.getElementById('loan-years').value = '30';

  document.getElementById('inquiry-name').value = '';
  document.getElementById('inquiry-contact').value = '';
  document.getElementById('inquiry-date').value = '';
  document.getElementById('inquiry-message').value = '';

  calculateLoan();
  openModal('inquiry-modal');
}

function submitInquiry(e) {
  e.preventDefault();
  const successBox = 'inquiry-success-box';
  
  showBoxMessage(successBox, '문의 및 방문 예약 신청이 접수되었습니다!<br>공인중개사가 확인 후 즉시 연락드리겠습니다.', 'success');
  
  setTimeout(() => {
    closeModal('inquiry-modal');
  }, 1800);
}

function calculateLoan() {
  const amountVal = parseFloat(document.getElementById('loan-amount').value);
  const rateVal = parseFloat(document.getElementById('loan-rate').value);
  const yearsVal = parseInt(document.getElementById('loan-years').value);

  if (isNaN(amountVal) || amountVal <= 0 || isNaN(rateVal) || rateVal <= 0) {
    return;
  }

  const principal = amountVal * 10000;
  const monthlyRate = (rateVal / 12) / 100;
  const totalMonths = yearsVal * 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const firstMonthInterest = principal * monthlyRate;
  const firstMonthPrincipal = monthlyPayment - firstMonthInterest;

  document.querySelectorAll('#loan-monthly-payment').forEach(el => {
    el.textContent = Math.round(monthlyPayment).toLocaleString('ko-KR') + ' 원';
  });
  document.getElementById('loan-first-interest').textContent = Math.round(firstMonthInterest).toLocaleString('ko-KR') + ' 원';
  document.getElementById('loan-first-principal').textContent = Math.round(firstMonthPrincipal).toLocaleString('ko-KR') + ' 원';
}

// ==================== INTERACTIVE OPEN STREET MAP FALLBACK (LEAFLET) ====================

let leafletMapInstance = null;
let leafletMarkers = [];

function loadLeaflet(callback) {
  if (window.L) {
    callback();
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = callback;
  document.head.appendChild(script);
}

function renderLeafletMap() {
  const container = document.getElementById('map-area-container');
  if (!container) return;

  const kakaoCanvas = document.getElementById('kakao-map-canvas');
  if (kakaoCanvas) {
    kakaoCanvas.innerHTML = '';
    kakaoCanvas.classList.add('hidden');
  }

  let dummyCanvas = document.getElementById('dummy-map-canvas');
  if (!dummyCanvas) {
    dummyCanvas = document.createElement('div');
    dummyCanvas.id = 'dummy-map-canvas';
    dummyCanvas.className = 'w-full h-full absolute inset-0 z-0';
    container.insertBefore(dummyCanvas, container.firstChild);
  }
  dummyCanvas.classList.remove('hidden');

  const currentDistrict = DISTRICT_DATA[selectedDistrict];

  loadLeaflet(() => {
    if (leafletMapInstance) {
      leafletMapInstance.remove();
      leafletMapInstance = null;
    }

    leafletMapInstance = L.map('dummy-map-canvas', {
      zoomControl: true
    }).setView([currentDistrict.lat, currentDistrict.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMapInstance);

    leafletMarkers = [];
    apartments.forEach(apt => {
      const isSelected = selectedApartment?.id === apt.id;
      
      const iconHtml = `
        <div class="relative flex items-center justify-center p-2 rounded-full border shadow-md font-bold text-[10px] whitespace-nowrap ${
          isSelected 
            ? 'bg-rose-500 text-white border-rose-600 scale-110 z-20' 
            : 'bg-white text-slate-800 border-slate-350 hover:bg-slate-50'
        }">
          <span class="material-symbols-outlined text-[13px] mr-0.5">map_pin</span>
          ${apt.name} (${apt.recentPrice}억)
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'leaflet-custom-pin',
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const marker = L.marker([apt.lat, apt.lng], { icon: customIcon }).addTo(leafletMapInstance);
      
      marker.on('click', () => {
        selectApartment(apt);
        renderLeafletMap();
      });

      leafletMarkers.push(marker);
    });
  });
}

// 매물 거래소 관심매물(북마크) 토글 액션
async function toggleListingBookmarkAction(event, aptId, aptName, price, districtKey) {
  if (event) event.stopPropagation();
  if (!currentUser) {
    alert('북마크 기능은 로그인 후 이용하실 수 있습니다.');
    openModal('login-modal');
    return;
  }

  const isBookmarked = checkIsBookmarked(aptId);
  let bookmarks = getBookmarksFromStorage();

  if (isDummyAuth) {
    if (isBookmarked) {
      bookmarks = bookmarks.filter(b => b.aptId !== aptId);
    } else {
      // DISTRICT_DATA에서 단지 주소 및 평형 매핑 정보 찾기
      const matchedApt = DISTRICT_DATA[districtKey]?.apts.find(a => a.id === aptId);
      bookmarks.push({
        aptId: aptId,
        aptName: aptName.split(' ')[0], // 단지명만 간략 노출
        recentPrice: `${price}억`,
        districtKey: districtKey,
        address: matchedApt ? matchedApt.address : '대구시',
        pyeong: matchedApt ? matchedApt.pyeong : 84
      });
    }
    saveBookmarksToStorage(bookmarks);
    renderListings();
    showToast(isBookmarked ? '⭐ 관심매물에서 삭제되었습니다.' : '❤️ 관심매물에 추가되었습니다.', 'success');
  } else {
    try {
      if (isBookmarked) {
        const { error } = await supabaseClient
          .from('bookmarks')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('apt_id', aptId);
        if (error) throw error;
      } else {
        const { error } = await supabaseClient
          .from('bookmarks')
          .insert({
            user_id: currentUser.id,
            apt_id: aptId,
            apt_name: aptName.split(' ')[0],
            recent_price: `${price}억`
          });
        if (error) throw error;
      }
      renderListings();
      showToast(isBookmarked ? '⭐ 관심매물에서 삭제되었습니다.' : '❤️ 관심매물에 추가되었습니다.', 'success');
    } catch (err) {
      console.error('Supabase bookmarks toggle error:', err);
      alert('북마크 동기화 중 오류가 발생했습니다: ' + err.message);
    }
  }
}

// 화면 하단에 부드럽게 나타나는 토스트 메시지 함수
function showToast(message, type = 'success') {
  // 기존 토스트 제거
  const exist = document.getElementById('app-toast-alert');
  if (exist) exist.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast-alert';
  toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-all duration-300 transform translate-y-4 opacity-0 z-50';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[16px] text-secondary">info</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // 애니메이션 효과 적용
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 50);

  // 2.5초 뒤 제거
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

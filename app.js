// ==================== GLOBAL APP STATE ====================
let supabaseClient = null;
let isDummyAuth = true;
let currentUser = null;

let selectedDistrict = 'gangnam';
let apartments = [];
let selectedApartment = null;

let isDummyMap = true;
let kakaoMapInstance = null;
let mapMarkers = [];

// ==================== STATIC MOCK DATA ENGINE ====================
// 공공데이터포털 연동 전 트래픽 초과 방지 및 100% 동작을 위해 시나리오에 맞는 실제에 가까운 가상 데이터 구축
const DISTRICT_DATA = {
  gangnam: {
    name: '서울 강남구',
    lat: 37.4979,
    lng: 127.0276,
    apts: [
      { id: 'gn-1', name: '은마아파트', lat: 37.4931, lng: 127.0628, mockX: 35, mockY: 45, address: '강남구 대치동 316', pyeong: 34, recentPrice: 24.5, trend: 'up', priceHistory: [{ year: '2023', price: 21.2 }, { year: '2024', price: 22.8 }, { year: '2025', price: 23.5 }, { year: '2026', price: 24.5 }] },
      { id: 'gn-2', name: '압구정현대 7차', lat: 37.5311, lng: 127.0289, mockX: 45, mockY: 20, address: '강남구 압구정동 369-1', pyeong: 52, recentPrice: 58.0, trend: 'up', priceHistory: [{ year: '2023', price: 51.0 }, { year: '2024', price: 53.5 }, { year: '2025', price: 56.0 }, { year: '2026', price: 58.0 }] },
      { id: 'gn-3', name: '개포주공 1단지', lat: 37.4812, lng: 127.0581, mockX: 60, mockY: 75, address: '강남구 개포동 660-3', pyeong: 25, recentPrice: 19.8, trend: 'down', priceHistory: [{ year: '2023', price: 21.5 }, { year: '2024', price: 20.8 }, { year: '2025', price: 20.1 }, { year: '2026', price: 19.8 }] },
      { id: 'gn-4', name: '도곡렉슬', lat: 37.4913, lng: 127.0494, mockX: 25, mockY: 60, address: '강남구 도곡동 527', pyeong: 33, recentPrice: 28.2, trend: 'up', priceHistory: [{ year: '2023', price: 25.0 }, { year: '2024', price: 26.5 }, { year: '2025', price: 27.8 }, { year: '2026', price: 28.2 }] }
    ]
  },
  seocho: {
    name: '서울 서초구',
    lat: 37.4837,
    lng: 127.0324,
    apts: [
      { id: 'sc-1', name: '반포자이', lat: 37.5028, lng: 127.0124, mockX: 30, mockY: 25, address: '서초구 반포동 2-1', pyeong: 35, recentPrice: 33.5, trend: 'up', priceHistory: [{ year: '2023', price: 29.5 }, { year: '2024', price: 31.0 }, { year: '2025', price: 32.5 }, { year: '2026', price: 33.5 }] },
      { id: 'sc-2', name: '아크로리버파크', lat: 37.5085, lng: 126.9972, mockX: 55, mockY: 15, address: '서초구 반포동 2-12', pyeong: 34, recentPrice: 39.0, trend: 'up', priceHistory: [{ year: '2023', price: 35.0 }, { year: '2024', price: 36.8 }, { year: '2025', price: 38.0 }, { year: '2026', price: 39.0 }] },
      { id: 'sc-3', name: '서초그랑자이', lat: 37.4891, lng: 127.0242, mockX: 45, mockY: 55, address: '서초구 서초동 1335', pyeong: 34, recentPrice: 29.8, trend: 'flat', priceHistory: [{ year: '2023', price: 29.5 }, { year: '2024', price: 29.6 }, { year: '2025', price: 29.7 }, { year: '2026', price: 29.8 }] }
    ]
  },
  mapo: {
    name: '서울 마포구',
    lat: 37.5622,
    lng: 126.9083,
    apts: [
      { id: 'mp-1', name: '마포래미안푸르지오', lat: 37.5498, lng: 126.9562, mockX: 45, mockY: 45, address: '마포구 아현동 777', pyeong: 34, recentPrice: 17.5, trend: 'up', priceHistory: [{ year: '2023', price: 15.2 }, { year: '2024', price: 16.0 }, { year: '2025', price: 16.8 }, { year: '2026', price: 17.5 }] },
      { id: 'mp-2', name: '신촌그랑자이', lat: 37.5562, lng: 126.9463, mockX: 30, mockY: 30, address: '마포구 대흥동 12', pyeong: 34, recentPrice: 16.2, trend: 'down', priceHistory: [{ year: '2023', price: 17.5 }, { year: '2024', price: 17.0 }, { year: '2025', price: 16.6 }, { year: '2026', price: 16.2 }] }
    ]
  },
  yongsan: {
    name: '서울 용산구',
    lat: 37.5326,
    lng: 126.9908,
    apts: [
      { id: 'ys-1', name: '한남더힐', lat: 37.5369, lng: 127.0113, mockX: 65, mockY: 30, address: '용산구 한남동 810', pyeong: 85, recentPrice: 95.0, trend: 'up', priceHistory: [{ year: '2023', price: 82.0 }, { year: '2024', price: 86.5 }, { year: '2025', price: 90.0 }, { year: '2026', price: 95.0 }] },
      { id: 'ys-2', name: '용산센트럴파크', lat: 37.5276, lng: 126.9691, mockX: 35, mockY: 60, address: '용산구 한강로3가 63-70', pyeong: 43, recentPrice: 28.5, trend: 'flat', priceHistory: [{ year: '2023', price: 28.0 }, { year: '2024', price: 28.2 }, { year: '2025', price: 28.4 }, { year: '2026', price: 28.5 }] }
    ]
  }
};

// ==================== APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Supabase 초기화 시도
  initSupabase();

  // 2. 로그인 사용자 정보 확인 및 UI 업데이트
  checkAuthSession();

  // 3. 부동산 목록 구성 및 지도 로드
  changeDistrict(selectedDistrict);

  // 4. Lucide 아이콘 활성화
  lucide.createIcons();
});

// Supabase 초기 설정
function initSupabase() {
  const config = window.APP_CONFIG;
  if (config && config.SUPABASE_URL && !config.SUPABASE_URL.includes('dummy-project')) {
    try {
      supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      isDummyAuth = false;
      console.log('Supabase 초기화 완료 (실 서비스 모드)');
    } catch (e) {
      console.error('Supabase 연동 실패. 더미 회원 모드로 자동 실행합니다.', e);
      isDummyAuth = true;
    }
  } else {
    isDummyAuth = true;
    console.log('Supabase 더미 모드로 시작');
  }
}

// ==================== MODAL MANAGEMENT ====================
function openModal(modalId) {
  // 트랜지션 충돌을 방지하기 위해 열려있는 모달들을 즉시 숨김
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
    
    // 강제 리플로우 유도 (트랜지션 애니메이션 오동작 방지)
    void modal.offsetWidth;
    
    overlay.classList.add('bg-black/60');
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
    overlay.classList.remove('bg-black/60');
    overlay.classList.add('hidden');
  }

  // 모달 에러/성공 메시지 청소
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
    overlay.classList.remove('bg-black/60');
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
  // 폼 초기화
  document.querySelectorAll('input').forEach(input => {
    if (input.type !== 'submit') input.value = '';
  });
}

function showBoxMessage(boxId, message, type = 'error') {
  const box = document.getElementById(boxId);
  if (box) {
    box.style.display = 'block';
    box.innerHTML = `<span>${message}</span>`;
  }
}

// ==================== AUTH SERVICE LOGIC ====================
// 더미 유저 저장소 (localStorage 활용)
const getDummyDB = () => {
  const data = localStorage.getItem('dummy_users_db');
  return data ? JSON.parse(data) : [{ email: 'test@example.com', password: '123456' }];
};

const saveDummyDB = (db) => {
  localStorage.setItem('dummy_users_db', JSON.stringify(db));
};

// 세션 유지 상태 확인
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

// UI 로그인 상태 갱신
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

// 1. 로그인 요청
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
    } catch (err) {
      showBoxMessage(errorBox, err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
    }
  }
}

// 2. 회원가입 요청
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
    showBoxMessage(successBox, '가입 성공! 잠시 후 로그인 모달로 전환됩니다.');
    setTimeout(() => {
      switchModal('signup-modal', 'login-modal');
    }, 1500);
  } else {
    const submitBtn = document.getElementById('signup-submit-btn');
    submitBtn.disabled = true;
    try {
      const { error } = await supabaseClient.auth.signUp({
        email: emailInput,
        password: passwordInput
      });
      if (error) throw error;
      showBoxMessage(successBox, '회원가입이 완료되었습니다. 이메일 함을 확인해주세요!');
      setTimeout(() => {
        switchModal('signup-modal', 'login-modal');
      }, 2500);
    } catch (err) {
      showBoxMessage(errorBox, err.message || '가입 도중 에러가 발생했습니다.');
    } finally {
      submitBtn.disabled = false;
    }
  }
}

// 3. 이메일 찾기 요청 (가상 시뮬레이션)
function submitFindEmail(e) {
  e.preventDefault();
  const errorBox = 'find-email-error-box';
  const successBox = 'find-email-success-box';
  const hint = document.getElementById('find-email-hint').value.trim();

  // 더미 DB 대조
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

// 4. 비밀번호 변경 적용
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

// 5. 회원 탈퇴 요청
async function submitWithdraw() {
  if (isDummyAuth) {
    const db = getDummyDB();
    const filtered = db.filter(u => u.email !== currentUser.email);
    saveDummyDB(filtered);
    
    // 세션 클리어
    currentUser = null;
    localStorage.removeItem('dummy-session-user');
    updateAuthUI();
    closeAllModals();
    alert('더미 회원 탈퇴가 처리되었습니다.');
  } else {
    try {
      // 클라이언트 단에서는 admin delete 계정이 불가능하므로, 
      // Supabase Edge Functions 혹은 Next.js API가 필요하지만 
      // 본 프로젝트는 HTML 단일 서버리스 구조이므로 경고창으로 처리 방안을 명시하거나 더미 가상 처리를 제공합니다.
      alert('실제 프로덕션 환경의 회원 탈퇴는 관리자 권한(API Route 또는 Edge Functions)이 필요하여, 현재의 완전 서버리스 Vanilla HTML 클라이언트 상태에서는 가상 탈퇴로 시뮬레이션 처리됩니다.');
      currentUser = null;
      await supabaseClient.auth.signOut();
      updateAuthUI();
      closeAllModals();
    } catch (err) {
      alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
    }
  }
}

// 6. 로그아웃
async function handleLogout() {
  if (isDummyAuth) {
    currentUser = null;
    localStorage.removeItem('dummy-session-user');
    updateAuthUI();
  } else {
    await supabaseClient.auth.signOut();
    currentUser = null;
    updateAuthUI();
  }
}

// 회원탈퇴 확인 폼 토글
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

// ==================== REAL ESTATE REGION CHANGE ====================
function changeDistrict(districtCode) {
  selectedDistrict = districtCode;
  apartments = DISTRICT_DATA[districtCode].apts;
  selectedApartment = null;

  // 지역 태그 업데이트
  document.getElementById('region-tag').textContent = DISTRICT_DATA[districtCode].name;

  // 목록 새로고침
  renderApartmentList();

  // 지도 새로 로드 및 마커 재배치
  loadMapAndMarkers();

  // 하단 차트 초기화
  resetChartArea();
}

// 아파트 리스트 렌더링
function renderApartmentList() {
  const container = document.getElementById('apartment-list-container');
  container.innerHTML = '';

  apartments.forEach(apt => {
    const isSelected = selectedApartment?.id === apt.id;
    const trendText = apt.trend === 'up' ? '상승' : apt.trend === 'down' ? '하락' : '보합';
    const trendClass = apt.trend === 'up' ? 'text-red-400 font-bold' : apt.trend === 'down' ? 'text-blue-400 font-bold' : 'text-slate-400';
    const trendIcon = apt.trend === 'up' ? '▲' : apt.trend === 'down' ? '▼' : '━';

    const card = document.createElement('div');
    card.className = `apartment-card ${isSelected ? 'active' : ''}`;
    card.onclick = () => selectApartment(apt);

    card.innerHTML = `
      <div class="card-header-row">
        <div class="flex items-center gap-2">
          <i data-lucide="building" class="w-4 h-4 text-indigo-400"></i>
          <h4 class="font-bold text-sm text-slate-100">${apt.name}</h4>
        </div>
        <span class="text-[10px] ${trendClass}">${trendIcon} ${trendText}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500"></i>
        <span class="font-mono">${apt.address}</span>
      </div>
      <div class="card-footer-row mt-2 pt-2.5 border-t border-slate-900/60">
        <span class="text-[11px] text-slate-500">${apt.pyeong}평형</span>
        <span class="text-xs font-semibold text-white font-mono">최근 실거래 <strong class="text-teal-400 text-sm">${apt.recentPrice}억</strong></span>
      </div>
    `;

    container.appendChild(card);
  });
  
  // 새로 추가된 카드의 Lucide 아이콘 활성화
  lucide.createIcons();
}

// 아파트 선택 이벤트
function selectApartment(apt) {
  selectedApartment = apt;
  renderApartmentList();

  // 지도 중심 이동 및 마커 활성화
  if (!isDummyMap && kakaoMapInstance) {
    const moveLatLon = new window.kakao.maps.LatLng(apt.lat, apt.lng);
    kakaoMapInstance.panTo(moveLatLon);
  } else {
    // 가상 지도일 때는 가상 지도를 다시 렌더링하여 하이라이트 표시
    renderDummyMap();
  }

  // 하단 차트 그리기
  drawTrendChart(apt);
}

// ==================== MAP SERVICE LOGIC (REAL KAKAO & MOCK) ====================
function loadMapAndMarkers() {
  const container = document.getElementById('map-area-container');
  const apiKey = window.APP_CONFIG.KAKAO_MAP_CLIENT_KEY;

  // 1. API 키가 없거나 dummy 상태일 경우 가상 지도 렌더링
  if (!apiKey || apiKey === '' || apiKey.includes('your-kakao')) {
    isDummyMap = true;
    renderDummyMap();
    return;
  }

  isDummyMap = false;
  container.innerHTML = `<div id="kakao-map-canvas" class="w-full h-full"></div>`;

  // 2. 카카오 지도 SDK 동적 주입 및 연동
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

// 실제 카카오 맵 초기화 및 마커 렌더링
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
  
  // 마커 제거
  mapMarkers.forEach(m => m.setMap(null));
  mapMarkers = [];

  // 새 마커 배치
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

// 가상 지도(Mock Map Simulator) SVG/HTML 결합 렌더러
function renderDummyMap() {
  const container = document.getElementById('map-area-container');
  const currentDistrict = DISTRICT_DATA[selectedDistrict];
  
  let markersHtml = '';
  apartments.forEach(apt => {
    const isSelected = selectedApartment?.id === apt.id;
    const markerClass = isSelected 
      ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/40 ring-4 ring-rose-500/20 scale-110 z-20' 
      : 'bg-indigo-600/90 text-indigo-100 hover:bg-indigo-500 hover:scale-105';
    
    markersHtml += `
      <button 
        onclick="selectApartmentById('${apt.id}')"
        style="left: ${apt.mockX}%; top: ${apt.mockY}%; transform: translate(-50%, -50%);"
        class="absolute p-2.5 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${markerClass}"
      >
        <i data-lucide="map-pin" class="w-4 h-4"></i>
        <!-- 툴팁 요약 카드 -->
        <div class="absolute bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950/95 border ${
          isSelected ? 'border-rose-500 text-rose-400' : 'border-slate-800 text-indigo-300'
        } text-[11px] font-bold whitespace-nowrap shadow-xl flex flex-col items-center">
          <span>${apt.name}</span>
          <span class="text-white text-[10px] mt-0.5">${apt.recentPrice}억</span>
        </div>
      </button>
    `;
  });

  container.innerHTML = `
    <div class="w-full h-full relative bg-slate-900 overflow-hidden select-none flex items-center justify-center">
      <!-- 가상 그리드 배경 -->
      <div class="absolute inset-0 bg-slate-950 opacity-40"></div>
      <div class="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 opacity-10 pointer-events-none">
        ${Array.from({ length: 144 }).map(() => `<div class="border border-indigo-500/30"></div>`).join('')}
      </div>

      <!-- 한강 물줄기 SVG -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M -50,280 C 250,260 450,340 650,310 C 850,280 1050,380 1250,360" fill="none" stroke="#0ea5e9" stroke-width="70" stroke-linecap="round"></path>
      </svg>

      <!-- 가상 지도 알림 뱃지 -->
      <div class="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-indigo-950/80 border border-indigo-900 text-indigo-300 text-xs font-medium rounded-full shadow-lg backdrop-blur-md">
        <i data-lucide="map" class="w-3.5 h-3.5"></i>
        <span>가상 맵 시뮬레이터 구동 중</span>
      </div>

      <!-- 대화형 마커 레이어 -->
      <div class="absolute inset-0">
        ${markersHtml}
      </div>

      <!-- 현재 자치구 이름 워터마크 -->
      <div class="absolute pointer-events-none text-center opacity-80">
        <span class="text-4xl font-extrabold text-slate-800 tracking-widest uppercase">${currentDistrict.name}</span>
        <p class="text-[10px] text-slate-700 font-mono mt-1">Virtual Map Mode (No API Key)</p>
      </div>
    </div>
  `;

  // 새로운 HTML 내의 Lucide 아이콘 활성화
  lucide.createIcons();
}

function selectApartmentById(aptId) {
  const apt = apartments.find(a => a.id === aptId);
  if (apt) selectApartment(apt);
}

// ==================== PRICE TREND CHART LOGIC (PURE SVG) ====================
function resetChartArea() {
  const chartHeader = document.getElementById('chart-apt-name');
  const chartSub = document.getElementById('chart-apt-address');
  const badge = document.getElementById('chart-trend-badge');
  const canvas = document.getElementById('trend-chart-canvas');

  chartHeader.textContent = '단지를 선택해 주세요';
  chartSub.textContent = '상세 실거래가 추이와 시세 변동 동향이 표시됩니다.';
  badge.className = 'hidden';
  canvas.innerHTML = `
    <div class="text-slate-500 text-xs text-center flex flex-col items-center gap-2">
      <i data-lucide="bar-chart-3" class="w-8 h-8 opacity-40"></i>
      <span>지도의 마커나 왼쪽 단지 목록을 클릭하면 시세 상승/하락 추이 그래프가 나타납니다.</span>
    </div>
  `;
  lucide.createIcons();
}

// Pure SVG 차트 시각화 구현
function drawTrendChart(apt) {
  // 정보 헤더 변경
  document.getElementById('chart-apt-name').textContent = `${apt.name} (${apt.pyeong}평형)`;
  document.getElementById('chart-apt-address').textContent = `${apt.address} | 실거래 히스토리`;

  // 추세 뱃지 노출
  const badge = document.getElementById('chart-trend-badge');
  badge.classList.remove('hidden');
  if (apt.trend === 'up') {
    badge.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/50 text-red-400 border border-red-900';
    badge.innerHTML = '<span>▲ 시세 상승세</span>';
  } else if (apt.trend === 'down') {
    badge.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/50 text-blue-400 border border-blue-900';
    badge.innerHTML = '<span>▼ 시세 하락세</span>';
  } else {
    badge.className = 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800';
    badge.innerHTML = '<span>━ 보합세</span>';
  }

  // SVG 차트 그리기
  const canvas = document.getElementById('trend-chart-canvas');
  const history = apt.priceHistory;

  // 그래프 최소/최대값 산정
  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices) * 0.9;
  const maxPrice = Math.max(...prices) * 1.1;
  const priceRange = maxPrice - minPrice;

  // SVG 캔버스 수치 정의
  const width = 600;
  const height = 180;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // 각 데이터 포인트 좌표 연산
  const points = history.map((data, index) => {
    const x = paddingLeft + (index / (history.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;
    return { x, y, year: data.year, price: data.price };
  });

  // SVG 경로 생성 (Path)
  let linePath = `M ${points[0].x} ${points[0].y}`;
  let areaPath = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    linePath += ` L ${points[i].x} ${points[i].y}`;
    areaPath += ` L ${points[i].x} ${points[i].y}`;
  }

  // 영역 채우기용 클로징 패스
  areaPath += ` L ${points[points.length - 1].x} ${height - paddingBottom}`;
  areaPath += ` L ${points[0].x} ${height - paddingBottom} Z`;

  // 그리드 가이드라인 Y축선 연산
  const yLines = 3;
  let gridLines = '';
  for (let i = 0; i <= yLines; i++) {
    const ratio = i / yLines;
    const yVal = paddingTop + chartHeight * ratio;
    const priceVal = (maxPrice - ratio * priceRange).toFixed(1);
    gridLines += `
      <line x1="${paddingLeft}" y1="${yVal}" x2="${width - paddingRight}" y2="${yVal}" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"></line>
      <text x="${paddingLeft - 10}" y="${yVal + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="monospace">${priceVal}억</text>
    `;
  }

  // 데이터 포인트 마커 및 X축 텍스트
  let markers = '';
  points.forEach((pt) => {
    markers += `
      <!-- 마커 점 -->
      <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#14b8a6" stroke="#020617" stroke-width="2" class="chart-dot"></circle>
      <!-- X축 년도 텍스트 -->
      <text x="${pt.x}" y="${height - 10}" fill="#64748b" font-size="11" text-anchor="middle" font-weight="500">${pt.year}년</text>
      <!-- 데이터 값 말풍선 -->
      <text x="${pt.x}" y="${pt.y - 10}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">${pt.price}억</text>
    `;
  });

  // 최종 SVG 구성
  canvas.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full">
      <!-- 그리드 가이드라인 -->
      ${gridLines}

      <!-- 그라디언트 영역 데코 -->
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.25"></stop>
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.00"></stop>
        </linearGradient>
      </defs>

      <!-- 그라디언트 채우기 레이어 -->
      <path d="${areaPath}" fill="url(#chart-grad)"></path>

      <!-- 메인 차트 곡선 라인 -->
      <path d="${linePath}" fill="none" stroke="url(#line-grad)" stroke-width="3" stroke-linecap="round" class="chart-line"></path>
      
      <defs>
        <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#6366f1"></stop>
          <stop offset="100%" stop-color="#14b8a6"></stop>
        </linearGradient>
      </defs>

      <!-- 마커 포인트 & 수치 텍스트 -->
      ${markers}
    </svg>
  `;
}

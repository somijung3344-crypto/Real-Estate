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

// ==================== EXTENDED REAL ESTATE DATASET (대구 피벗) ====================
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
      }
    ]
  }
};

// ==================== APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Supabase 연동 초기화
  initSupabase();

  // 2. 인증 세션 복원 및 UI 업데이트
  checkAuthSession();

  // 3. 탭 네비게이션 복원 (기본 홈 화면 로드)
  switchSection('home');

  // 4. Lucide 아이콘 초기 활성화
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
  document.getElementById('section-bookmarks').classList.add('hidden');

  // 2. 모든 네비게이션 탭 비활성화
  document.getElementById('nav-home').classList.remove('active');
  document.getElementById('nav-analysis').classList.remove('active');
  document.getElementById('nav-bookmarks').classList.remove('active');

  // 3. 대상 페이지 노출 및 탭 활성화
  document.getElementById(`section-${sectionId}`).classList.remove('hidden');
  document.getElementById(`nav-${sectionId}`).classList.add('active');

  // 4. 저장소 탭 로드 시 북마크 리스트 새로 렌더링
  if (sectionId === 'bookmarks') {
    renderBookmarksView();
  }

  // 5. 분석실 로드 시 아파트 미선택 상태 대응
  if (sectionId === 'analysis') {
    changeDistrict(selectedDistrict);
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
      if (document.getElementById('section-bookmarks').classList.contains('hidden') === false) {
        renderBookmarksView();
      }
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
      if (document.getElementById('section-bookmarks').classList.contains('hidden') === false) {
        renderBookmarksView();
      }
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
      const { error } = await supabaseClient.auth.signUp({
        email: emailInput,
        password: passwordInput
      });
      if (error) throw error;
      showBoxMessage(successBox, '회원가입 완료! 인증 메일을 발송했습니다.');
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
function changePyeongFilter(pyeongSize) {
  selectedPyeong = pyeongSize;
  
  // 버튼 액티브 클래스 업데이트
  const buttons = document.querySelectorAll('#pyeong-filter-wrapper button');
  buttons.forEach(btn => {
    if (btn.textContent.includes(pyeongSize)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
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
  const container = document.getElementById('map-area-container');
  const currentDistrict = DISTRICT_DATA[selectedDistrict];
  
  let markersHtml = '';
  apartments.forEach(apt => {
    const isSelected = selectedApartment?.id === apt.id;
    const markerClass = isSelected 
      ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30 ring-4 ring-rose-500/20 scale-110 z-20' 
      : 'bg-indigo-600 text-indigo-50 hover:bg-indigo-500 hover:scale-105';
    
    markersHtml += `
      <button 
        onclick="selectApartmentById('${apt.id}')"
        style="left: ${apt.mockX}%; top: ${apt.mockY}%; transform: translate(-50%, -50%);"
        class="absolute p-2.5 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${markerClass}"
      >
        <i data-lucide="map-pin" class="w-4 h-4"></i>
        <div class="absolute bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-white border ${
          isSelected ? 'border-rose-500 text-rose-500' : 'border-slate-200 text-slate-800'
        } text-[11px] font-bold whitespace-nowrap shadow-xl flex flex-col items-center">
          <span>${apt.name}</span>
          <span class="text-indigo-600 text-[10px] mt-0.5">${apt.recentPrice}억</span>
        </div>
      </button>
    `;
  });

  // 플로팅 검색창(#analysis-search-wrapper) 엘리먼트는 보존하고 시뮬레이터 캔버스만 덮어쓰기
  let dummyCanvas = document.getElementById('dummy-map-canvas');
  if (!dummyCanvas) {
    dummyCanvas = document.createElement('div');
    dummyCanvas.id = 'dummy-map-canvas';
    dummyCanvas.className = 'w-full h-full absolute inset-0';
    container.insertBefore(dummyCanvas, container.firstChild);
  }

  dummyCanvas.innerHTML = `
    <div class="w-full h-full relative bg-slate-50 overflow-hidden select-none flex items-center justify-center">
      <div class="absolute inset-0 bg-white opacity-40"></div>
      <div class="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 opacity-40 pointer-events-none">
        ${Array.from({ length: 144 }).map(() => `<div class="border border-slate-200/50"></div>`).join('')}
      </div>

      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M -50,280 C 250,260 450,340 650,310 C 850,280 1050,380 1250,360" fill="none" stroke="#bfdbfe" stroke-width="70" stroke-linecap="round"></path>
      </svg>

      <div class="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-md">
        <i data-lucide="map" class="w-3.5 h-3.5 text-indigo-600"></i>
        <span>가상 맵 시뮬레이터 구동 중</span>
      </div>

      <div class="absolute inset-0">
        ${markersHtml}
      </div>

      <div class="absolute pointer-events-none text-center opacity-70">
        <span class="text-4xl font-extrabold text-slate-200 tracking-widest uppercase">${currentDistrict.name}</span>
        <p class="text-[10px] text-slate-350 font-mono mt-1">Virtual Map Mode (No API Key)</p>
      </div>
    </div>
  `;
  lucide.createIcons();
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
  const fallback = document.getElementById('roadview-fallback');
  const extLink = document.getElementById('roadview-external-link');
  
  const position = new window.kakao.maps.LatLng(lat, lng);
  
  // 외부 공식 맵 로드뷰 URL 연계
  extLink.href = `https://map.kakao.com/link/roadview/${lat},${lng}`;
  
  if (window.kakao && window.kakao.maps && window.kakao.maps.Roadview) {
    try {
      // 1. 기존 캔버스 노드 정리
      container.innerHTML = '';
      
      const roadview = new window.kakao.maps.Roadview(container);
      const roadviewClient = new window.kakao.maps.RoadviewClient();
      
      roadviewClient.getNearestPanoId(position, 50, function(panoId) {
        if (panoId === null) {
          // 로드뷰 서비스 불가 구역 대응
          fallback.classList.remove('hidden');
          container.appendChild(fallback);
        } else {
          fallback.classList.add('hidden');
          roadview.setPanoId(panoId, position);
        }
      });
    } catch (e) {
      console.error(e);
      fallback.classList.remove('hidden');
      container.appendChild(fallback);
    }
  } else {
    // API 미로드 상태일 때 폴백 뷰 노출
    fallback.classList.remove('hidden');
    container.appendChild(fallback);
  }
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
      <i data-lucide="lock" class="w-10 h-10 opacity-40"></i>
      <span class="text-sm font-semibold text-slate-700">로그인이 필요한 메뉴입니다.</span>
      <p class="text-xs text-slate-400">북마크 기능을 이용해 나만의 관심 단지 목록을 안전하게 저장해 보세요.</p>
      <button onclick="openModal('login-modal')" class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-all">
        로그인 하기
      </button>
    `;
    lucide.createIcons();
    return;
  }

  let list = [];

  if (isDummyAuth) {
    list = getBookmarksFromStorage();
  } else {
    try {
      const { data, error } = await supabaseClient
        .from('bookmarks')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // DB에서 가져온 기본 키들을 로컬 아파트 메타데이터 정보와 맵핑
      list = data.map(dbApt => {
        let meta = null;
        let districtKey = 'suseong';
        
        Object.keys(DISTRICT_DATA).forEach(key => {
          const matched = DISTRICT_DATA[key].apts.find(a => a.id === dbApt.apt_id);
          if (matched) {
            meta = matched;
            districtKey = key;
          }
        });

        return {
          aptId: dbApt.apt_id,
          aptName: dbApt.apt_name,
          recentPrice: dbApt.recent_price,
          districtKey: districtKey,
          address: meta ? meta.address : '주소 정보 없음',
          pyeong: meta ? meta.pyeong : 84
        };
      });
    } catch (err) {
      console.error(err);
      list = getBookmarksFromStorage(); // 에러 백업용으로 로컬 데이터 사용
    }
  }

  countBadge.textContent = `${list.length}개 단지 저장됨`;

  if (list.length === 0) {
    emptyView.classList.remove('hidden');
  } else {
    emptyView.classList.add('hidden');
    
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bookmark-card';
      
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2 cursor-pointer" onclick="selectSearchApartment('${item.districtKey}', '${item.aptId}')">
            <div class="w-8 h-8 bg-slate-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <i data-lucide="building" class="w-4.5 h-4.5"></i>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-800 hover:text-indigo-650 transition-colors">${item.aptName}</h4>
              <p class="text-[10px] text-slate-400 font-mono mt-0.5">${item.address}</p>
            </div>
          </div>
          <!-- 북마크 즉시 해제 버튼 -->
          <button onclick="removeBookmarkDirectly('${item.aptId}')" class="p-1 text-red-500 hover:bg-slate-50 rounded-lg transition-colors">
            <i data-lucide="heart" class="w-4 h-4 fill-current"></i>
          </button>
        </div>
        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono mt-2">
          <span class="text-slate-450">${item.pyeong}평형</span>
          <span class="text-slate-700 font-semibold">최근 실거래가 <strong class="text-indigo-600 font-bold ml-1">${item.recentPrice}</strong></span>
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

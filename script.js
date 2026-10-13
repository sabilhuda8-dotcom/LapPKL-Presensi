import app, { db } from './firebase.js';
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';

import { db } from './firebase.js';
const auth = getAuth();

// ==================== DAFTAR TANGGAL MERAH NASIONAL INDONESIA ====================
const INDONESIA_HOLIDAYS = {
  // 2025
  '2025-01-01': 'Tahun Baru 2025 Masehi',
  '2025-01-27': "Isra Mi'raj Nabi Muhammad SAW",
  '2025-01-29': 'Tahun Baru Imlek 2576 Kongzili',
  '2025-03-29': 'Hari Suci Nyepi (Tahun Baru Saka 1947)',
  '2025-03-31': 'Hari Raya Idul Fitri 1446 H',
  '2025-04-01': 'Hari Raya Idul Fitri 1446 H',
  '2025-04-18': 'Wafat Yesus Kristus',
  '2025-05-01': 'Hari Buruh Internasional',
  '2025-05-12': 'Hari Raya Waisak 2569 BE',
  '2025-05-29': 'Kenaikan Yesus Kristus',
  '2025-06-01': 'Hari Lahir Pancasila',
  '2025-06-07': 'Hari Raya Idul Adha 1446 H',
  '2025-06-27': 'Tahun Baru Islam 1447 H',
  '2025-08-17': 'Hari Kemerdekaan RI ke-80',
  '2025-09-05': 'Maulid Nabi Muhammad SAW',
  '2025-12-25': 'Hari Raya Natal',

  // 2026
  '2026-01-01': 'Tahun Baru 2026 Masehi',
  '2026-01-16': "Isra Mi'raj Nabi Muhammad SAW",
  '2026-02-17': 'Tahun Baru Imlek 2577 Kongzili',
  '2026-03-19': 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
  '2026-03-20': 'Hari Raya Idul Fitri 1447 H',
  '2026-03-21': 'Hari Raya Idul Fitri 1447 H',
  '2026-04-03': 'Wafat Yesus Kristus',
  '2026-05-01': 'Hari Buruh Internasional',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-27': 'Hari Raya Idul Adha 1447 H',
  '2026-05-31': 'Hari Raya Waisak 2570 BE',
  '2026-06-01': 'Hari Lahir Pancasila',
  '2026-06-16': 'Tahun Baru Islam 1448 H',
  '2026-08-17': 'Hari Kemerdekaan RI ke-81',
  '2026-08-25': 'Maulid Nabi Muhammad SAW',
  '2026-12-25': 'Hari Raya Natal',

  // 2027
  '2027-01-01': 'Tahun Baru 2027 Masehi',
  '2027-02-06': 'Tahun Baru Imlek 2578 Kongzili',
  '2027-03-09': 'Hari Raya Idul Fitri 1448 H',
  '2027-03-10': 'Hari Raya Idul Fitri 1448 H',
  '2027-03-26': 'Wafat Yesus Kristus',
  '2027-05-01': 'Hari Buruh Internasional',
  '2027-05-06': 'Kenaikan Yesus Kristus',
  '2027-05-16': 'Hari Raya Idul Adha 1448 H',
  '2027-06-01': 'Hari Lahir Pancasila',
  '2027-08-17': 'Hari Kemerdekaan RI ke-82',
  '2027-12-25': 'Hari Raya Natal',
};

// ==================== STORAGE KEYS ====================
const STORAGE_USER_KEY = 'laporanPraktikUser';
const STORAGE_ENTRIES_KEY = 'laporanPraktikEntries';
const STORAGE_AUTH_KEY = 'laporanPraktikSession';
const STORAGE_THEME_KEY = 'laporanPraktikTheme';
const STORAGE_ATTENDANCE_KEY = 'laporanPraktikAttendance';
const STORAGE_USERS_LIST_KEY = 'laporanPraktikUsersList';
const STORAGE_TICKETS_KEY = 'laporanPraktikTickets';

const REPORTS_COLLECTION = 'laporanPraktik';
const ATTENDANCE_COLLECTION = 'laporanAbsensi';

// State
let currentAttendanceImageBase64 = null;
let editingAttendanceIndex = null;
let selectedRecapMonth = ''; // Format: YYYY-MM
let currentAdminTicketFilter = 'ALL';
let currentStudentTicketFilter = 'ALL';

// ==================== DOM ELEMENTS ====================
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const authMessage = document.getElementById('auth-message');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const welcomeText = document.getElementById('welcome-text');
const userRoleBadge = document.getElementById('user-role-badge');
const userRoleSubtext = document.getElementById('user-role-subtext');
const signupRole = document.getElementById('signup-role');



// Navigation group elements (Separation of Admin vs Student)
const adminNavGroup = document.getElementById('admin-nav-group');
const studentNavGroup = document.getElementById('student-nav-group');

// Admin panel elements
const adminNavSection = document.getElementById('admin-nav-section');
const adminTaskFilterContainer = document.getElementById('admin-task-filter-container');
const adminTaskUserFilter = document.getElementById('admin-task-user-filter');
const adminAttendanceFilterContainer = document.getElementById('admin-attendance-filter-container');
const adminAttendanceUserFilter = document.getElementById('admin-attendance-user-filter');
const adminStatStudents = document.getElementById('admin-stat-students');
const adminStatTasks = document.getElementById('admin-stat-tasks');
const adminStatAttendance = document.getElementById('admin-stat-attendance');
const adminStatTicketsActive = document.getElementById('admin-stat-tickets-active');
const adminStudentsTableBody = document.getElementById('admin-students-table-body');

// User profile elements
const userNis = document.getElementById('user-nis');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const saveUserButton = document.getElementById('save-user-button');
const identityNis = document.getElementById('identity-nis');
const identityName = document.getElementById('identity-name');
const identityEmail = document.getElementById('identity-email');

// Task elements
const taskName = document.getElementById('task-name');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const taskLocation = document.getElementById('task-location');
const taskRequester = document.getElementById('task-requester');
const taskProof = document.getElementById('task-proof');
const taskImage = document.getElementById('task-image');
const addTaskButton = document.getElementById('add-task-button');
const entriesList = document.getElementById('entries-list');
const entriesCount = document.getElementById('entries-count');
const searchEntries = document.getElementById('search-entries');
const sortEntries = document.getElementById('sort-entries');
const exportExcel = document.getElementById('export-excel');
const exportPdf = document.getElementById('export-pdf');
const exportWord = document.getElementById('export-word');
const taskBackfillNotice = document.getElementById('task-backfill-notice');
const taskBackfillText = document.getElementById('task-backfill-text');

// Theme toggle elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const authThemeToggleBtn = document.getElementById('auth-theme-toggle-btn');

// Attendance Form elements
const attendanceDate = document.getElementById('attendance-date');
const attendanceLocation = document.getElementById('attendance-location');
const attendanceNotes = document.getElementById('attendance-notes');
const attendanceImage = document.getElementById('attendance-image');
const attendanceImagePreviewBox = document.getElementById('attendance-image-preview-box');
const attendanceImagePreview = document.getElementById('attendance-image-preview');
const btnRemoveAttendanceImage = document.getElementById('btn-remove-attendance-image');
const saveAttendanceButton = document.getElementById('save-attendance-button');
const cancelAttendanceButton = document.getElementById('cancel-attendance-button');
const saveAttendanceBtnText = document.getElementById('save-attendance-btn-text');
const dateStatusNotice = document.getElementById('date-status-notice');
const dateStatusText = document.getElementById('date-status-text');
const holidayInfoBadge = document.getElementById('holiday-info-badge');

// Standard Time panel
const panelStandardTime = document.getElementById('panel-standard-time');
const attendanceCheckin = document.getElementById('attendance-checkin');
const attendanceCheckout = document.getElementById('attendance-checkout');
const btnNowCheckin = document.getElementById('btn-now-checkin');
const btnNowCheckout = document.getElementById('btn-now-checkout');

// Bantuan Perkuliahan panel
const panelBantuanKuliah = document.getElementById('panel-bantuan-kuliah');
const attKuliahStandby = document.getElementById('att-kuliah-standby');
const attKuliahIt = document.getElementById('att-kuliah-it');
const attKuliahPulang = document.getElementById('att-kuliah-pulang');
const attKuliahRuang = document.getElementById('att-kuliah-ruang');

// Hadir Situasional panel (Ke Sekolah Dulu / Fleksibel)
const panelSituasional = document.getElementById('panel-situasional');
const attSituasiType = document.getElementById('att-situasi-type');
const attSituasiJamIt = document.getElementById('att-situasi-jam-it');
const attSituasiJamPulang = document.getElementById('att-situasi-jam-pulang');
const attSituasiKeterangan = document.getElementById('att-situasi-keterangan');
const btnSituasiNowIn = document.getElementById('btn-situasi-now-in');
const btnSituasiNowOut = document.getElementById('btn-situasi-now-out');

// Izin Multi-day panel
const panelIzinMultiday = document.getElementById('panel-izin-multiday');
const izinStartDate = document.getElementById('izin-start-date');
const izinEndDate = document.getElementById('izin-end-date');
const izinRangeBox = document.getElementById('izin-range-box');
const izinRangeCalcText = document.getElementById('izin-range-calc-text');
const izinCategory = document.getElementById('izin-category');

// Monthly Recap elements
const recapMonthSelect = document.getElementById('recap-month-select');
const btnPrevMonth = document.getElementById('btn-prev-month');
const btnNextMonth = document.getElementById('btn-next-month');
const searchAttendance = document.getElementById('search-attendance');
const attendanceTableBody = document.getElementById('attendance-table-body');
const attendanceEmptyState = document.getElementById('attendance-empty-state');
const exportAttendanceExcel = document.getElementById('export-attendance-excel');
const exportAttendancePdf = document.getElementById('export-attendance-pdf');

// KPI summary elements
const recapCountHadir = document.getElementById('recap-count-hadir');
const recapCountKuliah = document.getElementById('recap-count-kuliah');
const recapCountSituasional = document.getElementById('recap-count-situasional');
const recapCountIzin = document.getElementById('recap-count-izin');
const recapCountSakit = document.getElementById('recap-count-sakit');
const recapCountLibur = document.getElementById('recap-count-libur');
const recapPercentage = document.getElementById('recap-percentage');
const recapTotalDays = document.getElementById('recap-total-days');

// Image modal elements
const imageModal = document.getElementById('image-modal');
const imageModalTitle = document.getElementById('image-modal-title');
const imageModalImg = document.getElementById('image-modal-img');
const imageModalClose = document.getElementById('image-modal-close');

// ==================== THEME MANAGEMENT ====================
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  document.querySelectorAll('.theme-icon').forEach(el => {
    el.innerHTML = isDark ? '<i data-lucide="sun" class="w-4 h-4"></i>' : '<i data-lucide="moon" class="w-4 h-4"></i>';
    if(window.lucide) lucide.createIcons({nodes: [el]});
  });
  document.querySelectorAll('.theme-text').forEach(el => {
    el.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  let isDark = false;
  if (savedTheme) {
    isDark = savedTheme === 'dark';
  } else {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme(isDark);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const nextDark = !isDark;
  localStorage.setItem(STORAGE_THEME_KEY, nextDark ? 'dark' : 'light');
  applyTheme(nextDark);
  showToast(`Beralih ke ${nextDark ? 'Mode Gelap 🌙' : 'Mode Terang ☀️'}`, 'info');
}

// ==================== TOAST & NOTIFICATIONS ====================
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (container) {
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-3 opacity-0 ${
      type === 'success'
        ? 'bg-emerald-600 text-white'
        : type === 'error'
        ? 'bg-rose-600 text-white'
        : 'bg-slate-800 dark:bg-slate-700 text-white'
    }`;
    const icon = type === 'success' ? '<i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i>' : type === 'error' ? '<i data-lucide="x-circle" class="w-3 h-3 inline text-red-500"></i>' : 'ℹ️';
    toast.innerHTML = `<span class="text-base">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    let title = 'Laporan & Absensi Praktik';
    if (type === 'success') title = '<i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> ' + title;
    else if (type === 'error') title = '<i data-lucide="x-circle" class="w-3 h-3 inline text-red-500"></i> ' + title;
    else title = 'ℹ️ ' + title;

    new Notification(title, { body: message });
  }
}

// ==================== TABS NAVIGATION ====================
function switchTab(tabName, event) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });

  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.classList.remove('hidden');
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-blue-100', 'text-blue-700', 'font-bold', 'dark:bg-blue-900/60', 'dark:text-blue-300', 'bg-amber-100', 'text-amber-800', 'dark:bg-amber-950/60', 'dark:text-amber-200');
    btn.classList.add('hover:bg-slate-100', 'text-slate-700', 'dark:hover:bg-slate-800', 'dark:text-slate-200');
  });

  const activeBtn = event ? event.currentTarget : document.querySelector(`[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('hover:bg-slate-100', 'text-slate-700', 'dark:hover:bg-slate-800', 'dark:text-slate-200');
    if (tabName.startsWith('admin-')) {
      activeBtn.classList.add('bg-amber-100', 'text-amber-800', 'font-bold', 'dark:bg-amber-950/60', 'dark:text-amber-200');
    } else {
      activeBtn.classList.add('bg-blue-100', 'text-blue-700', 'font-bold', 'dark:bg-blue-900/60', 'dark:text-blue-300');
    }
  }

  if (tabName === 'attendance-recap') {
    renderAttendanceRecap();
  } else if (tabName === 'list-tasks') {
    renderEntries();
  } else if (tabName === 'admin-dashboard' || tabName === 'admin-monitoring') {
    renderAdminDashboard();
  } else if (tabName === 'admin-tickets') {
    renderAdminTickets();
  } else if (tabName === 'admin-period-tasks') {
    renderAdminPeriodTasks();
  } else if (tabName === 'admin-period-attendance') {
    renderAdminPeriodAttendance();
  } else if (tabName === 'admin-manage-users') {
    renderAdminUsers();
  } else if (tabName === 'student-tickets') {
    renderStudentTickets();
  }
}
window.switchTab = switchTab;

// ==================== DATE & HOLIDAY HELPERS ====================
function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayInfo(dateStr) {
  if (!dateStr) return { isWeekend: false, isHoliday: false, holidayName: '', dayName: '', isWorkday: false };
  const d = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = d.getDay(); // 0: Minggu, 6: Sabtu
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[dayOfWeek];

  const holidayName = INDONESIA_HOLIDAYS[dateStr] || '';
  const isHoliday = Boolean(holidayName);

  return {
    isWeekend,
    isHoliday,
    holidayName,
    dayName,
    isWorkday: !isWeekend && !isHoliday,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

function formatDayDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function formatTime(timeStr) {
  if (!timeStr) return '-';
  const [hour, minute] = timeStr.split(':');
  return `${hour}:${minute}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showLoadingState(button) {
  button.disabled = true;
  button.style.opacity = '0.6';
}

function hideLoadingState(button) {
  button.disabled = false;
  button.style.opacity = '1';
}

// Live clock and date update
function updateLiveAttendanceClock() {
  const now = new Date();
  const dateEl = document.getElementById('attendance-live-date');
  const timeEl = document.getElementById('attendance-live-time');
  
  if (dateEl) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
  }
}
setInterval(updateLiveAttendanceClock, 1000);

// Evaluate selected date in Form Catatan Pekerjaan
function evaluateSelectedTaskDate(dateVal) {
  if (!dateVal || !taskBackfillNotice || !taskBackfillText) return;
  const todayStr = getLocalDateString(new Date());
  if (dateVal < todayStr) {
    taskBackfillNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-semibold';
    taskBackfillText.textContent = `Mode Susulan: Mencatat pekerjaan untuk tanggal yang lalu (${formatDayDate(dateVal)}). Tetap tersimpan rapi!`;
  } else if (dateVal === todayStr) {
    taskBackfillNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
    taskBackfillText.textContent = '<i data-lucide="circle" class="w-3 h-3 inline text-emerald-500 fill-emerald-500"></i> Mencatat pekerjaan hari ini';
  } else {
    taskBackfillNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
    taskBackfillText.textContent = `<i data-lucide="calendar" class="w-3 h-3 inline"></i> Jadwal mendatang: ${formatDayDate(dateVal)}`;
  }
}

// Evaluate selected date in Form Absensi
function evaluateSelectedAttendanceDate(dateVal) {
  if (!dateVal) return;
  const info = getDayInfo(dateVal);
  const todayStr = getLocalDateString(new Date());
  const isPast = dateVal < todayStr;
  const pastTag = isPast ? ' (Input Susulan)' : '';

  if (info.isHoliday) {
    dateStatusNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 font-semibold';
    dateStatusText.textContent = `Libur Nasional: ${info.holidayName}${pastTag}`;
    if (holidayInfoBadge) {
      holidayInfoBadge.className = 'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300';
      holidayInfoBadge.innerHTML = `<span><i data-lucide="flag" class="w-3 h-3 inline"></i></span><span>${info.holidayName}</span>`;
      holidayInfoBadge.classList.remove('hidden');
    }
  } else if (info.isWeekend) {
    dateStatusNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900 font-semibold';
    dateStatusText.textContent = `Akhir Pekan (${info.dayName}) - Jadwal PKL Libur${pastTag}`;
    if (holidayInfoBadge) holidayInfoBadge.classList.add('hidden');
  } else {
    dateStatusNotice.className = isPast
      ? 'mt-2 text-xs flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-semibold'
      : 'mt-2 text-xs flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900 font-semibold';
    dateStatusText.textContent = isPast
      ? `Input Susulan: Mengisi presensi untuk hari yang telah lewat (${info.dayName}, ${formatDayDate(dateVal)}). Tetap tercatat resmi!`
      : `<i data-lucide="circle" class="w-3 h-3 inline text-emerald-500 fill-emerald-500"></i> Hari Kerja PKL (${info.dayName}, 08:00 – 16:00 WIB)`;
    if (holidayInfoBadge) holidayInfoBadge.classList.add('hidden');
  }

  // Cek apakah tanggal ini sudah pernah diabsen (Pencegahan duplikasi absen harian 1x sehari)
  const existingEntries = getAttendanceEntries();
  const currentUser = getCurrentUser();
  const existing = existingEntries.find((e, idx) => e.date === dateVal && idx !== editingAttendanceIndex && (!currentUser || !e.userEmail || e.userEmail === currentUser.email));
  if (existing) {
    dateStatusNotice.className = 'mt-2 text-xs flex items-center gap-1.5 p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-semibold';
    dateStatusText.textContent = `ℹ️ Tanggal ini sudah diabsen (${existing.status}: ${existing.location || 'Divisi IT'}). Menyimpan akan memperbarui absensi hari tersebut (1x per hari).`;
  }
}

// ==================== STORAGE & MULTI-USER FUNCTIONS ====================
function getStoredUser() {
  return JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
}

function setStoredUser(user) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

function getAllUsers() {
  const raw = localStorage.getItem(STORAGE_USERS_LIST_KEY);
  let list = raw ? JSON.parse(raw) : [];
  if (!list.length) {
    // Default demo accounts
    list = [
      { nis: '2024001', name: 'Mochamad Sabil Huda', email: 'sabil@gmail.com', password: '123', role: 'user' },
      { nis: 'ADM-001', name: 'Admin IT / Pembimbing PKL', email: 'admin@pkl.local', password: 'admin', role: 'admin' },
    ];
    const existing = getStoredUser();
    if (existing && existing.email && !list.some(u => u.email === existing.email)) {
      list.push(existing);
    }
    localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(list));
  }
  return list;
}

function saveUserToList(user) {
  const list = getAllUsers();
  const idx = list.findIndex(u => u.email === user.email);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...user };
  } else {
    list.push(user);
  }
  localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(list));
}

function getCurrentUser() {
  const sessionEmail = getSession();
  if (!sessionEmail) return getStoredUser();
  const list = getAllUsers();
  const found = list.find(u => u.email === sessionEmail);
  return found || getStoredUser();
}

function updateAdminFilterDropdowns() {
  const allUsers = getAllUsers().filter(u => u.role !== 'admin');
  const userOptions = '<option value="ALL"><i data-lucide="globe" class="w-3 h-3 inline"></i> Semua Siswa PKL</option>' +
    allUsers.map(u => `<option value="${u.email}">${u.name} (${u.nis || '-'})</option>`).join('');

  if (adminTaskUserFilter) {
    const currentVal = adminTaskUserFilter.value || 'ALL';
    adminTaskUserFilter.innerHTML = userOptions;
    if ([...adminTaskUserFilter.options].some(o => o.value === currentVal)) {
      adminTaskUserFilter.value = currentVal;
    }
  }

  if (adminAttendanceUserFilter) {
    const currentVal = adminAttendanceUserFilter.value || 'ALL';
    adminAttendanceUserFilter.innerHTML = userOptions;
    if ([...adminAttendanceUserFilter.options].some(o => o.value === currentVal)) {
      adminAttendanceUserFilter.value = currentVal;
    }
  }

  const periodTaskUser = document.getElementById('period-task-user');
  if (periodTaskUser) {
    const currentVal = periodTaskUser.value || 'ALL';
    periodTaskUser.innerHTML = userOptions;
    if ([...periodTaskUser.options].some(o => o.value === currentVal)) {
      periodTaskUser.value = currentVal;
    }
  }

  const periodAttUser = document.getElementById('period-att-user');
  if (periodAttUser) {
    const currentVal = periodAttUser.value || 'ALL';
    periodAttUser.innerHTML = userOptions;
    if ([...periodAttUser.options].some(o => o.value === currentVal)) {
      periodAttUser.value = currentVal;
    }
  }

  const ticketAssignee = document.getElementById('ticket-input-assignee');
  if (ticketAssignee) {
    const currentVal = ticketAssignee.value || '';
    ticketAssignee.innerHTML = '<option value=""><i data-lucide="globe" class="w-3 h-3 inline"></i> Terbuka (Siapa saja boleh ambil)</option>' +
      allUsers.map(s => `<option value="${s.email}">${s.name} (${s.nis || '-'})</option>`).join('');
    if ([...ticketAssignee.options].some(o => o.value === currentVal)) {
      ticketAssignee.value = currentVal;
    }
  }
}

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_ENTRIES_KEY) || '[]');
}

function setEntries(entries) {
  localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
}

function getAttendanceEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_ATTENDANCE_KEY) || '[]');
}

function setAttendanceEntries(entries) {
  localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(entries));
}

function setSession(userEmail) {
  sessionStorage.setItem(STORAGE_AUTH_KEY, userEmail);
}

function getSession() {
  return sessionStorage.getItem(STORAGE_AUTH_KEY);
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_AUTH_KEY);
}

// ==================== FIRESTORE SYNC: JURNAL ====================
function buildFirestorePayload(task) {
  const user = getStoredUser() || {};
  return {
    userEmail: user.email || '',
    userName: user.name || '',
    userNis: user.nis || '',
    taskName: task.taskName,
    date: task.date,
    time: task.time,
    location: task.location,
    requester: task.requester,
    proof: task.proof,
    image: task.image || null,
    updatedAt: serverTimestamp(),
  };
}

async function fetchFirestoreEntries() {
  const user = getStoredUser();
  if (!user?.email) return [];

  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where('userEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (err) {
    console.warn('Firestore fetchEntries fallback to local:', err);
    return getEntries();
  }
}

async function saveEntryToFirestore(task) {
  try {
    const payload = buildFirestorePayload(task);
    if (task.id) {
      await updateDoc(doc(db, REPORTS_COLLECTION, task.id), payload);
      return task.id;
    }
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore saveEntry error, stored locally:', err);
    return task.id || 'task_' + Date.now();
  }
}

async function deleteEntryFromFirestore(entryId) {
  if (!entryId) return;
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, entryId));
  } catch (err) {
    console.warn('Firestore deleteEntry error:', err);
  }
}

async function loadFirestoreEntries() {
  try {
    const firestoreEntries = await fetchFirestoreEntries();
    if (firestoreEntries && firestoreEntries.length) {
      setEntries(firestoreEntries);
    }
  } catch (error) {
    console.warn('Firestore load error:', error);
  }
  renderEntries();
}

// ==================== FIRESTORE SYNC: ABSENSI ====================
function buildFirestoreAttendancePayload(att) {
  const user = getCurrentUser() || getStoredUser() || {};
  return {
    userEmail: att.userEmail || user.email || '',
    userName: att.userName || user.name || '',
    userNis: att.userNis || user.nis || '',
    date: att.date,
    status: att.status,
    location: att.location || 'Divisi IT',
    checkInTime: att.checkInTime || '',
    checkOutTime: att.checkOutTime || '',
    itTime: att.itTime || '',
    notes: att.notes || '',
    image: att.image || null,
    isKuliahDuty: att.isKuliahDuty || false,
    kuliahRoom: att.kuliahRoom || '',
    updatedAt: serverTimestamp(),
  };
}

async function fetchFirestoreAttendance() {
  const user = getStoredUser();
  if (!user?.email) return [];

  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('userEmail', '==', user.email),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (err) {
    console.warn('Firestore fetchAttendance fallback to local:', err);
    return getAttendanceEntries();
  }
}

async function saveAttendanceToFirestore(att) {
  try {
    const payload = buildFirestoreAttendancePayload(att);
    if (att.id) {
      await updateDoc(doc(db, ATTENDANCE_COLLECTION, att.id), payload);
      return att.id;
    }
    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore saveAttendance error, stored locally:', err);
    return att.id || 'att_' + Date.now();
  }
}

async function deleteAttendanceFromFirestore(recordId) {
  if (!recordId) return;
  try {
    await deleteDoc(doc(db, ATTENDANCE_COLLECTION, recordId));
  } catch (err) {
    console.warn('Firestore deleteAttendance error:', err);
  }
}

async function loadFirestoreAttendance() {
  try {
    const firestoreAtt = await fetchFirestoreAttendance();
    if (firestoreAtt && firestoreAtt.length) {
      setAttendanceEntries(firestoreAtt);
    }
  } catch (error) {
    console.warn('Firestore load attendance error:', error);
  }
  renderAttendanceRecap();
}

// ==================== AUTH FUNCTIONS ====================
function setActiveTab(tab) {
  showLogin.className = tab === 'login' 
    ? 'rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700' 
    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';

  showSignup.className = tab === 'signup'
    ? 'rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
    : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';

  loginForm.classList.toggle('hidden', tab !== 'login');
  signupForm.classList.toggle('hidden', tab !== 'signup');
  authMessage.textContent = '';
}

async function openApp() {
  authScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  fillUserFields();
  updateIdentity();
  await Promise.all([loadFirestoreEntries(), loadFirestoreAttendance()]);
  
  const currentUser = getCurrentUser();
  if (currentUser?.role === 'admin') {
    switchTab('admin-dashboard');
  } else {
    switchTab('student-tickets');
  }
}

function showAppIfAuthenticated() {
  const sessionEmail = getSession();
  const user = getCurrentUser();
  if (sessionEmail && user && user.email === sessionEmail) {
    openApp();
  }
}

function updateIdentity() {
  const user = getCurrentUser();
  identityNis.textContent = user?.nis || '-';
  identityName.textContent = user?.name || '-';
  identityEmail.textContent = user?.email || '-';
  welcomeText.textContent = user ? ` Hai, ${user.name}!` : 'Selamat datang!';

  const isAdmin = user?.role === 'admin';
  if (userRoleBadge) {
    if (isAdmin) {
      userRoleBadge.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/30 text-amber-100 border border-amber-300/40 backdrop-blur';
      userRoleBadge.innerHTML = '<span><i data-lucide="crown" class="w-3 h-3 inline text-amber-400"></i></span><span>Admin PKL</span>';
    } else {
      userRoleBadge.className = 'hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur border border-white/30 text-white';
      userRoleBadge.innerHTML = '<span><i data-lucide="graduation-cap" class="w-3 h-3 inline"></i></span><span>Siswa</span>';
    }
  }

  if (userRoleSubtext) {
    userRoleSubtext.textContent = isAdmin ? '<i data-lucide="crown" class="w-3 h-3 inline text-amber-400"></i> Administrator / Pembimbing' : '<i data-lucide="graduation-cap" class="w-3 h-3 inline"></i> Siswa Praktik Terdaftar';
  }

  // Toggle navigation groups based strictly on role
  if (adminNavGroup) adminNavGroup.classList.toggle('hidden', !isAdmin);
  if (studentNavGroup) studentNavGroup.classList.toggle('hidden', isAdmin);

  if (adminNavSection) {
    adminNavSection.classList.toggle('hidden', !isAdmin);
  }
  if (adminTaskFilterContainer) {
    adminTaskFilterContainer.classList.toggle('hidden', !isAdmin);
  }
  if (adminAttendanceFilterContainer) {
    adminAttendanceFilterContainer.classList.toggle('hidden', !isAdmin);
  }

  document.querySelectorAll('.admin-only-col').forEach(col => {
    col.classList.toggle('hidden', !isAdmin);
  });

  updateAdminFilterDropdowns();
}

function fillUserFields() {
  const user = getCurrentUser();
  if (user) {
    userNis.value = user.nis || '';
    userName.value = user.name || '';
    userEmail.value = user.email || '';
  }
}

// ==================== TICKETING SYSTEM LOGIC ====================
function getTickets() {
  const raw = localStorage.getItem(STORAGE_TICKETS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error parsing tickets:', e);
    }
  }

  // Default sample tickets
  const defaultTickets = [
    {
      id: 'ticket_1',
      title: 'Perbaikan Switch Hub & Krimping Kabel LAN Ruang Server',
      category: 'Jaringan / Hardware',
      priority: 'Tinggi',
      deadline: '2026-10-16',
      description: 'Port 5 dan 8 tidak menyala pada switch hub rack B. Cek konektor RJ-45 dan crimp ulang kabel jika putus.',
      createdBy: 'admin@pkl.local',
      createdByName: 'Admin IT / Pembimbing PKL',
      createdAt: '2026-10-12T08:00:00.000Z',
      status: 'OPEN',
      assignedToEmail: '',
      assignedToName: '',
      assignedToNis: '',
      completionNotes: '',
    },
    {
      id: 'ticket_2',
      title: 'Instalasi & Konfigurasi Driver Printer Epson L3110 di Ruang Dosen',
      category: 'Troubleshooting / Helpdesk',
      priority: 'Sedang',
      deadline: '2026-10-15',
      description: 'Dosen tidak bisa mencetak via USB. Silakan download driver terbaru Epson L3110 dan lakukan test print dokumen.',
      createdBy: 'admin@pkl.local',
      createdByName: 'Admin IT / Pembimbing PKL',
      createdAt: '2026-10-12T08:30:00.000Z',
      status: 'IN_PROGRESS',
      assignedToEmail: 'sabil@gmail.com',
      assignedToName: 'Mochamad Sabil Huda',
      assignedToNis: '2024001',
      completionNotes: '',
    },
    {
      id: 'ticket_3',
      title: 'Setup Proyektor & Audio Ruang Kuliah 3.1 Pagi',
      category: 'Bantuan Perkuliahan',
      priority: 'Urgent',
      deadline: '2026-10-12',
      description: 'Standby jam 07:00 pagi di Ruang 3.1 untuk menyalakan infocus dan mic wireless persiapan kuliah umum.',
      createdBy: 'admin@pkl.local',
      createdByName: 'Admin IT / Pembimbing PKL',
      createdAt: '2026-10-12T07:00:00.000Z',
      status: 'COMPLETED',
      assignedToEmail: 'sabil@gmail.com',
      assignedToName: 'Mochamad Sabil Huda',
      assignedToNis: '2024001',
      completionNotes: 'Proyektor dan audio telah standby jam 07:00 pagi, perkuliahan berjalan lancar.',
    }
  ];
  localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(defaultTickets));
  return defaultTickets;
}

function setTickets(tickets) {
  localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
}

function openCreateTicketModal(editId = null) {
  const modal = document.getElementById('ticket-modal');
  const titleEl = document.getElementById('ticket-modal-title');
  const editIdInput = document.getElementById('ticket-edit-id');
  const titleInput = document.getElementById('ticket-input-title');
  const catInput = document.getElementById('ticket-input-category');
  const priorityInput = document.getElementById('ticket-input-priority');
  const deadlineInput = document.getElementById('ticket-input-deadline');
  const assigneeInput = document.getElementById('ticket-input-assignee');
  const descInput = document.getElementById('ticket-input-description');

  // Populate assignee options from students list
  if (assigneeInput) {
    const students = getAllUsers().filter(u => u.role !== 'admin');
    assigneeInput.innerHTML = '<option value=""><i data-lucide="globe" class="w-3 h-3 inline"></i> Terbuka (Siapa saja boleh ambil)</option>' +
      students.map(s => `<option value="${s.email}">${s.name} (${s.nis || '-'})</option>`).join('');
  }

  if (editId) {
    const tickets = getTickets();
    const ticket = tickets.find(t => t.id === editId);
    if (ticket) {
      titleEl.innerHTML = '<span><i data-lucide="pencil" class="w-3 h-3 inline"></i></span><span>Edit Tiket Tugas</span>';
      editIdInput.value = ticket.id;
      titleInput.value = ticket.title || '';
      catInput.value = ticket.category || 'Jaringan / Hardware';
      priorityInput.value = ticket.priority || 'Sedang';
      deadlineInput.value = ticket.deadline || '';
      assigneeInput.value = ticket.assignedToEmail || '';
      descInput.value = ticket.description || '';
    }
  } else {
    titleEl.innerHTML = '<span><i data-lucide="plus" class="w-3 h-3 inline"></i></span><span>Buat Tiket Tugas Baru</span>';
    editIdInput.value = '';
    titleInput.value = '';
    catInput.selectedIndex = 0;
    priorityInput.value = 'Sedang';
    deadlineInput.value = getLocalDateString(new Date());
    assigneeInput.value = '';
    descInput.value = '';
  }

  modal.classList.remove('hidden');
}
window.openCreateTicketModal = openCreateTicketModal;

function closeTicketModal() {
  const modal = document.getElementById('ticket-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeTicketModal = closeTicketModal;

function saveTicketHandler() {
  const editId = document.getElementById('ticket-edit-id').value;
  const title = document.getElementById('ticket-input-title').value.trim();
  const category = document.getElementById('ticket-input-category').value;
  const priority = document.getElementById('ticket-input-priority').value;
  const deadline = document.getElementById('ticket-input-deadline').value;
  const assigneeEmail = document.getElementById('ticket-input-assignee').value;
  const description = document.getElementById('ticket-input-description').value.trim();

  if (!title || !description) {
    showToast('Judul dan instruksi tugas harus diisi', 'error');
    return;
  }

  const tickets = getTickets();
  const currentUser = getCurrentUser() || {};
  let assignedStudent = null;
  if (assigneeEmail) {
    assignedStudent = getAllUsers().find(u => u.email === assigneeEmail);
  }

  if (editId) {
    const idx = tickets.findIndex(t => t.id === editId);
    if (idx !== -1) {
      tickets[idx] = {
        ...tickets[idx],
        title,
        category,
        priority,
        deadline,
        description,
        assignedToEmail: assignedStudent ? assignedStudent.email : (tickets[idx].assignedToEmail || ''),
        assignedToName: assignedStudent ? assignedStudent.name : (tickets[idx].assignedToName || ''),
        assignedToNis: assignedStudent ? assignedStudent.nis : (tickets[idx].assignedToNis || ''),
        status: assignedStudent && tickets[idx].status === 'OPEN' ? 'IN_PROGRESS' : tickets[idx].status,
      };
      showToast('Tiket tugas berhasil diperbarui', 'success');
    }
  } else {
    const newTicket = {
      id: 'ticket_' + Date.now(),
      title,
      category,
      priority,
      deadline: deadline || getLocalDateString(new Date()),
      description,
      createdBy: currentUser.email || 'admin@pkl.local',
      createdByName: currentUser.name || 'Admin IT',
      createdAt: new Date().toISOString(),
      status: assignedStudent ? 'IN_PROGRESS' : 'OPEN',
      assignedToEmail: assignedStudent ? assignedStudent.email : '',
      assignedToName: assignedStudent ? assignedStudent.name : '',
      assignedToNis: assignedStudent ? assignedStudent.nis : '',
      completionNotes: '',
    };
    tickets.unshift(newTicket);
    showToast('Tiket tugas baru berhasil diterbitkan!', 'success');
  }

  setTickets(tickets);
  closeTicketModal();
  renderAdminTickets();
  renderAdminDashboard();
}
window.saveTicketHandler = saveTicketHandler;

function deleteTicket(ticketId) {
  if (confirm('⚠️ Apakah Anda yakin ingin menghapus tiket tugas ini?')) {
    let tickets = getTickets();
    tickets = tickets.filter(t => t.id !== ticketId);
    setTickets(tickets);
    renderAdminTickets();
    renderAdminDashboard();
    showToast('Tiket berhasil dihapus', 'success');
  }
}
window.deleteTicket = deleteTicket;

function setAdminTicketFilter(filter) {
  currentAdminTicketFilter = filter;
  document.querySelectorAll('.admin-ticket-filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.className = 'admin-ticket-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white';
    } else {
      btn.className = 'admin-ticket-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200';
    }
  });
  renderAdminTickets();
}
window.setAdminTicketFilter = setAdminTicketFilter;

function setStudentTicketFilter(filter) {
  currentStudentTicketFilter = filter;
  document.querySelectorAll('.student-ticket-filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.className = 'student-ticket-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white';
    } else {
      btn.className = 'student-ticket-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200';
    }
  });
  renderStudentTickets();
}
window.setStudentTicketFilter = setStudentTicketFilter;

function claimTicket(ticketId) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  ticket.status = 'IN_PROGRESS';
  ticket.assignedToEmail = currentUser.email;
  ticket.assignedToName = currentUser.name;
  ticket.assignedToNis = currentUser.nis || '';
  ticket.takenAt = new Date().toISOString();

  setTickets(tickets);
  renderStudentTickets();
  showToast(`Tugas "${ticket.title}" berhasil Anda ambil! Segera kerjakan!`, 'success');
}
window.claimTicket = claimTicket;

function openCompleteTicketModal(ticketId) {
  const modal = document.getElementById('complete-ticket-modal');
  const idInput = document.getElementById('complete-ticket-id');
  const titlePreview = document.getElementById('complete-ticket-title-preview');
  const notesInput = document.getElementById('complete-ticket-notes');

  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  idInput.value = ticket.id;
  titlePreview.textContent = `Pekerjaan: ${ticket.title}`;
  notesInput.value = '';
  modal.classList.remove('hidden');
}
window.openCompleteTicketModal = openCompleteTicketModal;

function closeCompleteTicketModal() {
  const modal = document.getElementById('complete-ticket-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeCompleteTicketModal = closeCompleteTicketModal;

function submitCompleteTicketHandler() {
  const ticketId = document.getElementById('complete-ticket-id').value;
  const notes = document.getElementById('complete-ticket-notes').value.trim();
  const autoJournal = document.getElementById('complete-ticket-auto-journal').checked;
  const currentUser = getCurrentUser();

  if (!notes) {
    showToast('Tuliskan ringkasan hasil pekerjaan', 'error');
    return;
  }

  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  ticket.status = 'COMPLETED';
  ticket.completionNotes = notes;
  ticket.completedAt = new Date().toISOString();
  setTickets(tickets);

  // Auto add to Journal if checked
  if (autoJournal && currentUser) {
    const today = getLocalDateString(new Date());
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const newEntry = {
      id: 'task_' + Date.now(),
      userEmail: currentUser.email,
      userName: currentUser.name,
      userNis: currentUser.nis || '',
      taskName: ticket.title,
      date: today,
      time: timeStr,
      location: ticket.category || 'Divisi IT',
      requester: ticket.createdByName || 'Pembimbing PKL',
      proof: `[Penyelesaian Tiket Tugas PKL]\n${notes}`,
      image: null,
    };
    const entries = getEntries();
    entries.unshift(newEntry);
    setEntries(entries);
    saveEntryToFirestore(newEntry);
  }

  closeCompleteTicketModal();
  renderStudentTickets();
  showToast('Tugas berhasil diselesaikan' + (autoJournal ? ' dan otomatis masuk ke Jurnal Pekerjaan!' : '!'), 'success');
}
window.submitCompleteTicketHandler = submitCompleteTicketHandler;

function renderAdminTickets() {
  const container = document.getElementById('admin-tickets-container');
  if (!container) return;
  const tickets = getTickets();

  // Badges count
  const allCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const progCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const compCount = tickets.filter(t => t.status === 'COMPLETED').length;

  const bAll = document.getElementById('admin-ticket-badge-all');
  const bOpen = document.getElementById('admin-ticket-badge-open');
  const bProg = document.getElementById('admin-ticket-badge-progress');
  const bComp = document.getElementById('admin-ticket-badge-completed');
  if (bAll) bAll.textContent = allCount;
  if (bOpen) bOpen.textContent = openCount;
  if (bProg) bProg.textContent = progCount;
  if (bComp) bComp.textContent = compCount;

  let filtered = [...tickets];
  if (currentAdminTicketFilter !== 'ALL') {
    filtered = filtered.filter(t => t.status === currentAdminTicketFilter);
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="sm:col-span-2 p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 text-center border border-dashed border-slate-300 dark:border-slate-700">
        <p class="text-3xl mb-2"><i data-lucide="ticket" class="w-8 h-8 inline text-indigo-400"></i></p>
        <p class="font-bold text-slate-700 dark:text-slate-300">Tidak ada tiket pada kategori ini</p>
        <button type="button" onclick="openCreateTicketModal()" class="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"><i data-lucide="plus" class="w-4 h-4 inline"></i> Buat Tiket</button>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(t => {
    let priorityBadge = '';
    if (t.priority === 'Urgent') {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300"><i data-lucide="circle" class="w-3 h-3 inline text-rose-500 fill-rose-500"></i> Urgent</span>';
    } else if (t.priority === 'Tinggi') {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300"><i data-lucide="circle" class="w-3 h-3 inline text-amber-500 fill-amber-500"></i> Tinggi</span>';
    } else if (t.priority === 'Sedang') {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300"><i data-lucide="circle" class="w-3 h-3 inline text-blue-400 fill-blue-400"></i> Sedang</span>';
    } else {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300"><i data-lucide="circle" class="w-3 h-3 inline text-emerald-500 fill-emerald-500"></i> Rendah</span>';
    }

    let statusBadge = '';
    if (t.status === 'OPEN') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><i data-lucide="circle" class="w-3 h-3 inline text-emerald-500 fill-emerald-500"></i> Tersedia</span>';
    } else if (t.status === 'IN_PROGRESS') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200"><i data-lucide="hourglass" class="w-3 h-3 inline"></i> Dikerjakan</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Selesai</span>';
    }

    let assigneeInfo = '';
    if (t.assignedToName) {
      assigneeInfo = `
        <div class="mt-3 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
          <p class="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <span><i data-lucide="user" class="w-3 h-3 inline"></i> Dikerjakan oleh:</span>
            <span>${t.assignedToName} (${t.assignedToNis || '-'})</span>
          </p>
          ${t.completionNotes ? `<p class="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap"><span class="font-bold">Hasil:</span> ${t.completionNotes}</p>` : ''}
        </div>`;
    }

    return `
      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold text-slate-500">${t.category || 'Tugas PKL'}</span>
            <div class="flex items-center gap-1.5">${priorityBadge}</div>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${t.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1"><i data-lucide="calendar" class="w-3 h-3 inline"></i> Target Deadline: <strong>${formatDayDate(t.deadline)}</strong></p>
          <p class="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-750">${t.description && t.description.length > 120 ? t.description.slice(0, 120) + "..." : t.description}</p>
          ${assigneeInfo}
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>${statusBadge}</div>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="openCreateTicketModal('${t.id}')" class="px-2.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200"><i data-lucide="pencil" class="w-3 h-3 inline"></i> Edit</button>
            <button type="button" onclick="deleteTicket('${t.id}')" class="px-2.5 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200"><i data-lucide="trash-2" class="w-3 h-3 inline"></i></button>
          </div>
        </div>
      </div>
    `;
  }}).join('');
  refreshIcons();
}

function renderStudentTickets() {
  const container = document.getElementById('student-tickets-container');
  if (!container) return;
  const tickets = getTickets();
  const currentUser = getCurrentUser();

  const myEmail = currentUser?.email || '';
  const badgeEl = document.getElementById('student-tickets-summary-badge');
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const myProgCount = tickets.filter(t => t.status === 'IN_PROGRESS' && t.assignedToEmail === myEmail).length;

  if (badgeEl) {
    badgeEl.textContent = `${openCount} Tugas Tersedia • ${myProgCount} Sedang Dikerjakan`;
  }

  let filtered = [...tickets];
  if (currentStudentTicketFilter === 'OPEN') {
    filtered = filtered.filter(t => t.status === 'OPEN');
  } else if (currentStudentTicketFilter === 'MY_TASK') {
    filtered = filtered.filter(t => t.status === 'IN_PROGRESS' && t.assignedToEmail === myEmail);
  } else if (currentStudentTicketFilter === 'COMPLETED') {
    filtered = filtered.filter(t => t.status === 'COMPLETED');
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="sm:col-span-2 p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 text-center border border-dashed border-slate-300 dark:border-slate-700">
        <p class="text-3xl mb-2"><i data-lucide="check-circle" class="w-8 h-8 inline text-emerald-500"></i></p>
        <p class="font-bold text-slate-700 dark:text-slate-300">Tidak ada tiket tugas pada kategori ini</p>
        <p class="text-xs text-slate-400 mt-1">Silakan cek berkala tugas yang diberikan pembimbing.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(t => {
    let priorityBadge = '';
    if (t.priority === 'Urgent') {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300"><i data-lucide="circle" class="w-3 h-3 inline text-rose-500 fill-rose-500"></i> Urgent</span>';
    } else if (t.priority === 'Tinggi') {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300"><i data-lucide="circle" class="w-3 h-3 inline text-amber-500 fill-amber-500"></i> Tinggi</span>';
    } else {
      priorityBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300"><i data-lucide="circle" class="w-3 h-3 inline text-blue-400 fill-blue-400"></i> Normal</span>';
    }

    let actionBtn = '';
    if (t.status === 'OPEN') {
      actionBtn = `<button type="button" onclick="claimTicket('${t.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"><i data-lucide="hand" class="w-4 h-4 inline"></i> Ambil Tugas</button>`;
    } else if (t.status === 'IN_PROGRESS' && t.assignedToEmail === myEmail) {
      actionBtn = `<button type="button" onclick="openCompleteTicketModal('${t.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Selesaikan Tugas</button>`;
    } else if (t.status === 'IN_PROGRESS') {
      actionBtn = `<span class="text-xs font-semibold text-slate-400"><i data-lucide="hourglass" class="w-3 h-3 inline"></i> Dikerjakan: ${t.assignedToName}</span>`;
    } else {
      actionBtn = `<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Tugas Selesai</span>`;
    }

    return `
      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold text-slate-500">${t.category}</span>
            ${priorityBadge}
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${t.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1"><i data-lucide="calendar" class="w-3 h-3 inline"></i> Target: <strong>${formatDayDate(t.deadline)}</strong></p>
          <p class="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-750">${t.description && t.description.length > 120 ? t.description.slice(0, 120) + "..." : t.description}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span class="text-[11px] text-slate-400">Oleh: ${t.createdByName || 'Pembimbing'}</span>
          <div>${actionBtn}</div>
        </div>
      </div>
    `;
  })).join('');
  if(window.lucide) lucide.createIcons();

}
// ==================== ADMIN DASHBOARD ====================
function renderAdminDashboard() {
  const allUsers = getAllUsers().filter(u => u.role !== 'admin');
  const allTasks = getEntries();
  const allAtt = getAttendanceEntries();
  const allTickets = getTickets();

  const activeTicketsCount = allTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  if (adminStatStudents) adminStatStudents.textContent = allUsers.length;
  if (adminStatTasks) adminStatTasks.textContent = allTasks.length;
  if (adminStatAttendance) adminStatAttendance.textContent = allAtt.length;
  if (adminStatTicketsActive) adminStatTicketsActive.textContent = activeTicketsCount;

  // Mini student list
  if (adminStudentsTableBody) {
    if (!allUsers.length) {
      adminStudentsTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Belum ada siswa terdaftar</td></tr>`;
    } else {
      adminStudentsTableBody.innerHTML = allUsers.map((u, i) => {
        const studentTasksCount = allTasks.filter(e => e.userEmail === u.email).length;
        const studentAttCount = allAtt.filter(e => e.userEmail === u.email).length;

        return `
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <td class="p-3 text-center font-bold text-slate-500">${i + 1}</td>
            <td class="p-3 font-semibold text-slate-900 dark:text-white">${u.name}</td>
            <td class="p-3 font-mono text-slate-600 dark:text-slate-300">${u.nis || '-'}</td>
            <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">${studentTasksCount}</span></td>
            <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">${studentAttCount}</span></td>
            <td class="p-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-1.5">
                <button onclick="viewStudentAttendance('${u.email}')" class="px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 text-xs font-bold">Absen</button>
                <button onclick="viewStudentTasks('${u.email}')" class="px-2 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 text-xs font-bold">Jurnal</button>
              </div>
            </td>
          </tr>
        `;
      }}).join('');
  refreshIcons();
    }
  }

  // Recent tickets preview
  const recentTicketsContainer = document.getElementById('admin-dashboard-recent-tickets');
  if (recentTicketsContainer) {
    const activeList = allTickets.filter(t => t.status !== 'COMPLETED').slice(0, 4);
    if (!activeList.length) {
      recentTicketsContainer.innerHTML = `
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p class="text-xl mb-1"><i data-lucide="check-circle" class="w-8 h-8 inline text-emerald-500"></i></p>
          <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Semua tiket tugas telah selesai</p>
        </div>`;
    } else {
      recentTicketsContainer.innerHTML = activeList.map(t => `
        <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex items-start justify-between gap-3">
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${t.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}">${t.priority}</span>
            <h5 class="text-xs font-bold text-slate-900 dark:text-white mt-1">${t.title}</h5>
            <p class="text-[11px] text-slate-400 mt-0.5">${t.assignedToName ? `Dikerjakan: ${t.assignedToName}` : '<i data-lucide="circle" class="w-3 h-3 inline text-emerald-500 fill-emerald-500"></i> Tersedia'}</p>
          </div>
          <button type="button" onclick="switchTab('admin-tickets')" class="text-xs text-indigo-600 hover:underline flex-shrink-0 font-bold">Detail</button>
        </div>
      `).join('');
    }
  }
}

window.viewStudentAttendance = function(email) {
  const userSelect = document.getElementById('period-att-user');
  if (userSelect) userSelect.value = email;
  switchTab('admin-period-attendance');
  renderAdminPeriodAttendance();
};

window.viewStudentTasks = function(email) {
  const userSelect = document.getElementById('period-task-user');
  if (userSelect) userSelect.value = email;
  switchTab('admin-period-tasks');
  renderAdminPeriodTasks();
};

// ==================== ADMIN REKAP JURNAL PER PERIODE ====================
function renderAdminPeriodTasks() {
  const tableBody = document.getElementById('period-tasks-table-body');
  if (!tableBody) return;
  const startInput = document.getElementById('period-task-start');
  const endInput = document.getElementById('period-task-end');
  const userSelect = document.getElementById('period-task-user');
  const searchInput = document.getElementById('period-task-search');
  const counterBadge = document.getElementById('period-task-counter-badge');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const allEntries = getEntries();
  let filtered = [...allEntries];

  if (startDate) {
    filtered = filtered.filter(e => (e.date || '') >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(e => (e.date || '') <= endDate);
  }
  if (selectedUser && selectedUser !== 'ALL') {
    filtered = filtered.filter(e => e.userEmail === selectedUser);
  }
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.taskName || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.requester || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm) ||
      (e.userNis || '').toLowerCase().includes(searchTerm) ||
      (e.proof || '').toLowerCase().includes(searchTerm)
    );
  }

  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (counterBadge) {
    counterBadge.textContent = `Ditemukan: ${filtered.length} catatan`;
  }

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400 font-semibold">Tidak ada catatan pekerjaan pada periode dan kriteria ini</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map((e, idx) => {
    const rawIndex = allEntries.indexOf(e);
    const photoCell = e.image 
      ? `<button type="button" onclick="openImageModal('${e.image}', '${e.taskName}')" class="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200">Lihat</button>`
      : '<span class="text-slate-400">-</span>';

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <td class="p-3 text-center font-bold text-slate-500">${idx + 1}</td>
        <td class="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
          <div>${e.userName || 'Siswa'}</div>
          <div class="text-[11px] font-mono text-slate-400">${e.userNis || '-'}</div>
        </td>
        <td class="p-3 whitespace-nowrap">
          <div class="font-bold text-slate-800 dark:text-slate-200">${formatDayDate(e.date)}</div>
          <div class="text-xs text-slate-400 font-mono">${formatTime(e.time)}</div>
        </td>
        <td class="p-3 font-bold text-slate-900 dark:text-white">${e.taskName}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300">${e.location}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300">${e.requester}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title="${e.proof}">${e.proof}</td>
        <td class="p-3 text-center whitespace-nowrap">${photoCell}</td>
        <td class="p-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editEntry(${rawIndex})" class="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200" title="Edit Catatan"><i data-lucide="pencil" class="w-3 h-3 inline"></i></button>
            <button onclick="deleteEntry(${rawIndex})" class="px-2.5 py-1 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200" title="Hapus Catatan"><i data-lucide="trash-2" class="w-3 h-3 inline"></i></button>
          </div>
        </td>
      </tr>
    `;
  }}).join('');
  refreshIcons();
}
window.renderAdminPeriodTasks = renderAdminPeriodTasks;

function setPeriodTaskPreset(type) {
  const startInput = document.getElementById('period-task-start');
  const endInput = document.getElementById('period-task-end');
  const now = new Date();
  const todayStr = getLocalDateString(now);

  if (type === 'THIS_MONTH') {
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    if (startInput) startInput.value = firstDay;
    if (endInput) endInput.value = todayStr;
  } else if (type === 'LAST_7_DAYS') {
    const past7 = new Date();
    past7.setDate(past7.getDate() - 7);
    if (startInput) startInput.value = getLocalDateString(past7);
    if (endInput) endInput.value = todayStr;
  } else if (type === 'LAST_30_DAYS') {
    const past30 = new Date();
    past30.setDate(past30.getDate() - 30);
    if (startInput) startInput.value = getLocalDateString(past30);
    if (endInput) endInput.value = todayStr;
  } else if (type === 'ALL_TIME') {
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
  }
  renderAdminPeriodTasks();
}
window.setPeriodTaskPreset = setPeriodTaskPreset;

function exportPeriodTasksExcel() {
  const startInput = document.getElementById('period-task-start');
  const endInput = document.getElementById('period-task-end');
  const userSelect = document.getElementById('period-task-user');
  const searchInput = document.getElementById('period-task-search');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [...getEntries()];
  if (startDate) filtered = filtered.filter(e => (e.date || '') >= startDate);
  if (endDate) filtered = filtered.filter(e => (e.date || '') <= endDate);
  if (selectedUser !== 'ALL') filtered = filtered.filter(e => e.userEmail === selectedUser);
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.taskName || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.requester || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm)
    );
  }
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!filtered.length) {
    showToast('Tidak ada data catatan pada periode ini untuk diekspor', 'error');
    return;
  }

  const headers = ['No', 'Nama Siswa', 'NIS', 'Email', 'Tanggal', 'Jam', 'Nama Pekerjaan', 'Lokasi', 'Pemohon / Pembimbing', 'Bukti / Hasil Kerja'];
  const rows = filtered.map((e, idx) => [
    idx + 1,
    `"${(e.userName || '').replace(/"/g, '""')}"`,
    `"${(e.userNis || '').replace(/"/g, '""')}"`,
    `"${(e.userEmail || '').replace(/"/g, '""')}"`,
    `"${e.date || ''}"`,
    `"${e.time || ''}"`,
    `"${(e.taskName || '').replace(/"/g, '""')}"`,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    `"${(e.requester || '').replace(/"/g, '""')}"`,
    `"${(e.proof || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const filename = `rekap-jurnal-periode-${startDate || 'awal'}-sd-${endDate || 'akhir'}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  showToast('Export Excel Jurnal Periode berhasil diunduh', 'success');
}
window.exportPeriodTasksExcel = exportPeriodTasksExcel;

function exportPeriodTasksPdf() {
  const startInput = document.getElementById('period-task-start');
  const endInput = document.getElementById('period-task-end');
  const userSelect = document.getElementById('period-task-user');
  const searchInput = document.getElementById('period-task-search');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [...getEntries()];
  if (startDate) filtered = filtered.filter(e => (e.date || '') >= startDate);
  if (endDate) filtered = filtered.filter(e => (e.date || '') <= endDate);
  if (selectedUser !== 'ALL') filtered = filtered.filter(e => e.userEmail === selectedUser);
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.taskName || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.requester || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm)
    );
  }
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!filtered.length) {
    showToast('Tidak ada data catatan pada periode ini untuk dicetak', 'error');
    return;
  }

  const printWindow = window.open('', '_blank');
  const studentInfo = selectedUser !== 'ALL' 
    ? (filtered[0]?.userName ? `${filtered[0].userName} (${filtered[0].userNis || '-'})` : selectedUser)
    : 'Semua Siswa PKL';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rekap Jurnal Periode - ${startDate || 'Awal'} s/d ${endDate || 'Sekarang'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 12px; }
        h1 { text-align: center; color: #1e40af; font-size: 18px; margin-bottom: 5px; }
        .meta { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <h1>REKAPITULASI JURNAL PEKERJAAN PKL</h1>
      <div class="meta">
        <strong>Periode:</strong> ${startDate ? formatDate(startDate) : 'Awal'} s/d ${endDate ? formatDate(endDate) : 'Sekarang'} | 
        <strong>Siswa:</strong> ${studentInfo} | 
        <strong>Total:</strong> ${filtered.length} Catatan
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th>Nama Siswa</th>
            <th>Tanggal & Jam</th>
            <th>Nama Pekerjaan</th>
            <th>Lokasi</th>
            <th>Pemohon</th>
            <th>Rincian Hasil Kerja</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((e, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td><strong>${e.userName || '-'}</strong><br><span style="font-size: 10px; color: #64748b;">${e.userNis || '-'}</span></td>
              <td>${formatDate(e.date)}<br><span style="font-size: 10px; color: #64748b;">${formatTime(e.time)}</span></td>
              <td><strong>${e.taskName}</strong></td>
              <td>${e.location}</td>
              <td>${e.requester}</td>
              <td style="white-space: pre-wrap;">${e.proof}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
window.exportPeriodTasksPdf = exportPeriodTasksPdf;

// ==================== ADMIN REKAP ABSENSI PER PERIODE ====================
function renderAdminPeriodAttendance() {
  const tableBody = document.getElementById('period-attendance-table-body');
  if (!tableBody) return;
  const startInput = document.getElementById('period-att-start');
  const endInput = document.getElementById('period-att-end');
  const userSelect = document.getElementById('period-att-user');
  const searchInput = document.getElementById('period-att-search');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const allEntries = getAttendanceEntries();
  let filtered = [...allEntries];

  if (startDate) {
    filtered = filtered.filter(e => (e.date || '') >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(e => (e.date || '') <= endDate);
  }
  if (selectedUser && selectedUser !== 'ALL') {
    filtered = filtered.filter(e => e.userEmail === selectedUser);
  }
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.status || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.notes || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm) ||
      (e.userNis || '').toLowerCase().includes(searchTerm)
    );
  }

  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // Calculate dynamic KPIs for this period
  const countHadir = filtered.filter(e => e.status === 'Hadir').length;
  const countKuliah = filtered.filter(e => e.status === 'Bantuan Perkuliahan').length;
  const countSituasional = filtered.filter(e => e.status === 'Hadir Situasional').length;
  const countIzin = filtered.filter(e => e.status === 'Izin').length;
  const countSakit = filtered.filter(e => e.status === 'Sakit').length;
  const countLibur = filtered.filter(e => e.status === 'Libur Nasional').length;

  const totalHadirFisik = countHadir + countKuliah + countSituasional;
  const totalHariKerja = totalHadirFisik + countIzin + countSakit;
  const percentage = totalHariKerja > 0 ? Math.round((totalHadirFisik / totalHariKerja) * 100) : 100;

  const kpiHadir = document.getElementById('period-count-hadir');
  const kpiKuliah = document.getElementById('period-count-kuliah');
  const kpiSituasi = document.getElementById('period-count-situasional');
  const kpiIzin = document.getElementById('period-count-izin');
  const kpiSakit = document.getElementById('period-count-sakit');
  const kpiLibur = document.getElementById('period-count-libur');
  const kpiPct = document.getElementById('period-attendance-percentage');

  if (kpiHadir) kpiHadir.textContent = countHadir;
  if (kpiKuliah) kpiKuliah.textContent = countKuliah;
  if (kpiSituasi) kpiSituasi.textContent = countSituasional;
  if (kpiIzin) kpiIzin.textContent = countIzin;
  if (kpiSakit) kpiSakit.textContent = countSakit;
  if (kpiLibur) kpiLibur.textContent = countLibur;
  if (kpiPct) kpiPct.textContent = `${percentage}%`;

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400 font-semibold">Tidak ada data presensi kehadiran pada periode dan filter yang dipilih</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map((e, idx) => {
    const rawIndex = allEntries.indexOf(e);
    let statusBadge = '';
    if (e.status === 'Hadir' || e.status === 'Bantuan Perkuliahan' || e.status === 'Hadir Situasional') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Hadir</span>';
    } else if (e.status === 'Izin') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Izin</span>';
    } else if (e.status === 'Sakit') {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Sakit</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300"><i data-lucide="flag" class="w-3 h-3 inline"></i> Libur</span>';
    }

    let timeDisplay = '-';
    if (e.checkInTime && e.checkInTime !== '-') {
      timeDisplay = `${e.checkInTime} – ${e.checkOutTime || '16:00'}`;
      if (e.itTime) {
        timeDisplay += ` (IT: ${e.itTime})`;
      }
    }

    const photoCell = e.image 
      ? `<button type="button" onclick="openImageModal('${e.image}', 'Presensi ${e.date}')" class="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200">Foto</button>`
      : '<span class="text-slate-400">-</span>';

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <td class="p-3 text-center font-bold text-slate-500">${idx + 1}</td>
        <td class="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
          <div>${e.userName || 'Siswa'}</div>
          <div class="text-[11px] font-mono text-slate-400">${e.userNis || '-'}</div>
        </td>
        <td class="p-3 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">${formatDayDate(e.date)}</td>
        <td class="p-3 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">${timeDisplay}</td>
        <td class="p-3 whitespace-nowrap">${statusBadge}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300">${e.location || '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title="${e.notes || ''}">${e.notes || '-'}</td>
        <td class="p-3 text-center whitespace-nowrap">${photoCell}</td>
        <td class="p-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editAttendance(${rawIndex})" class="px-2 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200" title="Edit Presensi"><i data-lucide="pencil" class="w-3 h-3 inline"></i></button>
            <button onclick="deleteAttendance(${rawIndex})" class="px-2 py-1 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200" title="Hapus Presensi"><i data-lucide="trash-2" class="w-3 h-3 inline"></i></button>
          </div>
        </td>
      </tr>
    `;
  }}).join('');
  refreshIcons();
}
window.renderAdminPeriodAttendance = renderAdminPeriodAttendance;

function setPeriodAttPreset(type) {
  const startInput = document.getElementById('period-att-start');
  const endInput = document.getElementById('period-att-end');
  const now = new Date();
  const todayStr = getLocalDateString(now);

  if (type === 'THIS_MONTH') {
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    if (startInput) startInput.value = firstDay;
    if (endInput) endInput.value = todayStr;
  } else if (type === 'LAST_7_DAYS') {
    const past7 = new Date();
    past7.setDate(past7.getDate() - 7);
    if (startInput) startInput.value = getLocalDateString(past7);
    if (endInput) endInput.value = todayStr;
  } else if (type === 'LAST_30_DAYS') {
    const past30 = new Date();
    past30.setDate(past30.getDate() - 30);
    if (startInput) startInput.value = getLocalDateString(past30);
    if (endInput) endInput.value = todayStr;
  } else if (type === 'ALL_TIME') {
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
  }
  renderAdminPeriodAttendance();
}
window.setPeriodAttPreset = setPeriodAttPreset;

function exportPeriodAttendanceExcel() {
  const startInput = document.getElementById('period-att-start');
  const endInput = document.getElementById('period-att-end');
  const userSelect = document.getElementById('period-att-user');
  const searchInput = document.getElementById('period-att-search');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [...getAttendanceEntries()];
  if (startDate) filtered = filtered.filter(e => (e.date || '') >= startDate);
  if (endDate) filtered = filtered.filter(e => (e.date || '') <= endDate);
  if (selectedUser !== 'ALL') filtered = filtered.filter(e => e.userEmail === selectedUser);
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.status || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.notes || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm)
    );
  }
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!filtered.length) {
    showToast('Tidak ada data absensi pada periode ini untuk diekspor', 'error');
    return;
  }

  const headers = ['No', 'Nama Siswa', 'NIS', 'Email', 'Tanggal', 'Status', 'Jam Masuk', 'Jam Pulang', 'Jam Tiba IT', 'Lokasi / Divisi', 'Keterangan'];
  const rows = filtered.map((e, idx) => [
    idx + 1,
    `"${(e.userName || '').replace(/"/g, '""')}"`,
    `"${(e.userNis || '').replace(/"/g, '""')}"`,
    `"${(e.userEmail || '').replace(/"/g, '""')}"`,
    `"${e.date || ''}"`,
    `"${e.status || ''}"`,
    `"${e.checkInTime || '-'}"`,
    `"${e.checkOutTime || '-'}"`,
    `"${e.itTime || '-'}"`,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const filename = `rekap-absensi-periode-${startDate || 'awal'}-sd-${endDate || 'akhir'}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  showToast('Export Excel Absensi Periode berhasil diunduh', 'success');
}
window.exportPeriodAttendanceExcel = exportPeriodAttendanceExcel;

function exportPeriodAttendancePdf() {
  const startInput = document.getElementById('period-att-start');
  const endInput = document.getElementById('period-att-end');
  const userSelect = document.getElementById('period-att-user');
  const searchInput = document.getElementById('period-att-search');

  const startDate = startInput ? startInput.value : '';
  const endDate = endInput ? endInput.value : '';
  const selectedUser = userSelect ? userSelect.value : 'ALL';
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [...getAttendanceEntries()];
  if (startDate) filtered = filtered.filter(e => (e.date || '') >= startDate);
  if (endDate) filtered = filtered.filter(e => (e.date || '') <= endDate);
  if (selectedUser !== 'ALL') filtered = filtered.filter(e => e.userEmail === selectedUser);
  if (searchTerm) {
    filtered = filtered.filter(e =>
      (e.status || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.notes || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm)
    );
  }
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!filtered.length) {
    showToast('Tidak ada data absensi pada periode ini untuk dicetak', 'error');
    return;
  }

  const printWindow = window.open('', '_blank');
  const studentInfo = selectedUser !== 'ALL' 
    ? (filtered[0]?.userName ? `${filtered[0].userName} (${filtered[0].userNis || '-'})` : selectedUser)
    : 'Semua Siswa PKL';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rekap Absensi Periode - ${startDate || 'Awal'} s/d ${endDate || 'Sekarang'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 12px; }
        h1 { text-align: center; color: #1e40af; font-size: 18px; margin-bottom: 5px; }
        .meta { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <h1>REKAPITULASI PRESENSI KEHADIRAN SISWA PKL</h1>
      <div class="meta">
        <strong>Periode:</strong> ${startDate ? formatDate(startDate) : 'Awal'} s/d ${endDate ? formatDate(endDate) : 'Sekarang'} | 
        <strong>Siswa:</strong> ${studentInfo} | 
        <strong>Total Presensi:</strong> ${filtered.length} Hari
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th>Nama Siswa</th>
            <th>Hari & Tanggal</th>
            <th>Waktu Presensi</th>
            <th>Status</th>
            <th>Lokasi / Divisi</th>
            <th>Keterangan / Keperluan</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((e, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td><strong>${e.userName || '-'}</strong><br><span style="font-size: 10px; color: #64748b;">${e.userNis || '-'}</span></td>
              <td>${formatDayDate(e.date)}</td>
              <td>${e.checkInTime !== '-' ? `${e.checkInTime} - ${e.checkOutTime || '16:00'}${e.itTime ? ` (IT: ${e.itTime})` : ''}` : '-'}</td>
              <td><strong>${e.status}</strong></td>
              <td>${e.location || '-'}</td>
              <td>${e.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
window.exportPeriodAttendancePdf = exportPeriodAttendancePdf;

// ==================== ADMIN USER MANAGEMENT (CRUD SISWA) ====================
function renderAdminUsers() {
  const tableBody = document.getElementById('admin-crud-users-table-body');
  if (!tableBody) return;
  const users = getAllUsers();
  const allTasks = getEntries();
  const allAtt = getAttendanceEntries();

  tableBody.innerHTML = users.map((u, idx) => {
    const isMainAdmin = u.role === 'admin';
    const taskCount = allTasks.filter(t => t.userEmail === u.email).length;
    const attCount = allAtt.filter(a => a.userEmail === u.email).length;

    const roleBadge = isMainAdmin 
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300"><i data-lucide="crown" class="w-3 h-3 inline text-amber-400"></i> Admin</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><i data-lucide="graduation-cap" class="w-3 h-3 inline"></i> Siswa</span>';

    const deleteBtn = isMainAdmin
      ? `<span class="text-[11px] text-slate-400 font-semibold" title="Akun admin utama tidak dapat dihapus">Utama</span>`
      : `<button type="button" onclick="deleteAdminUser(${idx})" class="px-2.5 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200"><i data-lucide="trash-2" class="w-3 h-3 inline"></i> Hapus</button>`;

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <td class="p-3 text-center font-bold text-slate-500">${idx + 1}</td>
        <td class="p-3 font-semibold text-slate-900 dark:text-white">
          <div class="flex items-center gap-1.5">${u.name} ${roleBadge}</div>
        </td>
        <td class="p-3 font-mono text-slate-600 dark:text-slate-300">${u.nis || '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-300">${u.email}</td>
        <td class="p-3 font-mono text-xs text-slate-600 dark:text-slate-300">${u.password || '••••••'}</td>
        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">${taskCount}</span></td>
        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">${attCount}</span></td>
        <td class="p-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button type="button" onclick="openEditUserModal(${idx})" class="px-2.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200"><i data-lucide="pencil" class="w-3 h-3 inline"></i> Edit</button>
            ${deleteBtn}
          </div>
        </td>
      </tr>
    `;
  }}).join('');
  refreshIcons();
}
window.renderAdminUsers = renderAdminUsers;

function openAddUserModal() {
  const modal = document.getElementById('admin-user-modal');
  const title = document.getElementById('admin-user-modal-title');
  const editIdxInput = document.getElementById('admin-user-edit-index');
  const nisInput = document.getElementById('admin-user-nis');
  const nameInput = document.getElementById('admin-user-name');
  const emailInput = document.getElementById('admin-user-email');
  const passInput = document.getElementById('admin-user-password');

  if (title) title.innerHTML = '<span><i data-lucide="plus" class="w-3 h-3 inline"></i></span><span>Tambah Akun Siswa Baru</span>';
  if (editIdxInput) editIdxInput.value = '';
  if (nisInput) nisInput.value = '';
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';

  if (modal) modal.classList.remove('hidden');
}
window.openAddUserModal = openAddUserModal;

function openEditUserModal(index) {
  const users = getAllUsers();
  const u = users[index];
  if (!u) return;

  const modal = document.getElementById('admin-user-modal');
  const title = document.getElementById('admin-user-modal-title');
  const editIdxInput = document.getElementById('admin-user-edit-index');
  const nisInput = document.getElementById('admin-user-nis');
  const nameInput = document.getElementById('admin-user-name');
  const emailInput = document.getElementById('admin-user-email');
  const passInput = document.getElementById('admin-user-password');

  if (title) title.innerHTML = '<span><i data-lucide="pencil" class="w-3 h-3 inline"></i></span><span>Edit Akun Siswa</span>';
  if (editIdxInput) editIdxInput.value = String(index);
  if (nisInput) nisInput.value = u.nis || '';
  if (nameInput) nameInput.value = u.name || '';
  if (emailInput) emailInput.value = u.email || '';
  if (passInput) passInput.value = u.password || '';

  if (modal) modal.classList.remove('hidden');
}
window.openEditUserModal = openEditUserModal;

function closeAdminUserModal() {
  const modal = document.getElementById('admin-user-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeAdminUserModal = closeAdminUserModal;

function saveAdminUserHandler() {
  const editIdx = document.getElementById('admin-user-edit-index').value;
  const nis = document.getElementById('admin-user-nis').value.trim();
  const name = document.getElementById('admin-user-name').value.trim();
  const email = document.getElementById('admin-user-email').value.trim();
  const password = document.getElementById('admin-user-password').value.trim();

  if (!nis || !name || !email || !password) {
    showToast('Semua kolom akun siswa wajib diisi', 'error');
    return;
  }
  if (!validateEmail(email)) {
    showToast('Format email tidak valid', 'error');
    return;
  }

  const users = getAllUsers();

  if (editIdx !== '') {
    const idx = parseInt(editIdx, 10);
    // Cek duplikasi email jika diubah
    const existingIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingIdx !== -1 && existingIdx !== idx) {
      showToast('Email sudah digunakan oleh akun lain', 'error');
      return;
    }

    users[idx] = {
      ...users[idx],
      nis,
      name,
      email,
      password,
    };
    localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
    showToast(`Akun siswa ${name} berhasil diperbarui!`, 'success');
  } else {
    // Tambah akun baru
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('Email sudah terdaftar dalam sistem', 'error');
      return;
    }

    const newUser = {
      nis,
      name,
      email,
      password,
      role: 'user',
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
    showToast(`Akun siswa ${name} berhasil didaftarkan!`, 'success');
  }

  closeAdminUserModal();
  updateAdminFilterDropdowns();
  renderAdminUsers();
  renderAdminDashboard();
}
window.saveAdminUserHandler = saveAdminUserHandler;

function deleteAdminUser(index) {
  const users = getAllUsers();
  const u = users[index];
  if (!u) return;

  if (u.role === 'admin') {
    showToast('Akun administrator tidak dapat dihapus', 'error');
    return;
  }

  if (confirm(`⚠️ Apakah Anda yakin ingin menghapus akun siswa ${u.name} (${u.email})?`)) {
    users.splice(index, 1);
    localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
    updateAdminFilterDropdowns();
    renderAdminUsers();
    renderAdminDashboard();
    showToast(`Akun siswa ${u.name} berhasil dihapus`, 'success');
  }
}
window.deleteAdminUser = deleteAdminUser;

// ==================== ENTRIES (JURNAL) ====================
function renderEntries() {
  const searchTerm = searchEntries.value.toLowerCase();
  const sortBy = sortEntries.value;
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const allEntries = getEntries();
  let entries = [...allEntries];

  // Filter by user role and admin selection
  if (isAdmin) {
    const selectedStudent = adminTaskUserFilter?.value || 'ALL';
    if (selectedStudent !== 'ALL') {
      entries = entries.filter(e => e.userEmail === selectedStudent);
    }
  } else {
    entries = entries.filter(e => !e.userEmail || e.userEmail === currentUser?.email);
  }

  if (searchTerm) {
    entries = entries.filter(e =>
      (e.taskName || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.requester || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm)
    );
  }

  if (sortBy === 'oldest') {
    entries = [...entries].reverse();
  } else if (sortBy === 'name') {
    entries = [...entries].sort((a, b) => a.taskName.localeCompare(b.taskName));
  }

  entriesCount.textContent = `Total: ${entries.length} catatan${isAdmin ? ' (Mode Admin)' : ''}`;

  if (!entries.length) {
    entriesList.innerHTML = `<div class="rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-8 text-center text-slate-500 dark:text-slate-400">
      <p class="text-3xl mb-2"><i data-lucide="inbox" class="w-8 h-8 inline text-slate-400"></i></p>
      <p class="text-base font-bold text-slate-700 dark:text-slate-300">Belum ada catatan pekerjaan</p>
      <p class="text-xs mt-1">Mulai tambahkan catatan pekerjaan Anda di menu Tambah Catatan</p>
    </div>`;
    return;
  }

  entriesList.innerHTML = entries.map((entry) => {
    const rawIndex = allEntries.indexOf(entry);
    const imagePreview = entry.image
      ? `<div class="mt-3">
          <img src="${entry.image}" alt="Preview" class="w-full max-h-48 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition shadow-sm" onclick="openImageModal('${entry.image}', '${entry.taskName}')" />
          <p class="text-[11px] text-slate-400 mt-1">Klik untuk memperbesar</p>
        </div>`
      : '';

    const studentBadge = isAdmin && entry.userName
      ? `<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 mb-2">
          <i data-lucide="user" class="w-3 h-3 inline"></i><span>${entry.userName}</span><span class="text-[10px] opacity-75">(${entry.userNis || '-'})</span>
        </div>`
      : '';

    return `
      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 sm:p-6 shadow-sm hover:shadow-md transition">
        ${studentBadge}
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">${entry.taskName}</h3>
            <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400"><i data-lucide="calendar" class="w-3 h-3 inline"></i> ${formatDate(entry.date)} • ${formatTime(entry.time)}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button onclick="editEntry(${rawIndex})" class="rounded-xl bg-blue-100 dark:bg-blue-900/60 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition"><i data-lucide="pencil" class="w-3 h-3 inline"></i> Edit</button>
            <button onclick="deleteEntry(${rawIndex})" class="rounded-xl bg-red-100 dark:bg-red-900/60 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-200 transition"><i data-lucide="trash-2" class="w-3 h-3 inline"></i> Hapus</button>
          </div>
        </div>
        <div class="mt-3.5 grid gap-2 text-xs sm:text-sm">
          <p><span class="font-bold text-slate-700 dark:text-slate-300">Lokasi:</span> <span class="text-slate-600 dark:text-slate-400">${entry.location}</span></p>
          <p><span class="font-bold text-slate-700 dark:text-slate-300">Pembimbing / Pemohon:</span> <span class="text-slate-600 dark:text-slate-400">${entry.requester}</span></p>
          <p class="font-bold text-slate-700 dark:text-slate-300"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Hasil Kerja:</p>
          <p class="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-750">${entry.proof}</p>
        </div>
        ${imagePreview}
      </div>
    `;
  }}).join('');
  refreshIcons();
}

window.editEntry = function(index) {
  const entries = getEntries();
  const entry = entries[index];
  if (!entry) return;

  taskName.value = entry.taskName;
  taskDate.value = entry.date;
  taskTime.value = entry.time;
  taskLocation.value = entry.location;
  taskRequester.value = entry.requester;
  taskProof.value = entry.proof;

  addTaskButton.textContent = 'Perbarui Catatan';
  addTaskButton.dataset.editIndex = index;

  switchTab('add-task');
  showToast('Mode edit catatan. Perbarui dan simpan perubahan', 'info');
};

window.deleteEntry = async function(index) {
  if (confirm('⚠️ Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak bisa dibatalkan.')) {
    const entries = getEntries();
    const entry = entries[index];

    try {
      if (entry?.id) {
        await deleteEntryFromFirestore(entry.id);
      }
      entries.splice(index, 1);
      setEntries(entries);
      renderEntries();
      showToast('Catatan berhasil dihapus', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Gagal menghapus catatan: ' + error.message, 'error');
    }
  }
};

function clearTaskForm() {
  taskName.value = '';
  const today = getLocalDateString(new Date());
  taskDate.value = today;
  evaluateSelectedTaskDate(today);
  const now = new Date();
  taskTime.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  taskLocation.value = '';
  taskRequester.value = '';
  taskProof.value = '';
  taskImage.value = '';
  addTaskButton.textContent = '<i data-lucide="plus" class="w-3 h-3 inline"></i> Tambah Catatan';
  delete addTaskButton.dataset.editIndex;
}

// ==================== ATTENDANCE STATUS & UI CONTROLS ====================
// ==================== ATTENDANCE STATUS & UI CONTROLS ====================
function setAttendanceStatus(status) {
  const statusInput = document.getElementById('attendance-status');
  if (statusInput) statusInput.value = status;

  if (status === 'Hadir') {
    if (panelStandardTime) panelStandardTime.classList.remove('hidden');
    if (panelIzinMultiday) panelIzinMultiday.classList.add('hidden');
    if (attendanceLocation && (!attendanceLocation.value || attendanceLocation.value.startsWith('Izin') || attendanceLocation.value.startsWith('Sakit'))) {
      attendanceLocation.value = 'Divisi IT';
    }
  } else if (status === 'Izin' || status === 'Sakit') {
    if (panelStandardTime) panelStandardTime.classList.add('hidden');
    if (panelIzinMultiday) panelIzinMultiday.classList.remove('hidden');
    if (attendanceLocation) attendanceLocation.value = status === 'Izin' ? 'Izin (Luar Kantor)' : 'Sakit (Istirahat)';
  } else if (status === 'Libur Nasional') {
    if (panelStandardTime) panelStandardTime.classList.add('hidden');
    if (panelIzinMultiday) panelIzinMultiday.classList.add('hidden');
    const dayInfo = getDayInfo(attendanceDate.value);
    if (attendanceLocation) attendanceLocation.value = dayInfo.holidayName || 'Libur Nasional / Weekend';
  }

  // Update button active styling
  document.querySelectorAll('.attendance-status-btn').forEach(btn => {
    const btnStatus = btn.dataset.status;
    const isSelected = btnStatus === status;

    if (isSelected) {
      if (btnStatus === 'Hadir') {
        btn.className = 'attendance-status-btn flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold transition shadow-sm hover:scale-[1.02]';
      } else if (btnStatus === 'Izin') {
        btn.className = 'attendance-status-btn flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold transition shadow-sm hover:scale-[1.02]';
      } else if (btnStatus === 'Sakit') {
        btn.className = 'attendance-status-btn flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold transition shadow-sm hover:scale-[1.02]';
      } else {
        btn.className = 'attendance-status-btn flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold transition shadow-sm hover:scale-[1.02]';
      }
    } else {
      btn.className = 'attendance-status-btn flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold transition hover:scale-[1.02]';
    }
  });
}

function clearAttendanceForm() {
  editingAttendanceIndex = null;
  const today = getLocalDateString(new Date());

  attendanceDate.value = today;
  attendanceCheckin.value = '08:00';
  attendanceCheckout.value = '16:00';
  attendanceLocation.value = 'Divisi IT';
  attendanceNotes.value = '';
  setAttendanceStatus('Hadir');

  // Reset multi-day
  const radioSingle = document.querySelector('input[name="izin-duration-type"][value="single"]');
  if (radioSingle) radioSingle.checked = true;
  if (izinRangeBox) izinRangeBox.classList.add('hidden');
  if (izinStartDate) izinStartDate.value = today;
  if (izinEndDate) izinEndDate.value = today;

  // Reset photo
  currentAttendanceImageBase64 = null;
  if (attendanceImage) attendanceImage.value = '';
  if (attendanceImagePreview) attendanceImagePreview.src = '';
  if (attendanceImagePreviewBox) attendanceImagePreviewBox.classList.add('hidden');

  if (saveAttendanceBtnText) saveAttendanceBtnText.textContent = 'Catat Kehadiran';
  if (cancelAttendanceButton) cancelAttendanceButton.classList.add('hidden');

  evaluateSelectedAttendanceDate(today);
}

// Calculate workdays in date range (excluding weekends and Indonesian holidays)
function calculateWorkdaysInRange(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return [];
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  if (start > end) return [];

  const workdays = [];
  const current = new Date(start);

  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const info = getDayInfo(dateStr);
    if (info.isWorkday) {
      workdays.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  return workdays;
}

// ==================== REKAPITULASI BULANAN SIMPEL ====================
function getAvailableMonths() {
  const entries = getAttendanceEntries();
  const months = new Set();
  
  // Current month always included
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  months.add(currentYM);

  entries.forEach(e => {
    if (e.date && e.date.length >= 7) {
      months.add(e.date.substring(0, 7));
    }
  });

  return Array.from(months).sort().reverse();
}

function updateRecapMonthDropdown() {
  const months = getAvailableMonths();
  if (!selectedRecapMonth) {
    const now = new Date();
    selectedRecapMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  recapMonthSelect.innerHTML = '';
  months.forEach(ym => {
    const [year, month] = ym.split('-');
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    if (ym === selectedRecapMonth) opt.selected = true;
    recapMonthSelect.appendChild(opt);
  });
}

function renderAttendanceRecap() {
  updateRecapMonthDropdown();
  const currentYM = selectedRecapMonth;
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Filter entries strictly for the selected month
  const allEntries = getAttendanceEntries();
  let monthEntries = allEntries.filter(e => (e.date || '').startsWith(currentYM));

  // Role filtering
  if (isAdmin) {
    const selectedStudent = adminAttendanceUserFilter?.value || 'ALL';
    if (selectedStudent !== 'ALL') {
      monthEntries = monthEntries.filter(e => e.userEmail === selectedStudent);
    }
  } else {
    monthEntries = monthEntries.filter(e => !e.userEmail || e.userEmail === currentUser?.email);
  }

  // Sort by date ascending for simple chronological view
  monthEntries.sort((a, b) => a.date.localeCompare(b.date));

  // Count KPIs for this month
  const hadirCount = monthEntries.filter(e => e.status === 'Hadir').length;
  const kuliahCount = monthEntries.filter(e => e.status === 'Bantuan Perkuliahan').length;
  const situasionalCount = monthEntries.filter(e => e.status === 'Hadir Situasional').length;
  const izinCount = monthEntries.filter(e => e.status === 'Izin').length;
  const sakitCount = monthEntries.filter(e => e.status === 'Sakit').length;
  const liburCount = monthEntries.filter(e => e.status === 'Libur Nasional').length;

  const totalEffectiveWorkdays = hadirCount + kuliahCount + situasionalCount + izinCount + sakitCount;
  const totalPresent = hadirCount + kuliahCount + situasionalCount; // All count as valid presence!
  const percentage = totalEffectiveWorkdays > 0 ? Math.round((totalPresent / totalEffectiveWorkdays) * 100) : (totalPresent > 0 ? 100 : 0);

  // Update KPI display
  if (recapCountHadir) recapCountHadir.textContent = hadirCount;
  if (recapCountKuliah) recapCountKuliah.textContent = kuliahCount;
  if (recapCountSituasional) recapCountSituasional.textContent = situasionalCount;
  if (recapCountIzin) recapCountIzin.textContent = izinCount;
  if (recapCountSakit) recapCountSakit.textContent = sakitCount;
  if (recapCountLibur) recapCountLibur.textContent = liburCount;
  if (recapPercentage) recapPercentage.textContent = percentage + '%';
  if (recapTotalDays) recapTotalDays.textContent = `${totalPresent} dari ${totalEffectiveWorkdays} hari hadir`;

  // Search filter inside this month
  const searchTerm = (searchAttendance?.value || '').toLowerCase().trim();
  if (searchTerm) {
    monthEntries = monthEntries.filter(e =>
      (e.date || '').toLowerCase().includes(searchTerm) ||
      (e.location || '').toLowerCase().includes(searchTerm) ||
      (e.notes || '').toLowerCase().includes(searchTerm) ||
      (e.userName || '').toLowerCase().includes(searchTerm) ||
      (e.status || '').toLowerCase().includes(searchTerm)
    );
  }

  // Unhide admin column header if admin
  document.querySelectorAll('.admin-only-col').forEach(el => {
    el.classList.toggle('hidden', !isAdmin);
  });

  // Render Table
  if (!monthEntries.length) {
    attendanceTableBody.innerHTML = '';
    attendanceEmptyState.classList.remove('hidden');
    return;
  }

  attendanceEmptyState.classList.add('hidden');

  attendanceTableBody.innerHTML = monthEntries.map((att, idx) => {
    const rawIndex = allEntries.indexOf(att);

    // Status Badge
    let statusBadge = '';
    if (att.status === 'Hadir' || att.status === 'Bantuan Perkuliahan' || att.status === 'Hadir Situasional') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><i data-lucide="check-circle" class="w-3 h-3 inline text-emerald-600"></i> Hadir</span>';
    } else if (att.status === 'Izin') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Izin</span>';
    } else if (att.status === 'Sakit') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">Sakit</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"><i data-lucide="flag" class="w-3 h-3 inline"></i> Libur</span>';
    }

    // Time Column
    let timeText = '';
    if (att.status === 'Bantuan Perkuliahan') {
      timeText = `<div class="font-mono text-[11px] leading-tight">
        <span class="text-indigo-600 dark:text-indigo-400 font-bold">07:00 (Kuliah)</span> → 
        <span class="text-slate-700 dark:text-slate-300">08:00 (IT)</span> s/d 
        <span class="text-slate-500">${att.checkOutTime || '16:00'}</span>
      </div>`;
    } else if (att.status === 'Hadir Situasional') {
      timeText = `<div class="font-mono text-xs">
        <span class="text-violet-600 dark:text-violet-400 font-bold">Tiba ${att.checkInTime || '09:30'}</span> <span class="text-slate-400">s/d</span> <span>${att.checkOutTime || '16:00'}</span>
      </div>`;
    } else if (att.status === 'Hadir') {
      timeText = `<div class="font-mono text-xs">
        <span>${att.checkInTime || '08:00'}</span> <span class="text-slate-400">s/d</span> <span>${att.checkOutTime || '16:00'}</span>
      </div>`;
    } else {
      timeText = '<span class="text-slate-400 text-xs">-</span>';
    }

    // Photo Thumbnail
    const imageCell = att.image
      ? `<button type="button" onclick="openImageModal('${att.image}', 'Bukti ${formatDayDate(att.date)}')" class="inline-flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 hover:scale-110 transition shadow-sm" title="Lihat Foto Bukti">
           <img src="${att.image}" class="w-full h-full object-cover" alt="Thumb" />
         </button>`
      : '<span class="text-slate-400 text-xs">-</span>';

    const studentCell = isAdmin
      ? `<td class="p-3 admin-only-col whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-200">
           ${att.userName || 'Siswa'}
           <span class="text-[10px] text-slate-400 block font-normal">${att.userNis || '-'}</span>
         </td>`
      : '';

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
        <td class="p-3 text-center font-bold text-slate-500 dark:text-slate-400">${idx + 1}</td>
        ${studentCell}
        <td class="p-3 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
          ${formatDayDate(att.date)}
        </td>
        <td class="p-3 whitespace-nowrap">${timeText}</td>
        <td class="p-3 whitespace-nowrap">${statusBadge}</td>
        <td class="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
          ${att.location || '-'}
        </td>
        <td class="p-3 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate" title="${att.notes || '-'}">
          ${att.notes || '-'}
        </td>
        <td class="p-3 text-center">${imageCell}</td>
        <td class="p-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editAttendance(${rawIndex})" class="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition text-xs font-bold" title="Edit Absensi"><i data-lucide="pencil" class="w-3 h-3 inline"></i></button>
            <button onclick="deleteAttendance(${rawIndex})" class="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-200 transition text-xs font-bold" title="Hapus Absensi"><i data-lucide="trash-2" class="w-3 h-3 inline"></i></button>
          </div>
        </td>
      </tr>
    `;
  }}).join('');
  refreshIcons();
}

window.editAttendance = function(index) {
  const entries = getAttendanceEntries();
  const att = entries[index];
  if (!att) return;

  editingAttendanceIndex = index;
  attendanceDate.value = att.date || '';
  attendanceNotes.value = att.notes || '';
  attendanceLocation.value = att.location || 'Divisi IT';

  setAttendanceStatus(att.status || 'Hadir');

  if (att.status === 'Bantuan Perkuliahan') {
    attKuliahStandby.value = att.checkInTime || '07:00';
    attKuliahIt.value = att.itTime || '08:00';
    attKuliahPulang.value = att.checkOutTime || '16:00';
    attKuliahRuang.value = att.kuliahRoom || '';
  } else if (att.status === 'Hadir Situasional') {
    attSituasiJamIt.value = att.checkInTime || '09:30';
    attSituasiJamPulang.value = att.checkOutTime || '16:00';
    attSituasiKeterangan.value = att.notes || '';
  } else if (att.status === 'Hadir') {
    attendanceCheckin.value = att.checkInTime || '08:00';
    attendanceCheckout.value = att.checkOutTime || '16:00';
  }

  currentAttendanceImageBase64 = att.image || null;
  if (currentAttendanceImageBase64) {
    attendanceImagePreview.src = currentAttendanceImageBase64;
    attendanceImagePreviewBox.classList.remove('hidden');
  } else {
    attendanceImagePreviewBox.classList.add('hidden');
  }

  if (saveAttendanceBtnText) saveAttendanceBtnText.textContent = 'Perbarui Absensi';
  if (cancelAttendanceButton) cancelAttendanceButton.classList.remove('hidden');

  evaluateSelectedAttendanceDate(att.date);
  switchTab('attendance');
  showToast('Mode edit absensi aktif. Ubah data dan simpan', 'info');
};

window.deleteAttendance = async function(index) {
  if (confirm('⚠️ Apakah Anda yakin ingin menghapus data presensi ini?')) {
    const entries = getAttendanceEntries();
    const att = entries[index];

    try {
      if (att?.id) {
        await deleteAttendanceFromFirestore(att.id);
      }
      entries.splice(index, 1);
      setAttendanceEntries(entries);
      renderAttendanceRecap();
      showToast('Presensi berhasil dihapus', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Gagal menghapus presensi: ' + error.message, 'error');
    }
  }
};

// ==================== IMAGE MODAL ====================
window.openImageModal = function(src, title) {
  if (!imageModal || !imageModalImg) return;
  imageModalImg.src = src;
  if (imageModalTitle) imageModalTitle.textContent = title || 'Bukti Foto';
  imageModal.classList.remove('hidden');
};

function closeImageModal() {
  if (imageModal) imageModal.classList.add('hidden');
}

if (imageModalClose) imageModalClose.addEventListener('click', closeImageModal);
if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeImageModal();
  });
}

// ==================== EXPORT BULANAN SIMPEL ====================
function exportAttendanceExcelHandler() {
  const currentUser = getCurrentUser() || {};
  const isAdmin = currentUser.role === 'admin';
  const allEntries = getAttendanceEntries();
  const currentYM = selectedRecapMonth;
  let entries = allEntries.filter(e => (e.date || '').startsWith(currentYM));

  if (isAdmin) {
    const selectedStudent = adminAttendanceUserFilter?.value || 'ALL';
    if (selectedStudent !== 'ALL') {
      entries = entries.filter(e => e.userEmail === selectedStudent);
    }
  } else {
    entries = entries.filter(e => !e.userEmail || e.userEmail === currentUser.email);
  }

  entries.sort((a, b) => a.date.localeCompare(b.date));

  if (!entries.length) {
    showToast('Tidak ada data presensi di bulan ini untuk di-export', 'error');
    return;
  }

  try {
    showLoadingState(exportAttendanceExcel);
    const headers = ['No', 'NIS', 'Nama Siswa', 'Hari/Tanggal', 'Status', 'Waktu Masuk / Standby', 'Waktu Pulang', 'Lokasi / Divisi', 'Keterangan / Keperluan'];
    const rows = entries.map((att, idx) => {
      let timeIn = att.checkInTime || '-';
      let timeOut = att.checkOutTime || '-';
      if (att.status === 'Bantuan Perkuliahan') {
        timeIn = `07:00 (Kuliah) → ${att.itTime || '08:00'} (IT)`;
      } else if (att.status === 'Hadir Situasional') {
        timeIn = `Tiba IT ${att.checkInTime || '09:30'}`;
      }

      return [
        idx + 1,
        `"${att.userNis || currentUser.nis || ''}"`,
        `"${att.userName || currentUser.name || ''}"`,
        `"${formatDayDate(att.date)}"`,
        `"${att.status || '-'}"`,
        `"${timeIn}"`,
        `"${timeOut}"`,
        `"${(att.location || '').replace(/"/g, '""')}"`,
        `"${(att.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, `rekap-presensi-pkl-${currentYM}.csv`, 'text/csv;charset=utf-8;');
    showToast(`File Excel Rekap Presensi Bulan ${currentYM} berhasil diunduh`, 'success');
  } catch (error) {
    showToast('Gagal export presensi: ' + error.message, 'error');
  } finally {
    hideLoadingState(exportAttendanceExcel);
  }
}

function exportAttendancePdfHandler() {
  const currentUser = getCurrentUser() || {};
  const isAdmin = currentUser.role === 'admin';
  const allEntries = getAttendanceEntries();
  const currentYM = selectedRecapMonth;
  let entries = allEntries.filter(e => (e.date || '').startsWith(currentYM));

  let reportSubtitle = `Siswa: ${currentUser.name || '-'}`;
  if (isAdmin) {
    const selectedStudent = adminAttendanceUserFilter?.value || 'ALL';
    if (selectedStudent !== 'ALL') {
      entries = entries.filter(e => e.userEmail === selectedStudent);
      const studentObj = getAllUsers().find(u => u.email === selectedStudent);
      reportSubtitle = `Siswa: ${studentObj ? studentObj.name : selectedStudent}`;
    } else {
      reportSubtitle = 'Semua Siswa PKL Terdaftar (Mode Admin)';
    }
  } else {
    entries = entries.filter(e => !e.userEmail || e.userEmail === currentUser.email);
  }

  entries.sort((a, b) => a.date.localeCompare(b.date));

  if (!entries.length) {
    showToast('Tidak ada data presensi di bulan ini untuk dicetak', 'error');
    return;
  }

  try {
    showLoadingState(exportAttendancePdf);
    const hadirCount = entries.filter(e => e.status === 'Hadir').length;
    const kuliahCount = entries.filter(e => e.status === 'Bantuan Perkuliahan').length;
    const situasionalCount = entries.filter(e => e.status === 'Hadir Situasional').length;
    const izinCount = entries.filter(e => e.status === 'Izin').length;
    const sakitCount = entries.filter(e => e.status === 'Sakit').length;
    const liburCount = entries.filter(e => e.status === 'Libur Nasional').length;
    const totalEffective = hadirCount + kuliahCount + situasionalCount + izinCount + sakitCount;
    const totalPresent = hadirCount + kuliahCount + situasionalCount;
    const percentage = totalEffective > 0 ? Math.round((totalPresent / totalEffective) * 100) : (totalPresent > 0 ? 100 : 0);

    const [year, month] = currentYM.split('-');
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = `${monthNames[parseInt(month, 10) - 1]} ${year}`;

    const isPrintingAllStudents = isAdmin && (adminAttendanceUserFilter?.value || 'ALL') === 'ALL';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Rekap Presensi PKL - Bulan ${monthName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.4; }
          .header { text-align: center; border-bottom: 3px double #2563eb; padding-bottom: 10px; margin-bottom: 18px; }
          .header h1 { margin: 0; font-size: 17px; text-transform: uppercase; }
          .header p { margin: 3px 0 0; font-size: 13px; color: #475569; }
          .info-table { width: 100%; margin-bottom: 12px; font-size: 12px; }
          .info-table td { padding: 3px 6px; }
          .summary-box { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
          .summary-card { flex: 1; min-width: 90px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; text-align: center; background: #f8fafc; font-size: 11px; }
          .summary-card strong { display: block; font-size: 15px; margin-top: 2px; }
          table.data { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 25px; }
          table.data th, table.data td { border: 1px solid #94a3b8; padding: 6px 8px; }
          table.data th { background-color: #f1f5f9; text-align: left; }
          .signature-section { display: flex; justify-content: space-between; margin-top: 35px; page-break-inside: avoid; font-size: 12px; }
          .signature-box { width: 220px; text-align: center; }
          .signature-space { height: 65px; }
          @media print { body { margin: 15mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>REKAPITULASI PRESENSI BULANAN PRAKTIK KERJA LAPANGAN (PKL)</h1>
          <p>Periode Bulan: <strong>${monthName}</strong> • Jadwal PKL: Senin – Jumat (08:00 – 16:00 WIB)</p>
          <p style="margin-top: 2px; font-size: 12px; color: #2563eb; font-weight: bold;">${reportSubtitle}</p>
        </div>

        <table class="info-table">
          <tr>
            <td width="15%"><strong>Nama Siswa:</strong></td>
            <td width="35%">${isAdmin ? (adminAttendanceUserFilter?.value === 'ALL' ? 'Semua Siswa Terlampir' : (entries[0]?.userName || currentUser.name)) : (currentUser.name || '-')}</td>
            <td width="15%"><strong>NIS / NIM:</strong></td>
            <td width="35%">${isAdmin ? (adminAttendanceUserFilter?.value === 'ALL' ? 'Multi-Siswa' : (entries[0]?.userNis || currentUser.nis)) : (currentUser.nis || '-')}</td>
          </tr>
          <tr>
            <td><strong>Divisi Penempatan:</strong></td>
            <td>Divisi IT</td>
            <td><strong>Tanggal Cetak:</strong></td>
            <td>${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</td>
          </tr>
        </table>

        <div class="summary-box">
          <div class="summary-card">Hadir IT: <strong style="color: #047857;">${hadirCount}</strong></div>
          <div class="summary-card">Bantuan Kuliah: <strong style="color: #4338ca;">${kuliahCount}</strong></div>
          <div class="summary-card">Situasional: <strong style="color: #7c3aed;">${situasionalCount}</strong></div>
          <div class="summary-card">Izin: <strong style="color: #b45309;">${izinCount}</strong></div>
          <div class="summary-card">Sakit: <strong style="color: #be123c;">${sakitCount}</strong></div>
          <div class="summary-card">Libur Tgl Merah: <strong style="color: #475569;">${liburCount}</strong></div>
          <div class="summary-card">Persentase Kehadiran: <strong style="color: #2563eb;">${percentage}%</strong></div>
        </div>

        <table class="data">
          <thead>
            <tr>
              <th width="4%" style="text-align: center;">No</th>
              ${isPrintingAllStudents ? '<th width="16%">Nama Siswa</th>' : ''}
              <th width="${isPrintingAllStudents ? '18%' : '20%'}">Hari & Tanggal</th>
              <th width="${isPrintingAllStudents ? '18%' : '20%'}">Waktu Presensi</th>
              <th width="14%">Status</th>
              <th width="16%">Lokasi / Divisi</th>
              <th>Keterangan / Keperluan</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map((att, i) => {
              let waktuStr = `${att.checkInTime || '08:00'} s/d ${att.checkOutTime || '16:00'}`;
              if (att.status === 'Bantuan Perkuliahan') {
                waktuStr = `07:00 (Kuliah) → 08:00 (IT) s/d ${att.checkOutTime || '16:00'}`;
              } else if (att.status === 'Hadir Situasional') {
                waktuStr = `Tiba IT ${att.checkInTime || '09:30'} s/d ${att.checkOutTime || '16:00'}`;
              }

              return `
                <tr>
                  <td style="text-align: center;">${i + 1}</td>
                  ${isPrintingAllStudents ? `<td><strong>${att.userName || '-'}</strong><br><small style="color:#64748b;">${att.userNis || '-'}</small></td>` : ''}
                  <td>${formatDayDate(att.date)}</td>
                  <td>${waktuStr}</td>
                  <td><strong>${att.status}</strong></td>
                  <td>${att.location || 'Divisi IT'}</td>
                  <td>${att.notes || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="signature-section">
          <div class="signature-box">
            <p>Mengetahui,<br><strong>Pembimbing Industri / Lapangan</strong></p>
            <div class="signature-space"></div>
            <p>__________________________<br>NIP/ID:</p>
          </div>
          <div class="signature-box">
            <p>Siswa / Mahasiswa Praktik,<br>&nbsp;</p>
            <div class="signature-space"></div>
            <p><strong>${isAdmin ? 'Koordinator PKL' : (currentUser.name || 'Siswa Praktik')}</strong><br>NIS: ${isAdmin ? 'Admin' : (currentUser.nis || '-')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    printWin.document.write(htmlContent);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
      showToast('Jendela cetak dibuka - pilih "Simpan sebagai PDF"', 'info');
    }, 300);
  } catch (error) {
    showToast('Gagal cetak rekap presensi: ' + error.message, 'error');
  } finally {
    hideLoadingState(exportAttendancePdf);
  }
}

// ==================== EVENT LISTENERS ====================
// Theme toggle buttons
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (authThemeToggleBtn) authThemeToggleBtn.addEventListener('click', toggleTheme);

// Auth tab toggling
showLogin.addEventListener('click', () => setActiveTab('login'));
showSignup.addEventListener('click', () => setActiveTab('signup'));

// Helper: Quick Date Offset
function getDateByOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + parseInt(offsetDays, 10));
  return getLocalDateString(d);
}




// ==================== FIREBASE AUTH: SIGNUP ====================
signupButton.addEventListener('click', async () => {
  const role = signupRole ? signupRole.value : 'user';
  const nis = document.getElementById('signup-nis').value.trim();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!nis || !name || !email || !password) {
    authMessage.textContent = 'Semua kolom harus diisi lengkap';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
    return;
  }
  if (!validateEmail(email)) {
    authMessage.textContent = 'Format email tidak valid';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
    return;
  }
  if (password.length < 6) {
    authMessage.textContent = 'Password minimal 6 karakter';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
    return;
  }

  try {
    authMessage.textContent = 'Mendaftarkan akun...';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-slate-500';

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Simpan profil ke Firestore
    const { setDoc, doc: fsDoc } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js');
    await setDoc(fsDoc(db, 'users', uid), { nis, name, email, role, uid, createdAt: new Date().toISOString() });

    const newUser = { nis, name, email, role, uid };
    saveUserToList(newUser);
    setStoredUser(newUser);
    setSession(email);

    authMessage.textContent = 'Pendaftaran berhasil! Membuka dashboard...';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-emerald-600';
    setTimeout(openApp, 600);
  } catch (err) {
    let msg = 'Pendaftaran gagal. Coba lagi.';
    if (err.code === 'auth/email-already-in-use') msg = 'Email sudah terdaftar. Silakan masuk.';
    if (err.code === 'auth/invalid-email') msg = 'Format email tidak valid.';
    authMessage.textContent = msg;
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
  }
});

// ==================== FIREBASE AUTH: LOGIN ====================
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    authMessage.textContent = 'Email dan password harus diisi';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
    return;
  }

  try {
    authMessage.textContent = 'Memeriksa akun...';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-slate-500';

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Ambil profil dari Firestore
    let user = null;
    try {
      const { getDoc, doc: fsDoc } = await import('https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js');
      const snap = await getDoc(fsDoc(db, 'users', uid));
      if (snap.exists()) user = { ...snap.data(), uid };
    } catch (_) {}

    // Fallback ke localStorage jika Firestore belum ada datanya
    if (!user) {
      const allUsers = getAllUsers();
      user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      user = { name: email, email, role: 'user', uid };
    }

    setStoredUser(user);
    setSession(email);
    authMessage.textContent = 'Berhasil masuk!';
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-emerald-600';
    setTimeout(openApp, 400);
  } catch (err) {
    let msg = 'Email atau password salah';
    if (err.code === 'auth/user-not-found') msg = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = 'Password salah.';
    if (err.code === 'auth/too-many-requests') msg = 'Terlalu banyak percobaan. Coba lagi nanti.';
    authMessage.textContent = msg;
    authMessage.className = 'mt-4 min-h-[1.25rem] text-sm text-center font-semibold text-rose-500';
  }
});

// ==================== FIREBASE AUTH: LOGOUT ====================
logoutButton.addEventListener('click', async () => {
  if (!confirm('Yakin ingin logout?')) return;
  try {
    await signOut(auth);
  } catch (_) {}
  clearSession();
  appScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
  setActiveTab('login');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  showToast('Anda berhasil logout', 'info');
});

// Save profile
saveUserButton.addEventListener('click', () => {
  const nis = userNis.value.trim();
  const name = userName.value.trim();
  const email = userEmail.value.trim();

  if (!nis || !name || !email) {
    showToast('Lengkapi semua data user terlebih dahulu', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showToast('Format email tidak valid', 'error');
    return;
  }

  const user = getCurrentUser() || getStoredUser() || {};
  const updatedUser = { ...user, nis, name, email };
  saveUserToList(updatedUser);
  setStoredUser(updatedUser);
  setSession(email);
  updateIdentity();
  showToast('Profil berhasil disimpan', 'success');
});

// Task Quick Date Shortcuts & Change Listener
document.querySelectorAll('.btn-task-quick-date').forEach(btn => {
  btn.addEventListener('click', () => {
    const offset = parseInt(btn.dataset.offset || 0, 10);
    const dStr = getDateByOffset(offset);
    taskDate.value = dStr;
    evaluateSelectedTaskDate(dStr);
    showToast(`Tanggal pekerjaan diatur: ${formatDayDate(dStr)}`, 'info');
  });
});

if (taskDate) {
  taskDate.addEventListener('change', () => {
    evaluateSelectedTaskDate(taskDate.value);
  });
}

// Admin Filter Listeners
if (adminTaskUserFilter) {
  adminTaskUserFilter.addEventListener('change', () => renderEntries());
}
if (adminAttendanceUserFilter) {
  adminAttendanceUserFilter.addEventListener('change', () => renderAttendanceRecap());
}

// Task Image validation
taskImage.addEventListener('change', (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file terlalu besar (maksimal 5MB)', 'error');
      taskImage.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar', 'error');
      taskImage.value = '';
      return;
    }
    showToast('Foto dokumentasi siap diupload', 'success');
  }
});

// Add / Update Task
addTaskButton.addEventListener('click', async () => {
  const isEdit = addTaskButton.dataset.editIndex !== undefined;
  const editIndex = parseInt(addTaskButton.dataset.editIndex, 10);
  const currentUser = getCurrentUser() || getStoredUser() || {};

  const task = {
    userEmail: currentUser.email || '',
    userName: currentUser.name || '',
    userNis: currentUser.nis || '',
    taskName: taskName.value.trim(),
    date: taskDate.value,
    time: taskTime.value,
    location: taskLocation.value.trim(),
    requester: taskRequester.value.trim(),
    proof: taskProof.value.trim(),
    image: null,
  };

  if (!task.taskName || !task.date || !task.time || !task.location || !task.requester || !task.proof) {
    showToast('Lengkapi semua kolom pekerjaan harian', 'error');
    return;
  }

  const entries = getEntries();
  if (isEdit) {
    task.id = entries[editIndex]?.id;
    if (entries[editIndex]?.userEmail) task.userEmail = entries[editIndex].userEmail;
    if (entries[editIndex]?.userName) task.userName = entries[editIndex].userName;
    if (entries[editIndex]?.userNis) task.userNis = entries[editIndex].userNis;
  }

  if (taskImage.files.length) {
    task.image = await readFileAsDataURL(taskImage.files[0]);
  } else if (isEdit) {
    task.image = entries[editIndex]?.image || null;
  }

  try {
    showLoadingState(addTaskButton);
    const firestoreId = await saveEntryToFirestore(task);
    task.id = firestoreId;

    if (isEdit) {
      entries[editIndex] = task;
      showToast('Catatan berhasil diperbarui', 'success');
    } else {
      entries.unshift(task);
      showToast('Catatan berhasil ditambahkan', 'success');
    }

    setEntries(entries);
    renderEntries();
    clearTaskForm();
    switchTab('list-tasks');
  } catch (error) {
    console.error('Firestore save error:', error);
    showToast('Gagal menyimpan catatan: ' + error.message, 'error');
  } finally {
    hideLoadingState(addTaskButton);
  }
});

// Search & Sort Tasks
searchEntries.addEventListener('input', () => renderEntries());
sortEntries.addEventListener('change', () => renderEntries());

// Export Task Excel & PDF & Word
exportExcel.addEventListener('click', () => {
  const user = getStoredUser();
  const entries = getEntries();
  if (!entries.length) {
    showToast('Tidak ada data untuk di-export', 'error');
    return;
  }

  try {
    showLoadingState(exportExcel);
    const headers = ['No', 'NIS', 'Nama', 'Email', 'Nama Pekerjaan', 'Tanggal', 'Jam', 'Lokasi', 'Nama Pemohon', 'Bukti Kerja'];
    const rows = entries.map((e, idx) => [
      idx + 1,
      `"${user?.nis || ''}"`,
      `"${user?.name || ''}"`,
      `"${user?.email || ''}"`,
      `"${e.taskName.replace(/"/g, '""')}"`,
      `"${e.date}"`,
      `"${e.time}"`,
      `"${e.location.replace(/"/g, '""')}"`,
      `"${e.requester.replace(/"/g, '""')}"`,
      `"${e.proof.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, `laporan-praktik-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
    showToast('File Excel (CSV) berhasil diunduh', 'success');
  } catch (error) {
    showToast('Gagal membuat file: ' + error.message, 'error');
  } finally {
    hideLoadingState(exportExcel);
  }
});

exportPdf.addEventListener('click', () => {
  const user = getStoredUser() || {};
  const entries = getEntries();

  if (!entries.length) {
    showToast('Tidak ada data untuk di-export', 'error');
    return;
  }

  try {
    showLoadingState(exportPdf);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Laporan Praktik - ${user.name || 'Siswa'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          h1 { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #3B82F6; padding-bottom: 12px; }
          .header-info { margin-bottom: 25px; background: #f0f4ff; padding: 15px; border-left: 4px solid #3B82F6; border-radius: 4px; font-size: 13px; }
          .header-info p { margin: 6px 0; }
          .entry { margin-bottom: 30px; page-break-inside: avoid; border-left: 4px solid #3B82F6; padding-left: 15px; }
          .entry h2 { margin: 0 0 10px 0; color: #1f2937; font-size: 15px; }
          .entry-field { margin: 6px 0; font-size: 13px; }
          .entry-field strong { color: #3B82F6; min-width: 140px; display: inline-block; }
          .proof-text { white-space: pre-wrap; background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 8px 0; border: 1px solid #e0e0e0; font-size: 12px; }
          .entry img { max-width: 400px; height: auto; margin-top: 10px; border-radius: 4px; }
          @media print { body { margin: 0; } .entry { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>LAPORAN KEGIATAN PRAKTIK</h1>
        <div class="header-info">
          <p><strong>NIS:</strong> ${user.nis || '-'}</p>
          <p><strong>Nama:</strong> ${user.name || '-'}</p>
          <p><strong>Email:</strong> ${user.email || '-'}</p>
          <p><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
        ${entries.map((entry, index) => `
          <div class="entry">
            <h2>${index + 1}. ${entry.taskName}</h2>
            <div class="entry-field"><strong>Tanggal / Jam:</strong> ${formatDate(entry.date)} ${formatTime(entry.time)}</div>
            <div class="entry-field"><strong>Lokasi:</strong> ${entry.location}</div>
            <div class="entry-field"><strong>Pembimbing / Pemohon:</strong> ${entry.requester}</div>
            <div class="entry-field"><strong>Bukti Kerja:</strong></div>
            <div class="proof-text">${entry.proof}</div>
            ${entry.image ? `<img src="${entry.image}" alt="Bukti ${index + 1}" />` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      showToast('Jendela print dibuka - pilih "Simpan sebagai PDF"', 'info');
    }, 250);
  } catch (error) {
    showToast('Gagal membuka print: ' + error.message, 'error');
  } finally {
    hideLoadingState(exportPdf);
  }
});

exportWord.addEventListener('click', () => {
  const user = getStoredUser() || {};
  const entries = getEntries();

  if (!entries.length) {
    showToast('Tidak ada data untuk di-export', 'error');
    return;
  }

  try {
    showLoadingState(exportWord);
    const html = `
<html xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<head><meta charset="utf-8"><title>Laporan Praktik</title></head>
<body style="font-family: Calibri, Arial; margin: 36pt; line-height: 1.5; color: #1f2937;">
  <h1 style="color: #2563eb; text-align: center; border-bottom: 2pt solid #2563eb; padding-bottom: 12pt;">LAPORAN KEGIATAN PRAKTIK</h1>
  <p><strong>NIS:</strong> ${user.nis || '-'}</p>
  <p><strong>Nama:</strong> ${user.name || '-'}</p>
  <p><strong>Email:</strong> ${user.email || '-'}</p>
  <hr style="border: 0.5pt solid #cbd5e1; margin: 15pt 0;" />
  ${entries.map((entry, index) => `
    <div style="margin-bottom: 20pt;">
      <h3 style="color: #1e3a8a;">${index + 1}. ${entry.taskName}</h3>
      <p><strong>Tanggal / Jam:</strong> ${formatDate(entry.date)} ${formatTime(entry.time)}</p>
      <p><strong>Lokasi:</strong> ${entry.location}</p>
      <p><strong>Pembimbing:</strong> ${entry.requester}</p>
      <p><strong>Hasil Kerja:</strong></p>
      <p style="background: #f1f5f9; padding: 8pt; border-radius: 4pt;">${entry.proof}</p>
    </div>
  `).join('')}
</body>
</html>`;

    downloadFile(html, `laporan-praktik-${new Date().toISOString().split('T')[0]}.doc`, 'application/msword');
    showToast('File Word berhasil diunduh', 'success');
  } catch (error) {
    showToast('Gagal membuat file Word: ' + error.message, 'error');
  } finally {
    hideLoadingState(exportWord);
  }
});

// ==================== ATTENDANCE FORM LISTENERS ====================
// Status buttons
document.querySelectorAll('.attendance-status-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setAttendanceStatus(btn.dataset.status);
  });
});

// Attendance Date input change listener
if (attendanceDate) {
  attendanceDate.addEventListener('change', () => {
    evaluateSelectedAttendanceDate(attendanceDate.value);
  });
}

// Attendance Quick Date Shortcuts
document.querySelectorAll('.btn-att-quick-date').forEach(btn => {
  btn.addEventListener('click', () => {
    const offset = parseInt(btn.dataset.offset || 0, 10);
    const dStr = getDateByOffset(offset);
    attendanceDate.value = dStr;
    evaluateSelectedAttendanceDate(dStr);
    showToast(`Tanggal absensi diatur: ${formatDayDate(dStr)}`, 'info');
  });
});

// Quick Time buttons
if (btnNowCheckin) {
  btnNowCheckin.addEventListener('click', () => {
    const now = new Date();
    attendanceCheckin.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    showToast('Jam masuk diisi jam saat ini', 'info');
  });
}

if (btnNowCheckout) {
  btnNowCheckout.addEventListener('click', () => {
    const now = new Date();
    attendanceCheckout.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    showToast('Jam pulang diisi jam saat ini', 'info');
  });
}

// Quick Template Note chips (Hadir IT, Bantuan Perkuliahan, Situasional ke sekolah dulu, dll)
document.querySelectorAll('.btn-quick-note').forEach(btn => {
  btn.addEventListener('click', () => {
    const note = btn.dataset.note || '';
    const loc = btn.dataset.location || '';
    const status = btn.dataset.status || 'Hadir';

    if (attendanceNotes) attendanceNotes.value = note;
    if (loc && attendanceLocation) attendanceLocation.value = loc;
    setAttendanceStatus(status);
    showToast(`Template keterangan dipilih: ${btn.textContent.trim()}`, 'info');
  });
});

// Izin duration toggle listener (single vs range)
document.querySelectorAll('input[name="izin-duration-type"]').forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'range') {
      izinRangeBox.classList.remove('hidden');
      updateIzinRangeCalculation();
    } else {
      izinRangeBox.classList.add('hidden');
    }
  });
});

function updateIzinRangeCalculation() {
  const start = izinStartDate.value;
  const end = izinEndDate.value;
  if (!start || !end) return;

  const workdays = calculateWorkdaysInRange(start, end);
  if (start > end) {
    izinRangeCalcText.textContent = '⚠️ Tanggal selesai harus sama atau setelah tanggal mulai.';
    izinRangeCalcText.className = 'sm:col-span-2 text-xs font-medium text-rose-700 dark:text-rose-300 p-2.5 rounded-xl bg-rose-100/60 dark:bg-rose-900/40';
  } else {
    izinRangeCalcText.textContent = `ℹ️ Terhitung ${workdays.length} hari kerja PKL (Senin – Jumat, otomatis melewati akhir pekan & hari libur nasional).`;
    izinRangeCalcText.className = 'sm:col-span-2 text-xs font-medium text-amber-800 dark:text-amber-300 p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-900/40';
  }
}

if (izinStartDate) izinStartDate.addEventListener('change', updateIzinRangeCalculation);
if (izinEndDate) izinEndDate.addEventListener('change', updateIzinRangeCalculation);

// Image handling
if (attendanceImage) {
  attendanceImage.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto terlalu besar (maksimal 5MB)', 'error');
      attendanceImage.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa format gambar', 'error');
      attendanceImage.value = '';
      return;
    }

    currentAttendanceImageBase64 = await readFileAsDataURL(file);
    attendanceImagePreview.src = currentAttendanceImageBase64;
    attendanceImagePreviewBox.classList.remove('hidden');
    showToast('Foto bukti kehadiran siap disimpan', 'success');
  });
}

if (btnRemoveAttendanceImage) {
  btnRemoveAttendanceImage.addEventListener('click', () => {
    currentAttendanceImageBase64 = null;
    attendanceImage.value = '';
    attendanceImagePreview.src = '';
    attendanceImagePreviewBox.classList.add('hidden');
  });
}

// Cancel edit
if (cancelAttendanceButton) {
  cancelAttendanceButton.addEventListener('click', () => {
    clearAttendanceForm();
    showToast('Mode edit dibatalkan', 'info');
  });
}

// Save Attendance Record (1x Sehari untuk Divisi IT atau Multi-day Izin)
if (saveAttendanceButton) {
  saveAttendanceButton.addEventListener('click', async () => {
    const isEdit = editingAttendanceIndex !== null;
    const statusVal = document.getElementById('attendance-status').value || 'Hadir';
    let notesVal = attendanceNotes.value.trim();
    const currentUser = getCurrentUser() || getStoredUser() || {};

    // Check if multi-day izin is selected
    const isMultiDayIzin = (statusVal === 'Izin' || statusVal === 'Sakit') && 
      document.querySelector('input[name="izin-duration-type"]:checked')?.value === 'range';

    if (isMultiDayIzin && !isEdit) {
      // MULTI-DAY IZIN FLOW
      const start = izinStartDate.value;
      const end = izinEndDate.value;
      if (!start || !end) {
        showToast('Pilih tanggal mulai dan tanggal selesai izin', 'error');
        return;
      }
      if (start > end) {
        showToast('Tanggal selesai harus sama atau setelah tanggal mulai', 'error');
        return;
      }

      const workdays = calculateWorkdaysInRange(start, end);
      if (!workdays.length) {
        showToast('Tidak ada hari kerja PKL (Senin-Jumat) dalam rentang tanggal yang dipilih', 'error');
        return;
      }

      const category = izinCategory.value;
      const combinedNotes = `${category}${notesVal ? ': ' + notesVal : ''} [Rentang: ${start} s/d ${end}]`;

      try {
        showLoadingState(saveAttendanceButton);
        const allEntries = getAttendanceEntries();

        for (const dateStr of workdays) {
          const record = {
            userEmail: currentUser.email || '',
            userName: currentUser.name || '',
            userNis: currentUser.nis || '',
            date: dateStr,
            status: statusVal,
            checkInTime: '-',
            checkOutTime: '-',
            location: category,
            notes: combinedNotes,
            image: currentAttendanceImageBase64 || null,
          };

          // Overwrite if entry on this date exists for current user, or insert new
          const existingIdx = allEntries.findIndex(e => e.date === dateStr && (!currentUser.email || !e.userEmail || e.userEmail === currentUser.email));
          if (existingIdx !== -1) {
            record.id = allEntries[existingIdx].id;
            await saveAttendanceToFirestore(record);
            allEntries[existingIdx] = record;
          } else {
            const firestoreId = await saveAttendanceToFirestore(record);
            record.id = firestoreId;
            allEntries.push(record);
          }
        }

        setAttendanceEntries(allEntries);
        renderAttendanceRecap();
        clearAttendanceForm();
        switchTab('attendance-recap');
        showToast(`Izin untuk ${workdays.length} hari kerja PKL berhasil dicatat!`, 'success');
      } catch (err) {
        console.error('Error saving multi-day izin:', err);
        showToast('Gagal menyimpan izin: ' + err.message, 'error');
      } finally {
        hideLoadingState(saveAttendanceButton);
      }
      return;
    }

    // SINGLE-DAY ATTENDANCE FLOW
    const dateVal = attendanceDate.value;
    if (!dateVal) {
      showToast('Pilih tanggal absensi terlebih dahulu', 'error');
      return;
    }

    let checkinVal = '';
    let checkoutVal = '';
    let locationVal = attendanceLocation.value.trim();

    if (statusVal === 'Hadir') {
      checkinVal = attendanceCheckin.value || '08:00';
      checkoutVal = attendanceCheckout.value || '16:00';
      locationVal = locationVal || 'Divisi IT';
      notesVal = notesVal || 'Hadir kerja di Divisi IT';
    } else if (statusVal === 'Izin' || statusVal === 'Sakit') {
      const category = izinCategory ? izinCategory.value : statusVal;
      locationVal = `${statusVal} - ${category}`;
      checkinVal = '-';
      checkoutVal = '-';
      if (!notesVal) {
        showToast('Tuliskan alasan pada kolom Keterangan untuk status ' + statusVal, 'error');
        return;
      }
    } else if (statusVal === 'Libur Nasional') {
      const dayInfo = getDayInfo(dateVal);
      locationVal = dayInfo.holidayName || 'Libur Nasional / Weekend';
      checkinVal = '-';
      checkoutVal = '-';
    } else {
      checkinVal = attendanceCheckin.value || '08:00';
      checkoutVal = attendanceCheckout.value || '16:00';
      locationVal = locationVal || 'Divisi IT';
    }

    const attRecord = {
      userEmail: currentUser.email || '',
      userName: currentUser.name || '',
      userNis: currentUser.nis || '',
      date: dateVal,
      status: statusVal,
      checkInTime: checkinVal,
      checkOutTime: checkoutVal,
      itTime: '',
      kuliahRoom: '',
      location: locationVal,
      notes: notesVal || 'Hadir',
      image: currentAttendanceImageBase64 || null,
    };

    const entries = getAttendanceEntries();
    
    // Check if entry for this date already exists for current user (1x per day rule)
    const existingIndex = entries.findIndex((e, idx) => 
      e.date === dateVal && 
      idx !== editingAttendanceIndex &&
      (!currentUser.email || !e.userEmail || e.userEmail === currentUser.email)
    );
    const targetIndex = isEdit ? editingAttendanceIndex : (existingIndex !== -1 ? existingIndex : null);

    if (targetIndex !== null) {
      attRecord.id = entries[targetIndex]?.id;
      if (entries[targetIndex]?.userEmail) attRecord.userEmail = entries[targetIndex].userEmail;
      if (entries[targetIndex]?.userName) attRecord.userName = entries[targetIndex].userName;
      if (entries[targetIndex]?.userNis) attRecord.userNis = entries[targetIndex].userNis;
    }

    try {
      showLoadingState(saveAttendanceButton);
      const firestoreId = await saveAttendanceToFirestore(attRecord);
      attRecord.id = firestoreId;

      if (targetIndex !== null) {
        entries[targetIndex] = attRecord;
        showToast('Presensi hari ini berhasil diperbarui', 'success');
      } else {
        entries.unshift(attRecord);
        showToast('Presensi hari ini berhasil dicatat', 'success');
      }

      setAttendanceEntries(entries);
      
      // Update selected month view to match this date
      selectedRecapMonth = dateVal.substring(0, 7);
      renderAttendanceRecap();
      clearAttendanceForm();
      switchTab('attendance-recap');
    } catch (error) {
      console.error('Error saving attendance:', error);
      showToast('Gagal menyimpan presensi: ' + error.message, 'error');
    } finally {
      hideLoadingState(saveAttendanceButton);
    }
  });
}

// Month Selector Listeners in Rekapitulasi Bulanan
if (recapMonthSelect) {
  recapMonthSelect.addEventListener('change', () => {
    selectedRecapMonth = recapMonthSelect.value;
    renderAttendanceRecap();
  });
}

if (btnPrevMonth) {
  btnPrevMonth.addEventListener('click', () => {
    const months = getAvailableMonths();
    const curIdx = months.indexOf(selectedRecapMonth);
    if (curIdx < months.length - 1) {
      selectedRecapMonth = months[curIdx + 1];
    } else {
      // Calculate previous month mathematically
      const [y, m] = selectedRecapMonth.split('-').map(Number);
      const prevDate = new Date(y, m - 2, 1);
      selectedRecapMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    }
    renderAttendanceRecap();
  });
}

if (btnNextMonth) {
  btnNextMonth.addEventListener('click', () => {
    const months = getAvailableMonths();
    const curIdx = months.indexOf(selectedRecapMonth);
    if (curIdx > 0) {
      selectedRecapMonth = months[curIdx - 1];
    } else {
      // Calculate next month mathematically
      const [y, m] = selectedRecapMonth.split('-').map(Number);
      const nextDate = new Date(y, m, 1);
      selectedRecapMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
    }
    renderAttendanceRecap();
  });
}

if (searchAttendance) {
  searchAttendance.addEventListener('input', () => renderAttendanceRecap());
}

if (exportAttendanceExcel) {
  exportAttendanceExcel.addEventListener('click', exportAttendanceExcelHandler);
}

if (exportAttendancePdf) {
  exportAttendancePdf.addEventListener('click', exportAttendancePdfHandler);
}

// ==================== ADMIN PERIOD FILTERS & EXPORT LISTENERS ====================
const periodTaskStart = document.getElementById('period-task-start');
if (periodTaskStart) periodTaskStart.addEventListener('change', renderAdminPeriodTasks);
const periodTaskEnd = document.getElementById('period-task-end');
if (periodTaskEnd) periodTaskEnd.addEventListener('change', renderAdminPeriodTasks);
const periodTaskUser = document.getElementById('period-task-user');
if (periodTaskUser) periodTaskUser.addEventListener('change', renderAdminPeriodTasks);
const periodTaskSearch = document.getElementById('period-task-search');
if (periodTaskSearch) periodTaskSearch.addEventListener('input', renderAdminPeriodTasks);

const periodAttStart = document.getElementById('period-att-start');
if (periodAttStart) periodAttStart.addEventListener('change', renderAdminPeriodAttendance);
const periodAttEnd = document.getElementById('period-att-end');
if (periodAttEnd) periodAttEnd.addEventListener('change', renderAdminPeriodAttendance);
const periodAttUser = document.getElementById('period-att-user');
if (periodAttUser) periodAttUser.addEventListener('change', renderAdminPeriodAttendance);
const periodAttSearch = document.getElementById('period-att-search');
if (periodAttSearch) periodAttSearch.addEventListener('input', renderAdminPeriodAttendance);

const btnExportPeriodTasksExcel = document.getElementById('btn-export-period-tasks-excel');
if (btnExportPeriodTasksExcel) btnExportPeriodTasksExcel.addEventListener('click', exportPeriodTasksExcel);
const btnExportPeriodTasksPdf = document.getElementById('btn-export-period-tasks-pdf');
if (btnExportPeriodTasksPdf) btnExportPeriodTasksPdf.addEventListener('click', exportPeriodTasksPdf);

const btnExportPeriodAttExcel = document.getElementById('btn-export-period-att-excel');
if (btnExportPeriodAttExcel) btnExportPeriodAttExcel.addEventListener('click', exportPeriodAttendanceExcel);
const btnExportPeriodAttPdf = document.getElementById('btn-export-period-att-pdf');
if (btnExportPeriodAttPdf) btnExportPeriodAttPdf.addEventListener('click', exportPeriodAttendancePdf);

// ==================== INITIALIZATION ====================

// Helper: refresh lucide icons setelah dynamic render
function refreshIcons() {
  if (window.lucide) setTimeout(() => lucide.createIcons(), 30);
}
function initializeApp() {
  initTheme();
  requestNotificationPermission();
  updateLiveAttendanceClock();
  
  // Set default dates with local date
  const today = getLocalDateString(new Date());
  selectedRecapMonth = today.substring(0, 7);
  const firstDayOfMonth = `${today.substring(0, 7)}-01`;

  if (taskDate) {
    taskDate.value = today;
    evaluateSelectedTaskDate(today);
  }
  if (attendanceDate) {
    attendanceDate.value = today;
    evaluateSelectedAttendanceDate(today);
  }
  if (izinStartDate) izinStartDate.value = today;
  if (izinEndDate) izinEndDate.value = today;

  const pTaskStart = document.getElementById('period-task-start');
  const pTaskEnd = document.getElementById('period-task-end');
  const pAttStart = document.getElementById('period-att-start');
  const pAttEnd = document.getElementById('period-att-end');

  if (pTaskStart && !pTaskStart.value) pTaskStart.value = firstDayOfMonth;
  if (pTaskEnd && !pTaskEnd.value) pTaskEnd.value = today;
  if (pAttStart && !pAttStart.value) pAttStart.value = firstDayOfMonth;
  if (pAttEnd && !pAttEnd.value) pAttEnd.value = today;

  showAppIfAuthenticated();
}

initializeApp();







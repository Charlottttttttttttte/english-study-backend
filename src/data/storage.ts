import type { DayProgress, UserState } from '../types';
import { getToken } from '../api/auth';

const USER_KEY = 'englishstudy_user';
const PROGRESS_KEY = 'englishstudy_progress';

export function loadUserState(): UserState {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as UserState;
  } catch { /* ignore */ }
  return {
    streak: 0,
    longestStreak: 0,
    totalDays: 0,
    dailyProgress: {},
    gardenLevel: 0,
    totalStudyMinutes: 0,
  };
}

export function saveUserState(state: UserState) {
  localStorage.setItem(USER_KEY, JSON.stringify(state));
}

export function loadDayProgress(date: string): DayProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const all = JSON.parse(raw) as Record<string, DayProgress>;
      return all[date] || createEmptyProgress(date);
    }
  } catch { /* ignore */ }
  return createEmptyProgress(date);
}

export function saveDayProgress(date: string, progress: DayProgress) {
  // Save to localStorage immediately (synchronous)
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, DayProgress>) : {};
    all[date] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch { /* ignore */ }

  // Fire-and-forget: sync to backend if token exists
  if (getToken()) {
    import('../api/progress').then((api) => {
      api.saveProgress(date, progress).catch(() => {/* silent fail */});
    });
  }
}

export function checkinDay(date: string, data: { studyDuration?: number; transcriptText?: string; similarityRate?: number }) {
  const progress = loadDayProgress(date);
  progress.completed = true;
  progress.studyDuration = data.studyDuration || 0;
  progress.transcriptText = data.transcriptText || '';
  progress.similarityRate = data.similarityRate || 0;
  progress.level1Completed = true;
  progress.level2Completed = true;
  progress.level3Completed = true;
  saveDayProgress(date, progress);

  // Fire-and-forget: backend checkin
  if (getToken()) {
    import('../api/progress').then((api) => {
      api.checkin(date, data).catch(() => {/* silent fail */});
    });
  }

  return progress;
}

function createEmptyProgress(date: string): DayProgress {
  return {
    date,
    completed: false,
    studyDuration: 0,
    level1Completed: false,
    level2Completed: false,
    level3Completed: false,
    dictationText: '',
    transcriptText: '',
    matchRate: 0,
    similarityRate: 0,
  };
}

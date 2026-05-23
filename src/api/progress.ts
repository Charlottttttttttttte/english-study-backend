import { callCloudFunction } from './client';
import type { DayProgress } from '../types';
import { getCurrentUser } from './auth';

function getUserId(): string | null {
  const user = getCurrentUser();
  return user?.id || null;
}

export async function getProgress(date: string): Promise<DayProgress> {
  const userId = getUserId();
  if (!userId) return createEmptyProgress(date);

  try {
    const { progress } = await callCloudFunction('getProgress', { userId, date });
    if (!progress) return createEmptyProgress(date);

    return {
      date: progress.date,
      completed: progress.completed || false,
      studyDuration: progress.studyDuration || 0,
      level1Completed: progress.level1Completed || false,
      level2Completed: progress.level2Completed || false,
      level3Completed: progress.level3Completed || false,
      dictationText: progress.dictationText || '',
      transcriptText: progress.transcriptText || '',
      matchRate: progress.matchRate || 0,
      similarityRate: progress.similarityRate || 0,
    };
  } catch {
    return createEmptyProgress(date);
  }
}

export async function saveProgress(date: string, progress: Partial<DayProgress>) {
  const userId = getUserId();
  if (!userId) return;

  try {
    await callCloudFunction('saveProgress', {
      userId,
      date,
      progress: {
        completed: progress.completed ?? false,
        studyDuration: progress.studyDuration ?? 0,
        level1Completed: progress.level1Completed ?? false,
        level2Completed: progress.level2Completed ?? false,
        level3Completed: progress.level3Completed ?? false,
        transcriptText: progress.transcriptText || '',
        matchRate: progress.matchRate ?? 0,
        similarityRate: progress.similarityRate ?? 0,
      },
    });
  } catch {
    // 静默处理
  }
}

export async function checkin(
  date: string,
  data: {
    studyDuration?: number;
    transcriptText?: string;
    similarityRate?: number;
  }
) {
  const userId = getUserId();
  if (!userId) return;

  try {
    await callCloudFunction('checkin', {
      userId,
      date,
      studyDuration: data.studyDuration || 0,
      transcriptText: data.transcriptText || '',
      similarityRate: data.similarityRate || 0,
    });
  } catch {
    // 静默处理
  }
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

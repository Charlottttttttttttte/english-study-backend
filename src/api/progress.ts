import { tcb } from './client';
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
    const { data } = await tcb
      .database()
      .collection('progress')
      .where({ user_id: userId, date })
      .get();

    if (!data || data.length === 0) return createEmptyProgress(date);

    const record = data[0];
    return {
      date: record.date,
      completed: record.completed || false,
      studyDuration: record.study_duration || 0,
      level1Completed: record.level1_completed || false,
      level2Completed: record.level2_completed || false,
      level3Completed: record.level3_completed || false,
      dictationText: record.dictation_text || '',
      transcriptText: record.transcript_text || '',
      matchRate: record.match_rate || 0,
      similarityRate: record.similarity_rate || 0,
    };
  } catch {
    return createEmptyProgress(date);
  }
}

export async function saveProgress(date: string, progress: Partial<DayProgress>) {
  const userId = getUserId();
  if (!userId) return;

  const record = {
    user_id: userId,
    date,
    completed: progress.completed ?? false,
    study_duration: progress.studyDuration ?? 0,
    level1_completed: progress.level1Completed ?? false,
    level2_completed: progress.level2Completed ?? false,
    level3_completed: progress.level3Completed ?? false,
    transcript_text: progress.transcriptText || '',
    match_rate: progress.matchRate ?? 0,
    similarity_rate: progress.similarityRate ?? 0,
  };

  try {
    const { data: existing } = await tcb
      .database()
      .collection('progress')
      .where({ user_id: userId, date })
      .get();

    if (existing && existing.length > 0) {
      await tcb.database().collection('progress').doc(existing[0]._id).update(record);
    } else {
      await tcb.database().collection('progress').add(record);
    }
  } catch {
    // 静默处理
  }
}

export async function checkin(
  date: string,
  data: { studyDuration?: number; transcriptText?: string; similarityRate?: number }
) {
  const userId = getUserId();
  if (!userId) return;

  const existing = await getProgress(date);

  await saveProgress(date, {
    ...existing,
    completed: true,
    level1Completed: true,
    level2Completed: true,
    level3Completed: true,
    studyDuration: data.studyDuration || existing.studyDuration,
    transcriptText: data.transcriptText || existing.transcriptText,
    similarityRate: data.similarityRate || existing.similarityRate,
  });
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

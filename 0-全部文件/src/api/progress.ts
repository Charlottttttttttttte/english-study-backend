import { supabase } from './client';
import type { DayProgress } from '../types';
import { getCurrentUser } from './auth';

function getUserId(): string | null {
  const user = getCurrentUser();
  return user?.id || null;
}

export async function getProgress(date: string): Promise<DayProgress> {
  const userId = getUserId();
  if (!userId) {
    return createEmptyProgress(date);
  }

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error || !data) return createEmptyProgress(date);

  return {
    date: data.date,
    completed: data.completed || false,
    studyDuration: data.study_duration || 0,
    level1Completed: data.level1_completed || false,
    level2Completed: data.level2_completed || false,
    level3Completed: data.level3_completed || false,
    dictationText: data.dictation_text || '',
    transcriptText: data.transcript_text || '',
    matchRate: data.match_rate || 0,
    similarityRate: data.similarity_rate || 0,
  };
}

export async function saveProgress(date: string, progress: Partial<DayProgress>) {
  const userId = getUserId();
  if (!userId) return;

  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

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

  if (existing) {
    await supabase.from('progress').update(record).eq('id', existing.id);
  } else {
    await supabase.from('progress').insert([record]);
  }
}

export async function checkin(date: string, data: { studyDuration?: number; transcriptText?: string; similarityRate?: number }) {
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

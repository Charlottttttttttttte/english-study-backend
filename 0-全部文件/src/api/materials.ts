import { supabase } from './client';
import type { StudyMaterial } from '../types';

export async function getMaterial(dayIndex: number): Promise<StudyMaterial> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('day_index', dayIndex)
    .single();

  if (error || !data) {
    // Fallback to default
    return {
      date: 'default',
      videoSrc: '',
      videoPoster: '/jungle-bg-layer-2.jpg',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'A Day in the Park',
      originalText: 'Today I went to the park...',
      translatedText: '今天我去公园...',
    };
  }

  return {
    date: `day${data.day_index}`,
    videoSrc: data.video_src || '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: data.audio_src || '',
    title: data.title || '',
    originalText: data.original_text || '',
    translatedText: data.translated_text || '',
  };
}

export async function getAllMaterials(): Promise<StudyMaterial[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('day_index');

  if (error || !data) return [];

  return data.map((m: any) => ({
    date: `day${m.day_index}`,
    videoSrc: m.video_src || '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: m.audio_src || '',
    title: m.title || '',
    originalText: m.original_text || '',
    translatedText: m.translated_text || '',
  }));
}

export async function updateMaterial(dayIndex: number, updates: Partial<StudyMaterial>) {
  const { error } = await supabase
    .from('materials')
    .update({
      ...(updates.audioSrc !== undefined && { audio_src: updates.audioSrc }),
      ...(updates.videoSrc !== undefined && { video_src: updates.videoSrc }),
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.originalText !== undefined && { original_text: updates.originalText }),
      ...(updates.translatedText !== undefined && { translated_text: updates.translatedText }),
    })
    .eq('day_index', dayIndex);

  if (error) throw new Error(error.message);
}

import { supabaseRequest } from './client';
import type { StudyMaterial } from '../types';

export async function getMaterial(dayIndex: number): Promise<StudyMaterial> {
  const { data: materials } = await supabaseRequest('materials', 'GET', null, { order: 'day_index.asc' });
  const totalCount = materials?.length || 0;

  if (totalCount === 0) {
    return {
      date: 'default',
      videoSrc: '',
      videoPoster: './jungle-bg-layer-2.jpg',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'A Day in the Park',
      originalText: 'Today I went to the park...',
      translatedText: '今天我去公园...',
    };
  }

  const actualIndex = ((dayIndex - 1) % totalCount) + 1;
  const { data } = await supabaseRequest('materials', 'GET', null, { day_index: `eq.${actualIndex}` });

  if (!data || data.length === 0) {
    return {
      date: 'default',
      videoSrc: '',
      videoPoster: './jungle-bg-layer-2.jpg',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'A Day in the Park',
      originalText: 'Today I went to the park...',
      translatedText: '今天我去公园...',
    };
  }

  const m = data[0];
  return {
    date: `day${m.day_index}`,
    videoSrc: m.video_src || '',
    videoPoster: './jungle-bg-layer-2.jpg',
    audioSrc: m.audio_src || '',
    title: m.title || '',
    originalText: m.original_text || '',
    translatedText: m.translated_text || '',
  };
}

export async function getAllMaterials(): Promise<StudyMaterial[]> {
  const { data: materials } = await supabaseRequest('materials', 'GET', null, { order: 'day_index.asc' });
  if (!materials) return [];

  return materials.map((m: any) => ({
    date: `day${m.day_index}`,
    videoSrc: m.video_src || '',
    videoPoster: './jungle-bg-layer-2.jpg',
    audioSrc: m.audio_src || '',
    title: m.title || '',
    originalText: m.original_text || '',
    translatedText: m.translated_text || '',
  }));
}

export async function updateMaterial(
  dayIndex: number,
  updates: Partial<StudyMaterial>
) {
  const updateData: any = {};
  if (updates.audioSrc !== undefined) updateData.audio_src = updates.audioSrc;
  if (updates.videoSrc !== undefined) updateData.video_src = updates.videoSrc;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.originalText !== undefined) updateData.original_text = updates.originalText;
  if (updates.translatedText !== undefined) updateData.translated_text = updates.translatedText;

  // 先查询 _id
  const { data: existing } = await supabaseRequest('materials', 'GET', null, { day_index: `eq.${dayIndex}` });

  if (existing && existing.length > 0) {
    await supabaseRequest('materials', 'PATCH', updateData, { id: `eq.${existing[0].id}` });
  } else {
    await supabaseRequest('materials', 'POST', {
      day_index: dayIndex,
      ...updateData,
    });
  }
}

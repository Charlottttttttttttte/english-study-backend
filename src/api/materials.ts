import { tcb } from './client';
import type { StudyMaterial } from '../types';

export async function getMaterial(dayIndex: number): Promise<StudyMaterial> {
  const { data: materials } = await tcb
    .database()
    .collection('materials')
    .where({ day_index: dayIndex })
    .get();

  if (!materials || materials.length === 0) {
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

  const data = materials[0];
  return {
    date: `day${data.day_index}`,
    videoSrc: data.video_src || '',
    videoPoster: './jungle-bg-layer-2.jpg',
    audioSrc: data.audio_src || '',
    title: data.title || '',
    originalText: data.original_text || '',
    translatedText: data.translated_text || '',
  };
}

export async function getAllMaterials(): Promise<StudyMaterial[]> {
  const { data: materials } = await tcb
    .database()
    .collection('materials')
    .orderBy('day_index', 'asc')
    .get();

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
  if (updates.originalText !== undefined)
    updateData.original_text = updates.originalText;
  if (updates.translatedText !== undefined)
    updateData.translated_text = updates.translatedText;

  const { data: existingDocs } = await tcb
    .database()
    .collection('materials')
    .where({ day_index: dayIndex })
    .get();

  if (existingDocs && existingDocs.length > 0) {
    await tcb.database().collection('materials').doc(existingDocs[0]._id).update(updateData);
  } else {
    await tcb.database().collection('materials').add({
      day_index: dayIndex,
      ...updateData,
    });
  }
}

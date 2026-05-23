import { callCloudFunction } from './client';
import type { StudyMaterial } from '../types';

export async function getMaterial(dayIndex: number): Promise<StudyMaterial> {
  const { material } = await callCloudFunction('getMaterial', { dayIndex });

  if (!material) {
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

  return {
    date: material.date,
    videoSrc: material.videoSrc || '',
    videoPoster: './jungle-bg-layer-2.jpg',
    audioSrc: material.audioSrc || '',
    title: material.title || '',
    originalText: material.originalText || '',
    translatedText: material.translatedText || '',
  };
}

export async function getAllMaterials(): Promise<StudyMaterial[]> {
  const { materials } = await callCloudFunction('getAllMaterials');
  return (materials || []).map((m: any) => ({
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
  await callCloudFunction('saveMaterial', {
    dayIndex,
    title: updates.title || '',
    audioSrc: updates.audioSrc || '',
    videoSrc: updates.videoSrc || '',
    originalText: updates.originalText || '',
    translatedText: updates.translatedText || '',
  });
}

export interface StudyMaterial {
  date: string;
  videoSrc: string;
  videoPoster: string;
  audioSrc: string;
  title: string;
  originalText: string;
  translatedText: string;
}

export interface DayProgress {
  date: string;
  completed: boolean;
  studyDuration: number;
  level1Completed: boolean;
  level2Completed: boolean;
  level3Completed: boolean;
  dictationText: string;
  transcriptText: string;
  matchRate: number;
  similarityRate: number;
}

export interface UserState {
  streak: number;
  longestStreak: number;
  totalDays: number;
  dailyProgress: Record<string, DayProgress>;
  gardenLevel: number;
  totalStudyMinutes: number;
}

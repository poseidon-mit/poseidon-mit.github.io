export type VideoLayoutMode = 'landscape' | 'portrait';

export const VIDEO_FPS = 30;
export const VIDEO_BPM = 120;
export const VIDEO_DURATION_SECONDS = 30;
export const VIDEO_DURATION_FRAMES = VIDEO_FPS * VIDEO_DURATION_SECONDS;

export const VIDEO_SIZES = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
} as const;

export const VIDEO_SAFE_AREA = {
  landscape: { paddingX: 120, paddingY: 80, scale: 1 },
  portrait: { paddingX: 72, paddingY: 140, scale: 0.9 },
} as const;

export const DEFAULT_AUDIO = {
  musicSrc: 'audio/poseidon-beat.wav',
  voSrc: 'audio/poseidon-vo-30s.mp3', // Placeholder for new VO
  sfxWhooshSrc: 'audio/whoosh.wav',
  sfxHitSrc: 'audio/hit.ogg',
} as const;

// 30 Seconds = 900 Frames
// Shot 1: 0-5s (0-150)
// Shot 2: 5-10s (150-300)
// Shot 3: 10-18s (300-540)
// Shot 4: 18-24s (540-720)
// Shot 5: 24-27s (720-810)
// Shot 6: 27-28.5s (810-855)
// Shot 7: 28.5-30s (855-900)
export const SHOTS = {
  shot1: { start: 0, duration: 150 },
  shot2: { start: 150, duration: 150 },
  shot3: { start: 300, duration: 240 },
  shot4: { start: 540, duration: 180 },
  shot5: { start: 720, duration: 90 },
  shot6: { start: 810, duration: 45 },
  shot7: { start: 855, duration: 45 },
} as const;

export type ShotKey = keyof typeof SHOTS;

export interface VideoConfig {
  fps: number;
  bpm: number;
  durationSeconds: number;
  durationFrames: number;
  shots: typeof SHOTS;
}

export const VIDEO_CONFIG: VideoConfig = {
  fps: VIDEO_FPS,
  bpm: VIDEO_BPM,
  durationSeconds: VIDEO_DURATION_SECONDS,
  durationFrames: VIDEO_DURATION_FRAMES,
  shots: SHOTS,
};

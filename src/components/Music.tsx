import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {speechPresence} from '../anim/envelope';
import {FPS, MUSIC_CROSSFADE_SECONDS, MUSIC_SECONDS, NARRATION_SECONDS, TOTAL_FRAMES} from '../config';

const TRACK_FRAMES = Math.round(MUSIC_SECONDS * FPS);
const XFADE = Math.round(MUSIC_CROSSFADE_SECONDS * FPS);
const STEP = TRACK_FRAMES - XFADE;
const TRACK_COUNT = Math.ceil((TOTAL_FRAMES - TRACK_FRAMES) / STEP) + 1;

// مستوى الموسيقى: خفض تلقائي (sidechain) تحت الكلام اعتماداً على شدة صوت المعلّق الحقيقية،
// مع صعود في المقدمة وارتفاع هادئ بعد آخر كلمة ثم تلاشٍ حتى نهاية الفيديو.
const gainAt = (frame: number): number => {
  const sec = frame / FPS;
  const total = TOTAL_FRAMES / FPS;
  const duck = 0.27 - 0.17 * speechPresence(frame); // 0.27 في الصمت، 0.10 أثناء الكلام
  const intro = interpolate(sec, [0, 2.5], [0, 1], {extrapolateRight: 'clamp'});
  const tail = interpolate(sec, [NARRATION_SECONDS, total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return duck * intro * tail;
};

export const Music: React.FC = () => {
  const tracks = Array.from({length: TRACK_COUNT}, (_, k) => k);
  return (
    <>
      {tracks.map((k) => {
        const from = k * STEP;
        const dur = Math.min(TRACK_FRAMES, TOTAL_FRAMES - from);
        const hasNext = k < TRACK_COUNT - 1;
        return (
          <Sequence key={k} from={from} durationInFrames={dur} layout="none">
            <Audio
              src={staticFile('audio/music.mp3')}
              volume={(f) => {
                const fadeIn = k === 0 ? 1 : interpolate(f, [0, XFADE], [0, 1], {extrapolateRight: 'clamp'});
                const fadeOut = hasNext
                  ? interpolate(f, [TRACK_FRAMES - XFADE, TRACK_FRAMES], [1, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })
                  : 1;
                return gainAt(from + f) * fadeIn * fadeOut;
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};

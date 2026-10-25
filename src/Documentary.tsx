import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {COLORS, FEATURES, NARRATION_SECONDS} from './config';
import {CUES} from './cuePlan';
import {CueRenderer} from './components/CueRenderer';
import {CurrentChapter} from './components/CurrentChapter';
import {FilmOverlay} from './components/FilmOverlay';
import {Music} from './components/Music';
import {NarratorLayer} from './components/NarratorLayer';
import {Scene} from './components/Scene';
import {TimelineBar} from './infographics/Hud';
import {RESOLVED_SCENES} from './lib/timeline';
import {DustMotes} from './overlays/Particles';
import {FilmScratches, ProjectorFlicker} from './overlays/FilmEffects';

export const Documentary: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.charcoal}}>
      {/* 1) الصور التاريخية مع حركة الكاميرا والانتقالات */}
      {RESOLVED_SCENES.map((scene, i) => (
        <Scene key={scene.id} scene={scene} isFirst={i === 0} isLast={i === RESOLVED_SCENES.length - 1} />
      ))}

      {/* 2) الرسوم المتحركة (خرائط، مشاهد، نصوص، أجواء) */}
      {FEATURES.cues && <CueRenderer cues={CUES} />}

      {/* 3) أجواء الفيلم القديم */}
      {FEATURES.dust && <DustMotes amount={0.7} />}
      <FilmOverlay />
      {FEATURES.filmScratches && <FilmScratches amount={0.9} />}
      {FEATURES.projectorFlicker && <ProjectorFlicker amount={1} />}

      {/* 4) شخصية المعلّق */}
      {FEATURES.narrator && <NarratorLayer />}

      {/* 5) الواجهة: مؤشر الفصل والشريط الزمني */}
      {FEATURES.chapterIndicator && <CurrentChapter />}
      {FEATURES.timeline && <TimelineBar totalSec={NARRATION_SECONDS} />}

      {/* 6) الصوت: التعليق الأصلي بلا تعديل + الموسيقى بخفض تلقائي */}
      <Audio src={staticFile('audio/merged.mp3')} />
      <Music />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {TransitionOverlay, transitionLead, transitionStyle} from '../transitions/transitions';
import type {ResolvedScene} from '../types';
import {Caption} from './Caption';
import {ClosingText} from './ClosingText';
import {HistoricalImage} from './HistoricalImage';
import {TitleCard} from './TitleCard';

interface Props {
  scene: ResolvedScene;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * يُرسم المشهد من (startFrame - lead) حتى endFrame؛ يظهر فوق المشهد السابق بنمط الانتقال المحدد في scenePlan.
 */
const SceneBody: React.FC<Props & {total: number; lead: number}> = ({scene, isLast, total, lead}) => {
  const frame = useCurrentFrame();
  const pIn = lead > 0 ? interpolate(frame, [0, lead], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const tStyle = lead > 0 ? transitionStyle(scene.transitionIn, pIn) : {};
  // المشهد الأخير يخفت إلى ظلام جزئي (ليس أسود كاملاً) ليبقى الإطار الأخير مكوّناً
  const endDim = isLast
    ? interpolate(frame, [total - 90, total], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const sceneFrames = total - lead;
  const cardFrames = scene.titleCard?.big ? 150 : 135;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={tStyle}>
        <HistoricalImage
          asset={scene.visualAsset}
          visualType={scene.visualType}
          motionStyle={scene.motionStyle}
          durationInFrames={total}
        />
        {endDim > 0 && <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${endDim})`}} />}
        {scene.titleCard && (
          <Sequence from={lead + 6} durationInFrames={Math.min(cardFrames, Math.max(30, sceneFrames - 12))}>
            <TitleCard card={scene.titleCard} duration={cardFrames} />
          </Sequence>
        )}
        {scene.caption && (
          <Sequence from={lead + 40} durationInFrames={Math.min(120, Math.max(30, sceneFrames - 50))}>
            <Caption text={scene.caption} duration={120} />
          </Sequence>
        )}
        {scene.closingText && (
          <Sequence from={lead} durationInFrames={sceneFrames}>
            <ClosingText text={scene.closingText} />
          </Sequence>
        )}
      </AbsoluteFill>
      {lead > 0 && <TransitionOverlay type={scene.transitionIn} progress={pIn} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<Props> = (props) => {
  const {scene, isFirst} = props;
  const lead = isFirst ? 0 : transitionLead(scene.transitionIn);
  const from = scene.startFrame - lead;
  const total = scene.endFrame - scene.startFrame + lead;
  return (
    <Sequence from={from} durationInFrames={total} layout="none">
      <SceneBody {...props} total={total} lead={lead} />
    </Sequence>
  );
};

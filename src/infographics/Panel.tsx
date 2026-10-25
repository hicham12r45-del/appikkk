import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp, easeOutBack, easeOutCubic, invLerp} from '../anim/math';
import {PAL} from '../art/palette';

export const ART_W = 1280;
export const ART_H = 720;

export type PanelAnchor = 'right' | 'left' | 'center' | 'topRight' | 'topLeft';

interface PanelProps {
  anchor: PanelAnchor;
  /** عرض اللوحة على الشاشة بالبكسل */
  width: number;
  duration: number;
  frameStyle?: 'parchment' | 'none';
  rotate?: number;
  children: React.ReactNode;
}

/** لوحة عرض للرسوم: تُدخل المحتوى المرسوم بمساحة 1280×720 داخل إطار بأسلوب أرشيفي مع ظهور واختفاء */
export const Panel: React.FC<PanelProps> = ({anchor, width, duration, frameStyle = 'parchment', rotate = 0, children}) => {
  const frame = useCurrentFrame();
  const inP = clamp(invLerp(0, 22, frame));
  const outP = clamp(invLerp(duration - 18, duration, frame));
  const appear = easeOutBack(inP);
  const opacity = easeOutCubic(inP) * (1 - outP);
  const scale = width / ART_W;
  const height = ART_H * scale;
  const pad = frameStyle === 'parchment' ? 14 : 0;

  const pos: React.CSSProperties = {};
  switch (anchor) {
    case 'right':
      pos.right = 70;
      pos.top = (1080 - height) / 2 - 20;
      break;
    case 'left':
      pos.left = 70;
      pos.top = (1080 - height) / 2 - 20;
      break;
    case 'center':
      pos.left = (1920 - width) / 2;
      pos.top = (1080 - height) / 2 - 10;
      break;
    case 'topRight':
      pos.right = 60;
      pos.top = 60;
      break;
    case 'topLeft':
      pos.left = 60;
      pos.top = 60;
      break;
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          ...pos,
          width: width + pad * 2,
          height: height + pad * 2,
          opacity,
          transform: `scale(${0.88 + appear * 0.12}) rotate(${rotate}deg)`,
          transformOrigin: 'center center',
          backgroundColor: frameStyle === 'parchment' ? PAL.parchment : 'transparent',
          boxShadow: frameStyle === 'parchment' ? '0 20px 60px rgba(0,0,0,0.65), inset 0 0 40px rgba(125,101,72,0.45)' : 'none',
          padding: pad,
          boxSizing: 'border-box',
        }}
      >
        <div style={{width, height, overflow: 'hidden', position: 'relative', backgroundColor: PAL.charcoal}}>
          <div style={{width: ART_W, height: ART_H, transform: `scale(${scale})`, transformOrigin: 'top left'}}>{children}</div>
        </div>
        {frameStyle === 'parchment' && (
          <>
            <div style={{position: 'absolute', left: 4, top: 4, width: 22, height: 22, borderTop: `3px solid ${PAL.red}`, borderLeft: `3px solid ${PAL.red}`}} />
            <div style={{position: 'absolute', right: 4, top: 4, width: 22, height: 22, borderTop: `3px solid ${PAL.red}`, borderRight: `3px solid ${PAL.red}`}} />
            <div style={{position: 'absolute', left: 4, bottom: 4, width: 22, height: 22, borderBottom: `3px solid ${PAL.red}`, borderLeft: `3px solid ${PAL.red}`}} />
            <div style={{position: 'absolute', right: 4, bottom: 4, width: 22, height: 22, borderBottom: `3px solid ${PAL.red}`, borderRight: `3px solid ${PAL.red}`}} />
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** رسم بملء الشاشة خلف النص (طبقة معتمة) */
export const FullArt: React.FC<{duration: number; dim?: number; children: React.ReactNode}> = ({duration, dim = 0.55, children}) => {
  const frame = useCurrentFrame();
  const inP = clamp(invLerp(0, 24, frame));
  const outP = clamp(invLerp(duration - 20, duration, frame));
  const opacity = easeOutCubic(inP) * (1 - outP);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <AbsoluteFill style={{backgroundColor: `rgba(8,8,10,${dim})`}} />
      <AbsoluteFill>
        <div style={{width: 1920, height: 1080, transform: `scale(${1920 / ART_W})`, transformOrigin: 'top left'}}>
          <div style={{width: ART_W, height: ART_H}}>{children}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

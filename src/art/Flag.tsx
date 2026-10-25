import React from 'react';
import {PAL} from './palette';

export interface FlagProps {
  x: number;
  y: number;
  width: number;
  height: number;
  frame: number;
  color?: string;
  poleHeight?: number;
  /** سرعة التموّج */
  speed?: number;
  /** سعة التموّج */
  amplitude?: number;
  /** نص قصير على الراية (اختياري) */
  emblem?: boolean;
  seed?: number;
}

/** راية متموجة: شرائح عمودية تُزاح بموجة جيبية، مع تظليل لمحاكاة الطيّات */
export const Flag: React.FC<FlagProps> = ({
  x,
  y,
  width,
  height,
  frame,
  color = PAL.red,
  poleHeight,
  speed = 0.16,
  amplitude = 10,
  emblem = false,
  seed = 0,
}) => {
  const strips = 28;
  const stripW = width / strips;
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < strips; i++) {
    const t = i / (strips - 1);
    const grow = 0.15 + t * 0.85; // قرب العمود أقل تموجاً
    const wave = Math.sin(frame * speed + t * 6.2 + seed) * amplitude * grow;
    const waveNext = Math.sin(frame * speed + ((i + 1) / (strips - 1)) * 6.2 + seed) * amplitude * grow;
    const shade = 0.5 + 0.5 * Math.cos(frame * speed + t * 6.2 + seed);
    const x0 = i * stripW;
    parts.push(
      <path
        key={i}
        d={`M ${x0} ${wave} L ${x0 + stripW + 0.6} ${waveNext} L ${x0 + stripW + 0.6} ${waveNext + height} L ${x0} ${wave + height} Z`}
        fill={color}
      />,
    );
    parts.push(
      <path
        key={`s${i}`}
        d={`M ${x0} ${wave} L ${x0 + stripW + 0.6} ${waveNext} L ${x0 + stripW + 0.6} ${waveNext + height} L ${x0} ${wave + height} Z`}
        fill={`rgba(0,0,0,${0.05 + (1 - shade) * 0.22})`}
      />,
    );
  }
  const ph = poleHeight ?? height * 2.4;
  const midWave = Math.sin(frame * speed + 3.1 + seed) * amplitude * 0.58;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={0} y1={-6} x2={0} y2={ph} stroke={PAL.sepiaDark} strokeWidth={Math.max(3, width * 0.018)} strokeLinecap="round" />
      <circle cx={0} cy={-8} r={Math.max(3, width * 0.02)} fill={PAL.gold} />
      <g transform="translate(2 0)">
        {parts}
        {emblem && (
          <g transform={`translate(${width * 0.5} ${height * 0.5 + midWave})`}>
            <circle r={height * 0.2} fill="none" stroke={PAL.gold} strokeWidth={Math.max(2, height * 0.03)} />
            <path
              d={`M 0 ${-height * 0.14} L ${height * 0.04} ${-height * 0.04} L ${height * 0.14} ${-height * 0.04} L ${height * 0.06} ${height * 0.03} L ${height * 0.09} ${height * 0.14} L 0 ${height * 0.07} L ${-height * 0.09} ${height * 0.14} L ${-height * 0.06} ${height * 0.03} L ${-height * 0.14} ${-height * 0.04} L ${-height * 0.04} ${-height * 0.04} Z`}
              fill={PAL.gold}
            />
          </g>
        )}
      </g>
    </g>
  );
};

/** لافتة قماشية بنص عربي (من النص المنطوق فقط) */
export const BannerCloth: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  frame: number;
  text: string;
  fontFamily: string;
  fontSize?: number;
  color?: string;
  textColor?: string;
}> = ({x, y, width, height, frame, text, fontFamily, fontSize = 54, color = PAL.red, textColor = PAL.offWhite}) => {
  const sway = Math.sin(frame * 0.09) * 5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway * 0.35})`}>
      <line x1={0} y1={-24} x2={width} y2={-24} stroke={PAL.sepiaDark} strokeWidth={6} strokeLinecap="round" />
      <path
        d={`M 0 -20 L ${width} -20 L ${width} ${height + sway} Q ${width / 2} ${height - 16 + sway * 0.5} 0 ${height + 4} Z`}
        fill={color}
      />
      <text
        x={width / 2}
        y={height * 0.58}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={700}
        fill={textColor}
        direction="rtl"
      >
        {text}
      </text>
    </g>
  );
};

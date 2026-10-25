import React from 'react';
import {Sequence} from 'remotion';
import {FPS} from '../config';
import type {Cue} from '../cues';
import {BrestMap, CivilWarMap, LeninRouteMap} from '../infographics/Maps';
import {BridgesSeize, BreadQueue, CarDeparture, CrowdFlags, CrownBreak, FactoryWorkers, MarchingSoldiers, SovietAssembly, StationArrival} from '../infographics/StreetScenes';
import {ClockDate, DecreeScroll, PalaceNight, SloganTrio, SovietEmblem, TrenchFront, WorldShift} from '../infographics/DramaScenes';
import {CounterNumber, DateStamp, KineticPhrase, NameLowerThird} from '../infographics/Hud';
import {LightLeak} from '../overlays/FilmEffects';
import {Embers, PaperScraps, Snow} from '../overlays/Particles';

const CueBody: React.FC<{cue: Cue; duration: number}> = ({cue, duration}) => {
  switch (cue.type) {
    case 'factory':
      return <FactoryWorkers duration={duration} />;
    case 'trench':
      return <TrenchFront duration={duration} />;
    case 'queue':
      return <BreadQueue duration={duration} />;
    case 'crowd':
      return <CrowdFlags duration={duration} banner={cue.banner} />;
    case 'crown':
      return <CrownBreak duration={duration} />;
    case 'decree':
      return <DecreeScroll duration={duration} />;
    case 'soviet':
      return <SovietAssembly duration={duration} />;
    case 'route':
      return <LeninRouteMap duration={duration} />;
    case 'slogans':
      return <SloganTrio duration={duration} />;
    case 'march':
      return <MarchingSoldiers duration={duration} />;
    case 'bridges':
      return <BridgesSeize duration={duration} />;
    case 'palace':
      return <PalaceNight duration={duration} />;
    case 'clock':
      return <ClockDate duration={duration} fromDay={cue.fromDay} toDay={cue.toDay} month={cue.month} year={cue.year} />;
    case 'car':
      return <CarDeparture duration={duration} />;
    case 'brest':
      return <BrestMap duration={duration} />;
    case 'civil':
      return <CivilWarMap duration={duration} />;
    case 'emblem':
      return <SovietEmblem duration={duration} />;
    case 'world':
      return <WorldShift duration={duration} />;
    case 'station':
      return <StationArrival duration={duration} />;
    case 'name':
      return <NameLowerThird name={cue.name} role={cue.role} duration={duration} />;
    case 'phrase':
      return <KineticPhrase words={cue.words} duration={duration} position={cue.position} size={cue.size} stagger={cue.stagger} accentIndex={cue.accentIndex} />;
    case 'counter':
      return <CounterNumber to={cue.to} label={cue.label} suffix={cue.suffix} duration={duration} />;
    case 'stamp':
      return <DateStamp text={cue.text} sub={cue.sub} duration={duration} />;
    case 'snow':
      return <Snow amount={cue.amount ?? 1} />;
    case 'embers':
      return <Embers amount={cue.amount ?? 1} />;
    case 'paper':
      return <PaperScraps amount={cue.amount ?? 1} />;
    case 'leak':
      return <LightLeak hue={cue.hue} amount={cue.amount ?? 1} />;
  }
};

export const CueRenderer: React.FC<{cues: Cue[]}> = ({cues}) => (
  <>
    {cues.map((cue) => {
      const from = Math.round(cue.fromSec * FPS);
      const duration = Math.max(24, Math.round((cue.toSec - cue.fromSec) * FPS));
      return (
        <Sequence key={cue.id} from={from} durationInFrames={duration} layout="none">
          <CueBody cue={cue} duration={duration} />
        </Sequence>
      );
    })}
  </>
);

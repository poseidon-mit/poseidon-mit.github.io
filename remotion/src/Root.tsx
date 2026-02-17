import React from 'react';
import { Composition } from 'remotion';
import { loadLocalFonts } from './shared/localFonts';
import { Opening } from './Opening';
import { Demo30s } from './Demo30s';
import { Slide01Title } from './Slide01Title';
import { Slide02Problem } from './Slide02Problem';
import { Slide03WhyNow } from './Slide03WhyNow';
import { Slide04Solution } from './Slide04Solution';
import { Slide05Differentiation } from './Slide05Differentiation';
import { Slide06Business } from './Slide06Business';
import { Slide07Demo } from './Slide07Demo';
import { Slide08Summary } from './Slide08Summary';
import { Slide09Epilogue } from './Slide09Epilogue';
import { ChartDemo } from './ChartDemo';
import { HighFidelityDemo } from './HighFidelityDemo';
import { ChartSpecDemo } from './ChartSpecDemo';
import { ChartVerification } from './ChartVerification';
import { LogoIcon, logoIconSchema } from './LogoIcon';
import { LogoTritonWordmark } from './LogoTritonWordmark';
import { LogoPoseidonWordmark } from './LogoPoseidonWordmark';
import { VideoMaster30s } from './VideoMaster30s';
import { VideoVertical9x16 } from './VideoVertical9x16';
import { VideoMasterWWDCv4 } from './VideoMasterWWDCv4';
import { VideoMasterV5 } from './video/v5/VideoMasterV5';
import { VideoMasterPoseidonIntro } from './video/poseidon-intro/VideoMasterPoseidonIntro';
import { DEFAULT_AUDIO, VIDEO_DURATION_FRAMES } from './video/config';
import { V5_VIDEO_DURATION_FRAMES } from './video/v5/config';
import { VIDEO_DURATION_FRAMES as POSEIDON_INTRO_DURATION_FRAMES, DEFAULT_AUDIO as POSEIDON_INTRO_AUDIO } from './video/poseidon-intro/config';
import { IconSampleSheet } from './IconSampleSheet';
import { Slide01TitleV2 } from './v2/Slide01TitleV2';
import { Slide02ProblemV2 } from './v2/Slide02ProblemV2';
import { Slide02ProblemOptionA } from './v2/Slide02ProblemOptionA';
import { Slide02ProblemOptionB } from './v2/Slide02ProblemOptionB';
import { Slide02ProblemOptionC } from './v2/Slide02ProblemOptionC';
import { Slide03WhyNowV2 } from './v2/Slide03WhyNowV2';
import { Slide04SolutionV2 } from './v2/Slide04SolutionV2';
import { Slide04Solution3A } from './v2/Slide04Solution3A';
import { Slide05DifferentiationV2 } from './v2/Slide05DifferentiationV2';
import { Slide06BusinessV2 } from './v2/Slide06BusinessV2';
import { Slide07FinModelV2 } from './v2/Slide07FinModelV2';
import { Slide07DemoV2 } from './v2/Slide07DemoV2';
import { Slide08SummaryV2 } from './v2/Slide08SummaryV2';
import { Slide09EpilogueV2 } from './v2/Slide09EpilogueV2';
import { Slide10AppendixV2 } from './v2/Slide10AppendixV2';
import { Slide11FinModelV2 } from './v2/Slide11FinModelV2';

import {
  DashboardHeroLayout,
  DashboardHeroMobileLayout,
  ProtectHeroLayout,
  ProtectHeroMobileLayout,
  GrowHeroLayout,
  GrowHeroMobileLayout,
  ExecuteHeroLayout,
  ExecuteHeroMobileLayout,
  GovernHeroLayout,
  GovernHeroMobileLayout,
  SettingsHeroLayout,
  SettingsHeroMobileLayout,
} from './app/hero';

loadLocalFonts();

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_FRAMES = 1;

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Opening"
        component={Opening}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="Demo30s"
        component={Demo30s}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="VideoMaster30s"
        component={VideoMaster30s}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          ...DEFAULT_AUDIO,
          enableAudio: true,
        }}
      />
      <Composition
        id="VideoVertical9x16"
        component={VideoVertical9x16}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          ...DEFAULT_AUDIO,
          enableAudio: true,
        }}
      />
      <Composition
        id="VideoMasterWWDCv4"
        component={VideoMasterWWDCv4}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          ...DEFAULT_AUDIO,
          enableAudio: true,
        }}
      />
      <Composition
        id="VideoMasterV5"
        component={VideoMasterV5}
        durationInFrames={V5_VIDEO_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          ...DEFAULT_AUDIO,
          enableAudio: true,
        }}
      />

      {/* Poseidon Product Intro - 30s promotional video */}
      <Composition
        id="PoseidonProductIntro"
        component={VideoMasterPoseidonIntro}
        durationInFrames={POSEIDON_INTRO_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          ...POSEIDON_INTRO_AUDIO,
          enableAudio: true,
          layout: 'landscape',
          useTier3: true,
        }}
      />
      <Composition
        id="PoseidonProductIntroVertical"
        component={VideoMasterPoseidonIntro}
        durationInFrames={POSEIDON_INTRO_DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          ...POSEIDON_INTRO_AUDIO,
          enableAudio: true,
          layout: 'portrait',
          useTier3: true,
        }}
      />

      <Composition id="Slide01Title" component={Slide01Title} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02Problem" component={Slide02Problem} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide03WhyNow" component={Slide03WhyNow} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide04Solution" component={Slide04Solution} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide05Differentiation" component={Slide05Differentiation} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide06Business" component={Slide06Business} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide07Demo" component={Slide07Demo} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide08Summary" component={Slide08Summary} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide09Epilogue" component={Slide09Epilogue} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition
        id="Slide01TitleDebug"
        component={Slide01Title}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide02ProblemDebug"
        component={Slide02Problem}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide03WhyNowDebug"
        component={Slide03WhyNow}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide04SolutionDebug"
        component={Slide04Solution}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide05DifferentiationDebug"
        component={Slide05Differentiation}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide06BusinessDebug"
        component={Slide06Business}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide07DemoDebug"
        component={Slide07Demo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide08SummaryDebug"
        component={Slide08Summary}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition
        id="Slide09EpilogueDebug"
        component={Slide09Epilogue}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ debug: true, debugGrid: true, debugIds: true }}
      />
      <Composition id="ChartDemo" component={ChartDemo} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HighFidelityDemo" component={HighFidelityDemo} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
      <Composition id="ChartSpecDemo" component={ChartSpecDemo} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="ChartVerification" component={ChartVerification} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      {/* --- Hero Wireframe Layouts (Web + Mobile) --- */}
      <Composition id="HeroDashboardWireframe" component={DashboardHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroProtectWireframe" component={ProtectHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroGrowWireframe" component={GrowHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroExecuteWireframe" component={ExecuteHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroGovernWireframe" component={GovernHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroSettingsWireframe" component={SettingsHeroLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      <Composition id="HeroDashboardMobileWireframe" component={DashboardHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroProtectMobileWireframe" component={ProtectHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroGrowMobileWireframe" component={GrowHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroExecuteMobileWireframe" component={ExecuteHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroGovernMobileWireframe" component={GovernHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="HeroSettingsMobileWireframe" component={SettingsHeroMobileLayout} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      {/* --- Icon Sample Sheet --- */}
      <Composition id="IconSampleSheet" component={IconSampleSheet} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      {/* --- V3 Visual-First Slides (latest master) --- */}
      <Composition id="Slide01TitleV3" component={Slide01TitleV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemV3" component={Slide02ProblemV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionAV3" component={Slide02ProblemOptionA} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionBV3" component={Slide02ProblemOptionB} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionCV3" component={Slide02ProblemOptionC} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide03WhyNowV3" component={Slide03WhyNowV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide04SolutionV3" component={Slide04Solution3A} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide04Solution3A" component={Slide04Solution3A} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide05DifferentiationV3" component={Slide05DifferentiationV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide06BusinessV3" component={Slide06BusinessV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide07DemoV3" component={Slide07DemoV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide08SummaryV3" component={Slide08SummaryV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide09EpilogueV3" component={Slide09EpilogueV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide10AppendixV3" component={Slide10AppendixV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide11FinModelV3" component={Slide11FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      {/* --- V3 Debug Compositions (grid + IDs overlay) --- */}
      <Composition id="Slide01TitleV3Debug" component={Slide01TitleV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02ProblemV3Debug" component={Slide02ProblemV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionAV3Debug" component={Slide02ProblemOptionA} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionBV3Debug" component={Slide02ProblemOptionB} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionCV3Debug" component={Slide02ProblemOptionC} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide03WhyNowV3Debug" component={Slide03WhyNowV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide04SolutionV3Debug" component={Slide04SolutionV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide05DifferentiationV3Debug" component={Slide05DifferentiationV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide06BusinessV3Debug" component={Slide06BusinessV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide07DemoV3Debug" component={Slide07DemoV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide08SummaryV3Debug" component={Slide08SummaryV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide09EpilogueV3Debug" component={Slide09EpilogueV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide10AppendixV3Debug" component={Slide10AppendixV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide11FinModelV3Debug" component={Slide11FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />

      {/* --- V2 Visual-First Slides (legacy compatibility) --- */}
      <Composition id="Slide01TitleV2" component={Slide01TitleV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemV2" component={Slide02ProblemV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionA" component={Slide02ProblemOptionA} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionB" component={Slide02ProblemOptionB} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide02ProblemOptionC" component={Slide02ProblemOptionC} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide03WhyNowV2" component={Slide03WhyNowV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide04SolutionV2" component={Slide04SolutionV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide05DifferentiationV2" component={Slide05DifferentiationV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide06BusinessV2" component={Slide06BusinessV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide07FinModelV2" component={Slide07FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide07DemoV2" component={Slide07DemoV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide08SummaryV2" component={Slide08SummaryV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide09EpilogueV2" component={Slide09EpilogueV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide10AppendixV2" component={Slide10AppendixV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Slide11FinModelV2" component={Slide11FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

      {/* --- V2 Debug Compositions (legacy compatibility) --- */}
      <Composition id="Slide01TitleV2Debug" component={Slide01TitleV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02ProblemV2Debug" component={Slide02ProblemV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionADebug" component={Slide02ProblemOptionA} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionBDebug" component={Slide02ProblemOptionB} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide02OptionCDebug" component={Slide02ProblemOptionC} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide03WhyNowV2Debug" component={Slide03WhyNowV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide04SolutionV2Debug" component={Slide04SolutionV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide05DiffV2Debug" component={Slide05DifferentiationV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide06BusinessV2Debug" component={Slide06BusinessV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide07FinModelV2Debug" component={Slide07FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide07DemoV2Debug" component={Slide07DemoV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide08SummaryV2Debug" component={Slide08SummaryV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide09EpilogueV2Debug" component={Slide09EpilogueV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide10AppendixV2Debug" component={Slide10AppendixV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />
      <Composition id="Slide11FinModelV2Debug" component={Slide11FinModelV2} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ debug: true, debugGrid: true, debugIds: true }} />


      {/* --- Logo Export Targets --- */}
      <Composition
        id="LogoFavicon"
        component={LogoIcon}
        schema={logoIconSchema}
        width={64}
        height={64}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'favicon', background: 'transparent' }}
      />

      <Composition
        id="LogoAppIcon"
        component={LogoIcon}
        schema={logoIconSchema}
        width={512}
        height={512}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'app-icon', background: 'transparent', showShield: false }}
      />

      <Composition
        id="LogoStandard"
        component={LogoIcon}
        schema={logoIconSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'standard', background: 'transparent', showShield: false, showParticles: false }}
      />

      <Composition
        id="LogoWordmark"
        component={LogoIcon}
        schema={logoIconSchema}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'wordmark', background: 'transparent', showShield: false, showWordmark: true }}
      />

      <Composition
        id="LogoPrint"
        component={LogoIcon}
        schema={logoIconSchema}
        width={2160}
        height={2160}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'print', background: 'transparent', showShield: false, showParticles: false }}
      />

      <Composition
        id="LogoTridentOnly"
        component={LogoIcon}
        schema={logoIconSchema}
        width={2160}
        height={2160}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'trident-only', background: 'transparent', showShield: false, showParticles: false }}
      />

      {/* --- Poseidon Lettermark Logo Concepts --- */}
      <Composition
        id="LogoTritonWordmarkOnly"
        component={LogoTritonWordmark}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'wordmark-only', background: 'navy' }}
      />
      <Composition
        id="LogoTritonLockupH"
        component={LogoTritonWordmark}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'lockup-horizontal', background: 'navy' }}
      />
      <Composition
        id="LogoTritonLockupStacked"
        component={LogoTritonWordmark}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'lockup-stacked', background: 'navy' }}
      />

      {/* --- Poseidon Wordmark Logo --- */}
      <Composition
        id="LogoPoseidonStacked"
        component={LogoPoseidonWordmark}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'stacked', background: 'navy' }}
      />
      <Composition
        id="LogoPoseidonHorizontal"
        component={LogoPoseidonWordmark}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'horizontal', background: 'navy' }}
      />
      <Composition
        id="LogoPoseidonTextOnly"
        component={LogoPoseidonWordmark}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'text-only', background: 'navy' }}
      />
      {/* Font comparison: Sora variant */}
      <Composition
        id="LogoPoseidonStackedSora"
        component={LogoPoseidonWordmark}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        defaultProps={{ variant: 'stacked', background: 'navy', fontFamily: "'Sora', system-ui, sans-serif" }}
      />

    </>
  );
};

export default RemotionRoot;

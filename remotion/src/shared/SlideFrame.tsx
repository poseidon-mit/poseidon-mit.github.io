import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './theme';
import { copy } from './copy';
import { SlideDebug } from './SlideDebug';

interface SlideFrameProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showDisclosure?: boolean;
  slideNumber?: number;
  totalSlides?: number;
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
  debugSizes?: boolean;
  debugOverflow?: boolean;
}

export const SlideFrame: React.FC<SlideFrameProps> = ({
  children,
  showFooter = true,
  showDisclosure = false,
  slideNumber,
  totalSlides = 10,
  debug = false,
  debugGrid,
  debugIds,
  debugSizes,
  debugOverflow,
}) => {
  const showGrid = debug && (debugGrid ?? true);
  const showIds = debug && (debugIds ?? true);
  const showSizes = debug && (debugSizes ?? true);
  const showOverflow = debug && (debugOverflow ?? true);

  return (
    <AbsoluteFill
      style={{
        background: theme.aurora.baseGradient,
        color: 'white',
        fontFamily: theme.typography.fontUi,
        position: 'relative',
      }}
    >
      {/* Aurora layer (slides.css .slide-artboard::before) */}
      <div
        style={{
          position: 'absolute',
          inset: '-12% -8% -6% -8%',
          background: theme.aurora.layers,
          opacity: theme.aurora.auroraOpacity,
          filter: `blur(${theme.aurora.auroraBlur}px) saturate(1.12)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette + grain (slides.css .slide-artboard::after) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `${theme.vignette.topVignette}, ${theme.vignette.bottomVignette}, ${theme.vignette.grainPattern}`,
          backgroundSize: 'auto, auto, 3px 3px',
          opacity: theme.vignette.vignetteOpacity,
          pointerEvents: 'none',
        }}
      />
      {/* Content area (safe margins 140px / 100px) */}
      <div
        style={{
          position: 'absolute',
          top: theme.spacing.marginY,
          left: theme.spacing.marginX,
          right: theme.spacing.marginX,
          bottom: theme.spacing.marginY,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <SlideDebug showGrid={showGrid} showIds={showIds} showSizes={showSizes} showOverflow={showOverflow} />
      {/* Footer */}
      {showFooter && (
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              left: theme.spacing.marginX,
              right: theme.spacing.marginX,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: theme.typography.fontMono,
              fontSize: theme.typographyScale.footnote,
              lineHeight: 1.2,
              color: 'rgba(255,255,255,0.55)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 8,
              zIndex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>{copy.footer.text}</div>
          {showDisclosure && <div style={{ whiteSpace: 'nowrap' }}>{copy.footer.disclosure}</div>}
          {slideNumber != null && (
            <div style={{ whiteSpace: 'nowrap' }}>{slideNumber} / {totalSlides}</div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

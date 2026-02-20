import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Act1Awakening } from './master-scenes/Act1Awakening';
import { Act2DeepResolution } from './master-scenes/Act2DeepResolution';
import { Act3TotalOrchestration } from './master-scenes/Act3TotalOrchestration';
import { Act4Convergence } from './master-scenes/Act4Convergence';

export const PoseidonMasterFilm: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#050508' }}>

            {/* ACT I: AWAKENING (0.0s - 7.0s) -> 210 frames */}
            <Sequence from={0} durationInFrames={210}>
                <Act1Awakening />
            </Sequence>

            {/* ACT II: DEEP RESOLUTION (7.0s - 14.5s) -> 225 frames */}
            <Sequence from={210} durationInFrames={225}>
                <Act2DeepResolution />
            </Sequence>

            {/* ACT III: TOTAL ORCHESTRATION (14.5s - 23.0s) -> 255 frames */}
            <Sequence from={435} durationInFrames={255}>
                <Act3TotalOrchestration />
            </Sequence>

            {/* ACT IV: CONVERGENCE (23.0s - 30.0s) -> 210 frames */}
            <Sequence from={690} durationInFrames={210}>
                <Act4Convergence />
            </Sequence>

        </AbsoluteFill>
    );
};

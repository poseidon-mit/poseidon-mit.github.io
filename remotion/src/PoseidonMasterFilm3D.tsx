import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Act1Awakening3D } from './master-scenes-3d/Act1Awakening3D';
import { Act2DeepResolution3D } from './master-scenes-3d/Act2DeepResolution3D';
import { Act3TotalOrchestration3D } from './master-scenes-3d/Act3TotalOrchestration3D';
import { Act4Convergence3D } from './master-scenes-3d/Act4Convergence3D';

export const PoseidonMasterFilm3D: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#020202' }}>

            <ThreeCanvas
                linear
                width={1920}
                height={1080}
                camera={{ fov: 45, position: [0, 0, 10] }}
            >
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                <ambientLight intensity={0.2} />

                {/* ACT I: AWAKENING (0.0s - 7.0s) -> 210 frames */}
                <Act1Awakening3D startFrame={0} durationInFrames={210} />

                {/* ACT II: DEEP RESOLUTION (7.0s - 14.5s) -> 225 frames */}
                <Act2DeepResolution3D startFrame={210} durationInFrames={225} />

                {/* ACT III: TOTAL ORCHESTRATION (14.5s - 23.0s) -> 255 frames */}
                <Act3TotalOrchestration3D startFrame={435} durationInFrames={255} />

                {/* ACT IV: CONVERGENCE (23.0s - 30.0s) -> 210 frames */}
                <Act4Convergence3D startFrame={690} durationInFrames={210} />

            </ThreeCanvas>

        </AbsoluteFill>
    );
};

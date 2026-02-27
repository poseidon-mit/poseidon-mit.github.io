import React from 'react';
import { Slide02ProblemV2 } from './v2/active/Slide02ProblemV2';

interface Slide02ProblemProps {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide02Problem: React.FC<Slide02ProblemProps> = (props) => {
  return <Slide02ProblemV2 {...props} />;
};

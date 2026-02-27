import React from 'react';
import { Slide02ProblemOptionA } from './Slide02ProblemOptionA';

interface Slide02ProblemV2Props {
  debug?: boolean;
  debugGrid?: boolean;
  debugIds?: boolean;
}

export const Slide02ProblemV2: React.FC<Slide02ProblemV2Props> = (props) => {
  return <Slide02ProblemOptionA {...props} />;
};

import Dashboard from './Dashboard';
import Protect from './protect/Protect';
import Grow from './Grow';
import Execute from './Execute';
import Govern from './Govern';
import Settings from './Settings';

export type EngineWorkspaceSlug = 'protect' | 'grow' | 'execute' | 'govern' | 'settings';

export function EngineWorkspace({ slug }: { slug: EngineWorkspaceSlug }) {
  if (slug === 'protect') return <Protect />;
  if (slug === 'grow') return <Grow />;
  if (slug === 'execute') return <Execute />;
  if (slug === 'govern') return <Govern />;
  if (slug === 'settings') return <Settings />;
  return <Dashboard />;
}

export default EngineWorkspace;

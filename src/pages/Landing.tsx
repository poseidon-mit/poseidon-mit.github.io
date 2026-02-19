import { LandingExperience } from '@/components/landing/LandingExperience';

export default function Landing() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <main id="main-content" role="main">
        <LandingExperience />
      </main>
    </>
  );
}

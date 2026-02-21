/**
 * DOM-based Confetti Animation for Poseidon
 * Particle-based animation system with physics simulation
 * Part of Gap 6: Emotional/Wellness UX
 */

interface ConfettiOptions {
  count?: number;
  duration?: number;
  colors?: string[];
  origin?: { x: number; y: number };
}

// Default color palette from theme
const DEFAULT_COLORS = [
  '#14B8A6', // teal
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#00F0FF', // cyan
  '#EAB308'  // gold
];

const DEFAULT_COUNT = 50;
const DEFAULT_DURATION = 3000;

// CSS keyframes injected once
let keyframesInjected = false;

/**
 * Inject confetti animation keyframes into document head
 */
function injectKeyframes(): void {
  if (keyframesInjected) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(var(--fall-distance)) translateX(var(--drift-x)) rotate(var(--rotation));
        opacity: 0;
      }
    }

    .confetti-particle {
      position: fixed;
      pointer-events: none;
      animation: confetti-fall var(--duration) ease-in forwards;
    }
  `;

  document.head.appendChild(style);
  keyframesInjected = true;
}

/**
 * Launch confetti animation from a specified origin
 * @param options Configuration for confetti animation
 */
export function launchConfetti(options: ConfettiOptions = {}): void {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const {
    count = DEFAULT_COUNT,
    duration = DEFAULT_DURATION,
    colors = DEFAULT_COLORS,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  } = options;

  // Inject keyframes if not already done
  injectKeyframes();

  // Create container
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;

  // Create particles
  const particles: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';

    // Random size between 8-12px
    const size = Math.random() * 4 + 8;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Random drift (-100px to +100px)
    const driftX = (Math.random() - 0.5) * 200;
    // Fall distance based on screen height
    const fallDistance = window.innerHeight + 100;
    // Random rotation (0-720deg)
    const rotation = Math.random() * 720;

    const durationMs = duration;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 2px;
      left: ${origin.x}px;
      top: ${origin.y}px;
      --duration: ${durationMs}ms;
      --fall-distance: ${fallDistance}px;
      --drift-x: ${driftX}px;
      --rotation: ${rotation}deg;
    `;

    container.appendChild(particle);
    particles.push(particle);
  }

  // Add container to body
  document.body.appendChild(container);

  // Remove after animation completes + buffer
  setTimeout(() => {
    container.remove();
    particles.forEach(p => p.remove());
  }, duration + 100);
}

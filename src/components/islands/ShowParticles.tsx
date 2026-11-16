/**
 * Campo de partículas 3D del hero de /show (React Bits · Particles, WebGL).
 * Gira lentamente y reacciona al cursor con paralaje.
 */
import Particles from '@/components/reactbits/Particles';

export default function ShowParticles() {
  return (
    <Particles
      particleColors={['#5cd48e', '#f4c95d', '#f4ede1']}
      particleCount={320}
      particleSpread={11}
      speed={0.08}
      particleBaseSize={110}
      sizeRandomness={1}
      moveParticlesOnHover
      particleHoverFactor={1.4}
      hoverEffect="parallax"
      alphaParticles
      cameraDistance={20}
    />
  );
}

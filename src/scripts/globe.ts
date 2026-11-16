/**
 * Globo 3D del hero (three.js, sin React).
 * - Esfera de puntos + meridianos/paralelos.
 * - Costa Rica marcada con un pulso y arcos animados hacia otras ciudades.
 * - Arrastrar para girar (con inercia); gira solo si no se interactúa.
 * - Toma los colores de las variables CSS y se actualiza al cambiar el tema.
 * - Solo dibuja mientras está visible en pantalla.
 *
 * Se importa de forma diferida desde main.ts: three.js no se descarga
 * hasta que el globo va a mostrarse.
 */
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

const RADIUS = 1;
const HOME = { lat: 9.93, lon: -84.08 }; // San José, Costa Rica
const DESTINATIONS = [
  { lat: 19.43, lon: -99.13 }, // Ciudad de México
  { lat: 40.71, lon: -74.0 }, // Nueva York
  { lat: 40.42, lon: -3.7 }, // Madrid
  { lat: -23.55, lon: -46.63 }, // São Paulo
  { lat: 4.71, lon: -74.07 }, // Bogotá
  { lat: 37.77, lon: -122.42 }, // San Francisco
];

function latLonToVector(lat: number, lon: number, radius = RADIUS): Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function cssColor(name: string, fallback: string): Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color(value || fallback);
}

export function mountGlobe(container: HTMLElement, reducedMotion: boolean): () => void {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.touchAction = 'pan-y';
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  const globe = new Group();
  scene.add(globe);

  /* --- Puntos (esfera de Fibonacci) --- */
  const dotCount = 2200;
  const dotPositions: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < dotCount; i++) {
    const y = 1 - (i / (dotCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const angle = golden * i;
    dotPositions.push(Math.cos(angle) * r * RADIUS, y * RADIUS, Math.sin(angle) * r * RADIUS);
  }
  const dotGeometry = new BufferGeometry();
  dotGeometry.setAttribute('position', new Float32BufferAttribute(dotPositions, 3));
  const dotMaterial = new PointsMaterial({ size: 0.014, transparent: true, opacity: 0.55, sizeAttenuation: true });
  globe.add(new Points(dotGeometry, dotMaterial));

  /* --- Núcleo para ocultar la cara trasera --- */
  const coreMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.88 });
  globe.add(new Mesh(new SphereGeometry(RADIUS * 0.985, 48, 48), coreMaterial));

  /* --- Meridianos y paralelos --- */
  const gridMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.22 });
  for (let lon = 0; lon < 180; lon += 30) {
    const points: Vector3[] = [];
    for (let lat = -90; lat <= 270; lat += 4) points.push(latLonToVector(lat, lon, RADIUS * 1.001));
    globe.add(new Line(new BufferGeometry().setFromPoints(points), gridMaterial));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const points: Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 4) points.push(latLonToVector(lat, lon, RADIUS * 1.001));
    globe.add(new Line(new BufferGeometry().setFromPoints(points), gridMaterial));
  }

  /* --- Costa Rica: punto + anillo que pulsa --- */
  const home = latLonToVector(HOME.lat, HOME.lon, RADIUS * 1.01);
  const accentMaterial = new MeshBasicMaterial();
  const homeDot = new Mesh(new SphereGeometry(0.03, 16, 16), accentMaterial);
  homeDot.position.copy(home);
  globe.add(homeDot);

  const ringMaterial = new MeshBasicMaterial({ transparent: true, side: DoubleSide, blending: AdditiveBlending });
  const ring = new Mesh(new RingGeometry(0.05, 0.065, 48), ringMaterial);
  ring.position.copy(home);
  ring.lookAt(home.clone().multiplyScalar(2));
  globe.add(ring);

  /* --- Arcos hacia otras ciudades + "viajeros" --- */
  const arcMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.55 });
  const destMaterial = new MeshBasicMaterial();
  const travelerMaterial = new MeshBasicMaterial();
  const arcs: { curve: QuadraticBezierCurve3; traveler: Mesh; offset: number }[] = [];

  DESTINATIONS.forEach((destination, index) => {
    const end = latLonToVector(destination.lat, destination.lon, RADIUS * 1.01);
    const distance = home.distanceTo(end);
    const mid = home
      .clone()
      .add(end)
      .normalize()
      .multiplyScalar(RADIUS + distance * 0.38);
    const curve = new QuadraticBezierCurve3(home, mid, end);
    globe.add(new Line(new BufferGeometry().setFromPoints(curve.getPoints(64)), arcMaterial));

    const destDot = new Mesh(new SphereGeometry(0.018, 12, 12), destMaterial);
    destDot.position.copy(end);
    globe.add(destDot);

    const traveler = new Mesh(new SphereGeometry(0.016, 12, 12), travelerMaterial);
    globe.add(traveler);
    arcs.push({ curve, traveler, offset: index / DESTINATIONS.length });
  });

  /* --- Colores desde el tema --- */
  const applyColors = (): void => {
    dotMaterial.color = cssColor('--muted', '#b8ad9d');
    gridMaterial.color = cssColor('--line-strong', '#463c32');
    coreMaterial.color = cssColor('--bg', '#13100d');
    const accent = cssColor('--accent', '#5cd48e');
    const accent2 = cssColor('--accent-2', '#f4c95d');
    accentMaterial.color = accent;
    ringMaterial.color = accent;
    arcMaterial.color = accent;
    destMaterial.color = accent2;
    travelerMaterial.color = accent2;
  };
  applyColors();
  const themeObserver = new MutationObserver(applyColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* --- Orientación inicial: Costa Rica mirando a la cámara --- */
  const homeY = Math.atan2(-home.x, home.z);
  let rotationY = homeY - 0.35;
  let rotationX = 0.18;
  let velocityY = 0;
  let velocityX = 0;

  /* --- Arrastrar para girar --- */
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastInteraction = -Infinity;
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';

  const onDown = (event: PointerEvent): void => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent): void => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    velocityY = dx * 0.005;
    velocityX = dy * 0.003;
    rotationY += velocityY;
    rotationX = Math.max(-0.9, Math.min(0.9, rotationX + velocityX));
    lastInteraction = performance.now();
  };
  const onUp = (): void => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  /* --- Tamaño --- */
  const resize = (): void => {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  /* --- Bucle de render (solo si está visible) --- */
  let frame = 0;
  let visible = true;
  const start = performance.now();

  const render = (now: number): void => {
    frame = 0;
    const t = (now - start) / 1000;

    if (!dragging) {
      rotationY += velocityY;
      rotationX = Math.max(-0.9, Math.min(0.9, rotationX + velocityX));
      velocityY *= 0.94;
      velocityX *= 0.9;
      // En reposo oscila alrededor de Costa Rica para que siempre quede a la vista
      if (!reducedMotion && now - lastInteraction > 2500) {
        const target = homeY - 0.25 + Math.sin(t * 0.25) * 0.6;
        // camino más corto hacia el objetivo (por si el usuario dio varias vueltas)
        const delta = Math.atan2(Math.sin(target - rotationY), Math.cos(target - rotationY));
        rotationY += delta * 0.012;
        rotationX += (0.18 - rotationX) * 0.012;
      }
    }
    globe.rotation.set(rotationX, rotationY, 0);

    if (!reducedMotion) {
      const pulse = (t % 2) / 2;
      ring.scale.setScalar(1 + pulse * 2.4);
      ringMaterial.opacity = 0.9 * (1 - pulse);
      arcs.forEach(({ curve, traveler, offset }) => {
        traveler.position.copy(curve.getPoint((t * 0.22 + offset) % 1));
      });
    } else {
      ringMaterial.opacity = 0.6;
      arcs.forEach(({ curve, traveler }) => traveler.position.copy(curve.getPoint(0.5)));
    }

    renderer.render(scene, camera);
    // Con movimiento reducido solo se redibuja al arrastrar o mientras hay inercia
    const moving = dragging || Math.abs(velocityY) > 0.0001 || Math.abs(velocityX) > 0.0001;
    if (visible && !document.hidden && (!reducedMotion || moving)) frame = requestAnimationFrame(render);
  };

  const play = (): void => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  canvas.addEventListener('pointerdown', play);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) play();
  });
  visibilityObserver.observe(container);

  const onVisibility = (): void => {
    if (!document.hidden && visible) play();
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Redibuja al cambiar de tema aunque esté en pausa
  const themeRepaint = new MutationObserver(play);
  themeRepaint.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  play();
  container.dataset.ready = 'true';

  return () => {
    cancelAnimationFrame(frame);
    themeObserver.disconnect();
    themeRepaint.disconnect();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.dispose();
    canvas.remove();
  };
}

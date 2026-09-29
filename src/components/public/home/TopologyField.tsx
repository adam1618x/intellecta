"use client";

import { useMemo, type CSSProperties } from "react";

type EffectMode = "light" | "dark";

type FocusRole = "background" | "button" | "visual";

type FocusTarget = {
  selector: string;
  role: FocusRole;
  fit?: "cover" | "contain-square" | "wide-wordmark" | "portrait-stage";
  preserveTransform?: boolean;
};

type EffectDefinition = {
  title: string;
  source: string;
  background: string;
  targets: readonly FocusTarget[];
  theme?: {
    nativeMode?: EffectMode;
    lightBackground: string;
    darkBackground: string;
    invertBackground?: boolean;
  };
  hiddenTargets?: readonly string[];
};

export type TopologyFieldProps = {
  mode?: EffectMode;
  hue?: number;
  saturation?: number;
  brightness?: number;
  /** Node/line color, hex. Default white. */
  color?: string;
  /** Kept for compatibility. The sphere is always centered. */
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const TOPOLOGY_FIELD_DEFAULTS = {
  mode: "dark",
  hue: 0,
  saturation: 1,
  brightness: 1,
  color: "#ffffff",
  flip: false,
} as const;

const topologySource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Topology</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body style="background: transparent; overflow: hidden; margin: 0; padding: 0;">

    <canvas id="animationCanvas" style="position: absolute; inset: 0; width: 100%; height: 100%; cursor: grab; touch-action: pan-y;"></canvas>

    <script>
        const COLOR = "__COLOR__";

        const canvas = document.getElementById('animationCanvas');

        let width = window.innerWidth;
        let height = window.innerHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 4000);
        camera.position.z = 900;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);

        const base = new THREE.Color(COLOR);

        // pivot = user drag rotation, group = automatic spin
        const pivot = new THREE.Group();
        const group = new THREE.Group();
        pivot.add(group);
        scene.add(pivot);

        const numNodes = 120;
        const nodes = [];
        const nodeGeo = new THREE.SphereGeometry(1, 16, 16);

        for (let i = 0; i < numNodes; i++) {
            let phi = Math.acos(-1 + (2 * i) / numNodes);
            let theta = Math.sqrt(numNodes * Math.PI) * phi;
            let x = Math.cos(theta) * Math.sin(phi);
            let y = Math.sin(theta) * Math.sin(phi);
            let z = Math.cos(phi);

            let mesh = new THREE.Mesh(
                nodeGeo,
                new THREE.MeshBasicMaterial({ color: base, transparent: true, opacity: 0.9 })
            );
            mesh.position.set(x, y, z);
            mesh.userData = {
                baseSize: Math.random() * 1.5 + 1.0,
                pulseSpeed: Math.random() * 0.02 + 0.015,
                pulseOffset: Math.random() * Math.PI * 2
            };
            group.add(mesh);
            nodes.push(mesh);
        }

        const linePos = [];
        const lineColors = [];
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                let dist = nodes[i].position.distanceTo(nodes[j].position);
                const threshold = 0.45;
                if (dist < threshold) {
                    linePos.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                    linePos.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);

                    let alpha = (1 - dist / threshold) * 0.9;
                    lineColors.push(base.r, base.g, base.b, alpha);
                    lineColors.push(base.r, base.g, base.b, alpha);
                }
            }
        }

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            depthWrite: false
        });
        group.add(new THREE.LineSegments(lineGeo, lineMat));

        const VIRTUAL = 640; // desktop sphere size in px

        function resize() {
            width = window.innerWidth || 1;
            height = window.innerHeight || 1;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Render as if the canvas were VIRTUAL px, then let CSS scale it down.
            // Lines and nodes keep the same proportions as on desktop.
            const k = Math.max(1, VIRTUAL / Math.min(width, height));
            renderer.setPixelRatio(Math.min(window.devicePixelRatio * k, 4));
            renderer.setSize(width, height, false);

            const visibleH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const visibleW = visibleH * camera.aspect;
            const R = Math.min(visibleW, visibleH) * 0.42;

            pivot.scale.set(R, R, R);
            pivot.position.set(0, 0, 0);
        }

        window.addEventListener('resize', resize);
        resize();

        let time = 0;
        let dragging = false, lastX = 0, lastY = 0, vx = 0, vy = 0;
        const axisX = new THREE.Vector3(1, 0, 0);
        const axisY = new THREE.Vector3(0, 1, 0);
        const q = new THREE.Quaternion();

        function spin(dx, dy) {
            pivot.quaternion.premultiply(q.setFromAxisAngle(axisY, dx));
            pivot.quaternion.premultiply(q.setFromAxisAngle(axisX, dy));
        }

        canvas.addEventListener('pointerdown', e => {
            dragging = true;
            lastX = e.clientX; lastY = e.clientY;
            vx = vy = 0;
            canvas.setPointerCapture(e.pointerId);
            canvas.style.cursor = 'grabbing';
        });
        canvas.addEventListener('pointermove', e => {
            if (!dragging) return;
            vx = (e.clientX - lastX) * 0.006;
            vy = (e.clientY - lastY) * 0.006;
            lastX = e.clientX; lastY = e.clientY;
            spin(vx, vy);
        });
        function endDrag() {
            if (!dragging) return;
            dragging = false;
            canvas.style.cursor = 'grab';
        }
        canvas.addEventListener('pointerup', endDrag);
        canvas.addEventListener('pointercancel', endDrag);

        function animate() {
            requestAnimationFrame(animate);

            if (!dragging) {
                time += 1;
                if (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001) {
                    spin(vx, vy);
                    vx *= 0.94; vy *= 0.94;
                }
            }

            group.rotation.y = time * 0.0018;
            group.rotation.x = 0.2;
            group.rotation.z = time * 0.0006;

            nodes.forEach(mesh => {
                let p = mesh.userData;
                let pulse = (Math.sin((time * p.pulseSpeed) + p.pulseOffset) + 1) / 2;

                let targetRadius = p.baseSize + pulse * 1.8;
                let scale = targetRadius / pivot.scale.x;

                mesh.scale.set(scale, scale, scale);
                mesh.material.opacity = 0.4 + (pulse * 0.6);
            });

            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>`;

const EFFECT: EffectDefinition = {
  title: "Nexus topology field",
  source: topologySource,
  background: "transparent",
  targets: [{ selector: "#animationCanvas", role: "background" }],
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildFocusedDocument(
  definition: EffectDefinition,
  mode: EffectMode,
  color: string,
) {
  const invertBackground =
    definition.theme?.invertBackground === true &&
    definition.theme.nativeMode !== mode;
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#ffffff";
  const source = definition.source.split("__COLOR__").join(safeColor);
  const targetJson = JSON.stringify(definition.targets).replace(
    /</g,
    "\\u003c",
  );
  const hiddenTargetJson = JSON.stringify(
    definition.hiddenTargets ?? [],
  ).replace(/</g, "\\u003c");
  const modeJson = JSON.stringify(mode);
  const backgroundFilter = invertBackground
    ? "filter: invert(1) hue-rotate(180deg) saturate(.92) brightness(1.02) !important;"
    : "";
  const focusStyle = `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: transparent !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-hidden] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: auto !important; ${backgroundFilter} }
</style>`;
  const focusScript = `<script data-threeui-focus>
(function () {
  document.documentElement.dataset.sfMode = ${modeJson};
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var hiddenSelectors = ${hiddenTargetJson};
    var roots = [];
    hiddenSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        element.setAttribute('data-threeui-hidden', '');
        element.setAttribute('aria-hidden', 'true');
        if ('inert' in element) element.inert = true;
      });
    });
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (spec.fit) element.setAttribute('data-threeui-fit', spec.fit);
      if (spec.preserveTransform) element.setAttribute('data-threeui-preserve-transform', '');
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) {
      var placeholderLink = root.matches('a[href="#"]') ? root : root.querySelector('a[href="#"]');
      if (placeholderLink) placeholderLink.addEventListener('click', function (event) { event.preventDefault(); });
      document.body.appendChild(root);
    });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;
  return source
    .replace(/<\/head>/i, `${focusStyle}</head>`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

export default function TopologyField({
  mode = TOPOLOGY_FIELD_DEFAULTS.mode,
  hue = TOPOLOGY_FIELD_DEFAULTS.hue,
  saturation = TOPOLOGY_FIELD_DEFAULTS.saturation,
  brightness = TOPOLOGY_FIELD_DEFAULTS.brightness,
  color = TOPOLOGY_FIELD_DEFAULTS.color,
  className,
  style,
}: TopologyFieldProps) {
  const safeMode: EffectMode = mode === "light" ? "light" : "dark";
  const source = useMemo(
    () => buildFocusedDocument(EFFECT, safeMode, color),
    [safeMode, color],
  );
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      className={className}
      data-mode={safeMode}
      title={EFFECT.title}
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: "transparent",
        filter,
        ...style,
      }}
    />
  );
}
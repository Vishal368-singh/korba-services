import { useEffect, useRef } from "react";

/**
 * Animated GIS cadastral map background.
 * Renders a full-viewport <canvas> with the property/road/GPS animation,
 * plus the label + scanline overlay. Drop it as the first child of any
 * relatively-positioned container (e.g. your login page) and place your
 * form content in a sibling with a higher z-index.
 *
 * Usage:
 *   <div className="login-page">
 *     <GisCadastralBackground />
 *     <div className="login-card">...your form...</div>
 *   </div>
 */
export default function GisCadastralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = null;
    let lastScan = 0;

    const CONFIG = {
      background: "#4B1223",
      propertyCount: 52,
      surveyorCount: 4,
      gpsCount: 7,
    };

    const rand = (min, max) => Math.random() * (max - min) + min;
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const lerp = (a, b, t) => a + (b - a) * t;

    function resizeCanvas() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ---------------- Properties ----------------
    const properties = [];

    function generateProperties() {
      properties.length = 0;
      const columns = 8;
      const rows = 7;
      const cellW = W / columns;
      const cellH = H / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (properties.length >= CONFIG.propertyCount) break;

          const cx = col * cellW + cellW * 0.5 + rand(-cellW * 0.15, cellW * 0.15);
          const cy = row * cellH + cellH * 0.5 + rand(-cellH * 0.15, cellH * 0.15);
          const width = cellW * rand(0.58, 0.92);
          const height = cellH * rand(0.58, 0.9);
          const points = [];
          const count = Math.floor(rand(5, 8));

          for (let i = 0; i < count; i++) {
            const angle = ((Math.PI * 2) / count) * i;
            const radiusX = width * 0.5 * rand(0.72, 1.05);
            const radiusY = height * 0.5 * rand(0.72, 1.05);
            points.push({
              x: cx + Math.cos(angle) * radiusX,
              y: cy + Math.sin(angle) * radiusY,
            });
          }

          properties.push({
            points,
            phase: rand(0, Math.PI * 2),
            completed: Math.random() < 0.15,
            scanProgress: -1,
            alpha: rand(0.18, 0.42),
          });
        }
      }
    }

    function propertyPath(property) {
      ctx.beginPath();
      const points = property.points;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
    }

    function drawProperties(time) {
      properties.forEach((property) => {
        propertyPath(property);
        const pulse = Math.sin(time * 0.0005 + property.phase) * 0.03;
        ctx.fillStyle = `rgba(75,18,35,${property.alpha + pulse})`;
        ctx.fill();

        ctx.strokeStyle = property.completed
          ? "rgba(204,126,145,.58)"
          : "rgba(160,80,102,.34)";
        ctx.lineWidth = property.completed ? 1.15 : 0.7;
        propertyPath(property);
        ctx.stroke();

        if (property.completed) drawCompletedProperty(property, time);
        if (property.scanProgress >= 0) drawScanAnimation(property);
      });
    }

    function drawCompletedProperty(property, time) {
      const points = property.points;
      const progress = (Math.sin(time * 0.001 + property.phase) + 1) / 2;

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(218,140,158,${0.25 + progress * 0.28})`;
      ctx.setLineDash([4, 7]);
      ctx.lineDashOffset = -time * 0.025;
      propertyPath(property);
      ctx.stroke();
      ctx.restore();

      let centerX = 0;
      let centerY = 0;
      points.forEach((p) => {
        centerX += p.x;
        centerY += p.y;
      });
      centerX /= points.length;
      centerY /= points.length;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 2.1 + progress * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235,170,185,.68)";
      ctx.fill();
    }

    // ---------------- Grid ----------------
    function drawGrid(time) {
      const spacing = Math.max(70, Math.min(110, W / 14));
      ctx.lineWidth = 0.45;

      for (let x = 0; x < W; x += spacing) {
        ctx.strokeStyle = "rgba(255,255,255,.025)";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += spacing) {
        ctx.strokeStyle = "rgba(255,255,255,.025)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const sweep = (time * 0.018) % W;
      const gradient = ctx.createLinearGradient(sweep - 80, 0, sweep + 80, 0);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(180,100,120,.025)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(sweep - 80, 0, 160, H);
    }

    // ---------------- Roads ----------------
    let roads = [];

    function buildRoads() {
      roads = [
        [
          { x: 0, y: H * 0.27 }, { x: W * 0.17, y: H * 0.31 }, { x: W * 0.34, y: H * 0.28 },
          { x: W * 0.52, y: H * 0.34 }, { x: W * 0.72, y: H * 0.29 }, { x: W, y: H * 0.33 },
        ],
        [
          { x: 0, y: H * 0.66 }, { x: W * 0.18, y: H * 0.61 }, { x: W * 0.37, y: H * 0.69 },
          { x: W * 0.55, y: H * 0.62 }, { x: W * 0.77, y: H * 0.68 }, { x: W, y: H * 0.63 },
        ],
        [
          { x: W * 0.18, y: 0 }, { x: W * 0.22, y: H * 0.18 }, { x: W * 0.17, y: H * 0.4 },
          { x: W * 0.23, y: H * 0.63 }, { x: W * 0.19, y: H },
        ],
        [
          { x: W * 0.68, y: 0 }, { x: W * 0.63, y: H * 0.22 }, { x: W * 0.69, y: H * 0.43 },
          { x: W * 0.62, y: H * 0.69 }, { x: W * 0.67, y: H },
        ],
        [
          { x: 0, y: H * 0.47 }, { x: W * 0.2, y: H * 0.44 }, { x: W * 0.42, y: H * 0.49 },
          { x: W * 0.63, y: H * 0.45 }, { x: W, y: H * 0.48 },
        ],
      ];
    }

    function drawRoads() {
      roads.forEach((road) => {
        ctx.beginPath();
        ctx.moveTo(road[0].x, road[0].y);
        for (let i = 1; i < road.length; i++) ctx.lineTo(road[i].x, road[i].y);
        ctx.strokeStyle = "rgba(255,255,255,.045)";
        ctx.lineWidth = 13;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(road[0].x, road[0].y);
        for (let i = 1; i < road.length; i++) ctx.lineTo(road[i].x, road[i].y);
        ctx.strokeStyle = "rgba(255,255,255,.095)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([7, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    function getRoadPoint(road, t) {
      const segments = [];
      let total = 0;
      for (let i = 0; i < road.length - 1; i++) {
        const len = distance(road[i], road[i + 1]);
        segments.push(len);
        total += len;
      }
      let target = t * total;
      for (let i = 0; i < segments.length; i++) {
        if (target <= segments[i]) {
          const ratio = target / segments[i];
          return {
            x: lerp(road[i].x, road[i + 1].x, ratio),
            y: lerp(road[i].y, road[i + 1].y, ratio),
          };
        }
        target -= segments[i];
      }
      return road[road.length - 1];
    }

    let roadVehicles = [];
    let surveyors = [];
    let gpsPoints = [];

    function buildMovers() {
      roadVehicles = Array.from({ length: 10 }, (_, i) => ({
        road: i % roads.length,
        offset: Math.random(),
        speed: rand(0.000025, 0.00006),
      }));

      surveyors = Array.from({ length: CONFIG.surveyorCount }, (_, i) => ({
        road: i % roads.length,
        progress: rand(0, 1),
        speed: rand(0.000025, 0.00005),
        reverse: i % 2 === 0,
      }));

      gpsPoints = Array.from({ length: CONFIG.gpsCount }, () => ({
        x: rand(W * 0.08, W * 0.92),
        y: rand(H * 0.1, H * 0.9),
        phase: rand(0, Math.PI * 2),
      }));
    }

    function drawRoadMovement() {
      roadVehicles.forEach((vehicle) => {
        vehicle.offset += vehicle.speed * 10;
        if (vehicle.offset > 1) vehicle.offset = 0;
        const p = getRoadPoint(roads[vehicle.road], vehicle.offset);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(224,160,175,.38)";
        ctx.fill();
      });
    }

    function drawGPS(time) {
      gpsPoints.forEach((point) => {
        const pulse = (Math.sin(time * 0.0015 + point.phase) + 1) / 2;
        const radius = 4 + pulse * 13;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(210,120,140,${0.05 + pulse * 0.12})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225,155,170,.65)";
        ctx.fill();
      });
    }

    function drawSurveyors() {
      surveyors.forEach((surveyor) => {
        surveyor.progress += surveyor.speed * 16;
        if (surveyor.progress > 1) surveyor.progress = 0;
        const t = surveyor.reverse ? 1 - surveyor.progress : surveyor.progress;
        const p = getRoadPoint(roads[surveyor.road], t);

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18);
        glow.addColorStop(0, "rgba(210,110,130,.25)");
        glow.addColorStop(1, "rgba(210,110,130,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(238,176,190,.85)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 8, p.y - 8);
        ctx.strokeStyle = "rgba(230,160,175,.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    }

    function triggerPropertyScan(time) {
      if (time - lastScan < 1500) return;
      lastScan = time;
      const index = Math.floor(Math.random() * properties.length);
      const property = properties[index];
      if (property && !property.completed) property.scanProgress = 0;
    }

    function drawScanAnimation(property) {
      property.scanProgress += 0.035;
      if (property.scanProgress > 1) {
        property.scanProgress = -1;
        if (Math.random() < 0.35) property.completed = true;
        return;
      }

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      property.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });

      const scanY = lerp(minY, maxY, property.scanProgress);
      ctx.beginPath();
      ctx.moveTo(minX - 5, scanY);
      ctx.lineTo(maxX + 5, scanY);
      ctx.strokeStyle = "rgba(220,145,160,.45)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      gradient.addColorStop(0, "rgba(220,145,160,0)");
      gradient.addColorStop(0.5, "rgba(220,145,160,.06)");
      gradient.addColorStop(1, "rgba(220,145,160,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(minX, scanY - 20, maxX - minX, 40);
    }

    function drawCrosshair() {
      const x = W * 0.5;
      const y = H * 0.5;
      ctx.strokeStyle = "rgba(255,255,255,.045)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - 18, y);
      ctx.lineTo(x + 18, y);
      ctx.moveTo(x, y - 18);
      ctx.lineTo(x, y + 18);
      ctx.stroke();
    }

    function drawBorder(time) {
      const padding = 22;
      ctx.strokeStyle = "rgba(160,80,100,.10)";
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, padding, W - padding * 2, H - padding * 2);

      const p = (time * 0.00008) % 1;
      const x = padding + p * (W - padding * 2);
      ctx.beginPath();
      ctx.arc(x, padding, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210,130,145,.35)";
      ctx.fill();
    }

    function render(time) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = CONFIG.background;
      ctx.fillRect(0, 0, W, H);

      const centerGlow = ctx.createRadialGradient(
        W * 0.5, H * 0.48, 0,
        W * 0.5, H * 0.48, Math.max(W, H) * 0.72
      );
      centerGlow.addColorStop(0, "rgba(75,18,35,.28)");
      centerGlow.addColorStop(1, "rgba(75,18,35,0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, W, H);

      drawGrid(time);
      drawRoads();
      drawProperties(time);
      drawRoadMovement();
      drawGPS(time);
      drawSurveyors();
      drawCrosshair();
      drawBorder(time);
      triggerPropertyScan(time);

      rafId = requestAnimationFrame(render);
    }

    function handleClick(event) {
      const rect = canvas.getBoundingClientRect();
      gpsPoints.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        phase: 0,
      });
      if (gpsPoints.length > 12) gpsPoints.shift();
    }

    function setup() {
      resizeCanvas();
      generateProperties();
      buildRoads();
      buildMovers();
    }

    function handleResize() {
      resizeCanvas();
      generateProperties();
      buildRoads();
      buildMovers();
    }

    setup();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("click", handleClick);
    rafId = requestAnimationFrame(render);

    const completionInterval = setInterval(() => {
      const pending = properties.filter((p) => !p.completed);
      if (pending.length === 0) return;
      const property = pending[Math.floor(Math.random() * pending.length)];
      property.scanProgress = 0;
    }, 4200);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(completionInterval);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#4b1223",
        zIndex: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", display: "block" }} />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(20,5,10,0.08), rgba(20,5,10,0.42) 78%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(255,255,255,0.025)",
          animation: "gisScanMove 12s linear infinite",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {[
        { label: "WARD 1", top: "16%", left: "12%" },
        { label: "WARD 6", top: "68%", left: "74%" },
        { label: "PROPERTY GRID", top: "31%", left: "58%" },
        { label: "ZONE 1", top: "78%", left: "22%" },
      ].map((l) => (
        <div
          key={l.label}
          style={{
            position: "fixed",
            top: l.top,
            left: l.left,
            color: "rgba(255,255,255,0.22)",
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "Arial, Helvetica, sans-serif",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          {l.label}
        </div>
      ))}

      <style>{`
        @keyframes gisScanMove {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
    </div>
  );
}
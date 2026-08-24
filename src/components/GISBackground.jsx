import { useEffect, useRef } from "react";
import "./GISBackground.css";

export default function GISBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W * dpr;
      canvas.height = H * dpr;

      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // ==========================================
    // YOUR GIS CANVAS CODE GOES HERE
    // ==========================================

    function animate(time) {
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#4B1223";
      ctx.fillRect(0, 0, W, H);

      // Put your:
      // drawGrid(time)
      // drawRoads()
      // drawProperties(time)
      // drawRoadMovement(time)
      // drawGPS(time)
      // drawSurveyors()
      // drawCrosshair()
      // drawBorder(time)
      // etc.
      // here

      requestAnimationFrame(animate);
    }

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="gis-background">

      <canvas
        ref={canvasRef}
        className="gis-canvas"
      />

      <div className="map-overlay"></div>

      <div className="scanline"></div>

      <div className="map-label label-a">
        WARD 1
      </div>

      <div className="map-label label-b">
        WARD 6
      </div>

      <div className="map-label label-c">
        PROPERTY GRID
      </div>

      <div className="map-label label-d">
        ZONE 1
      </div>

    </div>
  );
}
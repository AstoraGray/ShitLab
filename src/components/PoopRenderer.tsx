import React, { useEffect, useRef, useState } from "react";
import { PoopArt, getMaximumSegmentsCount } from "../types";
import { playSqueezeSound, playTickSound } from "../utils/audio";

interface PoopRendererProps {
  art: Partial<PoopArt> & {
    colorHex: string;
    accentColorHex: string;
    textureType: string;
    shapeType: string;
  };
  className?: string;
  interactive?: boolean;
  visibleSegmentsCount?: number; // 1, 2, or 3
}

// Simple deterministic pseudorandom generator for high-fidelity stable texture rendering
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const PoopRenderer: React.FC<PoopRendererProps> = ({
  art,
  className = "",
  interactive = true,
  visibleSegmentsCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wobbleRef = useRef(0); // Wobble amplitude
  const wobbleSpeedRef = useRef(0); // Wobble current velocity
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Trigger a "Duang Duang" physical wobble bounce
  const triggerWobble = () => {
    wobbleSpeedRef.current = 0.25;
    if (interactive) {
      playSqueezeSound(150 + Math.random() * 80);
    }
  };

  // Trigger wobble automatically on art update
  useEffect(() => {
    wobbleSpeedRef.current = 0.2;
  }, [art.id, art.colorHex, art.shapeType]);

  // Handle animation frame physical spring calculations & particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;

      // Spring physics math: Accel = -k * Position - c * Velocity
      const k = 0.12; // Spring stiffness
      const c = 0.08; // Friction damping
      const force = -k * wobbleRef.current;
      wobbleSpeedRef.current += force;
      wobbleSpeedRef.current *= (1 - c);
      wobbleRef.current += wobbleSpeedRef.current;

      // Device Pixel Ratio scaling for outstanding high resolution on Android & iOS screens
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = 350;
      const logicalHeight = 320;
      if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = logicalWidth;
      const height = logicalHeight;

      // Determine palette
      const baseColor = art.colorHex || "#8B5A2B";
      const accentColor = art.accentColorHex || "#5C3818";
      const texture = art.textureType || "smooth";
      const shape = art.shapeType || "standard_swirl";

      // 1, 2, or 3 segments limit
      const vCount = visibleSegmentsCount;

      // Centered positions
      const cx = width / 2;
      const cy = height / 2 + 30; // lower center to make space for the tall spire

      // Draw shadow under the poop
      const shadowGrad = ctx.createRadialGradient(cx, cy + 35, 5, cx, cy + 35, 80);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.4)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 35, 75, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal offset wobble scale based on vertical height
      const getWobbleOffset = (yOffset: number) => {
        // High layers wobble more (like a bouncy flagpole)
        return Math.sin(time * 6 + yOffset * 0.05) * wobbleRef.current * 25;
      };

      // Base drawing functions with spring coordinates
      // Helper to draw a sleek soft-serve glossy segment
      const drawSegment = (
        x: number,
        y: number,
        rx: number,
        ry: number,
        colorHex: string,
        accentHex: string,
        layerIdx: number,
        segmentFraction: number = 0.5
      ) => {
        ctx.save();

        // Compute segment-specific texture based on local age
        const baseTexture = art.textureType || "smooth";
        const holdingDays = art.holdingDays || 0;
        const localAge = holdingDays * (1 - segmentFraction);
        
        let texture = baseTexture;
        const specialFoodTextures = [
          "volcanic_lava",
          "toxic_slime",
          "cyber_grid",
          "glittery",
          "metallic_gold",
          "crystalline",
          "rainbow_metallic",
          "grainy"
        ];
        // Only override standard textures (smooth, steaming, etc.) with stony historical items, so precious food textures are fully preserved!
        if (holdingDays >= 2 && !specialFoodTextures.includes(baseTexture)) {
          if (localAge >= 7) {
            texture = "gilded_relic";
          } else if (localAge >= 5) {
            texture = "ancient_bronze";
          } else if (localAge >= 4) {
            texture = "relic_moss_stone";
          } else if (localAge >= 2) {
            texture = "petrified_fossil";
          } else {
            texture = baseTexture;
          }
        }
        
        // Base gradient
        const grad = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
        
        if (texture === "metallic_gold") {
          // luxurious gold gradient
          grad.addColorStop(0, "#D4AF37");
          grad.addColorStop(0.3, "#FFDF00");
          grad.addColorStop(0.6, "#FFFFFF");
          grad.addColorStop(0.8, "#AA7C11");
          grad.addColorStop(1, "#654321");
        } else if (texture === "crystalline") {
          // semi translucent crystal
          grad.addColorStop(0, hexToRgba(colorHex, 0.95));
          grad.addColorStop(0.4, "#E0FFFF");
          grad.addColorStop(0.7, hexToRgba(accentHex, 0.9));
          grad.addColorStop(1, hexToRgba(colorHex, 0.7));
        } else if (texture === "rainbow_metallic") {
          // magical iridescent chromatic color shift
          const shift = (time * 40 + layerIdx * 30) % 360;
          grad.addColorStop(0, `hsl(${shift}, 100%, 65%)`);
          grad.addColorStop(0.3, `hsl(${(shift + 90) % 360}, 100%, 60%)`);
          grad.addColorStop(0.6, `hsl(${(shift + 180) % 360}, 100%, 55%)`);
          grad.addColorStop(1, `hsl(${(shift + 270) % 360}, 100%, 45%)`);
        } else if (texture === "volcanic_lava") {
          // molten glowing boiling magma base
          grad.addColorStop(0, "#FF4000");
          grad.addColorStop(0.3, "#FF8800");
          grad.addColorStop(0.6, "#D32F2F");
          grad.addColorStop(1, "#1E1313");
        } else if (texture === "cyber_grid") {
          // neon cyber digital obsidian core
          grad.addColorStop(0, "#1F1F24");
          grad.addColorStop(0.5, "#0D0D11");
          grad.addColorStop(1, "#020204");
        } else if (texture === "toxic_slime") {
          // bubbling radioactive biohazard acid
          grad.addColorStop(0, "#39FF14");
          grad.addColorStop(0.5, "#10B981");
          grad.addColorStop(1, "#064E3B");
        } else if (texture === "ancient_bronze") {
          // Green rust oxidization over classic deep bronze
          grad.addColorStop(0, "#4A5D4E"); // teal verdigris rim
          grad.addColorStop(0.3, "#8C6E40"); // metallic copper body
          grad.addColorStop(0.7, "#5B3A29"); // dark bronze shadow
          grad.addColorStop(1, "#27170E");
        } else if (texture === "petrified_fossil") {
          // Prehistoric grey sedimentary stone layers
          grad.addColorStop(0, "#D2C9C1"); // light fossil silt
          grad.addColorStop(0.5, "#9A8C81"); // core stony grey
          grad.addColorStop(1, "#544C45"); // shadow stone
        } else if (texture === "gilded_relic") {
          // Decaying metal rust with peeling luxurious gold
          grad.addColorStop(0, "#E6B93B"); // gold crown
          grad.addColorStop(0.3, "#A67C1E"); // base gold
          grad.addColorStop(0.6, "#782210"); // rusty orange-red decay
          grad.addColorStop(1, "#300D05");
        } else if (texture === "relic_moss_stone") {
          // Granite stone overrun with velvet forest moss
          grad.addColorStop(0, "#446A37"); // vivid moss green
          grad.addColorStop(0.4, "#7F8C7D"); // grey granite body
          grad.addColorStop(0.8, "#3E4A3D"); // deep organic shadow
          grad.addColorStop(1, "#1B221A");
        } else {
          grad.addColorStop(0, lightenOrDarkenColor(colorHex, 40));
          grad.addColorStop(0.4, colorHex);
          grad.addColorStop(1, lightenOrDarkenColor(colorHex, -30));
        }

        ctx.fillStyle = grad;
        ctx.strokeStyle = texture === "cyber_grid" ? "#00FFFF" : lightenOrDarkenColor(colorHex, -40);
        ctx.lineWidth = texture === "cyber_grid" ? 2.5 : 4;

        // Draw the segment body
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw highlights (specular reflections)
        const highlightGrad = ctx.createLinearGradient(x - rx * 0.5, y - ry * 0.5, x + rx * 0.5, y + ry * 0.5);
        highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.65)");
        highlightGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.1)");
        highlightGrad.addColorStop(1, "rgba(100, 100, 100, 0)");

        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        // Shift highlight up-left
        ctx.ellipse(x - rx * 0.25, y - ry * 0.25, rx * 0.6, ry * 0.45, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        // Texture Details
        if (texture === "grainy") {
          // Draw tiny freckles / chili pepper seeds
          ctx.fillStyle = accentHex;
          for (let i = 0; i < 15; i++) {
            const seedX = layerIdx * 100 + i * 2;
            const seedY = layerIdx * 100 + i * 2 + 1;
            const randAngle = seededRandom(seedX) * Math.PI * 2;
            const randDist = seededRandom(seedY) * 0.7;
            const px = x + Math.cos(randAngle) * rx * randDist;
            const py = y + Math.sin(randAngle) * ry * randDist;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (texture === "glittery") {
          // Sparkling dots
          ctx.fillStyle = "#FFF";
          for (let i = 0; i < 5; i++) {
            const seedX = layerIdx * 200 + i * 2;
            const seedY = layerIdx * 200 + i * 2 + 1;
            const sparkleX = x + (seededRandom(seedX) - 0.5) * rx * 1.2;
            const sparkleY = y + (seededRandom(seedY) - 0.5) * ry * 1.2;
            const sparkleSize = Math.abs(Math.sin(time * 5 + i)) * 3;
            drawStar(ctx, sparkleX, sparkleY, 4, sparkleSize, sparkleSize / 2, "#E0FFFF");
          }
        } else if (texture === "volcanic_lava") {
          // Render volcanic crack lines
          ctx.strokeStyle = "#FF8C00";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x - rx * 0.7, y - ry * 0.2);
          ctx.lineTo(x + rx * 0.7, y + ry * 0.2);
          ctx.moveTo(x - rx * 0.4, y + ry * 0.4);
          ctx.lineTo(x + rx * 0.2, y - ry * 0.5);
          ctx.stroke();

          // Float moving black ash chunks
          ctx.fillStyle = "#222222";
          for (let i = 0; i < 4; i++) {
            const bx = x + Math.sin(i * 1.5 + time * 2) * rx * 0.4;
            const by = y + Math.cos(i + time * 1.5) * ry * 0.4;
            ctx.beginPath();
            ctx.rect(bx - 3, by - 3, 6, 6);
            ctx.fill();
          }
        } else if (texture === "cyber_grid") {
          ctx.strokeStyle = "#00FFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          // vertical grid lines in perspective
          for (let k = -3; k <= 3; k++) {
            ctx.moveTo(x + k * (rx * 0.25), y - ry * 0.85);
            ctx.lineTo(x + k * (rx * 0.25), y + ry * 0.85);
          }
          // horizontal lines
          for (let k = -2; k <= 2; k++) {
            ctx.moveTo(x - rx * 0.9, y + k * (ry * 0.35));
            ctx.lineTo(x + rx * 0.9, y + k * (ry * 0.35));
          }
          ctx.stroke();

          // glowing dots at nodes occasionally
          if (Math.sin(time * 8 + layerIdx) > 0.4) {
            ctx.fillStyle = "#FF00FF";
            ctx.beginPath();
            ctx.arc(x + Math.sin(time) * rx * 0.5, y + Math.cos(time) * ry * 0.5, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (texture === "toxic_slime") {
          // Bubbling green nodes
          ctx.fillStyle = "rgba(100, 255, 100, 0.7)";
          for (let i = 0; i < 3; i++) {
            const bx = x + Math.cos(time * 2.5 + i * 2) * rx * 0.5;
            const by = y + Math.sin(time * 2 + i * 1.5) * ry * 0.5 - Math.abs(Math.sin(time + i)) * 10;
            ctx.beginPath();
            ctx.arc(bx, by, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // white bubble specular glow dot
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(bx - 1.5, by - 1.5, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(100, 255, 100, 0.7)";
          }
        } else if (texture === "ancient_bronze") {
          // Draw metallic scratches & green patinated verdigris spots
          ctx.fillStyle = "rgba(40, 180, 120, 0.75)";
          for (let i = 0; i < 4; i++) {
            const px = x + Math.cos(i * 1.5) * rx * 0.4;
            const py = y + Math.sin(i * 1.5) * ry * 0.3;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Scratch highlights
          ctx.strokeStyle = "rgba(255, 230, 150, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - rx * 0.5, y - ry * 0.2);
          ctx.lineTo(x - rx * 0.3, y + ry * 0.1);
          ctx.stroke();
        } else if (texture === "petrified_fossil") {
          // Skeletal fossil bones/leaves outlines
          ctx.strokeStyle = "rgba(240, 235, 230, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - rx * 0.4, y);
          ctx.lineTo(x + rx * 0.4, y);
          ctx.moveTo(x, y - ry * 0.4);
          ctx.lineTo(x, y + ry * 0.4);
          for (let offset = -15; offset <= 15; offset += 10) {
            ctx.moveTo(x + offset - 2, y - 5);
            ctx.lineTo(x + offset + 2, y + 5);
          }
          ctx.stroke();
        } else if (texture === "gilded_relic") {
          // Shiny peeled gilded flakes
          ctx.fillStyle = "#FFE875";
          for (let i = 0; i < 3; i++) {
            const gx = x + Math.cos(time + i * 2) * rx * 0.6;
            const gy = y + Math.sin(time + i * 2) * ry * 0.6;
            ctx.beginPath();
            ctx.rect(gx - 3, gy - 2, 6, 4);
            ctx.fill();
          }
        } else if (texture === "relic_moss_stone") {
          // Speckled granite and fuzzy moss dots
          ctx.fillStyle = "rgba(85, 140, 60, 0.85)";
          for (let i = 0; i < 6; i++) {
            const mx = x + Math.sin(i * 2 + time * 0.3) * rx * 0.5;
            const my = y + Math.cos(i * 1.5) * ry * 0.5;
            ctx.beginPath();
            ctx.ellipse(mx, my, 4, 2.5, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // --- 5. ANCIENT INFLUENCE OVERLAY ---
        // Dynamically blend in ancient, weathered, and aged qualities as holdingDays increases
        const age = localAge;
        if (age >= 2) {
          ctx.save();
          const intensity = Math.min(1, (age - 1) / 6); // Maps 1-7+ days to range 0.1 - 1.0

          // Weathered cracks/veins
          ctx.strokeStyle = "rgba(43, 24, 12, " + (intensity * 0.45) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - rx * 0.6, y - ry * 0.4);
          ctx.lineTo(x - rx * 0.2, y - ry * 0.1);
          ctx.lineTo(x - rx * 0.1, y + ry * 0.25);
          ctx.moveTo(x + rx * 0.4, y - ry * 0.3);
          ctx.lineTo(x + rx * 0.1, y + ry * 0.1);
          ctx.lineTo(x + rx * 0.3, y + ry * 0.4);
          ctx.stroke();

          // Green moss growth / patinated spots
          ctx.fillStyle = "rgba(46, 117, 89, " + (intensity * 0.65) + ")";
          for (let i = 0; i < Math.floor(age); i++) {
            const angle = (i * 2.3 + layerIdx * 1.5) % (Math.PI * 2);
            const dist = 0.4 + ((i * 7) % 55) * 0.008;
            const px = x + Math.cos(angle) * rx * dist;
            const py = y + Math.sin(angle) * ry * dist;
            const spotSize = 1.5 + ((i * 13) % 4);

            ctx.beginPath();
            ctx.arc(px, py, spotSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(100, 200, 150, " + (intensity * 0.35) + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(px, py, spotSize, 0, Math.PI * 2);
            ctx.stroke();
          }

          // If age is extremely high (>= 5), overlay royal golden foil flakes peeking through
          if (age >= 5) {
            ctx.fillStyle = "rgba(230, 185, 45, " + (intensity * 0.85) + ")";
            for (let i = 0; i < 2; i++) {
              const gX = x + Math.sin(layerIdx + i) * rx * 0.4;
              const gY = y + Math.cos(layerIdx + i * 3) * ry * 0.4;
              ctx.beginPath();
              ctx.ellipse(gX, gY, 6, 3, Math.PI / 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }

        // --- 5B. SEASONAL & TEMPORAL HYBRID OVERLAY ---
        const artSeason = art.season || "spring";
        const artTime = art.timeOfDay || "afternoon";

        ctx.save();
        
        // Let's draw spectacular custom seasonal details in perspective corresponding to season and time!
        if (artSeason === "spring") {
          // SPRING: Tender green and light pink petal swirls!
          const leafCount = artTime === "morning" ? 3 : (artTime === "afternoon" ? 5 : 4);
          
          for (let i = 0; i < leafCount; i++) {
            const angle = (time * 1.5 + i * 1.8 + layerIdx) % (Math.PI * 2);
            const dist = 0.3 + (i * 0.15);
            const px = x + Math.cos(angle) * rx * dist;
            const py = y + Math.sin(angle) * ry * dist;
            
            ctx.fillStyle = i % 2 === 0 ? "rgba(144, 238, 144, 0.75)" : "rgba(255, 182, 193, 0.8)";
            ctx.beginPath();
            ctx.ellipse(px, py, 4, 2, angle + Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw tiny dew glimmers for morning
            if (artTime === "morning") {
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
              ctx.beginPath();
              ctx.arc(px - 1, py - 1, 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (artSeason === "summer") {
          // SUMMER: Hot golden glare, sunrays, fireflies!
          if (artTime === "afternoon") {
            ctx.strokeStyle = "rgba(255, 223, 0, 0.3)";
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 3; i++) {
              const rayPos = (time * 10 + i * 25) % (rx * 2);
              ctx.beginPath();
              ctx.moveTo(x - rx + rayPos, y - ry);
              ctx.lineTo(x - rx + rayPos + 10, y + ry);
              ctx.stroke();
            }
          } else if (artTime === "night") {
            ctx.fillStyle = "rgba(220, 255, 47, 0.9)";
            for (let i = 0; i < 3; i++) {
              const flyX = x + Math.sin(time * 2 + i * 3) * rx * 0.7;
              const flyY = y + Math.cos(time * 1.5 + i * 2) * ry * 0.6;
              ctx.beginPath();
              ctx.arc(flyX, flyY, 2.5 + Math.abs(Math.sin(time * 4 + i)) * 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = "rgba(64, 224, 208, 0.55)";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 4; i++) {
              const bx = x + Math.cos(time + i * 1.5) * rx * 0.5;
              const by = y + Math.sin(time * 1.2 + i) * ry * 0.5;
              ctx.beginPath();
              ctx.arc(bx, by, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        } else if (artSeason === "autumn") {
          // AUTUMN: Beautiful orange falling maple sheets and warm amber/golden dust
          const leaves = artTime === "afternoon" ? 5 : 3;
          ctx.fillStyle = "rgba(217, 119, 6, 0.85)";
          for (let i = 0; i < leaves; i++) {
            const angle = (time * 1.1 + i * 2.1) % (Math.PI * 2);
            const dist = 0.2 + (i * 0.16);
            const px = x + Math.cos(angle) * rx * dist;
            const py = y + Math.sin(angle) * ry * dist;
            
            ctx.beginPath();
            ctx.moveTo(px, py - 4);
            ctx.lineTo(px + 3, py - 1);
            ctx.lineTo(px + 4, py + 2);
            ctx.lineTo(px, py + 1);
            ctx.lineTo(px - 4, py + 2);
            ctx.lineTo(px - 3, py - 1);
            ctx.closePath();
            ctx.fill();
          }
          
          if (artTime === "night") {
            ctx.fillStyle = "rgba(255, 244, 210, 0.35)";
            ctx.beginPath();
            ctx.arc(x - rx * 0.2, y - ry * 0.2, rx * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (artSeason === "winter") {
          // WINTER: Frost crystals and falling hexagonal snow dust!
          ctx.strokeStyle = "rgba(224, 242, 254, 0.75)";
          ctx.lineWidth = 1;
          const snowCount = artTime === "night" ? 5 : 3;
          for (let i = 0; i < snowCount; i++) {
            const sx = x + Math.sin(time + i * 2) * rx * 0.6;
            const sy = y + (Math.cos(time * 0.5 + i) * ry * 0.5) + (Math.sin(time) * 4);
            
            ctx.beginPath();
            ctx.moveTo(sx - 3, sy);
            ctx.lineTo(sx + 3, sy);
            ctx.moveTo(sx, sy - 3);
            ctx.lineTo(sx, sy + 3);
            ctx.stroke();
            
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(sx, sy, 1, 0, Math.PI * 2);
            ctx.fill();
          }
          
          if (artTime === "afternoon") {
            const softWarmIvory = ctx.createRadialGradient(x, y, 5, x, y, rx);
            softWarmIvory.addColorStop(0, "rgba(255, 253, 230, 0.25)");
            softWarmIvory.addColorStop(1, "rgba(255, 253, 230, 0)");
            ctx.fillStyle = softWarmIvory;
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();

        ctx.restore();
      };

      // RENDER SHAPES
      if (shape === "standard_swirl" || shape === "double_helix") {
        // Double helix uses overlapping dual strands; standard swirl has classic decreasing tiers
        const isHelix = shape === "double_helix";
        const holdingDays = art.holdingDays || 0;
        const tiersCount = getMaximumSegmentsCount(shape, holdingDays);

        let drawTiers = tiersCount;
        if (vCount !== undefined) {
          drawTiers = Math.min(vCount, tiersCount);
        }

        // Draw tiers bottom up
        for (let i = 0; i < drawTiers; i++) {
          const depthIdx = tiersCount - 1 - i; // bottom first
          // Distribute heights evenly
          const yPos = cy - depthIdx * (30 * (4 / Math.min(6, tiersCount)));
          const wOff = getWobbleOffset(depthIdx * 50);

          // Tier scale
          const scale = (tiersCount - depthIdx) / tiersCount;
          const rx = (65 * scale + 10) * (1 + Math.min(0.2, (tiersCount - 4) * 0.03));
          const ry = (22 * scale + 4) * (1 + Math.min(0.1, (tiersCount - 4) * 0.02));

          const strandX = isHelix ? cx + Math.sin(time * 4 + depthIdx) * 15 + wOff : cx + wOff;

          const segmentFraction = depthIdx / (tiersCount - 1 || 1);
          drawSegment(strandX, yPos, rx, ry, baseColor, accentColor, depthIdx, segmentFraction);
        }

        // Top spire point - draw only if fully completed
        if (vCount === undefined || vCount >= tiersCount) {
          const spireY = cy - tiersCount * (30 * (4 / Math.min(6, tiersCount))) + 10;
          const wOffSpire = getWobbleOffset(tiersCount * 50);
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 4;

          ctx.beginPath();
          const topX = cx + wOffSpire;
          const baseLeft = topX - 18;
          const baseRight = topX + 18;
          const baseHeight = spireY + 12;

          ctx.moveTo(baseLeft, baseHeight);
          // Bezier swirl peak ending in cute tip
          ctx.bezierCurveTo(
            topX - 15, spireY - 5,
            topX + 15 + Math.sin(time * 3) * 6, spireY - 18,
            topX + 5 + Math.sin(time * 2) * 4, spireY - 32
          );
          ctx.bezierCurveTo(
            topX - 5, spireY - 15,
            topX + 15, baseHeight - 4,
            baseRight, baseHeight
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // draw highlight on spire
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.beginPath();
          ctx.moveTo(baseLeft + 6, baseHeight - 2);
          ctx.bezierCurveTo(topX - 8, spireY - 3, topX + 8, spireY - 15, topX + 2, spireY - 26);
          ctx.bezierCurveTo(topX - 3, spireY - 12, topX + 5, baseHeight - 8, baseLeft + 15, baseHeight - 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

      } else if (shape === "massive_mountain") {
        // Heavy mountain shape (super big, bento pyramid tiers)
        const holdingDays = art.holdingDays || 0;
        const layers = getMaximumSegmentsCount(shape, holdingDays);
        let drawLayers = layers;
        if (vCount !== undefined) {
          drawLayers = Math.min(vCount, layers);
        }

        for (let i = layers - 1; i >= layers - drawLayers; i--) {
          const yPos = cy - i * (26 * (5 / Math.min(8, layers)));
          const wOff = getWobbleOffset(i * 45);
          const scale = (layers - i) / layers;
          
          const rx = (85 * scale + 15) * (1 + Math.min(0.2, (layers - 5) * 0.03));
          const ry = (28 * scale + 6) * (1 + Math.min(0.1, (layers - 5) * 0.02));

          const segmentFraction = i / (layers - 1 || 1);
          drawSegment(cx + wOff, yPos, rx, ry, baseColor, accentColor, i, segmentFraction);
        }
        
        // Massive peak
        if (vCount === undefined || vCount >= drawLayers) {
          const spireY = cy - layers * (26 * (5 / Math.min(8, layers))) + 10;
          const wOffSpire = getWobbleOffset(layers * 45);
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx + wOffSpire - 22, spireY + 10);
          ctx.lineTo(cx + wOffSpire + 5, spireY - 35);
          ctx.lineTo(cx + wOffSpire + 22, spireY + 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

      } else if (shape === "fluid_drip") {
        // Melty puddle style
        const holdingDays = art.holdingDays || 0;
        const stages = getMaximumSegmentsCount(shape, holdingDays);
        const wOff = getWobbleOffset(10);
        let drawStage = vCount === undefined ? stages : Math.min(vCount, stages);
        
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -25);
        ctx.lineWidth = 4;

        if (drawStage >= 1) {
          // Big bottom splash pool using drawSegment for full texture consistency
          drawSegment(cx + wOff, cy + 15, 80, 26, baseColor, accentColor, 0, 0.0);
        }

        // Draw multiple melting segments!
        for (let i = 1; i < drawStage; i++) {
          const depthIdx = stages - 1 - i;
          const yPos = cy - i * 18;
          const rx = Math.max(15, 60 - i * 8);
          const ry = Math.max(6, 20 - i * 2);
          const segmentFraction = i / (stages - 1 || 1);
          drawSegment(cx + wOff * (1 + i * 0.1), yPos, rx, ry, baseColor, accentColor, depthIdx, segmentFraction);
        }

        if (drawStage >= stages) {
          // Falling drip drop
          const dripY = cy + 18 + Math.abs(Math.sin(time * 2)) * 14;
          ctx.fillStyle = baseColor;
          ctx.beginPath();
          ctx.arc(cx - 40 + wOff, dripY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();

      } else if (shape === "eiffel_tower") {
        const holdingDays = art.holdingDays || 0;
        const tiers = getMaximumSegmentsCount(shape, holdingDays);
        let drawTiers = tiers;
        if (vCount !== undefined) {
          drawTiers = Math.min(vCount, tiers);
        }

        // Eiffel-style support arches at the bottom
        if (vCount === undefined || vCount >= 1) {
          ctx.save();
          ctx.fillStyle = lightenOrDarkenColor(baseColor, -20);
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          // Draw left bent metallic leg
          ctx.ellipse(cx - 38 + getWobbleOffset(10), cy + 22, 16, 26, Math.PI / 8, 0, Math.PI * 2);
          // Draw right bent leg
          ctx.ellipse(cx + 38 + getWobbleOffset(10), cy + 22, 16, 26, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Draw central arch cut-out overlay
          ctx.fillStyle = "#0F0F0F"; // Match backdrop dark
          ctx.beginPath();
          ctx.ellipse(cx + getWobbleOffset(10), cy + 28, 22, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Tall decreasing scaffolding tiers
        for (let i = 0; i < drawTiers; i++) {
          const depthIdx = tiers - 1 - i; // bottom first
          const yPos = cy - depthIdx * (25 * (6 / Math.min(9, tiers)));
          const wOff = getWobbleOffset(depthIdx * 40);
          
          const scale = (tiers - depthIdx) / tiers;
          const rx = 50 * scale + 10;
          const ry = 14 * scale + 3;

          const segmentFraction = depthIdx / (tiers - 1 || 1);
          drawSegment(cx + wOff, yPos, rx, ry, baseColor, accentColor, depthIdx, segmentFraction);
        }

        // Tall Eiffel spindly needle peak (gourmet coil spire)
        if (vCount === undefined || vCount >= drawTiers) {
          const spireY = cy - tiers * (25 * (6 / Math.min(9, tiers))) + 8;
          const wOffSpire = getWobbleOffset(tiers * 40);
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 4;

          ctx.beginPath();
          const topX = cx + wOffSpire;
          ctx.moveTo(topX - 8, spireY + 12);
          ctx.lineTo(topX - 1.5, spireY - 45); // highly extended point
          ctx.lineTo(topX + 1.5, spireY - 45);
          ctx.lineTo(topX + 8, spireY + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

      } else if (shape === "royal_crown") {
        const holdingDays = art.holdingDays || 0;
        const cushionsCount = 1 + Math.min(2, Math.max(0, Math.floor(holdingDays / 4)));
        const pointsCount = 3 + Math.min(4, Math.max(0, Math.floor(holdingDays / 2))); // 3 up to 7 points!
        const totalStages = cushionsCount + 1 + pointsCount;
        let drawStage = vCount === undefined ? totalStages : Math.min(vCount, totalStages);

        // cushions background foundation
        if (drawStage >= cushionsCount) {
          for (let cIdx = 0; cIdx < cushionsCount; cIdx++) {
            const wOff = getWobbleOffset(10 + cIdx * 10);
            const segmentFraction = (cIdx / (totalStages - 1 || 1)) * 0.3; // Very bottom
            drawSegment(cx + wOff, cy + 18 - cIdx * 8, 75 - cIdx * 5, 20 - cIdx * 2, baseColor, accentColor, cIdx, segmentFraction);
          }
        } else if (drawStage >= 1) {
          const wOff = getWobbleOffset(10);
          drawSegment(cx + wOff, cy + 18, 75, 20, baseColor, accentColor, 0, 0.0);
        }

        // Pearl band base
        if (drawStage >= cushionsCount + 1) {
          const wOff = getWobbleOffset(25);
          const segmentFraction = cushionsCount / (totalStages - 1 || 1);
          drawSegment(cx + wOff, cy + 2 - (cushionsCount - 1) * 8, 60, 14, lightenOrDarkenColor(baseColor, 20), accentColor, cushionsCount, segmentFraction);
          
          // Draw small pearls on the band
          ctx.save();
          ctx.fillStyle = "#FFDF00";
          const pearlCount = 4 + cushionsCount * 2;
          for (let p = -Math.floor(pearlCount/2); p <= Math.floor(pearlCount/2); p++) {
            ctx.beginPath();
            ctx.arc(cx + wOff + p * (120 / pearlCount), cy + 2 - (cushionsCount - 1) * 8, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Crown points extending upwards
        if (drawStage >= cushionsCount + 2) {
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 3.5;

          const wOff = getWobbleOffset(40);
          const yBaseline = cy - 5 - (cushionsCount - 1) * 8;
          
          // Draw points dynamically
          const pointsToDraw = Math.min(pointsCount, drawStage - (cushionsCount + 1));
          for (let pIdx = 0; pIdx < pointsToDraw; pIdx++) {
            const progress = pointsCount > 1 ? (pIdx / (pointsCount - 1)) : 0.5; // 0 to 1
            const xPos = cx + wOff - 50 + progress * 100;
            const peakHeight = (pIdx === Math.floor(pointsCount / 2)) ? 50 : 35; // taller center point
            
            ctx.beginPath();
            ctx.moveTo(xPos - 120 / (pointsCount * 2), yBaseline);
            ctx.bezierCurveTo(
              xPos - 15, yBaseline - peakHeight * 0.6,
              xPos - 5, yBaseline - peakHeight,
              xPos, yBaseline - peakHeight
            );
            ctx.bezierCurveTo(
              xPos + 5, yBaseline - peakHeight,
              xPos + 15, yBaseline - peakHeight * 0.6,
              xPos + 120 / (pointsCount * 2), yBaseline
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Pearl orb on top of peak
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(xPos, yBaseline - peakHeight, pIdx === Math.floor(pointsCount / 2) ? 6 : 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

      } else if (shape === "ring_doughnut") {
        const holdingDays = art.holdingDays || 0;
        const totalNodes = getMaximumSegmentsCount(shape, holdingDays);
        let drawNodes = totalNodes;
        if (vCount !== undefined) {
          drawNodes = Math.min(vCount, totalNodes);
        }

        // Draw overlapping circular nodes to form a full ring
        for (let i = 0; i < drawNodes; i++) {
          const angle = (i * Math.PI * 2) / totalNodes - Math.PI / 2; // offset so top first
          const rxRadius = 55 + Math.min(25, holdingDays * 2.5); // wider radius when held longer
          const px = cx + Math.cos(angle) * rxRadius + getWobbleOffset(i * 30);
          const py = cy + Math.sin(angle) * (rxRadius * 0.65) + 8;
          
          const segmentFraction = Math.max(0, Math.min(1, (cy + rxRadius * 0.65 + 8 - py) / (2 * rxRadius * 0.65 || 1)));
          drawSegment(px, py, 26, 20, baseColor, accentColor, i, segmentFraction);
        }

        // Sprinkles on top
        if (vCount === undefined || vCount >= drawNodes) {
          ctx.save();
          const colors = ["#FF4500", "#FFD700", "#FF1493", "#00FFFF", "#32CD32", "#FF8C00", "#C71585"];
          const sprinkleCount = 15 + Math.min(15, Math.floor(holdingDays * 2));
          const rxRadius = 55 + Math.min(25, holdingDays * 2.5);
          for (let i = 0; i < sprinkleCount; i++) {
            const angle = (i * Math.PI * 2) / sprinkleCount;
            const px = cx + Math.cos(angle) * rxRadius + getWobbleOffset(40);
            const py = cy + Math.sin(angle) * (rxRadius * 0.65) + 8;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.rect(px - 1.5, py - 6, 3, 10);
            ctx.fill();
          }
          ctx.restore();
        }

      } else if (shape === "alien_ufo") {
        const holdingDays = art.holdingDays || 0;
        const antennasCount = 1 + Math.min(3, Math.max(0, Math.floor(holdingDays / 3))); // up to 4 antennas!
        const totalStages = 3 + antennasCount;
        let drawStage = vCount === undefined ? totalStages : Math.min(vCount, totalStages);

        // Stage 1: Bottom thruster glows
        if (drawStage >= 1) {
          ctx.save();
          ctx.fillStyle = "#FF5500";
          ctx.beginPath();
          // Wider thruster array for longer holding days
          const thrusters = 2 + Math.min(2, Math.floor(holdingDays / 3.5));
          for (let th = 0; th < thrusters; th++) {
            const offsetMultiplier = th - (thrusters - 1) / 2;
            ctx.ellipse(cx + offsetMultiplier * 35 + getWobbleOffset(10), cy + 24, 8, 14, 0, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.restore();
        }

        // Stage 2: Saucer disc body (flat broad ellipse)
        if (drawStage >= 2) {
          const wOff = getWobbleOffset(25);
          const broadRx = 85 + Math.min(30, holdingDays * 4);
          drawSegment(cx + wOff, cy + 8, broadRx, 18, baseColor, accentColor, 0, 0.4);
          
          // Draw center illuminated laser windows
          ctx.save();
          ctx.fillStyle = "#00FFFF";
          const windowCount = 5 + Math.min(6, Math.floor(holdingDays * 0.8));
          for (let p = -Math.floor(windowCount/2); p <= Math.floor(windowCount/2); p++) {
            ctx.beginPath();
            ctx.arc(cx + wOff + p * (broadRx * 2 / (windowCount + 1)), cy + 8, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Stage 3: Top reactor dome cap
        if (drawStage >= 3) {
          const wOff = getWobbleOffset(50);
          ctx.save();
          // Taller dome when age is higher
          const domeHeight = 25 + Math.min(15, holdingDays * 1.5);
          const domeGrad = ctx.createRadialGradient(cx + wOff, cy - 4, 5, cx + wOff, cy - 4, 35);
          domeGrad.addColorStop(0, "#FFFFFF");
          domeGrad.addColorStop(0.5, lightenOrDarkenColor(baseColor, 40));
          domeGrad.addColorStop(1, accentColor);
          ctx.fillStyle = domeGrad;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(cx + wOff, cy - 4, 38, domeHeight, 0, Math.PI, 0); // draw top half semicircle dome
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Extra stages: Antennas coiling upwards!
        if (drawStage >= 4) {
          ctx.save();
          ctx.strokeStyle = "#FF00FF";
          ctx.lineWidth = 2.5;
          const wOff = getWobbleOffset(60);
          const antennaStagesToDraw = Math.min(antennasCount, drawStage - 3);

          for (let a = 0; a < antennaStagesToDraw; a++) {
            const angleOffset = antennasCount > 1 ? (a - (antennasCount - 1) / 2) * 0.35 : 0;
            const ax = cx + wOff + Math.sin(angleOffset) * 25;
            const ay = cy - 4 - 20;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(ax + Math.sin(time * 5 + a) * 8, ay - 20, ax + Math.sin(angleOffset) * 15, ay - 35);
            ctx.stroke();

            // Antenna glowing bulb
            ctx.fillStyle = "#00FF00";
            ctx.beginPath();
            ctx.arc(ax + Math.sin(angleOffset) * 15, ay - 35, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

      } else if (shape === "lucky_cat_tail") {
        const holdingDays = art.holdingDays || 0;
        const segments = getMaximumSegmentsCount(shape, holdingDays);
        let drawSegments = segments;
        if (vCount !== undefined) {
          drawSegments = Math.min(vCount, segments);
        }

        // Draw overlapping snake/tail segments in a wavy column
        for (let i = 0; i < drawSegments; i++) {
          const depthIdx = segments - 1 - i;
          // waves get richer / wave speed gets wavy based on time & held age
          const waveX = Math.sin(time * (3.5 + Math.min(2, holdingDays * 0.15)) + depthIdx * 0.7) * 16;
          const yPos = cy - depthIdx * 24;
          const wOff = getWobbleOffset(depthIdx * 30);
          
          const scale = (segments - depthIdx) / segments;
          const rx = 32 * scale + 15;
          const ry = 14 * scale + 4;

          const segmentFraction = depthIdx / (segments - 1 || 1);
          drawSegment(cx + waveX + wOff, yPos, rx, ry, baseColor, accentColor, depthIdx, segmentFraction);
          
          // Striped cat-tail accent bands
          ctx.save();
          ctx.strokeStyle = lightenOrDarkenColor(accentColor, -30);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx + waveX + wOff - rx * 0.4, yPos);
          ctx.lineTo(cx + waveX + wOff + rx * 0.4, yPos);
          ctx.stroke();
          ctx.restore();
        }

        // Fluffy rounded tip of cat tail
        if (vCount === undefined || vCount >= drawSegments) {
          const depthIdx = 0;
          const topWaveX = Math.sin(time * (3.5 + Math.min(2, holdingDays * 0.15)) + depthIdx * 0.7) * 16;
          const topSpireY = cy - segments * 24 + 10;
          const wOffSpire = getWobbleOffset(segments * 30);
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx + topWaveX + wOffSpire, topSpireY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      } else if (shape === "spherical_boba") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 28 + 10;
          const wOff = getWobbleOffset(depthIdx * 35);
          drawSegment(cx + wOff, yPos, 28, 28, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
        }

      } else if (shape === "space_station") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        const wOff = getWobbleOffset(25);
        if (drawCount >= 1) {
          drawSegment(cx + wOff, cy + 10, 60, 24, baseColor, accentColor, 0, 0.2);
        }
        if (drawCount >= 2) {
          drawSegment(cx + wOff, cy - 20, 36, 18, baseColor, accentColor, 1, 0.5);
        }
        if (drawCount >= 3) {
          ctx.save();
          ctx.fillStyle = accentColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, 40);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(cx + wOff - 105, cy - 4, 45, 12);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(cx + wOff + 60, cy - 4, 45, 12);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

      } else if (shape === "abstract_cube") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 25 + 15;
          const wOff = getWobbleOffset(depthIdx * 35);
          const size = 50 - depthIdx * 5;
          
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -30);
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.rect(cx + wOff - size / 2, yPos - size / 2, size, size);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = lightenOrDarkenColor(baseColor, 25);
          ctx.beginPath();
          ctx.moveTo(cx + wOff - size / 2, yPos - size / 2);
          ctx.lineTo(cx + wOff - size / 4, yPos - size / 2 - 12);
          ctx.lineTo(cx + wOff + size * 0.75, yPos - size / 2 - 12);
          ctx.lineTo(cx + wOff + size / 2, yPos - size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = lightenOrDarkenColor(baseColor, -25);
          ctx.beginPath();
          ctx.moveTo(cx + wOff + size / 2, yPos - size / 2);
          ctx.lineTo(cx + wOff + size * 0.75, yPos - size / 2 - 12);
          ctx.lineTo(cx + wOff + size * 0.75, yPos + size / 2 - 12);
          ctx.lineTo(cx + wOff + size / 2, yPos + size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

      } else if (shape === "sharp_obelisk") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 32 + 10;
          const wOff = getWobbleOffset(depthIdx * 30);
          const rx = 35 - depthIdx * 5;
          const ry = 14;
          drawSegment(cx + wOff, yPos, rx, ry, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
        }

      } else if (shape === "cute_octopus") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        const wOff = getWobbleOffset(25);
        if (drawCount >= 1) {
          drawSegment(cx + wOff, cy + 12, 55, 20, baseColor, accentColor, 0, 0.1);
        }
        if (drawCount >= 2) {
          ctx.save();
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          for (let t = 0; t < 6; t++) {
            const angle = (t * Math.PI) / 5;
            const tx = cx + wOff + Math.cos(angle) * 45;
            const ty = cy + 12 + Math.abs(Math.sin(angle)) * 12;
            ctx.beginPath();
            ctx.moveTo(cx + wOff, cy + 12);
            ctx.quadraticCurveTo(tx, ty + 10 + Math.sin(time * 3 + t) * 6, tx + Math.cos(time + t) * 10, ty + 15);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (drawCount >= 3) {
          drawSegment(cx + wOff, cy - 20, 35, 32, baseColor, accentColor, 2, 0.6);
          ctx.save();
          ctx.fillStyle = "#FFF";
          ctx.beginPath();
          ctx.arc(cx + wOff - 10, cy - 22, 6, 0, Math.PI * 2);
          ctx.arc(cx + wOff + 10, cy - 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(cx + wOff - 9 + Math.sin(time) * 1.5, cy - 21, 3, 0, Math.PI * 2);
          ctx.arc(cx + wOff + 11 + Math.sin(time) * 1.5, cy - 21, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

      } else if (shape === "rose_bud") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 20;
          const wOff = getWobbleOffset(depthIdx * 25);
          const radius = 55 - depthIdx * 6;
          drawSegment(cx + wOff, yPos, radius, radius * 0.5, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
          
          ctx.save();
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, 40);
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + wOff, yPos - 4, radius * 0.7, 0.1 * depthIdx, Math.PI + i);
          ctx.stroke();
          ctx.restore();
        }

      } else if (shape === "twisted_pretzel") {
        const wOff = getWobbleOffset(20);
        ctx.save();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 14;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 40, cy - 10);
        ctx.quadraticCurveTo(cx + wOff - 65, cy + 25, cx + wOff - 10, cy + 15);
        ctx.quadraticCurveTo(cx + wOff, cy, cx + wOff + 10, cy + 15);
        ctx.quadraticCurveTo(cx + wOff + 65, cy + 25, cx + wOff + 40, cy - 10);
        ctx.quadraticCurveTo(cx + wOff + 20, cy - 40, cx + wOff, cy - 15);
        ctx.quadraticCurveTo(cx + wOff - 20, cy - 40, cx + wOff - 40, cy - 10);
        ctx.stroke();
        
        ctx.lineWidth = 18;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -25);
        ctx.fillStyle = "#FFF";
        for (let s = 0; s < 7; s++) {
          const sX = cx + wOff + Math.sin(s * 2.3) * 45;
          const sY = cy + Math.cos(s * 1.8) * 18;
          ctx.beginPath();
          ctx.rect(sX - 3, sY - 3, 6, 6);
          ctx.fill();
        }
        ctx.restore();

      } else if (shape === "golden_pyramid") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 25 + 15;
          const wOff = getWobbleOffset(depthIdx * 30);
          const size = 110 * ((count - depthIdx) / count);
          
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -30);
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.moveTo(cx + wOff, yPos - 12);
          ctx.lineTo(cx + wOff - size / 2, yPos + 12);
          ctx.lineTo(cx + wOff + size / 2, yPos + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = lightenOrDarkenColor(baseColor, -25);
          ctx.beginPath();
          ctx.moveTo(cx + wOff, yPos - 12);
          ctx.lineTo(cx + wOff + size / 2, yPos + 12);
          ctx.lineTo(cx + wOff + size * 0.1, yPos + 12);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

      } else if (shape === "lucky_bag") {
        const wOff = getWobbleOffset(25);
        drawSegment(cx + wOff, cy + 15, 65, 30, baseColor, accentColor, 0, 0.1);
        drawSegment(cx + wOff, cy - 10, 48, 24, baseColor, accentColor, 1, 0.4);
        
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FFDF00";
        ctx.beginPath();
        ctx.arc(cx + wOff, cy - 14, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(cx + wOff - 12, cy - 14, 10, 5, -Math.PI / 6, 0, Math.PI * 2);
        ctx.ellipse(cx + wOff + 12, cy - 14, 10, 5, Math.PI / 6, 0, Math.PI * 2);
        ctx.fillStyle = "#FFDF00";
        ctx.fill();
        ctx.stroke();
        ctx.restore();

      } else if (shape === "curvy_chili") {
        const wOff = getWobbleOffset(25);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
        ctx.lineWidth = 3.5;
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 22, cy - 65);
        ctx.bezierCurveTo(
          cx + wOff + 35, cy - 25,
          cx + wOff + 45, cy + 25,
          cx + wOff - 15, cy + 38
        );
        ctx.bezierCurveTo(
          cx + wOff + 18, cy + 18,
          cx + wOff + 22, cy - 20,
          cx + wOff + 12, cy - 65
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#48BB78";
        ctx.strokeStyle = "#22543D";
        ctx.beginPath();
        ctx.ellipse(cx + wOff - 5, cy - 66, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 5, cy - 66);
        ctx.quadraticCurveTo(cx + wOff - 12, cy - 82, cx + wOff - 8, cy - 86);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

      } else if (shape === "gear_wheel") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        const wOff = getWobbleOffset(30);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 25 + 10;
          const radius = 55 - depthIdx * 6;
          
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
          ctx.lineWidth = 3;
          
          ctx.beginPath();
          ctx.arc(cx + wOff, yPos, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          const teeth = 8;
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
          ctx.lineWidth = 3;
          for (let t = 0; t < teeth; t++) {
            const angle = (t * Math.PI * 2) / teeth + time;
            const tx = cx + wOff + Math.cos(angle) * (radius + 4);
            const ty = yPos + Math.sin(angle) * (radius + 4);
            ctx.beginPath();
            ctx.arc(tx, ty, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        }

      } else if (shape === "spiral_stair") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const angle = (depthIdx * Math.PI * 2) / 8 + time;
          const xPos = cx + Math.cos(angle) * 35 + getWobbleOffset(depthIdx * 20);
          const yPos = cy - depthIdx * 20;
          drawSegment(xPos, yPos, 45 - depthIdx * 1.5, 12, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
        }

      } else if (shape === "cactus_pillar") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        const wOff = getWobbleOffset(30);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 24 + 10;
          drawSegment(cx + wOff, yPos, 28, 14, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
        }
        if (drawCount >= 3) {
          drawSegment(cx + wOff - 35, cy - 35, 12, 22, "#38A169", "#22543D", 1, 0.5);
        }
        if (drawCount >= 4) {
          drawSegment(cx + wOff + 35, cy - 55, 12, 22, "#48BB78", "#22543D", 2, 0.6);
        }

      } else if (shape === "leaning_tower") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const leaningOffset = -depthIdx * 5.5;
          const yPos = cy - depthIdx * 24 + 10;
          const wOff = getWobbleOffset(depthIdx * 30);
          const rx = 44 - depthIdx * 2.5;
          const ry = 14;
          drawSegment(cx + leaningOffset + wOff, yPos, rx, ry, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
        }

      } else if (shape === "chess_knight") {
        const wOff = getWobbleOffset(25);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -45);
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.ellipse(cx + wOff, cy + 24, 55, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + wOff - 25, cy + 20);
        ctx.quadraticCurveTo(cx + wOff - 35, cy - 35, cx + wOff - 15, cy - 65);
        ctx.quadraticCurveTo(cx + wOff - 5, cy - 80, cx + wOff + 15, cy - 65);
        ctx.quadraticCurveTo(cx + wOff + 38, cy - 55, cx + wOff + 10, cy - 35);
        ctx.quadraticCurveTo(cx + wOff - 5, cy - 30, cx + wOff, cy - 4);
        ctx.quadraticCurveTo(cx + wOff + 25, cy + 5, cx + wOff + 25, cy + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 18, cy - 64);
        ctx.lineTo(cx + wOff - 24, cy - 82);
        ctx.lineTo(cx + wOff - 10, cy - 68);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(cx + wOff - 2, cy - 56, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(cx + wOff - 1.5, cy - 55.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (shape === "ancient_totem") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 26 + 10;
          const wOff = getWobbleOffset(depthIdx * 30);
          drawSegment(cx + wOff, yPos, 36, 14, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
          
          ctx.save();
          ctx.fillStyle = accentColor;
          ctx.fillRect(cx + wOff - 18, yPos - 5, 8, 4);
          ctx.fillRect(cx + wOff + 10, yPos - 5, 8, 4);
          ctx.fillRect(cx + wOff - 10, yPos + 3, 20, 3);
          ctx.restore();
        }

      } else if (shape === "gourmet_croissant") {
        const wOff = getWobbleOffset(25);
        const croissantTiers = 5;
        for (let i = 0; i < croissantTiers; i++) {
          const depth = croissantTiers - 1 - i;
          const yPos = cy + 18 - depth * 14;
          const rx = 65 - depth * 10;
          const ry = 22 - depth * 3;
          drawSegment(cx + wOff, yPos, rx, ry, baseColor, accentColor, depth, depth / croissantTiers);
        }

      } else if (shape === "pagoda_spire") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const depthIdx = count - 1 - i;
          const yPos = cy - depthIdx * 25 + 15;
          const wOff = getWobbleOffset(depthIdx * 30);
          const baseScale = (count - depthIdx) / count;
          const rx = 55 * baseScale + 12;
          const ry = 12;
          
          drawSegment(cx + wOff, yPos, rx, ry, baseColor, accentColor, depthIdx, depthIdx / (count || 1));
          
          ctx.save();
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.moveTo(cx + wOff - rx, yPos);
          ctx.quadraticCurveTo(cx + wOff - rx - 8, yPos - 12, cx + wOff - rx - 14, yPos - 10);
          ctx.lineTo(cx + wOff - rx + 4, yPos + 2);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(cx + wOff + rx, yPos);
          ctx.quadraticCurveTo(cx + wOff + rx + 8, yPos - 12, cx + wOff + rx + 14, yPos - 10);
          ctx.lineTo(cx + wOff + rx - 4, yPos + 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

      } else if (shape === "infinity_loop") {
        const holdingDays = art.holdingDays || 0;
        const count = getMaximumSegmentsCount(shape, holdingDays);
        let drawCount = vCount === undefined ? count : Math.min(vCount, count);
        for (let i = 0; i < drawCount; i++) {
          const angle = (i * Math.PI * 2) / count + time;
          const loopX = cx + Math.sin(angle * 2) * 45 + getWobbleOffset(i * 15);
          const loopY = cy + Math.sin(angle) * 25 + 8;
          drawSegment(loopX, loopY, 24, 18, baseColor, accentColor, i, i / count);
        }

      } else if (shape === "thor_hammer") {
        const wOff = getWobbleOffset(30);
        ctx.save();
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
        ctx.lineWidth = 4;
        
        ctx.fillStyle = "#718096";
        ctx.fillRect(cx + wOff - 5, cy + 2, 10, 42);
        ctx.strokeRect(cx + wOff - 5, cy + 2, 10, 42);
        
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.rect(cx + wOff - 50, cy - 42, 100, 44);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = lightenOrDarkenColor(baseColor, 30);
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 50, cy - 42);
        ctx.lineTo(cx + wOff - 55, cy - 35);
        ctx.lineTo(cx + wOff - 55, cy - 7);
        ctx.lineTo(cx + wOff - 50, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + wOff + 50, cy - 42);
        ctx.lineTo(cx + wOff + 55, cy - 35);
        ctx.lineTo(cx + wOff + 55, cy - 7);
        ctx.lineTo(cx + wOff + 50, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#63B3ED";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 20, cy - 26);
        ctx.lineTo(cx + wOff - 5, cy - 14);
        ctx.lineTo(cx + wOff + 8, cy - 28);
        ctx.lineTo(cx + wOff + 25, cy - 16);
        ctx.stroke();
        ctx.restore();

      } else if (shape === "origami_crane") {
        const wOff = getWobbleOffset(25);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
        ctx.lineWidth = 3.5;
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff, cy - 35);
        ctx.lineTo(cx + wOff - 45, cy + 10);
        ctx.lineTo(cx + wOff, cy - 2);
        ctx.lineTo(cx + wOff + 45, cy + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff, cy - 35);
        ctx.lineTo(cx + wOff, cy - 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + wOff, cy - 10);
        ctx.lineTo(cx + wOff - 38, cy - 26);
        ctx.lineTo(cx + wOff - 44, cy - 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + wOff, cy - 10);
        ctx.lineTo(cx + wOff + 36, cy - 28);
        ctx.stroke();
        ctx.restore();

      } else if (shape === "volcanic_caldera") {
        const wOff = getWobbleOffset(30);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 75, cy + 24);
        ctx.lineTo(cx + wOff - 28, cy - 28);
        ctx.lineTo(cx + wOff + 28, cy - 28);
        ctx.lineTo(cx + wOff + 75, cy + 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#FF5500";
        ctx.strokeStyle = "#FFFF00";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(cx + wOff, cy - 28, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

      } else if (shape === "cathedral_dome") {
        const wOff = getWobbleOffset(25);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -40);
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.ellipse(cx + wOff, cy + 18, 64, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(cx + wOff, cy + 2, 54, 44, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, 30);
        ctx.lineWidth = 2;
        for (let r = -2; r <= 2; r++) {
          ctx.beginPath();
          ctx.ellipse(cx + wOff, cy + 2, Math.abs(r) * 16, 44, 0, Math.PI, 0);
          ctx.stroke();
        }
        
        ctx.strokeStyle = "#FFDF00";
        ctx.lineWidth = 3.5;
        const spyY = cy - 42;
        ctx.beginPath();
        ctx.moveTo(cx + wOff, spyY);
        ctx.lineTo(cx + wOff, spyY - 18);
        ctx.moveTo(cx + wOff - 6, spyY - 12);
        ctx.lineTo(cx + wOff + 6, spyY - 12);
        ctx.stroke();
        ctx.restore();

      } else if (shape === "fortune_cookie") {
        const wOff = getWobbleOffset(20);
        ctx.save();
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = lightenOrDarkenColor(baseColor, -35);
        ctx.lineWidth = 3.5;
        
        ctx.beginPath();
        ctx.ellipse(cx + wOff - 18, cy + 4, 32, 22, -Math.PI / 10, 0, Math.PI * 2);
        ctx.ellipse(cx + wOff + 18, cy + 4, 32, 22, Math.PI / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#FFFFF8";
        ctx.strokeStyle = "#A0AEC0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(cx + wOff - 15, cy - 24, 35, 12);
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = "#4A5568";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + wOff - 10, cy - 18);
        ctx.lineTo(cx + wOff + 12, cy - 18);
        ctx.moveTo(cx + wOff - 8, cy - 14);
        ctx.lineTo(cx + wOff + 8, cy - 14);
        ctx.stroke();
        ctx.restore();
      }

      // 4. DRAW EXTRA SPECIAL EFFECTS (Steam, glint sparklers, velvet barrier bounds)
      if (texture === "steaming" || texture === "toxic_slime") {
        ctx.save();
        ctx.strokeStyle = texture === "toxic_slime" ? "rgba(100, 255, 100, 0.4)" : "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        // Rising vapor lines
        for (let j = 0; j < 3; j++) {
          const steamX = cx + (j - 1) * 35 + Math.sin(time * 3 + j) * 8;
          const steamY = cy - 70 - (time * 40 + j * 30) % 90;
          ctx.beginPath();
          ctx.moveTo(steamX, steamY);
          ctx.bezierCurveTo(
            steamX - 5, steamY - 15,
            steamX + 5, steamY - 30,
            steamX, steamY - 45
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      if (texture === "metallic_gold") {
        // Draw occasional rotating majestic sparkling stars in orbit
        ctx.save();
        const sparklesCount = 4;
        for (let i = 0; i < sparklesCount; i++) {
          const angle = time * 0.8 + (i * Math.PI * 2) / sparklesCount;
          const orbX = cx + Math.cos(angle) * 95;
          const orbY = cy - 40 + Math.sin(angle * 2) * 15;
          const size = Math.abs(Math.sin(time * 4 + i)) * 8 + 4;
          drawStar(ctx, orbX, orbY, 4, size, size / 3, "#FFDF00");
        }
        ctx.restore();
      }

      if (texture === "crystalline") {
        // Crystalline shiny facet lines directly on the silhouette
        ctx.save();
        ctx.strokeStyle = "#E0FFFF";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 20);
        ctx.lineTo(cx, cy + 10);
        ctx.lineTo(cx + 40, cy - 10);
        ctx.moveTo(cx, cy - 40);
        ctx.lineTo(cx - 15, cy - 10);
        ctx.lineTo(cx + 10, cy - 10);
        ctx.lineTo(cx, cy - 40);
        ctx.stroke();
        ctx.restore();
      }

      // Draw the Mint Leaf only if reached complete state
      const holdingDays = art.holdingDays || 0;
      const maxSegments = getMaximumSegmentsCount(shape, holdingDays);
      if (vCount === undefined || vCount >= maxSegments) {
        let currentSpireY = cy - maxSegments * 30 + 10;
        if (shape === "massive_mountain") {
          currentSpireY = cy - maxSegments * (26 * (5 / Math.min(8, maxSegments))) + 10;
        } else if (shape === "eiffel_tower") {
          currentSpireY = cy - maxSegments * (25 * (6 / Math.min(9, maxSegments))) - 45 + 10;
        } else if (shape === "lucky_cat_tail") {
          currentSpireY = cy - maxSegments * 24 - 14 + 10;
        } else if (shape === "alien_ufo") {
          currentSpireY = cy - 8 - 26 + 10;
        } else if (shape === "royal_crown") {
          currentSpireY = cy - 50 + 10;
        } else if (shape === "ring_doughnut") {
          currentSpireY = cy - 35 + 10;
        } else if (shape === "spherical_boba") {
          currentSpireY = cy - maxSegments * 28 + 10;
        } else if (shape === "space_station") {
          currentSpireY = cy - 20 + 10;
        } else if (shape === "abstract_cube") {
          currentSpireY = cy - maxSegments * 25 + 10;
        } else if (shape === "sharp_obelisk") {
          currentSpireY = cy - maxSegments * 32 + 10;
        } else if (shape === "cute_octopus") {
          currentSpireY = cy - 20 + 10;
        } else if (shape === "rose_bud") {
          currentSpireY = cy - maxSegments * 20 + 10;
        } else if (shape === "twisted_pretzel") {
          currentSpireY = cy - 15 + 10;
        } else if (shape === "golden_pyramid") {
          currentSpireY = cy - maxSegments * 25 + 10;
        } else if (shape === "lucky_bag") {
          currentSpireY = cy - 10 + 10;
        } else if (shape === "curvy_chili") {
          currentSpireY = cy - 65 + 10;
        } else if (shape === "gear_wheel") {
          currentSpireY = cy - maxSegments * 25 + 10;
        } else if (shape === "spiral_stair") {
          currentSpireY = cy - maxSegments * 20 + 10;
        } else if (shape === "cactus_pillar") {
          currentSpireY = cy - maxSegments * 24 + 10;
        } else if (shape === "leaning_tower") {
          currentSpireY = cy - maxSegments * 24 + 10;
        } else if (shape === "chess_knight") {
          currentSpireY = cy - 82 + 10;
        } else if (shape === "ancient_totem") {
          currentSpireY = cy - maxSegments * 26 + 10;
        } else if (shape === "gourmet_croissant") {
          currentSpireY = cy + 18 - 4 * 14 + 10;
        } else if (shape === "pagoda_spire") {
          currentSpireY = cy - maxSegments * 25 + 10;
        } else if (shape === "infinity_loop") {
          currentSpireY = cy - 25 + 10;
        } else if (shape === "thor_hammer") {
          currentSpireY = cy - 42 + 10;
        } else if (shape === "origami_crane") {
          currentSpireY = cy - 35 + 10;
        } else if (shape === "volcanic_caldera") {
          currentSpireY = cy - 28 + 10;
        } else if (shape === "cathedral_dome") {
          currentSpireY = cy - 42 + 10;
        } else if (shape === "fortune_cookie") {
          currentSpireY = cy - 24 + 10;
        }

        const topOffsetPercent = currentSpireY - 14;
        const topX = cx + getWobbleOffset(4 * 50);

        ctx.save();
        // Green mint leaf drawing
        ctx.fillStyle = "#48BB78"; // Fresh green mint color
        ctx.strokeStyle = "#276749";
        ctx.lineWidth = 2;

        ctx.beginPath();
        const lX = topX + 2;
        const lY = topOffsetPercent;
        ctx.translate(lX, lY);
        ctx.rotate(-Math.PI / 6 + Math.sin(time * 2) * 0.08); // slight wind float action

        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-14, -8, -12, -22);
        ctx.quadraticCurveTo(-2, -18, 0, 0);
        ctx.fill();
        ctx.stroke();

        // Leaf veins
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-9, -15);
        ctx.stroke();

        ctx.restore();
      }

      // Pop the dpr scale save state securely
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [art, visibleSegmentsCount]);

  // Helper: Convert hex to RGBA
  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Helper: Lighten or Darken colors nicely for gradients/strokes
  const lightenOrDarkenColor = (colHex: string, amt: number) => {
    let usePound = false;
    if (colHex[0] === "#") {
      colHex = colHex.slice(1);
      usePound = true;
    }
    let num = parseInt(colHex, 16);
    if (isNaN(num)) {
      return usePound ? "#8B5A2B" : "8B5A2B"; // fallback
    }

    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  };

  // Helper: Draw sparkling polygon star
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    colorHex: string
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = colorHex;
    ctx.fill();
    ctx.restore();
  };

  return (
    <div
      id={`poop_render_container_${art.id || "preview"}`}
      className={`relative flex items-center justify-center transition-all ${className}`}
      style={{ cursor: interactive ? "pointer" : "default" }}
      onClick={() => {
        if (interactive) triggerWobble();
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (interactive) playTickSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={350}
        height={320}
        className="max-w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform hover:scale-[1.03] transition-transform duration-300"
      />
      {interactive && isHovered && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-300 tracking-wider uppercase pointer-events-none">
          Click to DUANG (Q弹一下)
        </div>
      )}
    </div>
  );
};

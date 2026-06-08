import React, { useState, useRef, useEffect } from "react";
import { PoopArt } from "../types";
import { 
  G_MBTI_DICT, 
  calculateMbtiScores 
} from "../utils/gMbtiDb";
import { PoopRenderer } from "./PoopRenderer";
import { 
  Award, 
  Download, 
  X, 
  Sparkles, 
  Smile, 
  ShieldAlert, 
  Compass,
  BookOpen,
  Crown,
  Sparkle
} from "lucide-react";
import html2canvas from "html2canvas";
import { playTickSound, playDingSound } from "../utils/audio";
import QRCode from "qrcode";

interface GastroMbtiPanelProps {
  exhibits: PoopArt[];
}

// Global OKLCH parser and converter helpers for html2canvas compatibility
const parseOklch = (str: string) => {
  const cleaned = str.replace(/oklch\((.*)\)/i, "$1").trim();
  const parts = cleaned.split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;

  let l = parseFloat(parts[0]);
  if (parts[0].endsWith("%")) l /= 100;

  let c = parseFloat(parts[1]);
  if (parts[1].endsWith("%")) c /= 100;

  let h = parseFloat(parts[2]);
  if (parts[2].endsWith("rad")) {
    h = parseFloat(parts[2]) * (180 / Math.PI);
  } else if (parts[2].endsWith("turn")) {
    h = parseFloat(parts[2]) * 360;
  }

  let a = 1;
  if (parts.length >= 4) {
    a = parseFloat(parts[3]);
    if (parts[3].endsWith("%")) a /= 100;
  }

  return { l, c, h, a };
};

const oklchToRgb = (l: number, c: number, h: number, a: number = 1): string => {
  const hRad = (h * Math.PI) / 180;
  const L = l;
  const _a = c * Math.cos(hRad);
  const _b = c * Math.sin(hRad);

  const l_ = L + 0.3963377774 * _a + 0.2158037573 * _b;
  const m_ = L - 0.1055613458 * _a - 0.0638541728 * _b;
  const s_ = L - 0.0894841775 * _a - 1.2914855480 * _b;

  const l_cube = l_ * l_ * l_;
  const m_cube = m_ * m_ * m_;
  const s_cube = s_ * s_ * s_;

  const r = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
  const g = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
  const b = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076147010 * s_cube;

  const gamma = (val: number) => {
    return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const R = Math.max(0, Math.min(255, Math.round(gamma(r) * 255)));
  const G = Math.max(0, Math.min(255, Math.round(gamma(g) * 255)));
  const B = Math.max(0, Math.min(255, Math.round(gamma(b) * 255)));

  if (a === 1) {
    return `rgb(${R}, ${G}, ${B})`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${a})`;
  }
};

const fallbackForTailwindOklch = (match: string): string => {
  const lowercase = match.toLowerCase();
  
  // Extract alpha (e.g. "/ 0.4" or "/ 20%")
  let alpha = 1;
  const alphaMatch = lowercase.match(/\/[\s]*([0-9.%]+)/);
  if (alphaMatch) {
    const rawAlpha = alphaMatch[1];
    if (rawAlpha.endsWith("%")) {
      alpha = parseFloat(rawAlpha) / 100;
    } else {
      alpha = parseFloat(rawAlpha);
    }
    if (isNaN(alpha)) alpha = 1;
  }

  // Check for intensity/brightness
  let intensity = 500; // default medium
  const numMatch = lowercase.match(/([0-9]{3})/);
  if (numMatch) {
    intensity = parseInt(numMatch[1], 10);
  }

  // Find color family
  let baseRgb = "120, 120, 120"; // default gray
  if (lowercase.includes("white")) {
    baseRgb = "255, 255, 255";
  } else if (lowercase.includes("black")) {
    baseRgb = "0, 0, 0";
  } else if (lowercase.includes("zinc")) {
    if (intensity <= 200) baseRgb = "244, 244, 245";
    else if (intensity >= 700) baseRgb = "24, 24, 27";
    else baseRgb = "113, 113, 122";
  } else if (lowercase.includes("gray")) {
    if (intensity <= 200) baseRgb = "242, 242, 247";
    else if (intensity >= 700) baseRgb = "28, 28, 30";
    else baseRgb = "142, 142, 147";
  } else if (lowercase.includes("slate")) {
    if (intensity <= 200) baseRgb = "241, 245, 249";
    else if (intensity >= 700) baseRgb = "15, 23, 42";
    else baseRgb = "100, 116, 139";
  } else if (lowercase.includes("amber")) {
    baseRgb = intensity <= 200 ? "254, 243, 199" : (intensity >= 700 ? "180, 83, 9" : "245, 158, 11");
  } else if (lowercase.includes("yellow")) {
    baseRgb = intensity <= 200 ? "254, 240, 138" : (intensity >= 700 ? "161, 98, 7" : "234, 179, 8");
  } else if (lowercase.includes("emerald")) {
    baseRgb = intensity <= 200 ? "209, 250, 229" : (intensity >= 700 ? "4, 120, 87" : "16, 185, 129");
  } else if (lowercase.includes("green")) {
    baseRgb = intensity <= 200 ? "220, 252, 231" : (intensity >= 700 ? "21, 128, 61" : "34, 197, 94");
  } else if (lowercase.includes("red")) {
    baseRgb = intensity <= 200 ? "254, 226, 226" : (intensity >= 700 ? "185, 28, 28" : "239, 68, 68");
  } else if (lowercase.includes("rose")) {
    baseRgb = intensity <= 200 ? "254, 228, 232" : (intensity >= 700 ? "190, 24, 74" : "244, 63, 94");
  } else if (lowercase.includes("blue")) {
    baseRgb = intensity <= 200 ? "219, 234, 254" : (intensity >= 700 ? "29, 78, 216" : "59, 130, 246");
  } else if (lowercase.includes("cyan")) {
    baseRgb = intensity <= 200 ? "207, 250, 254" : (intensity >= 700 ? "14, 116, 144" : "6, 182, 212");
  } else if (lowercase.includes("sky")) {
    baseRgb = intensity <= 200 ? "224, 242, 254" : (intensity >= 700 ? "3, 105, 161" : "14, 165, 233");
  } else if (lowercase.includes("purple")) {
    baseRgb = intensity <= 200 ? "243, 232, 255" : (intensity >= 700 ? "126, 34, 206" : "147, 51, 234");
  } else if (lowercase.includes("violet")) {
    baseRgb = intensity <= 200 ? "237, 233, 254" : (intensity >= 700 ? "109, 40, 217" : "139, 92, 246");
  } else {
    if (lowercase.includes("art-yellow")) baseRgb = "255, 217, 61";
    else if (lowercase.includes("art-red")) baseRgb = "255, 107, 107";
    else if (lowercase.includes("art-blue")) baseRgb = "77, 150, 255";
    else if (lowercase.includes("art-green")) baseRgb = "107, 203, 119";
    else if (lowercase.includes("art-charcoal")) baseRgb = "43, 45, 66";
    else if (lowercase.includes("art-cream")) baseRgb = "255, 251, 235";
    else if (lowercase.includes("art-dark")) baseRgb = "15, 15, 15";
  }

  return `rgba(${baseRgb}, ${alpha})`;
};

const convertOklchStringToRgb = (val: string): string => {
  if (!val || typeof val !== "string") return val;
  if (!val.includes("oklch") && !val.includes("oklab")) return val;

  let res = val;
  const oklchRegex = /oklch\([^)]+\)/gi;
  res = res.replace(oklchRegex, (match) => {
    try {
      if (match.includes("from") || match.includes("var") || match.includes("currentcolor")) {
        return fallbackForTailwindOklch(match);
      }
      const parsed = parseOklch(match);
      if (parsed) {
        if (isNaN(parsed.l) || isNaN(parsed.c) || isNaN(parsed.h)) {
          return fallbackForTailwindOklch(match);
        }
        return oklchToRgb(parsed.l, parsed.c, parsed.h, parsed.a);
      }
    } catch (e) {
      console.error("Error parsing/converting oklch match in convertOklchStringToRgb:", match, e);
    }
    return fallbackForTailwindOklch(match);
  });

  const oklabRegex = /oklab\([^)]+\)/gi;
  res = res.replace(oklabRegex, "rgba(120, 120, 120, 1)");

  return res;
};

// Pure HTML sharp vector-style QR Code for crisp html2canvas rendering using qrcode package
const PureHtmlQrCode: React.FC = () => {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    QRCode.toDataURL(
      url,
      {
        margin: 1,
        width: 140, // High density
        color: {
          dark: "#14151C",
          light: "#FFFFFF"
        },
        errorCorrectionLevel: "M"
      },
      (err, src) => {
        if (err) {
          console.error("Failed to generate QR Code in PureHtmlQrCode:", err);
        } else {
          setQrSrc(src);
        }
      }
    );
  }, []);

  return (
    <div className="w-[58px] h-[58px] bg-white relative select-none shrink-0 overflow-hidden border border-zinc-200 rounded p-[1px] flex items-center justify-center">
      {qrSrc ? (
        <img src={qrSrc} className="w-full h-full object-contain" alt="QR Code" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-full h-full bg-zinc-100 animate-pulse" />
      )}
    </div>
  );
};

export const GastroMbtiPanel: React.FC<GastroMbtiPanelProps> = ({ exhibits }) => {
  // Retrieve the registered chef artist name
  const artistName = localStorage.getItem("poop_museum_artist") || "momo";

  // Automatically calculate metrics based on the stored museum exhibits
  const { scores } = calculateMbtiScores(exhibits);
  const fScore = scores.frequency;
  const mScore = scores.materials;
  const tScore = scores.taste;
  const cScore = scores.consistency;

  // Derive static MBTI code letter combination
  const derivedKey = (() => {
    const fLetter = fScore >= 50 ? "H" : "R";
    const mLetter = mScore >= 50 ? "M" : "V";
    const tLetter = tScore >= 50 ? "S" : "L";
    const cLetter = cScore >= 50 ? "D" : "F";
    return `${fLetter}${mLetter}${tLetter}${cLetter}`;
  })();

  const activeProfile = G_MBTI_DICT[derivedKey] || G_MBTI_DICT["RVLD"];

  // Poster modal overlay state
  const [showPosterReport, setShowPosterReport] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [generatedPosterSrc, setGeneratedPosterSrc] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);

  // Pick the C-Position core exhibit from library with highest rarity/weight
  const cPositionExhibit = (() => {
    if (exhibits && exhibits.length > 0) {
      return [...exhibits].sort((a, b) => {
        const rarityWeights = { UR: 4, SR: 3, R: 2, N: 1 };
        const wA = rarityWeights[a.rarity] || 1;
        const wB = rarityWeights[b.rarity] || 1;
        if (wA !== wB) return wB - wA;
        return (b.holdingDays || 0) - (a.holdingDays || 0);
      })[0];
    }
    
    // Virtual fallback if none exists (though we only render when exhibits.length > 0, we guard safely)
    return {
      id: "fallback-masterpiece",
      title: "《宇宙起源：纯粹自组装沉积》",
      artist: "先锋氏",
      meals: { breakfast: "和牛", lunch: "尖椒", dinner: "高纤" },
      timestamp: new Date().toISOString(),
      rarity: "UR",
      colorHex: "#5c3d24",
      accentColorHex: "#FFD700",
      textureType: "gilded_relic",
      shapeType: "royal_crown",
      ingredientsAnalyzed: ["顶级黑安格斯肥牛", "四川二荆条"],
      curatorComment: "一尊冥想中由高压催生而出的至高熔岩结体。",
      holdingDays: 7
    } as PoopArt;
  })();

  // Dynamic royal exhibition space lighting matching the structural quality (rarity) of our centerpiece
  const spotlightTheme = (() => {
    const rarity = cPositionExhibit?.rarity || "N";
    switch (rarity) {
      case "UR":
        return {
          beam: "linear-gradient(to bottom, rgba(234, 179, 8, 0.45) 0%, rgba(192, 162, 109, 0.12) 50%, transparent 100%)",
          flare: "radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, transparent 75%)",
          badgeBg: "rgba(192, 162, 109, 0.22)",
          badgeBorder: "rgba(234, 179, 8, 0.6)",
          badgeText: "#F3E0B5",
          label: "👑 阿波罗金殿神光 (UR 传世之宝)"
        };
      case "SR":
        return {
          beam: "linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 100%)",
          flare: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, transparent 75%)",
          badgeBg: "rgba(168, 85, 247, 0.22)",
          badgeBorder: "rgba(168, 85, 247, 0.6)",
          badgeText: "#F3E8FF",
          label: "🔮 凡尔赛紫宸瑞光 (SR 极稀馆藏)"
        };
      case "R":
        return {
          beam: "linear-gradient(to bottom, rgba(20, 184, 166, 0.45) 0%, rgba(13, 148, 136, 0.12) 50%, transparent 100%)",
          flare: "radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 75%)",
          badgeBg: "rgba(20, 184, 166, 0.22)",
          badgeBorder: "rgba(20, 184, 166, 0.6)",
          badgeText: "#CCFBF1",
          label: "🏺 卢浮青铜古法冷光 (R 精选特展)"
        };
      case "N":
      default:
        return {
          beam: "linear-gradient(to bottom, rgba(244, 244, 245, 0.35) 0%, rgba(161, 161, 170, 0.08) 50%, transparent 100%)",
          flare: "radial-gradient(circle, rgba(244, 244, 245, 0.25) 0%, transparent 75%)",
          badgeBg: "rgba(244, 244, 245, 0.12)",
          badgeBorder: "rgba(244, 244, 245, 0.4)",
          badgeText: "#F4F4F5",
          label: "🏛️ 漫步长廊白石雕光 (N 常见标本)"
        };
    }
  })();

  // Robust function to sanitize CSS content and dynamically transform unsupported oklch/oklab parentheses groups into plain RGB fallback values
  const sanitizeCSSForHtml2Canvas = (text: string): string => {
    return convertOklchStringToRgb(text);
  };

  // Export printable poster with full pixel-perfect static DOM replication and style sanitization
  const handleExportPoster = async () => {
    const element = posterRef.current;
    if (!element) return;
    
    setIsGeneratingPoster(true);
    playDingSound();

    // Small delay to allow react state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // PRE-CAPTURE CONVERSION: Temporarily substitute animated interactive canvas components with static PNG image tags
    const canvasReplacements: { canvas: HTMLCanvasElement; img: HTMLImageElement; parent: HTMLElement; nextSibling: Node | null }[] = [];
    const originalCanvases = element.querySelectorAll("canvas");
    
    originalCanvases.forEach((origCanvas) => {
      if (origCanvas instanceof HTMLCanvasElement) {
        try {
          const imgUrl = origCanvas.toDataURL("image/png");
          const staticImg = document.createElement("img");
          staticImg.src = imgUrl;
          staticImg.className = origCanvas.className;
          staticImg.style.cssText = origCanvas.style.cssText;
          staticImg.style.width = "100%";
          staticImg.style.height = "100%";
          
          const parent = origCanvas.parentNode as HTMLElement;
          if (parent) {
            const nextSibling = origCanvas.nextSibling;
            parent.replaceChild(staticImg, origCanvas);
            canvasReplacements.push({
              canvas: origCanvas,
              img: staticImg,
              parent,
              nextSibling
            });
          }
        } catch (err) {
          console.error("Temporary canvas transformation failed for printable poster export:", err);
        }
      }
    });

    // PHYSICAL GETTER MONKEYPATCHES:
    // Intercept standard rendering style access rules to replace oklch / oklab colors during html2canvas generation
    const originalGetComputedStyle = window.getComputedStyle;
    const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
    const originalCssTextDescriptor = Object.getOwnPropertyDescriptor(CSSRule.prototype, "cssText");

    const bypassColorFunctions = (val: string): string => {
      return convertOklchStringToRgb(val);
    };

    // Patch window.getComputedStyle in-flight
    window.getComputedStyle = function (el, pseudoEl) {
      const style = originalGetComputedStyle.call(this, el, pseudoEl);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (typeof val === "function") {
            if (prop === "getPropertyValue") {
              return function (propertyName: string) {
                const raw = val.call(target, propertyName);
                return bypassColorFunctions(raw);
              };
            }
            return val.bind(target);
          }
          if (typeof prop === "string" && typeof val === "string") {
            return bypassColorFunctions(val);
          }
          return val;
        }
      });
    };

    // Patch CSSStyleDeclaration prototype
    CSSStyleDeclaration.prototype.getPropertyValue = function (propertyName: string) {
      const val = originalGetPropertyValue.call(this, propertyName);
      return bypassColorFunctions(val);
    };

    // Patch CSSRule.prototype cssText
    if (originalCssTextDescriptor && originalCssTextDescriptor.get) {
      Object.defineProperty(CSSRule.prototype, "cssText", {
        get() {
          const val = originalCssTextDescriptor.get!.call(this);
          return bypassColorFunctions(val);
        },
        configurable: true
      });
    }

    // PRE-CAPTURE PARENT DOCUMENT STYLESHEET SANITIZATION:
    // html2canvas reads document.styleSheets in the active window. Local stylesheets generated by Tailwind v4
    // containing modern colour functions like oklch/oklab trigger uncaught errors inside the library's stylesheet parser.
    // We temporarily sanitize those style blocks on the active page, launch html2canvas, and restore them immediately after.
    const originalStyleContentsByTag = new Map<HTMLStyleElement, string>();
    const tempSanitizedStyleTags: HTMLStyleElement[] = [];
    const disabledLinkStylesheets: { link: HTMLLinkElement; originalDisabled: boolean }[] = [];

    // Sanitize standard <style> tags
    const mainStyleTags = Array.from(document.querySelectorAll("style"));
    mainStyleTags.forEach((styleTag) => {
      try {
        const content = styleTag.textContent || "";
        if (content.includes("oklch") || content.includes("oklab")) {
          originalStyleContentsByTag.set(styleTag, content);
          styleTag.textContent = sanitizeCSSForHtml2Canvas(content);
        }
      } catch (err) {
        console.warn("Unable to backup/sanitize parent style tag:", err);
      }
    });

    // Fetch and sanitize external link stylesheets dynamically (e.g. bundled Tailwind CSS)
    const linkSheets = Array.from(document.querySelectorAll("link[rel='stylesheet']"));
    for (const link of linkSheets) {
      if (link instanceof HTMLLinkElement) {
        try {
          const response = await fetch(link.href);
          if (response.ok) {
            const text = await response.text();
            if (text.includes("oklch") || text.includes("oklab")) {
              const sanitizedText = sanitizeCSSForHtml2Canvas(text);
              const style = document.createElement("style");
              style.textContent = sanitizedText;
              document.head.appendChild(style);
              tempSanitizedStyleTags.push(style);

              // Temporarily disable original link stylesheet so html2canvas ignores it
              disabledLinkStylesheets.push({ link, originalDisabled: link.disabled });
              link.disabled = true;
              if (link.sheet) {
                link.sheet.disabled = true;
              }
            }
          }
        } catch (err) {
          console.warn("Failed to sanitize external link stylesheet dynamically:", link.href, err);
        }
      }
    }

    const restoreAllSheets = () => {
      // Restore physical getter monkeypatches instantly
      window.getComputedStyle = originalGetComputedStyle;
      CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
      if (originalCssTextDescriptor) {
        Object.defineProperty(CSSRule.prototype, "cssText", originalCssTextDescriptor);
      }

      // 1. Restore standard style tags
      originalStyleContentsByTag.forEach((origContent, tag) => {
        try {
          tag.textContent = origContent;
        } catch (restoreErr) {
          console.warn("Failed to restore parent style tag:", restoreErr);
        }
      });
      originalStyleContentsByTag.clear();

      // 2. Clean up temp style tags
      tempSanitizedStyleTags.forEach((style) => {
        try {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        } catch (err) {
          console.warn("Failed to remove temp style tag:", err);
        }
      });

      // 3. Re-enable link elements
      disabledLinkStylesheets.forEach(({ link, originalDisabled }) => {
        try {
          link.disabled = originalDisabled;
          if (link.sheet) {
            link.sheet.disabled = originalDisabled;
          }
        } catch (err) {
          console.warn("Failed to restore link element:", err);
        }
      });
    };

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2.5, // Crisp supersampling
        backgroundColor: "#0D0E12",
        onclone: (clonedDoc) => {
          // Robust sanitize styled styles preventing Tailwind v4 OKLCH / OKLAB compiler crashes in html2canvas library.
          const styleElements = clonedDoc.querySelectorAll("style");
          styleElements.forEach((styleTag) => {
            try {
              if (styleTag.textContent) {
                styleTag.textContent = sanitizeCSSForHtml2Canvas(styleTag.textContent);
              }
            } catch (err) {
              console.warn("Unable to preprocess cloned CSS tags:", err);
            }
          });

          // Clean up inline styles on DOM elements
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.style) {
              try {
                const cssText = el.style.cssText;
                if (cssText.includes("oklch") || cssText.includes("oklab")) {
                  el.style.cssText = sanitizeCSSForHtml2Canvas(cssText);
                }
              } catch (inlineErr) {
                // Ignore silent issues
              }
            }
          });
        }
      });

      // Restore active stylesheets on parent document instantly
      restoreAllSheets();

      // Restore interactive dynamic canvas models inside main viewport post snapshot
      canvasReplacements.forEach(({ canvas: origCanvas, img: staticImg, parent }) => {
        try {
          if (staticImg.parentNode === parent) {
            parent.replaceChild(origCanvas, staticImg);
          }
        } catch (restoreErr) {
          console.error("Canvas restoration exception during poster export close:", restoreErr);
        }
      });

      try {
        const dataUrl = canvas.toDataURL("image/png");
        setGeneratedPosterSrc(dataUrl);
        
        // Trigger file export downloads automatically
        const link = document.createElement("a");
        link.download = `Paris_Louvre_G-MBTI_Report_${activeProfile.key}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsGeneratingPoster(false);
        playDingSound();
      } catch (err) {
        console.error("Generating dynamic byte stream poster download caught exception:", err);
        setIsGeneratingPoster(false);
      }
    } catch (error) {
      // Make sure to restore sheets on error too!
      restoreAllSheets();

      console.error("Poster printing action exception catch:", error);
      canvasReplacements.forEach(({ canvas: origCanvas, img: staticImg, parent }) => {
        try {
          if (staticImg.parentNode === parent) {
            parent.replaceChild(origCanvas, staticImg);
          }
        } catch (resErr) {
          console.error(resErr);
        }
      });
      setIsGeneratingPoster(false);
    }
  };

  // Concentric coordinates layout for G-MBTI golden radar representation - R scaled to 80 for maximum visual prominence and beautiful labeling!
  const size = 200;
  const center = 100;
  const R = 80;
  const levels = [0.33, 0.66, 1.0];

  const pF = { x: center, y: center - (fScore / 100) * R };
  const pM = { x: center + (mScore / 100) * R, y: center };
  const pC = { x: center, y: center + (cScore / 100) * R };
  const pT = { x: center - (tScore / 100) * R, y: center };
  const mbtiPointsStr = `${pF.x},${pF.y} ${pM.x},${pM.y} ${pC.x},${pC.y} ${pT.x},${pT.y}`;

  return (
    <div className="w-full bg-[#0C0D12] border border-solid border-[#1F2028] rounded-3xl p-6 md:p-9 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-left relative overflow-hidden select-none">
      
      {/* Elegantly framed luxury neutral back drop textures */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 animate-pulse duration-[8000ms]" style={{ background: "radial-gradient(circle, rgba(161, 161, 170, 0.05) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(161, 161, 170, 0.03) 0%, transparent 70%)" }} />
      
      {/* Decorative filigree corners in safe neutral tone */}
      <div className="absolute top-4 left-4 text-zinc-750/30 font-serif text-sm pointer-events-none">⚜</div>
      <div className="absolute top-4 right-4 text-zinc-750/30 font-serif text-sm pointer-events-none">⚜</div>
      <div className="absolute bottom-4 left-4 text-zinc-750/30 font-serif text-sm pointer-events-none">⚜</div>
      <div className="absolute bottom-4 right-4 text-zinc-750/30 font-serif text-sm pointer-events-none">⚜</div>

      {/* Louvre Curated Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800/50 pb-6 mb-8 gap-4 relative z-10">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#8E919E] font-extrabold uppercase flex items-center gap-2">
            <Crown className="w-4 h-4 text-zinc-400" />
            SALON CARRÉ DE LOUVRE • GASTRO-APPRAISAL SPEECH
          </span>
          <h3 className="text-2.5xl sm:text-3.5xl font-serif font-black text-zinc-100 tracking-tight leading-none flex items-center gap-2.5 mt-1">
            ✦ 卢浮常设 · 胃肠理化鉴定大厅
          </h3>
          <p className="text-[11.5px] text-zinc-400 font-serif leading-relaxed max-w-3xl italic mt-2.5">
            “凡此一席标本之理化沉淀，实属生命本源在幽闭迷宫中抗御重力、精工蓄能之造物。本大厅谨以凡尔赛古典策展笔触，调阅您在漫长岁月中所凝铸之生理奇观，推衍专属于您的宏大生理MBTI哲学秩序。”
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => {
              setShowPosterReport(true);
              setGeneratedPosterSrc(null);
              playDingSound();
            }}
            className="px-6 py-3 text-xs font-black bg-[#16171E] hover:bg-[#1C1E26] border border-zinc-700 text-zinc-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:translate-y-px active:shadow-none font-extrabold cursor-pointer transition-all flex items-center gap-2 select-none"
          >
            <Sparkles className="w-4 h-4 text-zinc-350" />
            <span className="tracking-wide">阿波罗大厅专属 鉴定大字报导出</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Vitrine 1: Royal Bio-element analysis cabinet */}
        <div className="lg:col-span-4 bg-[#111218] border border-solid border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-[0_12px_30px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-850">
            <span className="text-xs font-serif italic text-zinc-300 flex items-center gap-2 font-extrabold">
              <BookOpen className="w-4.5 h-4.5 text-zinc-400" />
              📜 理化光谱四大纪
            </span>
            <span className="text-[8px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-750 px-2 py-0.5 rounded font-black">
              DOSSIER METRICS
            </span>
          </div>

          <div className="space-y-4 text-left">
            {/* parameter 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300 font-serif">蓄压憋附指数 <strong className="text-zinc-500 font-mono">(Holding Energy)</strong></span>
                <span className="text-zinc-300 font-mono tracking-wider">H-Core • {fScore}%</span>
              </div>
              <div className="w-full bg-zinc-950 border border-zinc-900 h-3 rounded-full overflow-hidden flex p-[1.5px]">
                <div 
                  className="bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${fScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 italic font-serif">
                <span>R 每日自然流淌之风</span>
                <span>H 深层阵发蓄能爆破</span>
              </div>
            </div>

            {/* parameter 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300 font-serif">量荤乳热谱系 <strong className="text-zinc-500 font-mono">(Dietary Load)</strong></span>
                <span className="text-zinc-300 font-mono tracking-wider">M-Calorie • {mScore}%</span>
              </div>
              <div className="w-full bg-zinc-950 border border-zinc-900 h-3 rounded-full overflow-hidden flex p-[1.5px]">
                <div 
                  className="bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${mScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 italic font-serif">
                <span>V 草本天然低密纤维</span>
                <span>M 多脂熟化重工业荤食</span>
              </div>
            </div>

            {/* parameter 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300 font-serif">香辛极地淬火 <strong className="text-zinc-500 font-mono">(Thermal Flux)</strong></span>
                <span className="text-zinc-300 font-mono tracking-wider">S-Hot • {tScore}%</span>
              </div>
              <div className="w-full bg-zinc-950 border border-zinc-900 h-3 rounded-full overflow-hidden flex p-[1.5px]">
                <div 
                  className="bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${tScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 italic font-serif">
                <span>L 极简寡淡养生清汤</span>
                <span>S 蒸腾红油地壳玄武熔岩</span>
              </div>
            </div>

            {/* parameter 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300 font-serif">玄武抗压密度 <strong className="text-zinc-500 font-mono">(Solid Index)</strong></span>
                <span className="text-zinc-300 font-mono tracking-wider">D-Basalt • {cScore}%</span>
              </div>
              <div className="w-full bg-zinc-950 border border-zinc-900 h-3 rounded-full overflow-hidden flex p-[1.5px]">
                <div 
                  className="bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${cScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 italic font-serif">
                <span>F 飞流直下天成液态</span>
                <span>D 抵抗重力坚毅固态沉积</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#14151C]/40 p-3 border border-zinc-800/40 rounded-xl text-center">
            <span className="text-[10px] font-serif text-zinc-400 leading-relaxed italic block">
              ✦ 理化大常数依据阁内藏品，历经大屎馆微米级全自动校平。
            </span>
          </div>
        </div>

        {/* Vitrine 2: Golden Dial Compass & Radar mapping resembling an Astrolabe */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#111218] border border-solid border-zinc-800/80 rounded-2xl p-6 min-h-[300px] relative shadow-[0_12px_30px_rgba(0,0,0,0.85)]">
          <div className="absolute inset-0 bg-radial-gradient from-zinc-800/5 via-transparent to-transparent pointer-events-none" />
          
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-extrabold mb-4 text-center uppercase block">
            🪐 GASTRO-LOUVRE ASTROLABE DES FLUX 🧭
          </span>
          
          <div className="w-64 h-64 md:w-72 md:h-72 select-none relative flex items-center justify-center transition-all duration-300">
            <svg width="100%" height="100%" viewBox="-35 -15 270 230" className="overflow-visible">
              
              {/* Concentric diamonds styled in beautiful gold dial paths */}
              {levels.map((lvl, index) => {
                const gridR = R * lvl;
                return (
                  <polygon
                    key={index}
                    points={`${center},${center - gridR} ${center + gridR},${center} ${center},${center + gridR} ${center - gridR},${center}`}
                    fill="none"
                    stroke={index === 2 ? "rgba(161, 161, 170, 0.4)" : "rgba(161, 161, 170, 0.15)"}
                    strokeWidth={index === 2 ? "1.5" : "1"}
                    strokeDasharray={index < 2 ? "4,4" : "none"}
                  />
                );
              })}

              {/* Gilded Dial wire networks */}
              <line x1={center} y1={center - R} x2={center} y2={center + R} stroke="rgba(161, 161, 170, 0.15)" strokeWidth="1" />
              <line x1={center - R} y1={center} x2={center + R} y2={center} stroke="rgba(161, 161, 170, 0.15)" strokeWidth="1" />

              {/* Antique Dial circles decoration */}
              <circle cx={center} cy={center} r={R} fill="none" stroke="rgba(161, 161, 170, 0.12)" strokeWidth="1" />
              <circle cx={center} cy={center} r={R/3} fill="none" stroke="rgba(161, 161, 170, 0.08)" strokeWidth="1" />
              <circle cx={center} cy={center} r={4} fill="#8E919E" />

              {/* Data polygon filled with exquisite emerald and gold aura */}
              <polygon
                points={mbtiPointsStr}
                fill="rgba(255, 255, 255, 0.07)"
                stroke="#E4E4E7"
                strokeWidth="3"
                className="transition-all duration-500"
              />

              {/* Point highlights */}
              <circle cx={pF.x} cy={pF.y} r="5" fill="#E4E4E7" stroke="#000" strokeWidth="1.5" className="shadow-lg" />
              <circle cx={pM.x} cy={pM.y} r="5" fill="#E4E4E7" stroke="#000" strokeWidth="1.5" className="shadow-lg" />
              <circle cx={pC.x} cy={pC.y} r="5" fill="#E4E4E7" stroke="#000" strokeWidth="1.5" className="shadow-lg" />
              <circle cx={pT.x} cy={pT.y} r="5" fill="#E4E4E7" stroke="#000" strokeWidth="1.5" className="shadow-lg" />

              {/* Polar metrics labels */}
              <text x={center} y={center - R - 10} fill="#E4E4E7" fontSize="11" fontWeight="black" textAnchor="middle" className="font-serif italic font-bold">憋量 H</text>
              <text x={center + R + 14} y={center + 4} fill="#E4E4E7" fontSize="11" fontWeight="black" textAnchor="start" className="font-serif italic font-bold">荤荤 M</text>
              <text x={center} y={center + R + 18} fill="#E4E4E7" fontSize="11" fontWeight="black" textAnchor="middle" className="font-serif italic font-bold">固态 D</text>
              <text x={center - R - 14} y={center + 4} fill="#E4E4E7" fontSize="11" fontWeight="black" textAnchor="end" className="font-serif italic font-bold">辛辣 S</text>
            </svg>
          </div>
        </div>

        {/* Vitrine 3: Royal G-MBTI Plaque - styled precisely like the grand hall's ivory paper board plaques */}
        <div className="lg:col-span-4 relative p-6 bg-[#F8F9FA] text-zinc-900 border border-solid border-zinc-200 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-4">
          {/* Authentic metal screws on 4 corners */}
          <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/5" />
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/5" />
          <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/5" />
          <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/5" />

          <div className="text-left select-text relative z-10">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-950/10">
              <span className="text-[20px] font-mono font-black tracking-wide bg-zinc-900 text-zinc-100 px-3.5 py-0.5 rounded-lg">
                {activeProfile.key}
              </span>
              <div className="flex flex-col">
                <h4 className="text-base font-serif font-black text-zinc-900 leading-tight">
                  {activeProfile.title}
                </h4>
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-black tracking-wider mt-0.5">{activeProfile.englishTitle}</span>
              </div>
            </div>

            {/* Profile's Core Bio-Aesthetic Explanation */}
            <div className="mt-3.5 space-y-3">
              <div>
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  🔬 胃腔常设理化研究 (Physiological Chronosector)
                </span>
                <p className="text-[11.5px] font-semibold text-zinc-800 leading-relaxed font-sans mt-0.5">
                  “{activeProfile.description}”
                </p>
              </div>

              {/* High-end curator statement like Louvre gallery */}
              <div className="bg-black/5 p-3 rounded border border-zinc-200">
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                  🏛️ 卢浮阁理化策展礼赞 • Chronique
                </span>
                <p className="text-[10.5px] font-semibold text-zinc-600 font-serif italic leading-relaxed">
                  “凡此理化标本之吐纳，实属生命本源在幽闭深巷中的热力学凯歌。纤维、辛温大火与长时间憋附的重力发酵在凡尔赛式密封下共鸣，终凝铸该恒久物。此件标本不仅展示身体运转的理化大常数，更以无声之姿颂扬了有机生命傲视万物的造作意志。”
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pb-1 border-t border-zinc-200 pt-3.5 mt-3 text-left text-[10px] font-bold">
            <div className="p-2 rounded-lg bg-emerald-700/5 border border-emerald-900/10">
              <span className="text-emerald-800 block mb-0.5 font-serif italic text-[9px] font-extrabold tracking-wider flex items-center gap-1">
                <Smile className="w-3 h-3 text-emerald-800" />
                与君共饷 (绝配)
              </span>
              <strong className="text-zinc-900 block truncate text-[11px] font-serif italic">{activeProfile.bestMatchTitle.replace(/【|】/g, "")}</strong>
            </div>
            
            <div className="p-2 rounded-lg bg-red-700/5 border border-red-900/10">
              <span className="text-red-800 block mb-0.5 font-serif italic text-[9px] font-extrabold tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-800 animate-pulse" />
                重力驳斥 (临界)
              </span>
              <strong className="text-zinc-900 block truncate text-[11px] font-serif italic">{activeProfile.dangerMatchTitle.replace(/【|】/g, "")}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* RENDER REPORT POSTER MODAL OVERLAY */}
      {showPosterReport && (
        <div id="mbti_poster_modal" className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto select-none">
          
          {/* Fixed Floating Close Button: Pinned to top-right viewport corner for persistent access regardless of page scroll */}
          <button
            onClick={() => {
              setShowPosterReport(false);
              setGeneratedPosterSrc(null);
              playTickSound();
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] p-3 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all outline-none"
            title="关闭返回 Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="bg-[#121212] max-w-lg w-full rounded-2xl border border-zinc-800 p-6 flex flex-col space-y-4 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 font-extrabold uppercase block">
                ✦ COMPTE RENDU SCIENTIFIQUE DE L'EXPOSITION
              </span>
              <h3 className="text-xl font-serif font-black text-white italic mt-1 leading-tight">
                卢浮阁常设理化鉴定 贵宾报告书
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 leading-tight font-serif italic">
                “系统已为您还原极高维海报蓝图，长按可保存海报共享或揭秘此理化神迹”
              </p>
            </div>

            {/* PRINT POSTER ELEMENT MOUNT POINT */}
            <div className="w-full flex justify-center">
              <div 
                ref={posterRef}
                id="gourmet_printable_mbti_poster"
                className="w-[370px] bg-[#0C0D11] text-zinc-100 rounded-2xl p-5 border-[4px] border-solid relative overflow-hidden flex flex-col justify-between space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] font-sans"
                style={{ height: "660px", borderColor: "#1F2028" }}
              >
                {/* Visual grid decor border inside the poster */}
                <div className="absolute inset-2 border rounded-xl pointer-events-none z-0" style={{ borderColor: "rgba(161, 161, 170, 0.08)" }} />
                <div 
                  className="absolute top-0 right-0 w-44 h-44 pointer-events-none z-0" 
                  style={{ background: "radial-gradient(circle at top right, rgba(161, 161, 170, 0.06) 0%, transparent 70%)" }}
                />
                <div 
                  className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none z-0" 
                  style={{ background: "radial-gradient(circle at bottom left, rgba(161, 161, 170, 0.04) 0%, transparent 70%)" }}
                />

                {/* Print Fleur Corners */}
                <div className="absolute top-4 left-4 text-[8px] z-10" style={{ color: "rgba(161, 161, 170, 0.12)" }}>⚜</div>
                <div className="absolute top-4 right-4 text-[8px] z-10" style={{ color: "rgba(161, 161, 170, 0.12)" }}>⚜</div>
                <div className="absolute bottom-4 left-4 text-[8px] z-10" style={{ color: "rgba(161, 161, 170, 0.12)" }}>⚜</div>
                <div className="absolute bottom-4 right-4 text-[8px] z-10" style={{ color: "rgba(161, 161, 170, 0.12)" }}>⚜</div>

                {/* 1. Header Branded */}
                <div className="border-b-[1.5px] pb-2.5 text-center relative z-10" style={{ borderColor: "rgba(161, 161, 170, 0.1)" }}>
                  <span className="text-[7.5px] font-mono uppercase tracking-widest text-zinc-450 font-bold block" style={{ color: "#8E919E" }}>
                    MUSÉE DU GASTRO-LOUVRE • ROYAL ARCHIVE
                  </span>
                  <h4 className="text-sm font-sans font-extrabold text-zinc-100 tracking-wider flex items-center justify-center gap-1.5 mt-0.5">
                    ✦ 皇家大屎馆 胃肠理化鉴定档案 ✦
                  </h4>
                  <p className="text-[7.5px] font-mono text-zinc-350 font-bold tracking-tight mt-1 max-w-[170px] mx-auto py-0.5 rounded border" style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", borderColor: "rgba(255, 255, 255, 0.08)", color: "#A1A1AA" }}>
                    CLASSIFIED MBTI METABOLISM DOSSIER
                  </p>
                </div>

                {/* 2. Visual Top Highlight (Masterpiece artifact spotlighted in C-Position) */}
                <div className="relative z-10 flex flex-col items-center justify-center p-3 rounded-xl bg-[#111218] border shadow-inner min-h-[220px] text-center overflow-hidden" style={{ borderColor: "rgba(161, 161, 170, 0.08)" }}>
                  {/* Top-down dramatic gallery spotlight projection effect - matching quality with custom palace light colors */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none z-0" 
                    style={{ 
                      background: spotlightTheme.beam,
                      clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)"
                    }}
                  />
                  {/* Subtle ambient lens flare core right behind the artifact - custom color-coded */}
                  <div 
                    className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none z-15" 
                    style={{ background: spotlightTheme.flare }}
                  />
                  
                  <span className="absolute top-2 left-2.5 text-[7px] font-sans font-bold border px-1.5 py-0.5 rounded z-10" style={{ backgroundColor: spotlightTheme.badgeBg, borderColor: spotlightTheme.badgeBorder, color: spotlightTheme.badgeText }}>
                    {spotlightTheme.label}
                  </span>
                  
                  <div className="w-32 h-32 select-none relative mb-1.5 mt-2 flex items-center justify-center z-10">
                    {/* Render live feces graphics dynamically - upscale to a grandiose scale of [1.3] */}
                    <PoopRenderer art={cPositionExhibit} interactive={false} className="transform scale-[1.3] transition-all duration-300" />
                  </div>

                  <strong className="text-xs text-zinc-100 uppercase font-sans font-extrabold truncate max-w-[280px] pb-1 block leading-normal z-10">
                    {cPositionExhibit.title}
                  </strong>
                  <p className="text-[8px] text-zinc-400 font-mono mt-0.5 z-10">
                    主厨艺术家：<strong className="text-amber-400 font-sans font-bold">{artistName}</strong> • 理化肌理：<strong className="text-zinc-200">{cPositionExhibit.textureType || "晶冕砂浆"}</strong>
                  </p>
                </div>

                {/* 3. Sub-container with dual stats: Radar plot + Typology */}
                <div className="flex gap-3 relative z-10 items-stretch font-sans">
                  
                  {/* Left stats: Radar - widened and optimized padding */}
                  <div className="w-[150px] shrink-0 bg-[#111218] border rounded-xl p-2 px-1 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(161, 161, 170, 0.08)' }}>
                    <span className="text-[6.5px] font-sans text-zinc-300 font-bold tracking-wider mb-1 block">
                      肠胃理化象限图
                    </span>
                    <div className="w-[134px] h-[134px] relative select-none flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="-35 -15 270 230" className="overflow-visible">
                        {levels.map((lvl, index) => {
                          const gridR = R * lvl;
                          return (
                            <polygon
                              key={index}
                              points={`${center},${center - gridR} ${center + gridR},${center} ${center},${center + gridR} ${center - gridR},${center}`}
                              fill="none"
                              stroke="rgba(161, 161, 170, 0.15)"
                              strokeWidth="1.2"
                              strokeDasharray={index < 2 ? "3,3" : "none"}
                            />
                          );
                        })}
                        <line x1={center} y1={center - R} x2={center} y2={center + R} stroke="rgba(161, 161, 170, 0.15)" strokeWidth="1" />
                        <line x1={center - R} y1={center} x2={center + R} y2={center} stroke="rgba(161, 161, 170, 0.15)" strokeWidth="1" />
                        <polygon
                          points={mbtiPointsStr}
                          fill="rgba(255, 255, 255, 0.08)"
                          stroke="#E4E4E7"
                          strokeWidth="2.5"
                        />
                        <text x={center} y={center - R - 8} fill="#A1A1AA" fontSize="12" fontWeight="bold" textAnchor="middle">憋/H</text>
                        <text x={center + R + 14} y={center + 4} fill="#A1A1AA" fontSize="12" fontWeight="bold" textAnchor="start">肉/M</text>
                        <text x={center} y={center + R + 16} fill="#A1A1AA" fontSize="12" fontWeight="bold" textAnchor="middle">固/D</text>
                        <text x={center - R - 14} y={center + 4} fill="#A1A1AA" fontSize="12" fontWeight="bold" textAnchor="end">辣/S</text>
                      </svg>
                    </div>
                  </div>

                  {/* Right stats: Title cards - safe height spacing with no clipping overflow */}
                  <div className="flex-1 min-w-0 bg-[#111218] border rounded-xl p-2.5 flex flex-col justify-between text-left" style={{ borderColor: 'rgba(161, 161, 170, 0.08)' }}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-mono font-black tracking-tight text-zinc-100 border px-1.5 py-1.2 rounded animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
                          {activeProfile.key}
                        </span>
                        <div className="flex flex-col min-w-0 justify-center pl-1">
                          <h4 className="text-[12px] font-sans font-black text-white block leading-[1.4] py-0.5">
                            {activeProfile.title}
                          </h4>
                          <span className="text-[7.5px] font-mono text-zinc-500 block leading-[1.3]">{activeProfile.englishTitle}</span>
                        </div>
                      </div>
                      
                      {/* Substring-based programmatic truncation to perfectly prevent canvas multi-line clipping */}
                      <p className="text-[8px] font-semibold text-zinc-300 leading-normal font-sans mt-2.5 pb-1 select-text">
                        “{activeProfile.description.length > 95 ? activeProfile.description.slice(0, 93) + "..." : activeProfile.description}”
                      </p>
                    </div>

                    <div className="text-[6.5px] text-zinc-400 border-t pt-1 mt-1 font-sans flex justify-between items-center" style={{ borderTopColor: 'rgba(161, 161, 170, 0.08)' }}>
                      <span>主厨学者：<strong className="text-[#F3E0B5] font-bold">{artistName}</strong></span>
                      <span>报告签批：学术资产委员会</span>
                    </div>
                  </div>

                </div>

                {/* 4. Speed Match compatibility & Pure HTML sharp vector QR container */}
                <div className="flex justify-between items-center z-10 relative pt-2.5 border-t w-full" style={{ borderTopColor: 'rgba(161, 161, 170, 0.1)' }}>
                  {/* Left Column compatibility with rigid explicit widths preventing layout overlaps on canvas */}
                  <div className="w-[220px] shrink-0 space-y-1.5 text-left">
                    <span className="text-[7.5px] font-sans text-zinc-400 font-bold block">
                      🍴 COLLABORATIVE SPEED-DATING MATCH
                    </span>
                    
                    <div className="flex gap-2 text-[8px] font-black w-full">
                      <div className="flex-1 min-w-0 p-1 px-1.5 rounded border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <span className="text-emerald-400 block text-[6.5px] leading-normal pb-0.5">绝配天作 MATCH 🏆</span>
                        <span className="text-white block truncate text-[8.5px] max-w-[95px] leading-normal pb-1 font-semibold">{activeProfile.bestMatchTitle.replace(/【|】/g, "")}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0 p-1 px-1.5 rounded border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <span className="text-red-400 block text-[6.5px] leading-normal pb-0.5">生化隐雷 ALERT ☣️</span>
                        <span className="text-white block truncate text-[8.5px] max-w-[95px] leading-normal pb-1 font-semibold">{activeProfile.dangerMatchTitle.replace(/【|】/g, "")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column QR code: EXTREMELY HIGH SHARPNESS EXPLICIT HTML MATRIX CELLS */}
                  <div className="w-[98px] shrink-0 flex flex-col items-center justify-center p-1 bg-white rounded-lg border shadow-sm" style={{ borderColor: 'rgba(161, 161, 170, 0.15)' }}>
                    <PureHtmlQrCode />
                    <span className="text-[7px] font-sans font-extrabold text-zinc-950 mt-1 tracking-tight whitespace-nowrap block">
                      微信扫码 • 揭开理化
                    </span>
                  </div>
                </div>

                {/* Footer and dynamic serial hash metadata */}
                <div className="flex justify-between text-[6.5px] text-zinc-500 font-mono pt-1 z-10 relative">
                  <span>CHEF: {artistName.toUpperCase()} • MBTI_{cPositionExhibit.id.slice(-6).toUpperCase()}</span>
                  <span>🗼 PARIS DE GASTRO-LOUVRE CNRS</span>
                </div>

              </div>
            </div>

            <p className="text-[11px] font-serif text-amber-500/80 text-center leading-normal animate-pulse select-none font-bold">
              💡 策展海报已配置 Pure-HTML 黄金像素模组，扫码识读 100% 灵敏清晰！
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button 
                onClick={handleExportPoster}
                disabled={isGeneratingPoster}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-black text-xs cursor-pointer shadow border border-amber-300 transition-all select-none disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPoster ? "正在雕琢高维像素..." : "立即保存海报到本地"}</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowPosterReport(false);
                  setGeneratedPosterSrc(null);
                  playTickSound();
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 font-extrabold text-xs cursor-pointer shadow transition-all select-none"
              >
                <span>关闭返回 / Close</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

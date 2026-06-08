import React, { useState } from "react";
import { PoopArt, GuestComment } from "../types";
import { PoopRenderer } from "./PoopRenderer";
import { Award, Share2, Clipboard, Heart, Send, Sparkles, Coffee, ExternalLink, Download, Image as ImageIcon, RefreshCw } from "lucide-react";
import { playDingSound, playTickSound } from "../utils/audio";
import html2canvas from "html2canvas";

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

interface SocialPosterProps {
  art: PoopArt;
  onClose: () => void;
  guestComments: GuestComment[];
  onAddComment: (comment: Omit<GuestComment, "id" | "timestamp">) => void;
}

export const SocialPoster: React.FC<SocialPosterProps> = ({
  art,
  onClose,
  guestComments,
  onAddComment,
}) => {
  const [copied, setCopied] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🧻");
  const [commentText, setCommentText] = useState("");

  // States for Image Canvas Render pipeline
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageSrc, setGeneratedImageSrc] = useState<string | null>(null);
  const [copyImgSuccess, setCopyImgSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"dynamic" | "static">("dynamic");

  // Helper for dynamic font scaling to contain curator notes perfectly inside aspect-ratio box without any overflow
  const getFontSizeForComment = (text: string) => {
    const len = text ? text.length : 0;
    if (len > 250) return { fontSize: "6.8px", lineHeight: "1.1", lineClamp: 6 };
    if (len > 180) return { fontSize: "7.6px", lineHeight: "1.15", lineClamp: 5 };
    if (len > 110) return { fontSize: "8.5px", lineHeight: "1.20", lineClamp: 4 };
    return { fontSize: "9.5px", lineHeight: "1.3", lineClamp: 4 };
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    playTickSound();
    
    // Give browser a frame to finish layout before snapshotting
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.getElementById("gourmet_printable_postcard");
    if (!element) {
      setIsGenerating(false);
      return;
    }
    
    // PRE-CAPTURE: Convert the dynamic live <canvas> elements to static high-resolution <img> tags
    // directly in the active doc just before html2canvas runs. This guarantees that all active textures, 
    // particle ticks, and custom season overlays currently being rendered are captured with pixel-perfect accuracy.
    const canvasReplacements: { canvas: HTMLCanvasElement; img: HTMLImageElement; parent: HTMLElement; nextSibling: Node | null }[] = [];
    const originalCanvases = element.querySelectorAll("canvas");
    
    originalCanvases.forEach((origCanvas) => {
      if (origCanvas instanceof HTMLCanvasElement) {
        try {
          const imgUrl = origCanvas.toDataURL("image/png");
          const staticImg = document.createElement("img");
          staticImg.src = imgUrl;
          
          // Replicate classes and inline style bounds precisely
          staticImg.className = origCanvas.className;
          staticImg.style.cssText = origCanvas.style.cssText;
          staticImg.style.width = "100%";
          staticImg.style.height = "100%";
          staticImg.style.maxWidth = "100%";
          staticImg.style.maxHeight = "100%";
          
          // Set layout proportions
          const widthAttr = origCanvas.getAttribute("width") || "350";
          const heightAttr = origCanvas.getAttribute("height") || "320";
          staticImg.setAttribute("width", widthAttr);
          staticImg.setAttribute("height", heightAttr);
          
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
        } catch (canvasErr) {
          console.error("Failed to temporarily replace live canvas for export:", canvasErr);
        }
      }
    });

    // Symmetrical inline oklch sanitizer for style tags and inline stylings
    const sanitizeCSS = (val: string): string => {
      return convertOklchStringToRgb(val);
    };

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
          styleTag.textContent = sanitizeCSS(content);
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
              const sanitizedText = sanitizeCSS(text);
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
          console.warn("Failed to sanitize external link stylesheet dynamically in SocialPoster:", link.href, err);
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

      // Restore standard style tags
      originalStyleContentsByTag.forEach((origContent, tag) => {
        try {
          tag.textContent = origContent;
        } catch (restoreErr) {
          console.warn("Failed to restore parent style tag:", restoreErr);
        }
      });
      originalStyleContentsByTag.clear();

      // Clean up temp style tags
      tempSanitizedStyleTags.forEach((style) => {
        try {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        } catch (err) {
          console.warn("Failed to remove temp style tag:", err);
        }
      });

      // Re-enable link elements
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
        scale: 2, // High resolution Retinal supersampling
        backgroundColor: "#E4E3E0", // Match french ivory card color
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          const styleElements = clonedDoc.querySelectorAll("style");
          styleElements.forEach((styleTag) => {
            try {
              if (styleTag.textContent) {
                styleTag.textContent = sanitizeCSS(styleTag.textContent);
              }
            } catch (err) {
              console.warn("Unable to sanitize cloned style element:", err);
            }
          });

          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.style) {
              try {
                const cssText = el.style.cssText;
                if (cssText.includes("oklch") || cssText.includes("oklab")) {
                  el.style.cssText = sanitizeCSS(cssText);
                }
              } catch (inlineErr) {
                // Ignore silent issues
              }
            }
          });
        }
      });

      // RESTORE STYLES IN PARENT FIRST
      restoreAllSheets();

      // RESTORE: Put the original live animated canvas elements back into the view immediately
      canvasReplacements.forEach(({ canvas: origCanvas, img: staticImg, parent }) => {
        try {
          if (staticImg.parentNode === parent) {
            parent.replaceChild(origCanvas, staticImg);
          }
        } catch (restoreErr) {
          console.error("Failed to restore animated canvas component:", restoreErr);
        }
      });

      try {
        const dataUrl = canvas.toDataURL("image/png");
        setGeneratedImageSrc(dataUrl);
        setActiveTab("static"); // Switch to static tab automatically so the preview is immediately apparent
        playDingSound();
      } catch (error) {
        console.error("生成海报图片失败:", error);
        alert("绘制海报发生异常，已退回到动态预览！");
      } finally {
        setIsGenerating(false);
      }
    } catch (err) {
      console.error("Canvas context generation error:", err);
      
      // RESTORE STYLES IN PARENT IN EVENT OF EXCEPTION
      restoreAllSheets();

      // RESTORE IN FAILURE: Ensure page is always left in an interactive state
      canvasReplacements.forEach(({ canvas: origCanvas, img: staticImg, parent }) => {
        try {
          if (staticImg.parentNode === parent) {
            parent.replaceChild(origCanvas, staticImg);
          }
        } catch (restoreErr) {
          console.error("Failed to restore animated canvas during failure catch:", restoreErr);
        }
      });
      setIsGenerating(false);
    }
  };

  const handleCopyClipboardImage = async () => {
    if (!generatedImageSrc) return;
    try {
      const res = await fetch(generatedImageSrc);
      const blob = await res.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopyImgSuccess(true);
      playDingSound();
      setTimeout(() => setCopyImgSuccess(false), 2000);
    } catch (err) {
      console.error("无法复制二进制图片到剪贴板，改用回退提示:", err);
      alert("复制失败，请在移动端长按海报卡片、或在桌面端右键进行保存/拷贝！");
    }
  };

  const handleSaveImageFile = () => {
    if (!generatedImageSrc) return;
    const link = document.createElement("a");
    link.href = generatedImageSrc;
    link.download = `${art.title || "赛博大屎"}_${art.rarity || "UR"}_大屎馆收藏年鉴海报.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playDingSound();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !commentText.trim()) return;

    onAddComment({
      author: visitorName.trim(),
      emoji: selectedEmoji,
      text: commentText.trim(),
    });

    setVisitorName("");
    setCommentText("");
    playDingSound();
  };

  const emojiOptions = ["🧻", "🏆", "✨", "💩", "💨"];

  return (
    <div 
      id="social_poster_overlay" 
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/90 backdrop-blur-md flex justify-center items-start md:items-center p-3 sm:p-6 pb-20 md:pb-6"
    >
      {/* Floating Exit Close Button: fixed at viewport corner, always visible on scroll for seamless mobile navigation */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[60] bg-white hover:bg-art-red hover:text-white border-[3px] border-art-charcoal text-art-charcoal font-black w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-[3px_3px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none transition-all text-sm animate-bounce"
        title="关闭返回 Close"
      >
        ✕
      </button>

      {/* Main Overlay dialog - cream box styled in the Duolingo physical thick line visual mode */}
      <div className="relative w-full max-w-4xl bg-[#FFFBEB] border-[4px] md:border-[6px] border-art-charcoal rounded-3xl p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_#2B2D42] md:shadow-[8px_8px_0px_#2B2D42] flex flex-col md:flex-row gap-6 md:gap-8 text-art-charcoal animate-fade-in my-4 sm:my-8">
        
        {/* Left Side: Traditional French Art Postcard Card */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full text-center md:text-left mb-4">
            <span className="text-[10px] font-mono tracking-widest text-art-red font-black uppercase">
              🏛️ MUSEUM SOUVENIR POSTCARD
            </span>
            <h3 className="text-xl font-serif text-art-charcoal italic font-black">
              大屎馆限定·古典艺术明信片
            </h3>
          </div>

          {/* Modern Tab Control bar to switch between dynamic interactive canvas card and generated physical static PNG image */}
          {generatedImageSrc && (
            <div className="w-full flex bg-zinc-200/70 p-1 rounded-xl border-[2.5px] border-art-charcoal font-black text-xs mb-3 shadow-[2px_2px_0px_#2B2D42] animate-fade-in">
              <button
                type="button"
                onClick={() => { setActiveTab("dynamic"); playTickSound(); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center cursor-pointer transition-all ${activeTab === "dynamic" ? "bg-white text-art-charcoal shadow-sm font-black border border-zinc-300" : "text-zinc-650 opacity-80"}`}
              >
                🏛️ 动态艺术预览 (Live)
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("static"); playTickSound(); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center cursor-pointer transition-all ${activeTab === "static" ? "bg-art-yellow text-art-charcoal shadow-sm font-black border border-art-charcoal" : "text-zinc-650 opacity-80"}`}
              >
                🖼️ 静态海报大图 (PNG)
              </button>
            </div>
          )}

          {/* Postcard Body container styled with luxury ivory cardboard */}
          <div className="relative w-full aspect-[5/7] overflow-hidden rounded-2xl shadow-[5px_5px_0px_#2B2D42]">
            {/* Capture Target Card */}
            <div 
              id="gourmet_printable_postcard" 
              className="w-full h-full bg-[#E4E3E0] border-[4px] border-[#2B2D42] rounded-2xl flex flex-col justify-between p-4 sm:p-5 relative select-none text-[#18181B] before:absolute before:inset-0.5 before:border before:border-[#CCCCCC] before:border-opacity-30 before:pointer-events-none transition-all"
            >
              {/* Screws on corner stamps */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(43, 45, 66, 0.2)' }} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(43, 45, 66, 0.2)' }} />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(43, 45, 66, 0.2)' }} />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(43, 45, 66, 0.2)' }} />

              {/* Vintage Postcard Dividers postage spot */}
              <div className="absolute top-4 right-4 w-12 h-14 border-[1.5px] border-dashed flex flex-col items-center justify-center text-[7px] font-mono leading-tight flex-shrink-0" style={{ borderColor: '#555555', color: '#555555' }}>
                <span>POST</span>
                <span>CARD</span>
                <span>STAMP</span>
              </div>

              {/* Dynamic Heritage Stamp - customized according to piece rarity */}
              {(() => {
                const r = art.rarity || "N";
                if (r === "UR") {
                  return (
                    <div className="absolute bottom-20 right-6 w-16 h-16 rounded-full border-[3px] border-double flex flex-col items-center justify-center text-center rotate-12 pointer-events-none opacity-90 select-none flex-shrink-0" style={{ borderColor: '#DC2626', color: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.03)' }}>
                      <div className="text-[6px] font-black leading-none uppercase tracking-tighter">
                        <span className="text-[7.5px] block -mb-0.5">👑 LOUVRE 👑</span>
                        <strong className="text-[12px] block font-extrabold text-red-650 tracking-widest">★ UR ★</strong>
                        <span className="text-[5.5px] block mt-0.5 font-bold tracking-tight">GRAND SOUVENIR</span>
                      </div>
                    </div>
                  );
                } else if (r === "SR") {
                  return (
                    <div className="absolute bottom-20 right-6 w-15 h-15 rounded-full border-[2.5px] border-dashed flex flex-col items-center justify-center text-center -rotate-12 pointer-events-none opacity-85 select-none flex-shrink-0" style={{ borderColor: '#7E22CE', color: '#7E22CE', backgroundColor: 'rgba(126, 34, 206, 0.03)' }}>
                      <div className="text-[6px] font-black leading-none uppercase tracking-tight">
                        <span className="text-[7px] block -mb-0.5">⚜️ SALON ⚜️</span>
                        <strong className="text-[10px] block font-extrabold text-purple-700 tracking-wider">★ SR ★</strong>
                        <span className="text-[5px] block mt-0.5 font-bold tracking-tight">HEIRLOOM CLASS</span>
                      </div>
                    </div>
                  );
                } else if (r === "R") {
                  return (
                    <div className="absolute bottom-20 right-6 w-14 h-14 border-[2.5px] border-double flex flex-col items-center justify-center text-center rotate-6 pointer-events-none opacity-85 select-none flex-shrink-0" style={{ borderColor: '#047857', color: '#047857', borderRadius: '35% 65% 65% 35% / 50%', backgroundColor: 'rgba(4, 120, 87, 0.03)' }}>
                      <div className="text-[5.5px] font-black leading-none uppercase tracking-tight">
                        <span className="text-[6.5px] block -mb-0.5">💎 GUILD 💎</span>
                        <strong className="text-[9.5px] block font-extrabold text-[#0D9488] tracking-wide">★ R ★</strong>
                        <span className="text-[4.5px] block mt-0.5 font-bold tracking-tighter">AUTHENTIC FINE</span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="absolute bottom-20 right-6 w-14 h-14 border-2 flex flex-col items-center justify-center text-center rotate-[-15deg] pointer-events-none opacity-75 select-none flex-shrink-0" style={{ borderColor: '#4B5563', color: '#4B5563', backgroundColor: 'rgba(75, 85, 99, 0.03)' }}>
                      <div className="text-[6px] font-black leading-none uppercase tracking-tighter">
                        <span className="text-[6.5px] block">🚇 METRO 🚇</span>
                        <strong className="text-[8.5px] block font-mono text-zinc-600">★ N ★</strong>
                        <span className="text-[5px] block mt-0.5 leading-none font-bold">QC APPROVED</span>
                      </div>
                    </div>
                  );
                }
              })()}

              {/* Vintage Aged Duration Stamp */}
              {art.holdingDays > 0 && (
                <div className="absolute top-4 left-4 bg-[#FFF0F2] border-[1.5px] border-dashed px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-black rotate-[-8deg] shadow-[1px_1px_0px_#B22222]/30 uppercase flex-shrink-0" style={{ borderColor: '#FF6B6B', color: '#FF6B6B' }}>
                  ★ AGED {art.holdingDays} DAYS ★
                </div>
              )}

              {/* Main Title Head */}
              <div className="border-b pb-1.5 mb-2 pr-16 text-left flex-shrink-0" style={{ borderBottomColor: 'rgba(204, 204, 204, 0.4)' }}>
                <h4 className="text-sm sm:text-base font-sans text-[#141414] font-black tracking-tight leading-snug">
                  {art.title}
                </h4>
                <span className="text-[9px] font-mono uppercase block tracking-wider font-bold" style={{ color: '#555555' }}>
                  Artist: {art.artist}
                </span>
              </div>

              {/* Fecal rendering centerpiece */}
              <div className="flex-1 flex items-center justify-center relative my-1 drop-shadow-md min-h-0">
                <PoopRenderer art={art} interactive={false} className="transform scale-[0.8]" />
                {/* Artistic caption of medium */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded text-[8.5px] font-bold uppercase tracking-wide max-w-full truncate border px-1.5 py-0.5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#555555', borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                  Medium: {art.ingredientsAnalyzed.slice(0, 3).join(", ") || "Metabolic Blend"}
                </div>
              </div>

              {/* Bottom Critique and Decors */}
              <div className="mt-auto border-t pt-2 text-left flex-shrink-0" style={{ borderTopColor: 'rgba(204, 204, 204, 0.4)' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col justify-start">
                    <span className="text-[7.5px] font-bold uppercase tracking-wider font-mono block" style={{ color: '#555555' }}>策展人札记 Curator Notes</span>
                    {(() => {
                      const textConfig = getFontSizeForComment(art.curatorComment);
                      return (
                        <p 
                          className="font-sans font-medium mt-1 p-1 rounded" 
                          style={{ 
                            fontSize: textConfig.fontSize, 
                            lineHeight: textConfig.lineHeight,
                            WebkitLineClamp: textConfig.lineClamp,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                            color: '#1C1917' 
                          }}
                        >
                          {art.curatorComment}
                        </p>
                      );
                    })()}
                  </div>
                  {/* Visual grid layout representing writing side */}
                  <div className="border-l pl-3 flex flex-col justify-end" style={{ borderLeftColor: 'rgba(204, 204, 204, 0.3)' }}>
                    <div className="w-full border-b h-4" style={{ borderBottomColor: 'rgba(204, 204, 204, 0.3)' }} />
                    <div className="w-full border-b h-4" style={{ borderBottomColor: 'rgba(204, 204, 204, 0.3)' }} />
                    <span className="text-[8px] font-bold mt-1.5 self-end uppercase font-mono" style={{ color: '#555555' }}>
                      Grade: {art.rarity} LEVEL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Static PNG Image Overlay - Highly compatible mobile long-press view with tab trigger check */}
            {activeTab === "static" && generatedImageSrc && (
              <div className="absolute inset-0 z-10 w-full h-full bg-[#E4E3E0] border-[4px] border-[#2B2D42] rounded-2xl select-text flex flex-col items-center justify-center p-3 animate-fade-in">
                <img 
                  src={generatedImageSrc} 
                  alt="大作古典艺术明信片海报" 
                  className="w-full h-full object-contain rounded border border-zinc-400 border-opacity-30 shadow-inner select-all"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2.5 left-2 right-2 bg-black/85 backdrop-blur text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wide leading-tight text-center pointer-events-none select-none shadow-md">
                  💡 移动端提示：长按上图即可直接拷贝至剪贴板或保存
                </div>
              </div>
            )}
          </div>

          {/* Unified Action Button: "Generate Image" transitioning to download/copy options */}
          <div className="w-full mt-6">
            {!generatedImageSrc ? (
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-art-yellow border-[3px] border-art-charcoal font-black text-xs text-art-charcoal shadow-[4px_4px_0px_#2B2D42] hover:bg-[#ffe56e] hover:shadow-[5px_5px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none disabled:opacity-75 transition-all uppercase tracking-wider cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-art-charcoal animate-spin" />
                    <span>古典巨作精心绘制中 (2x 高清画质)...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-art-charcoal animate-bounce" />
                    <span>生成海报图片 (复制 / 保存)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleCopyClipboardImage}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl bg-amber-100 text-art-charcoal border-[3px] border-art-charcoal font-black text-xs shadow-[3px_3px_0px_#2B2D42] hover:bg-amber-200 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Clipboard className="w-4 h-4 text-art-charcoal" />
                    <span>{copyImgSuccess ? "已复制到剪切板！" : "复制图片到剪贴板"}</span>
                  </button>

                  <button
                    onClick={handleSaveImageFile}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl bg-[#52D273] text-white border-[3px] border-art-charcoal font-black text-xs shadow-[3px_3px_0px_#2B2D42] hover:bg-[#43c063] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white animate-bounce" />
                    <span>保存 PNG 图片到相册</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setGeneratedImageSrc(null);
                    setActiveTab("dynamic");
                    playTickSound();
                  }}
                  className="w-full py-2 bg-white text-zinc-620 border-[2.5px] border-zinc-400 font-bold text-[10px] rounded-lg hover:bg-zinc-50 cursor-pointer text-center"
                >
                  ✕ 撤销海报，返回查看动态明信片卡
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Right Side: Guest Book Ledger and visiting stats */}
        <div className="w-full md:w-1/2 flex flex-col border-t md:border-t-0 md:border-l-[3px] border-art-charcoal/30 md:pl-8 pt-6 md:pt-0">
          <div className="mb-4 text-left">
            <span className="text-[10px] font-mono tracking-widest text-[#2B2D42] opacity-60 font-black uppercase">
              ✍️ VISITORS GUESTBOOK LEDGER
            </span>
            <h3 className="text-xl font-serif text-art-charcoal italic font-black">
              贵宾参展点评留言簿
            </h3>
          </div>

          {/* Comment Ledger visual scroll list */}
          <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto bg-white border-[3px] border-art-charcoal rounded-2xl p-4 shadow-[4px_4px_0px_#2B2D42] mb-6 flex flex-col space-y-3">
            {guestComments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Coffee className="w-10 h-10 text-art-charcoal/30 mb-2 animate-bounce" />
                <p className="text-xs text-art-charcoal/50 font-bold">
                  尚无留言。手纸珍贵，画作留香，留下您的首发神级点评吧！
                </p>
              </div>
            ) : (
              guestComments.map((comment) => (
                <div 
                  key={comment.id}
                  className="p-3 bg-[#FAF8F5] border-[2px] border-art-charcoal rounded-xl flex items-start space-x-3 text-left shadow-[2px_2px_0px_#2B2D42]"
                >
                  <span className="text-2xl pt-0.5 select-none">{comment.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-[#2B2D42] truncate">
                        {comment.author}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 font-bold bg-black/5 px-1.5 py-0.5 rounded">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#2B2D42]/85 font-semibold leading-relaxed break-words font-sans">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Commentary feedback input form */}
          <form onSubmit={handleSubmitComment} className="mt-auto bg-[#FDFBF7] p-4 border-[3px] border-art-charcoal rounded-2xl text-left shadow-[4px_4px_0px_#2B2D42]">
            <span className="block text-[10px] font-black text-art-charcoal/60 uppercase tracking-wider mb-3">
              留下您的贵宾印记留字评语
            </span>

            {/* Pseudo picker rating icons */}
            <div className="flex items-center space-x-2 mb-4 flex-wrap gap-y-1">
              <span className="text-xs font-bold text-[#2B2D42] mr-1">盖戳徽章:</span>
              <div className="flex items-center space-x-1.5">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      playTickSound();
                    }}
                    className={`text-lg px-2 py-1 rounded-xl border-[2.5px] transition-all cursor-pointer ${selectedEmoji === emoji ? "bg-[#FFFCE8] border-art-yellow scale-110 shadow-[2px_2px_0px_#2B2D42]" : "bg-white border-zinc-200 opacity-60 hover:opacity-100"}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Author Name Input */}
            <input
              type="text"
              required
              placeholder="贵宾大名 / 参展代号 (Pseudonym)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-[3px] border-art-charcoal text-xs font-bold text-art-charcoal placeholder-zinc-400 focus:outline-none focus:border-art-blue shadow-inner mb-3"
            />

            {/* Comment Body Input with beautiful internal send triangle */}
            <div className="relative">
              <textarea
                required
                maxLength={100}
                placeholder="在此写下点评，限100字... (例如: 艺术张力拉满，此软雪糕质感通透，有卢浮宫神韵)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border-[3px] border-art-charcoal text-xs font-bold text-[#2B2D42] placeholder-zinc-400 resize-none focus:outline-none focus:border-art-blue shadow-inner pl-3 pr-10"
              />
              <button
                type="submit"
                className="absolute bottom-2.5 right-2 bg-art-red hover:bg-[#ff8080] border-[2px] border-art-charcoal text-white p-1.5 rounded-lg transition-transform active:scale-90 shadow-[2px_2px_0px_#2B2D42] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Global Exit Close Button absolute styled nicely */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 bg-white border-[3px] border-art-charcoal text-art-charcoal hover:bg-art-red hover:text-white font-extrabold text-xs w-8 h-8 rounded-full items-center justify-center cursor-pointer shadow-[2px_2px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none transition-all"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

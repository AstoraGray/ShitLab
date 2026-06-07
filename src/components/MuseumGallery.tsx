import React, { useState } from "react";
import { PoopArt } from "../types";
import { PoopRenderer } from "./PoopRenderer";
import { Award, Calendar, Heart, Trash2, ChevronLeft, ChevronRight, Share2, Info } from "lucide-react";
import { playTickSound } from "../utils/audio";

interface MuseumGalleryProps {
  exhibits: PoopArt[];
  onDeleteExhibit: (id: string) => void;
  onSelectShare: (art: PoopArt) => void;
}

export const MuseumGallery: React.FC<MuseumGalleryProps> = ({
  exhibits,
  onDeleteExhibit,
  onSelectShare,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (exhibits.length === 0) {
    return (
      <div id="gallery_empty_state" className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/60 border border-zinc-850 rounded-3xl backdrop-blur-xl">
        <Award className="w-16 h-16 text-zinc-700 mb-4 animate-pulse" />
        <h3 className="text-xl font-medium text-zinc-300 font-sans mb-2">大屎馆尚无馆藏</h3>
        <p className="text-xs text-zinc-500 max-w-sm font-sans">
          胃囊空荡，画廊寂静。请在上方输入每日膳食，并拉动拉杆释放或蓄力，开启您的第一件赛博艺术品创作。
        </p>
      </div>
    );
  }

  const activeArt = exhibits[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % exhibits.length);
    playTickSound();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + exhibits.length) % exhibits.length);
    playTickSound();
  };

  // Helper for Rarity Style Pedestals & Backdrops
  const getRarityConfig = (rarity: "N" | "R" | "SR" | "UR") => {
    switch (rarity) {
      case "UR":
        return {
          title: "UR - 传世神作 (Grand Masterpiece)",
          textStyle: "text-amber-600 font-black drop-shadow-sm",
          lightCone: "from-amber-400/20 via-amber-400/5 to-transparent",
          containerBg: "radial-gradient(circle, rgba(230,175,46,0.12) 0%, rgba(15,15,15,1) 85%)",
        };
      case "SR":
        return {
          title: "SR - 史诗杰作 (Epic Creation)",
          textStyle: "text-purple-600 font-black",
          lightCone: "from-purple-400/20 via-purple-300/3 to-transparent",
          containerBg: "radial-gradient(circle, rgba(147,51,234,0.09) 0%, rgba(15,15,15,1) 85%)",
        };
      case "R":
        return {
          title: "R - 先锋艺术 (Avant-Garde)",
          textStyle: "text-emerald-700 font-extrabold",
          lightCone: "from-emerald-400/15 via-emerald-300/2 to-transparent",
          containerBg: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(15,15,15,1) 85%)",
        };
      default:
        return {
          title: "N - 常规展品 (Standard Exhibit)",
          textStyle: "text-zinc-650 font-bold",
          lightCone: "from-zinc-100/10 via-zinc-100/1 to-transparent",
          containerBg: "radial-gradient(circle, rgba(63,63,70,0.04) 0%, rgba(15,15,15,1) 85%)",
        };
    }
  };

  const rarityConfig = getRarityConfig(activeArt.rarity);

  return (
    <div id="museum_gallery_view" className="relative flex flex-col w-full bg-[#0F0F0F] rounded-3xl border border-zinc-800/80 overflow-hidden shadow-2xl">
      
      {/* Top Gallery Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/40">
        <div className="flex items-center space-x-2.5">
          <Award className="w-5 h-5 text-art-yellow" />
          <span className="text-sm font-mono tracking-widest text-zinc-455 uppercase font-bold">
            卢浮殿堂级展厅 ({activeIndex + 1} / {exhibits.length})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectShare(activeArt)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-sans font-bold shadow border border-zinc-800 transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>制作海报</span>
          </button>
          <button
            onClick={() => {
              onDeleteExhibit(activeArt.id);
              if (activeIndex > 0) setActiveIndex(activeIndex - 1);
            }}
            className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/75 text-red-400 hover:text-red-300 transition-all cursor-pointer border border-red-900/45"
            title="销毁艺术品"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Exhibition Stage with dramatic Spotlight lighting */}
      <div
        className="relative flex flex-col md:flex-row items-center justify-center p-6 md:p-12 min-h-[500px] transition-all duration-700 overflow-hidden"
        style={{ background: rarityConfig.containerBg }}
      >
        {/* Carousel Arrow Left */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-40 p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800/60 active:scale-90 shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Arrow Right */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-40 p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800/60 active:scale-90 shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dynamic Gallery Lighting Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-full bg-gradient-to-b from-[#FFFFFF10] to-transparent pointer-events-none z-10" style={{ clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)" }} />

        {/* The Art Sculpture Rendering & Pedestal Stack */}
        <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 z-20 mt-4">
          
          {/* Masterpiece visual model container */}
          <div className="relative w-64 h-64 mb-1 drop-shadow-[0_20px_50px_rgba(255,100,0,0.25)] flex items-center justify-center">
            <PoopRenderer art={activeArt} className="transform scale-[1.05] transition-transform active:scale-95 duration-200" />
          </div>
          
          {/* Authentic Radial-dotted dark Pedestal */}
          <div className="w-80 h-16 bg-[#1A1A1A] border border-white/10 rounded-t-sm shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
            {/* Dots background gradient */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)", backgroundSize: "16px 16px" }} />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Small status on pedestal */}
            <span className="text-[10px] font-mono tracking-widest text-white/50 font-bold z-10 select-none">
              EXHIBIT PLATFORM
            </span>
            <span className="text-[8px] font-mono text-white/30 z-10 tracking-widest uppercase">
              ID: {activeArt.id.split("-")[1] || "0x7F"}{activeArt.id.split("-")[0]?.slice(0,4).toUpperCase()}
            </span>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5" />
          </div>

        </div>

        {/* Artistic Plaque rotated, high art antique texture */}
        <div className="w-full md:w-1/2 p-2 md:pl-8 mt-12 md:mt-0 z-20 flex flex-col justify-center">
          
          {/* Ivory paper board */}
          <div className="relative p-6 bg-[#E4E3E0] text-zinc-900 border border-zinc-400 rounded-lg shadow-2xl transform md:rotate-1 transition-all duration-300 text-left select-none max-w-lg mx-auto w-full">
            {/* Screws on four corners */}
            <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/10" />
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/10" />
            <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/10" />
            <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-zinc-950/20 border border-zinc-950/10" />

            {/* Rarity and Title */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-0.5 rounded border border-zinc-400 bg-white/60 ${rarityConfig.textStyle}`}>
                {activeArt.rarity} · LEVEL
              </span>
              <span className="text-[10.5px] font-mono text-zinc-500 font-bold">EXHIBIT NO. {activeIndex + 1}/{exhibits.length}</span>
            </div>

            <h2 className="font-serif italic text-2xl text-[#141414] leading-tight mb-2 tracking-tight">
              {activeArt.title}
            </h2>

            <div className="h-[2px] bg-zinc-900/10 w-full mb-3" />

            {/* Core parameters */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pb-3.5 text-xs text-zinc-800 font-medium">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide">艺术家 Artist</span>
                <span className="text-[#141414] font-bold font-serif truncate" title={activeArt.artist}>
                  {activeArt.artist}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide">累积蓄力 Duration</span>
                <span className="text-[#141414] font-black">
                  {activeArt.holdingDays === 0 ? "即刻产生 (Instant)" : `憋憋累积 ${activeArt.holdingDays} 天`}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide">展出史历 Timeline</span>
                <span className="text-zinc-800 text-[11px] font-semibold">
                  {activeArt.timestamp ? new Date(activeArt.timestamp).toLocaleDateString() : "赛博纪元"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide">等级品阶 Quality</span>
                <span className="text-zinc-900 text-[11px] font-extrabold uppercase">
                  {activeArt.rarity === "UR" ? "👑 ROYAL TRANS-GOLD" : `★ SPECIAL ${activeArt.textureType}`}
                </span>
              </div>
            </div>

            {/* InGESTION Ingredients as high art ingredients labels */}
            <div className="mb-4">
              <span className="block text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide mb-1.5">
                创作媒介 Medium (Ingredients Analyzed)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeArt.ingredientsAnalyzed.length === 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 text-zinc-650 italic">
                    空腹发酵 (Metabolic Blend)
                  </span>
                ) : (
                  activeArt.ingredientsAnalyzed.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold tracking-tight px-2 py-0.5 rounded bg-black/5 border border-zinc-900/10 text-[#141414]"
                    >
                      {ing}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Extended Multi-Day Ingestion Chronicle */}
            {activeArt.heldMealsHistory && activeArt.heldMealsHistory.length > 0 && (
              <div className="mb-4">
                <span className="block text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide mb-1.5">
                  发酵历程 Ingestion Chronicle (沉积时空轴)
                </span>
                <div className="bg-black/5 p-2.5 rounded border border-zinc-900/10 text-[10px] font-medium text-zinc-700 space-y-1">
                  {activeArt.heldMealsHistory.map((m, hIdx) => {
                    const mealsJoin = [m.breakfast, m.lunch, m.dinner].filter(Boolean).join(" + ") || "空腹发酵";
                    return (
                      <div key={hIdx} className="flex justify-between items-center opacity-80">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">第 {hIdx + 1} 天 (古老积压层)</span>
                        <span className="font-sans font-bold text-zinc-800 truncate max-w-[180px]">{mealsJoin}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center border-t border-zinc-900/10 pt-1 mt-1 font-bold">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-art-red">释出当日 (新鲜表质层)</span>
                    <span className="font-sans font-bold text-zinc-900 truncate max-w-[180px]">
                      {[activeArt.meals.breakfast, activeArt.meals.lunch, activeArt.meals.dinner].filter(Boolean).join(" + ") || "空腹释出"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Curatorial monolog */}
            <div>
              <span className="block text-[10px] font-bold text-zinc-900/50 uppercase tracking-wide mb-1.5">
                策展札记 Curatorial Statement
              </span>
              <p className="text-xs md:text-sm text-[#141414]/90 font-serif leading-relaxed italic bg-black/5 p-3.5 rounded border border-zinc-900/10 font-medium font-sans">
                “ {activeArt.curatorComment} ”
              </p>
            </div>

          </div>
        </div>

        {/* Velvet Ropes spanned at bottom of stage as defined in template spec */}
        <div className="absolute bottom-0 left-0 right-0 w-full px-8 md:px-20 flex justify-between pointer-events-none z-30">
          {/* Left post */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 rounded-full shadow" />
            <div className="w-2.5 h-20 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 rounded-t shadow" />
            <div className="w-8 h-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-md" />
          </div>
          {/* Right post */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 rounded-full shadow" />
            <div className="w-2.5 h-20 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 rounded-t shadow" />
            <div className="w-8 h-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-md" />
          </div>
        </div>
        {/* Saggy Crimson velvet rope cord */}
        <div className="absolute bottom-16 left-12 right-12 md:left-24 md:right-24 h-4 border-b-[5px] border-red-700 rounded-b-[400px] shadow-[0_4px_10px_rgba(139,0,0,0.4)] pointer-events-none z-20 opacity-80" />

      </div>
      
      {/* Quick stats ribbon bar underneath */}
      <div className="flex flex-wrap items-center justify-around gap-2 p-4 bg-black/40 border-t border-zinc-900 rounded-b-3xl">
        <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
          <Heart className="w-3.5 h-3.5 text-zinc-650" />
          <span>馆藏累计：<strong className="text-zinc-300">{exhibits.length}</strong> 件作品</span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
          <Calendar className="w-3.5 h-3.5 text-zinc-650" />
          <span>最长蓄力憋拉：
            <strong className="text-zinc-300">
              {Math.max(...exhibits.map(e => e.holdingDays), 0)} 天
            </strong>
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
          <Award className="w-3.5 h-3.5 text-art-yellow" />
          <span>UR传奇馆藏：
            <strong className="text-zinc-300">
              {exhibits.filter(e => e.rarity === "UR").length} 件
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { PoopArt, MealInput, getMaximumSegmentsCount } from "../types";
import { PoopRenderer } from "./PoopRenderer";
import { 
  playSteamLeverSound, 
  playDingSound, 
  playSqueezeSound, 
  playSpotlightFanfare,
  playTickSound 
} from "../utils/audio";
import { Award, Zap, HelpCircle, Flame, Sparkles } from "lucide-react";

interface PoopSynthesizerProps {
  isSynthesizing: boolean;
  meals: MealInput;
  holdingDays: number;
  heldMealsHistory: MealInput[];
  artistName: string;
  onSynthesizeComplete: (newArt: PoopArt) => void;
  onCancel: () => void;
}

export const PoopSynthesizer: React.FC<PoopSynthesizerProps> = ({
  isSynthesizing,
  meals,
  holdingDays,
  heldMealsHistory,
  artistName,
  onSynthesizeComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<"idle" | "cloche_in" | "lever_ready" | "crunching" | "extrusion" | "decorating" | "chef_special_reveal">("idle");
  const [shaking, setShaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extrudingSegments, setExtrudingSegments] = useState<number>(0);
  const [synthesizedArt, setSynthesizedArt] = useState<PoopArt | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Start the magical gourmet kitchen pipeline
  useEffect(() => {
    if (isSynthesizing) {
      triggerGourmetFlow();
    } else {
      setStep("idle");
      setSynthesizedArt(null);
      setProgress(0);
      setErrorMessage("");
    }
  }, [isSynthesizing]);

  const triggerGourmetFlow = async () => {
    setLoading(true);
    setErrorMessage("");
    setStep("cloche_in");

    // Play initial plate table set sound
    setTimeout(() => {
      playDingSound();
    }, 400);

    // Fetch the AI synthesis analysis from server
    try {
      const response = await fetch("/api/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meals,
            holdingDays,
            artistName,
            heldMealsHistory,
          }),
        });
      
      if (!response.ok) {
        throw new Error("Server synthesis failed");
      }

      const data = await response.json();
      
      const newPiece: PoopArt = {
        id: "art-" + Math.random().toString(36).substr(2, 9),
        title: data.title || "《无名物：日常的质感维度》",
        artist: artistName || "无名主厨",
        meals: { ...meals },
        timestamp: new Date().toISOString(),
        rarity: data.rarity || "N",
        colorHex: data.colorHex || "#8B5A2B",
        accentColorHex: data.accentColorHex || "#5C3818",
        textureType: data.textureType || "smooth",
        shapeType: data.shapeType || "standard_swirl",
        ingredientsAnalyzed: data.ingredientsAnalyzed || ["空气/水"],
        curatorComment: data.curatorComment || "创作者诉说着肠胃物理机制的纯净赞歌。",
        holdingDays,
        heldMealsHistory,
        season: data.season,
        timeOfDay: data.timeOfDay,
      };

      setSynthesizedArt(newPiece);
      setLoading(false);
      
      setTimeout(() => {
        setStep("lever_ready");
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setErrorMessage("利基传感器在后台对接口时发现网络断连。正在连接本地备用合成矩阵...");
      setLoading(false);
      // Local fallback artwork logic
      setTimeout(() => {
        const fallbacks = [
          { title: "《清晨第一缕阳光下的太妃糖拉丝》", rarity: "N" as const, comment: "色泽温润，边缘柔和，昭示着艺术家平稳踏实的肠胃微生态循环。" },
          { title: "《午后双焦咖啡因之神圣结核》", rarity: "R" as const, comment: "富含焦糊气孔与深邃的碳质斑点，代表着咖啡因与高压代谢下的先锋创意碰撞。" },
          { title: "《重度辛辣红油的存在主义哀歌》", rarity: "R" as const, comment: "高饱和红亮油光，散发着警示性的色彩张力，它是一场昨日火锅狂欢后的肠道重力救赎。" },
          { title: "《抹茶微风下的森林盆景幻想》", rarity: "R" as const, comment: "草本膳食纤维元素沉积，色泽沉静内敛。犹如初春巴黎雨后的湿润地表苔藓。" },
          { title: "《两日积压的青铜沙基纪念碑》", rarity: "SR" as const, comment: "结构粗砺沉稳，具有岩石化石般的历史折叠感。两日发酵带来饱满沉甸的轮廓力学。" },
          { title: "《重度压力下的黑曜石深渊断层》", rarity: "SR" as const, comment: "蓄力深沉。由于摄入与周身荷尔蒙联合施压，硬度极高，闪烁着克制自省的高冷幽光。" },
          { title: "《麦穗与黄油的黄昏法国浪漫高歌》", rarity: "SR" as const, comment: "法式面包牛角与精细碳水的浪漫交织，色变黄金，是肠道对近代烘焙文明温存的致敬。" },
          { title: "《万物皆虚的七日鎏金神圣王冠》", rarity: "UR" as const, comment: "传世级殿堂神作！长达七日物理幽闭发酵，铸成奢华的纯金色泽与高达120cm王冠峰峦。" },
          { title: "《终极宇宙能之幽浮晶体雕琢》", rarity: "UR" as const, comment: "质地剔透并覆盖偏光，流体力学上近于倒扣飞碟。超脱了生理解剖常规的后现代主义圣物。" }
        ];
        
        // Randomly select among matching groups
        let chosen = fallbacks[0];
        if (holdingDays >= 7) {
          chosen = Math.random() > 0.5 ? fallbacks[7] : fallbacks[8];
        } else if (holdingDays >= 3) {
          const srs = [fallbacks[4], fallbacks[5], fallbacks[6]];
          chosen = srs[Math.floor(Math.random() * srs.length)];
        } else {
          const normals = [fallbacks[0], fallbacks[1], fallbacks[2], fallbacks[3]];
          chosen = normals[Math.floor(Math.random() * normals.length)];
        }
        
        const combinedIngredients: string[] = [];
        const allHistoryMeals = [...(heldMealsHistory || []), meals];
        allHistoryMeals.forEach(m => {
          if (m.breakfast) combinedIngredients.push(m.breakfast);
          if (m.lunch) combinedIngredients.push(m.lunch);
          if (m.dinner) combinedIngredients.push(m.dinner);
        });
        if (combinedIngredients.length === 0) {
          combinedIngredients.push("饥饿/空气");
        }

        // Add fun detail to fallback curator comment if they had hold history
        let customFallbackComment = chosen.comment;
        if (heldMealsHistory && heldMealsHistory.length > 0) {
          const pastSummary = heldMealsHistory
            .map(m => Object.values(m).filter(Boolean).join("、"))
            .filter(Boolean)
            .slice(0, 3)
            .join("、");
          customFallbackComment = `这是一场长达 ${holdingDays} 天的发酵长河。艺术家自 ${heldMealsHistory.length} 日前便蓄意深潜，底盘暗沉沉积着【${pastSummary || "空腹"}】的古老陈酿痕迹，并与今日释出的【${Object.values(meals).filter(Boolean).join("、") || "空腹"}】完美融汇，整体呈：${chosen.comment}`;
        }

        const nowLoc = new Date();
        const monthLoc = nowLoc.getMonth();
        const hourLoc = nowLoc.getHours();
        const localSeason: "spring" | "summer" | "autumn" | "winter" = (monthLoc >= 2 && monthLoc <= 4) ? "spring" : ((monthLoc >= 5 && monthLoc <= 7) ? "summer" : ((monthLoc >= 8 && monthLoc <= 10) ? "autumn" : "winter"));
        const localTimeOfDay: "morning" | "afternoon" | "night" = (hourLoc >= 6 && hourLoc < 12) ? "morning" : ((hourLoc >= 12 && hourLoc < 18) ? "afternoon" : "night");

        const fallbackPiece: PoopArt = {
          id: "fallback-" + Math.random().toString(36).substr(2, 9),
          title: chosen.title,
          artist: artistName || "无离线贵宾",
          meals: { ...meals },
          timestamp: new Date().toISOString(),
          rarity: chosen.rarity,
          colorHex: chosen.rarity === "UR" ? "#F59E0B" : (chosen.rarity === "SR" ? "#8B5A2B" : "#B45309"),
          accentColorHex: "#451A03",
          textureType: chosen.rarity === "UR" ? "golden_foil" : "cracked",
          shapeType: "standard_swirl",
          ingredientsAnalyzed: combinedIngredients,
          curatorComment: customFallbackComment + ` ——主厨艺术家：${artistName || "momo"}`,
          holdingDays,
          heldMealsHistory,
          season: localSeason,
          timeOfDay: localTimeOfDay,
        };
        setSynthesizedArt(fallbackPiece);
        setStep("lever_ready");
      }, 1000);
    }
  };

  const handlePullLever = () => {
    if (step !== "lever_ready") return;
    
    playSteamLeverSound();
    setStep("crunching");
    setShaking(true);
    setExtrudingSegments(0);

    // Gear gearbox sound sequence
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playSqueezeSound(80 + Math.random() * 40);
      }, i * 400 + 200);
    }

    // Progress to soft serve rendering
    setTimeout(() => {
      setShaking(false);
      setStep("extrusion");
      
      let counter = 0;
      const targetCount = synthesizedArt ? getMaximumSegmentsCount(synthesizedArt.shapeType, synthesizedArt.holdingDays) : 4;
      
      const interval = setInterval(() => {
        playSqueezeSound(120 + counter * 30);
        setExtrudingSegments(prev => prev + 1);
        counter++;
        if (counter >= targetCount) {
          clearInterval(interval);
          
          // Garnish leaf step
          setTimeout(() => {
            setStep("decorating");
            playDingSound();
            
            // Grand reveal spotlight
            setTimeout(() => {
              setStep("chef_special_reveal");
              playSpotlightFanfare();
            }, 1200);

          }, 1000);
        }
      }, 450); // Slightly faster interval to remain fun with extremely high layers!

    }, 2200);
  };

  const handleSaveToGallery = () => {
    if (synthesizedArt) {
      onSynthesizeComplete(synthesizedArt);
    }
  };

  if (!isSynthesizing) return null;

  return (
    <div id="synthesizer_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm overflow-y-auto">
      
      {/* Q-version chunky flat container card */}
      <div className={`relative w-full max-w-xl bg-[#FFFBEB] border-[4px] md:border-[6px] border-art-charcoal p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_#2B2D42] text-art-charcoal transition-all duration-300 ${shaking ? "animate-bounce" : ""}`}>
        
        {/* Synth lab top banner */}
        <div className="absolute top-4 left-4 flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 bg-art-red rounded-full animate-ping" />
          <span className="text-[9px] font-black tracking-widest text-[#2B2D42]/60 uppercase">SYNTH-LAB ATELIER</span>
        </div>

        {/* Cancel corner button */}
        {(step === "lever_ready" || step === "cloche_in") && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-[10px] font-black text-[#2B2D42]/60 hover:text-art-red transition-all underline decoration-1 cursor-pointer"
          >
            CANCEL (返回制备)
          </button>
        )}

        {/* --- STAGE 1: CLOCHE RESTAURANT PLATE ENTERS --- */}
        {step === "cloche_in" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            
            {/* Cloche silver dome */}
            <div className="relative mb-6 transform hover:scale-105 transition-transform duration-500">
              <div className="w-8 h-8 rounded-full bg-zinc-300 border-[3px] border-art-charcoal mx-auto -mb-2 shadow z-20 relative" />
              <div className="w-48 h-24 rounded-t-full bg-gradient-to-b from-[#FFF] via-zinc-200 to-zinc-400 border-[3px] border-art-charcoal shadow-md flex items-center justify-center" />
              <div className="w-56 h-4 bg-zinc-400 rounded-full border-[3px] border-art-charcoal shadow" />
            </div>

            <h3 className="text-xl font-serif text-art-charcoal italic font-black mb-2 animate-pulse">
              「主打艺术餐盘端入中...」
            </h3>
            <p className="text-xs text-art-charcoal/80 font-bold max-w-xs leading-relaxed">
              银盘防尘罩已经上桌。微量代谢传感器阵列正在读取您的摄入配方进行高分子推演：
              <span className="block mt-2 font-mono text-[10px] text-art-red font-black uppercase tracking-wider bg-white/70 p-1.5 rounded border border-art-charcoal/20">
                {meals.breakfast || "空腹"} | {meals.lunch || "空腹"} | {meals.dinner || "空腹"} ({holdingDays}天蓄力)
              </span>
            </p>
            {loading && (
              <div className="flex items-center space-x-1.5 mt-6">
                <span className="text-xs font-black uppercase tracking-wider text-[#2B2D42]/40">Analyzing API...</span>
                <div className="w-2.5 h-2.5 bg-art-yellow rounded-full border-2 border-art-charcoal animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-art-yellow rounded-full border-2 border-art-charcoal animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-art-yellow rounded-full border-2 border-art-charcoal animate-bounce" />
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 2: COLOSSAL RED LEVER PULL --- */}
        {step === "lever_ready" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-art-red border-[2px] border-art-charcoal rounded-lg shadow-[2px_2px_0px_#2B2D42] text-white mb-6">
              <Zap className="w-3.5 h-3.5 text-white animate-bounce" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {holdingDays >= 7 ? "⚠️ OVERLOAD COMPRESSION (过载合成压力警报!)" : "PREPARATION READY (主厨制备完毕)"}
              </span>
            </div>

            <p className="text-xs text-art-charcoal/80 font-bold mb-8 max-w-sm leading-relaxed">
              餐台已热，胚体待叠。请亲手<strong>按压拉动下方大型机具红阀</strong>，注入原动力高压物理合成流程。
            </p>

            {/* Interactive Mechanical Red Lever */}
            <div 
              onClick={handlePullLever}
              className="group relative flex flex-col items-center justify-center w-36 h-36 bg-white border-[3.5px] border-art-charcoal rounded-full shadow-[4px_4px_0px_#2B2D42] cursor-pointer hover:bg-art-yellow active:translate-y-1 active:shadow-none transition-all duration-200"
            >
              {/* Shaft holder */}
              <div className="w-4 h-12 bg-zinc-300 border-x-[2px] border-art-charcoal rounded-full absolute top-12 z-10" />
              
              {/* Spinning outer warning border */}
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-art-charcoal/20 group-hover:border-art-charcoal/40 animate-spin [animation-duration:15s]" />

              {/* Lever handle */}
              <div className="relative flex flex-col items-center group-hover:translate-y-4 transition-transform duration-300 z-20">
                <div className="w-14 h-14 rounded-full bg-art-red border-[3px] border-art-charcoal shadow-md flex items-center justify-center text-white text-[11px] font-black font-sans select-none tracking-wider">
                  PULL
                </div>
                <div className="w-3.5 h-12 bg-[#DDD] border-[2px] border-art-charcoal -mt-1 shadow" />
              </div>
            </div>

            <span className="block text-[11px] font-black text-art-charcoal tracking-wider uppercase mt-6">
              ⬇️ 点击拉阀触发 (ACTIVATE ENGINE)
            </span>

            {errorMessage && (
              <span className="mt-4 block text-[9.5px] text-art-charcoal/60 border border-art-charcoal/30 bg-white/70 px-3 py-1.5 rounded-lg max-w-xs font-bold leading-normal">
                {errorMessage}
              </span>
            )}
          </div>
        )}

        {/* --- STAGE 3: CRUNCHING MECHANICAL GEARS & SHAKING --- */}
        {step === "crunching" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            
            {/* Spinning code gears */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="w-16 h-16 border-[4px] border-dashed border-art-yellow bg-white rounded-full animate-spin [animation-duration:5s]" />
              <div className="w-10 h-10 border-[3px] border-dashed border-art-red bg-white rounded-full absolute bottom-2 right-2 animate-spin [animation-duration:2.5s] [animation-direction:reverse]" />
            </div>

            <h3 className="text-base font-black text-art-charcoal tracking-widest uppercase animate-pulse mb-2">
              ⚙️ COMPILING METABOLIC CODE (胃壁磨碎中)
            </h3>
            <p className="text-xs text-art-charcoal/70 font-bold max-w-xs leading-relaxed">
              重力编译器加码，蒸汽溢出。
              正在进行高压水化与高膳食纤维分子在原子级的流体堆砌重排...
            </p>

            {/* Retro progress bar */}
            <div className="h-6 w-56 bg-[#E9ECEF] border-[3px] border-art-charcoal rounded-full overflow-hidden p-0.5 relative shadow-inner mt-6">
              <div className="h-full bg-gradient-to-r from-art-yellow to-art-red rounded-full transition-all duration-1000 ease-out w-3/4 animate-pulse" />
            </div>
          </div>
        )}

        {/* --- STAGE 4: EXTRUSION SOFT-SERVE COILING --- */}
        {step === "extrusion" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            
            <div className="relative w-48 h-48 bg-white border-[3.5px] border-art-charcoal rounded-3xl flex items-center justify-center overflow-hidden mb-4 shadow-[4px_4px_0px_#2B2D42]">
              
              {/* Nozzle drawing */}
              <div className="absolute top-0 w-8 h-6 bg-zinc-200 border-x-[2.5px] border-b-[2.5px] border-art-charcoal rounded-b-md flex items-center justify-center z-20">
                <div className="w-2 h-2 rounded-full bg-art-yellow animate-ping" />
              </div>

              <span className="absolute bottom-2.5 right-3 text-[9px] font-black text-art-charcoal/50 uppercase tracking-widest">
                COIL {extrudingSegments} / {synthesizedArt ? getMaximumSegmentsCount(synthesizedArt.shapeType, synthesizedArt.holdingDays) : 4}
              </span>

              {/* Material model preview */}
              <div className="mt-4 transform scale-90 transition-all duration-300 opacity-95">
                {synthesizedArt && (
                  <PoopRenderer 
                    art={synthesizedArt}
                    interactive={false} 
                    visibleSegmentsCount={extrudingSegments}
                  />
                )}
              </div>
            </div>

            <h3 className="text-sm font-black text-art-green uppercase tracking-wider animate-pulse mb-1">
              🍦 SOFT-SERVE COIL EXTRUDING (软雪糕旋转堆砌)
            </h3>
            <p className="text-[11px] text-art-charcoal/70 font-bold">
              经典果冻奶油流体下溢，物理受力受重力微调，尖角完美定位。
            </p>
          </div>
        )}

        {/* --- STAGE 5: TWEEZER MINTS DESIGN --- */}
        {step === "decorating" && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            
            <div className="relative w-48 h-48 bg-white border-[3.5px] border-art-charcoal rounded-3xl flex items-center justify-center overflow-hidden mb-4 shadow-[4px_4px_0px_#2B2D42]">
              {/* steel arm */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-zinc-650 to-zinc-400 z-30 animate-bounce" />
              
              <div className="mt-4 transform scale-90 opacity-100">
                {synthesizedArt && <PoopRenderer art={synthesizedArt} interactive={false} />}
              </div>
            </div>

            <h3 className="text-xs font-black text-art-charcoal uppercase tracking-widest mb-1">
              🌱 FRENCH GOLD GARNISHING (法式薄荷点缀)
            </h3>
            <p className="text-[11px] text-art-charcoal/70 font-bold max-w-xs">
              一只高精密不锈钢镊子庄严伸出，在艺术品微翘的顶尖小心翼翼地粘上一片代表生命与呼吸的清凉野荷。
            </p>
          </div>
        )}

        {/* --- STAGE 6: COMPLETED CHEF REVEAL WITH PLAQUE --- */}
        {step === "chef_special_reveal" && synthesizedArt && (
          <div className="flex flex-col items-center py-1 animate-fade-in text-center">
            
            {/* Highlight Ribbon badge */}
            <div className="flex items-center space-x-2 px-4 py-1.5 bg-art-red border-[2px] border-art-charcoal rounded-full shadow-[2px_2px_0px_#2B2D42] text-white mb-4">
              <Sparkles className="w-4 h-4 text-white animate-spin" />
              <span className="text-[11.5px] font-black tracking-widest uppercase">
                今日重塑佳作 REVEAL: {synthesizedArt.rarity} LEVEL
              </span>
            </div>

            {/* Complete artifact container box mockup */}
            <div className="relative w-64 h-64 flex items-center justify-center bg-white border-[3.5px] border-art-charcoal rounded-3xl shadow-[5px_5px_0px_#2B2D42] overflow-hidden mb-6">
              <PoopRenderer art={synthesizedArt} interactive={true} className="transform scale-[1.05]" />
              {/* Backlight shine gradient clipping */}
              <div className="absolute top-0 w-32 h-64 bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform -skew-x-12" />
            </div>

            {/* Ivory presentation Plaque rotated */}
            <div className="relative p-6 bg-[#E4E3E0] text-zinc-900 border-[2.5px] border-zinc-450 rounded-lg shadow-xl text-left select-none max-w-sm w-full mb-6 relative">
              {/* Corner screws */}
              <div className="absolute top-2 left-2 w-1.2 h-1.2 rounded-full bg-zinc-950/20" />
              <div className="absolute top-2 right-2 w-1.2 h-1.2 rounded-full bg-zinc-950/20" />
              <div className="absolute bottom-2 left-2 w-1.2 h-1.2 rounded-full bg-zinc-950/20" />
              <div className="absolute bottom-2 right-2 w-1.2 h-1.2 rounded-full bg-zinc-950/20" />

              <div className="flex items-center justify-between border-b border-zinc-900/10 pb-2 mb-2 pr-4">
                <h4 className="text-base font-serif italic text-[#141414] font-black">
                  {synthesizedArt.title}
                </h4>
                <span className="text-[8.5px] font-mono font-bold uppercase text-zinc-500">
                  {holdingDays}d hold
                </span>
              </div>

              <p className="text-xs text-zinc-800 font-serif leading-relaxed italic mb-3 bg-black/5 p-2 rounded">
                “ {synthesizedArt.curatorComment} ”
              </p>

              <div className="flex flex-wrap gap-1 text-[9.5px] text-zinc-650 pt-2 border-t border-zinc-900/10 font-bold">
                <span className="uppercase text-zinc-400">媒介:</span>
                {synthesizedArt.ingredientsAnalyzed.slice(0, 4).map((x, i) => (
                  <span key={i} className="bg-white/60 px-1.5 py-0.5 rounded border border-zinc-300">
                    {x}
                  </span>
                ))}
              </div>
            </div>

            {/* Save Button triggers storage physical click shadow */}
            <button
              onClick={handleSaveToGallery}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-art-green hover:bg-[#a5d584] border-[3.5px] border-art-charcoal font-black text-sm text-art-charcoal rounded-2xl shadow-[4px_4px_0px_#2B2D42] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider cursor-pointer"
            >
              <Award className="w-5 h-5 text-art-charcoal" />
              <span>送存大屎馆藏殿堂 (Museum Preservation)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

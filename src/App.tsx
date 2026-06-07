import React, { useState, useEffect } from "react";
import { MealInput, PoopArt, GuestComment } from "./types";
import { MealConsole } from "./components/MealConsole";
import { MuseumGallery } from "./components/MuseumGallery";
import { PoopSynthesizer } from "./components/PoopSynthesizer";
import { SocialPoster } from "./components/SocialPoster";
import { playTickSound, playDingSound } from "./utils/audio";
import { Award, PenTool, HelpCircle, Sparkles, UserCheck, Info } from "lucide-react";

export default function App() {
  
  // 1. Initial State Persistence Loaders
  const [artistName, setArtistName] = useState<string>(() => {
    return localStorage.getItem("poop_museum_artist") || "visitor@cyberpoop.cafe";
  });
  
  const [meals, setMeals] = useState<MealInput>({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  
  const [holdingDays, setHoldingDays] = useState<number>(0);
  
  const [heldMealsHistory, setHeldMealsHistory] = useState<MealInput[]>(() => {
    const saved = localStorage.getItem("poop_museum_held_history");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [exhibits, setExhibits] = useState<PoopArt[]>(() => {
    const saved = localStorage.getItem("poop_museum_exhibits");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    
    // Default pre-loaded relics for initial museum beauty
    return [
      {
        id: "art-initial-01",
        title: "《午夜麻辣红油的存在主义阵痛》",
        artist: "visitor@cyberpoop.cafe",
        meals: { breakfast: "冰美式咖啡", lunch: "尖椒螺蛳粉", dinner: "九宫格重辣火锅" },
        timestamp: "2026-06-06T15:15:00.000Z",
        rarity: "R",
        colorHex: "#B22222",
        accentColorHex: "#FF4500",
        textureType: "steaming",
        shapeType: "standard_swirl",
        ingredientsAnalyzed: ["冰美式", "尖椒中辣", "重油火锅"],
        curatorComment: "这件饱满、散发着热烈红色光芒的经典软雪糕流体，控诉了极辣膳食对现代肠壁粘膜无情的重力压迫，更以强饱和的存在主义线条对消费主义深夜暴食进行了尖锐的艺术解构。",
        holdingDays: 1
      },
      {
        id: "art-initial-02",
        title: "《松露金箔在重压之下的宏大叙事》",
        artist: "visitor@cyberpoop.cafe",
        meals: { breakfast: "特级吉列和牛", lunch: "黑松露菌菇刺身", dinner: "金箔鱼子酱拌饭" },
        timestamp: "2026-06-02T10:04:00.000Z",
        rarity: "UR",
        colorHex: "#F59E0B",
        accentColorHex: "#D97706",
        textureType: "metallic_gold",
        shapeType: "massive_mountain",
        ingredientsAnalyzed: ["特级和牛", "黑松露", "金箔鱼子酱"],
        curatorComment: "蓄力长达七日而成的殿堂神作。这件高达150cm的超重载纯金质软雪糕峰峦层层卷绕，闪烁着奢靡质感。它测试着自然引力与腹壁阻尼的极限，是一部对消费主义精致生活沉重代偿的华丽挽歌。",
        holdingDays: 7
      }
    ];
  });

  const [guestComments, setGuestComments] = useState<GuestComment[]>(() => {
    const saved = localStorage.getItem("poop_museum_comments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    
    // Pre-loaded reviews
    return [
      {
        id: "cmt-1",
        author: "香榭丽舍特约批评：米其林评论家 Pierre",
        emoji: "🏆",
        text: "红油带来的张力极为耀眼！顶尖那薄荷叶的点缀堪称圣殿级点睛一笔！",
        timestamp: "2026-06-07T08:12:00Z"
      },
      {
        id: "cmt-2",
        author: "饱受辛辣摧残的长沙常客",
        emoji: "🧻",
        text: "简直是装了摄像头！吃尖折耳根和重油九宫格后真的会产生此等宏大叹息作品！",
        timestamp: "2026-06-07T09:44:00Z"
      }
    ];
  });

  // Current states for triggers and overlays
  const [isEditingArtist, setIsEditingArtist] = useState(false);
  const [artistInput, setArtistInput] = useState(artistName);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeShareArt, setActiveShareArt] = useState<PoopArt | null>(null);
  const [showGameInstructions, setShowGameInstructions] = useState(false);

  // 2. Synchronize Local Storage when changed
  useEffect(() => {
    localStorage.setItem("poop_museum_artist", artistName);
  }, [artistName]);

  useEffect(() => {
    localStorage.setItem("poop_museum_exhibits", JSON.stringify(exhibits));
  }, [exhibits]);

  useEffect(() => {
    localStorage.setItem("poop_museum_comments", JSON.stringify(guestComments));
  }, [guestComments]);

  useEffect(() => {
    localStorage.setItem("poop_museum_held_history", JSON.stringify(heldMealsHistory));
  }, [heldMealsHistory]);

  const handleHoldingDaysChange = (newDays: number) => {
    if (newDays > holdingDays) {
      setHeldMealsHistory((prev) => [...prev, { ...meals }]);
      setMeals({ breakfast: "", lunch: "", dinner: "" });
    } else if (newDays < holdingDays) {
      setHeldMealsHistory((prev) => {
        const copy = [...prev];
        const lastMeal = copy.pop();
        if (lastMeal) {
          setMeals(lastMeal);
        } else {
          setMeals({ breakfast: "", lunch: "", dinner: "" });
        }
        return copy;
      });
    }
    setHoldingDays(newDays);
  };

  // Handle addition of a newly synthesized masterpiece poop
  const handleSynthesizeComplete = (newArt: PoopArt) => {
    setExhibits((prev) => [newArt, ...prev]);
    setIsSynthesizing(false);
    
    // Reset ingestion form and indicator
    setMeals({ breakfast: "", lunch: "", dinner: "" });
    setHoldingDays(0);
    setHeldMealsHistory([]);
    localStorage.removeItem("poop_museum_held_history");
    
    // Automatically trigger share overlay card
    setTimeout(() => {
      setActiveShareArt(newArt);
    }, 450);
  };

  // Submit Guest comment
  const handleAddComment = (newComment: Omit<GuestComment, "id" | "timestamp">) => {
    const commentItem: GuestComment = {
      id: "cmt-" + Math.random().toString(36).substr(2, 9),
      ...newComment,
      timestamp: new Date().toISOString(),
    };
    setGuestComments((prev) => [commentItem, ...prev]);
  };

  // Delete/Decommission items
  const handleDeleteExhibit = (id: string) => {
    setExhibits((prev) => prev.filter((ex) => ex.id !== id));
    playTickSound();
  };

  // Confirm changes to Artist pseudonym
  const handleSaveArtistName = () => {
    if (artistInput.trim()) {
      setArtistName(artistInput.trim());
      setIsEditingArtist(false);
      playDingSound();
    }
  };

  return (
    <div id="cyber_museum_app_root" className="min-h-screen bg-[#0F0F0F] text-zinc-100 flex flex-col justify-between selection:bg-art-yellow selection:text-art-charcoal font-sans antialiased overflow-x-hidden relative">
      
      {/* Absolute background visual spotlights decor lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-screen bg-gradient-to-b from-[#FFF]/2 to-transparent pointer-events-none z-0" style={{ clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }} />

      {/* Main Container Layout */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 flex flex-col space-y-6 z-10 relative">
        
        {/* GRAND MUSEUM HEADER ROUTE */}
        <header id="museum_masthead" className="flex flex-col md:flex-row md:items-center justify-between border-b-[3px] border-art-charcoal/30 pb-5 gap-4">
          <div className="flex items-center space-x-3.5">
            {/* Museum Royal Seal Emblem (French-chunky badge style) */}
            <div className="w-12 h-12 rounded-2xl bg-art-yellow border-[3px] border-art-charcoal shadow-[3px_3px_0px_#2B2D42] flex items-center justify-center text-2xl select-none relative animate-pulse">
              💩
            </div>
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-widest text-[#FFF] opacity-60 font-black font-mono block">
                CYBER MUSEUM OF FECAL MODERN ART
              </span>
              <h1 className="text-xl md:text-2xl font-serif font-black text-white italic tracking-tight flex items-center gap-2 mt-0.5">
                赛博大屎馆
              </h1>
            </div>
          </div>

          {/* Configurable Artist Pseudonym / Credentials panel */}
          <div className="flex flex-col md:items-end justify-center">
            
            <div className="flex items-center space-x-3">
              {isEditingArtist ? (
                <div className="flex items-center space-x-1.5 animate-fade-in">
                  <input
                    type="text"
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border-[2px] border-art-charcoal rounded-lg text-art-charcoal font-bold outline-none"
                    maxLength={32}
                  />
                  <button
                    onClick={handleSaveArtistName}
                    className="px-2.5 py-1 text-[10px] bg-art-yellow border-[2px] border-art-charcoal text-art-charcoal font-black rounded-lg shadow-[2px_2px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none hover:bg-[#ffe05c]"
                  >
                    保存
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Physical credentials badge */}
                  <div className="px-3.5 py-1.5 bg-white text-art-charcoal border-[2.5px] border-art-charcoal rounded-xl shadow-[2.5px_2.5px_0px_#2B2D42] flex items-center space-x-2 font-bold hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#2B2D42] transition-all">
                    <span className="text-xs font-serif italic text-art-charcoal">
                      主厨艺术家：<strong className="text-art-red">{artistName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setArtistInput(artistName);
                        setIsEditingArtist(true);
                        playTickSound();
                      }}
                      className="p-1 rounded bg-[#FFFBEB] border border-art-charcoal/20 hover:bg-art-yellow text-art-charcoal transition-all text-xs cursor-pointer"
                      title="修改签名"
                    >
                      <PenTool className="w-3 h-3 text-art-charcoal" />
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions conceptual bibel trigger */}
              <button
                onClick={() => {
                  setShowGameInstructions(!showGameInstructions);
                  playTickSound();
                }}
                className="px-3.5 py-1.5 bg-white border-[2.5px] border-art-charcoal text-art-charcoal rounded-xl shadow-[2.5px_2.5px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer hover:bg-zinc-100"
              >
                <HelpCircle className="w-4 h-4 text-art-charcoal" />
                <span>产品概念案 1.0</span>
              </button>
            </div>

          </div>
        </header>

        {/* CONCEPTUAL 1.0 BIBEL RECIPE BANNER - CREAM RETRO STYLE */}
        {showGameInstructions && (
          <div id="conceptual_bible_card" className="p-5 rounded-2xl bg-[#FFFBEB] border-[3.5px] border-art-charcoal text-art-charcoal text-left animate-fade-in font-sans shadow-[5px_5px_0px_#2B2D42] relative select-none">
            {/* Corners accents */}
            <div className="absolute top-2 left-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute top-2 right-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute bottom-2 left-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute bottom-2 right-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />

            <h4 className="text-base font-black text-art-charcoal pb-2 border-b border-art-charcoal/25 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-art-red animate-bounce" />
              赛博大屎馆 《产品策划案 V1.0》 摘要：
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-art-charcoal/80 mt-3.5 leading-relaxed">
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-red block mb-1">🥗 1. 每日膳食打卡：</strong>
                <p>
                  录入打卡今日三餐食材。系统智能读取高饱和化学公式，融合成型，直接影响最后雕塑作品的色泽、尖角形态与硬质纹理（例如麻辣火锅出红油）。
                </p>
              </div>
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-blue block mb-1">⚡ 2. 蓄力指针决策锁：</strong>
                <p>
                  可按压选择“先憋着”。蓄力发酵天数越多（最多蓄10天），大肠胃合成压力上升。释出之物几何面积越宏大、尖端形态越奢靡，评级甚至飙升至UR级传奇金箔工艺！
                </p>
              </div>
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-green block mb-1">🎟️ 3. 法式高雅上盘：</strong>
                <p>
                  拉动红色拉阀，将启动巴黎卢浮宫银器高级流水线。软雪糕膏体旋转缠绕下倾落，机械镊子微调点缀代表初春生机的薄荷叶。罩Ding声升起。
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowGameInstructions(false)}
              className="mt-4 text-xs font-black text-art-red underline decoration-2 decoration-art-red/20 hover:text-art-red/80 select-none block"
            >
              我知道了，开始合成创作！
            </button>
          </div>
        )}

        {/* WORKSPACE PREPARATION */}
        <section id="diet_and_accumulation_workspace" className="relative z-10 hover:skew-x-[0.1deg] transition-all">
          <MealConsole
            meals={meals}
            onChangeMeals={setMeals}
            holdingDays={holdingDays}
            onChangeHoldingDays={handleHoldingDaysChange}
            onTriggerSynthesize={() => {
              setIsSynthesizing(true);
              playTickSound();
            }}
            heldMealsHistory={heldMealsHistory}
          />
        </section>

        {/* GALLERY MUSEUM ROTATING CAROUSEL LIST */}
        <section id="grand_museum_showcase_gallery" className="pt-2">
          <div className="flex items-center justify-between mb-3 text-left">
            <span className="text-xs font-mono tracking-widest text-[#FFF] opacity-50 uppercase font-black">
              MASTERPIECE CAROUSEL EXHIBITS (古典展位)
            </span>
            <div className="flex items-center space-x-1.5 text-[10.5px] text-zinc-500 font-bold">
              <Info className="w-3.5 h-3.5 text-zinc-600" />
              <span>左右箭头或滑动手势可阅览馆藏珍品</span>
            </div>
          </div>
          <MuseumGallery
            exhibits={exhibits}
            onDeleteExhibit={handleDeleteExhibit}
            onSelectShare={setActiveShareArt}
          />
        </section>

      </div>

      {/* FOOTER GRAPHICS - RETRO MINIMALIST NO INFRA TELEMETRY */}
      <footer id="museum_pedigree_footer" className="py-6 border-t-[3px] border-art-charcoal/30 bg-black/40 text-center font-sans mt-8">
        <p className="text-[10px] font-mono tracking-widest text-[#FFF] opacity-40 font-black uppercase">
          CYBER POOP MUSEUM © 2026 • PARIS ARTISAN EDITION
        </p>
        <p className="text-[9px] text-zinc-600 mt-1 font-serif italic">
          “You are what you eat... literally.”
        </p>
      </footer>

      {/* --- OVERLAY MODAL: SYNERGY PROCESS PIPELINE STAGE --- */}
      <PoopSynthesizer
        isSynthesizing={isSynthesizing}
        meals={meals}
        holdingDays={holdingDays}
        heldMealsHistory={heldMealsHistory}
        artistName={artistName}
        onSynthesizeComplete={handleSynthesizeComplete}
        onCancel={() => setIsSynthesizing(false)}
      />

      {/* --- OVERLAY MODAL: SOUVENIR POSTCARD POSTATION & REVIEW BOARD --- */}
      {activeShareArt && (
        <SocialPoster
          art={activeShareArt}
          onClose={() => {
            setActiveShareArt(null);
            playTickSound();
          }}
          guestComments={guestComments}
          onAddComment={handleAddComment}
        />
      )}

    </div>
  );
}

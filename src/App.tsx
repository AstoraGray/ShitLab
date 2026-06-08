import React, { useState, useEffect } from "react";
import { MealInput, PoopArt, GuestComment } from "./types";
import { MealConsole } from "./components/MealConsole";
import { MuseumGallery } from "./components/MuseumGallery";
import { PoopSynthesizer } from "./components/PoopSynthesizer";
import { SocialPoster } from "./components/SocialPoster";
import { PoopCalendar } from "./components/PoopCalendar";
import { playTickSound, playDingSound } from "./utils/audio";
import { Award, PenTool, HelpCircle, Sparkles, UserCheck, Info } from "lucide-react";

export default function App() {
  
  // 1. Initial State Persistence Loaders
  const [artistName, setArtistName] = useState<string>(() => {
    return localStorage.getItem("poop_museum_artist") || "momo";
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
    
    // Returned empty list for grand launch - visitors start with an clean, pristine museum gallery
    return [];
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
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);

  // Reset active showcase slide whenever date-key filter or total exhibit count changes
  useEffect(() => {
    setGalleryActiveIndex(0);
  }, [selectedDateKey, exhibits.length]);

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
    setSelectedDateKey(null); // Clear active date filter on new creation so the custom art is immediately displayed
    setExhibits((prev) => [newArt, ...prev]);
    setIsSynthesizing(false);
    
    // Automatically generate a customized VIP comment in the guest book ledger based on this new piece!
    const guestAuthors = [
      "香榭丽舍秘密资深主评 Pierre",
      "凡尔赛后现代泥塑家 Bernard",
      "饱受生理力学考证的王教授",
      "塞纳河畔当代流体力学研究员",
      "川渝火锅深夜教父 廖馆长",
      "太空物理与重力流质总监理",
      "威尼斯古典双年展评审 Céleste",
      "巴黎拉斐尔先锋画廊常务总监",
      "米兰时尚周香氛与重力艺术指导",
      "中医药膳代谢机理调养专家 李医生",
      "蓬皮杜国家艺术中心首席学者",
      "前卫有机废料构造学名誉布道人",
      "巴黎香奈儿首席色彩搭配师 Jeanne"
    ];
    
    const guestCommentsPool = [
      `被震惊了！这件《${newArt.title}》中那股高饱和的油脂色彩和纯法式弯卷质地，隔着高压罩都有一股令人肃立的卢浮宫高贵神韵！`,
      `如此不可思议的${newArt.rarity}级史诗神作！它证明了真正的艺术大师在于能从日常代谢中，抽离出对后现代化消费主义极具穿透力的反思！`,
      `拉下红色阀门拉杆的瞬间简直是行为艺术的巅峰。特别是底部的沉积断层层，简直是用消化引力谱写的一首微缩编年史！`,
      `我的天，如此完美的巴洛克双螺旋，简直比凡尔赛宫的古典青铜盘饰还要璀璨！太具有戏剧冲突和反叛张力了！`,
      `令人窒息的质感弧度！多日积屯的高压在此达致物理力学圣殿级的完美平衡，不折不扣的世界杯巡演名作！`,
      `调色盘简直绝了，主厨艺术家不仅有非凡的厨艺底色，更有无愧于现代先锋派色彩泰斗的高明色准！向您脱帽致敬！`,
      `那片带露珠的露水薄荷叶的点缀，让本应是纯粹代谢的物质遗存，骤然具备了巴黎春天的轻盈与野性！卓越！`,
      `长达 ${newArt.holdingDays} 日的情感憋附与高密度发酵，在此达成了无可指摘的宿命凝结，每一寸褶皱都充满生命意志！`,
      `这是极其罕见的有机结体美学。在底盘厚重的陈酿色泽中，分明跳跃着昨日高卡能食物最后的生命哀鸣！`
    ];

    const randomAuthor = guestAuthors[Math.floor(Math.random() * guestAuthors.length)];
    const randomText = guestCommentsPool[Math.floor(Math.random() * guestCommentsPool.length)];
    const guestEmojis = ["🏆", "✨", "🧻", "💩", "💨", "🎨", "🌟", "🔥"];
    const emoji = newArt.rarity === "UR" ? "🏆" : (newArt.rarity === "SR" ? "✨" : guestEmojis[Math.floor(Math.random() * guestEmojis.length)]);
    
    const autoCmt: GuestComment = {
      id: "cmt-" + Math.random().toString(36).substr(2, 9),
      artId: newArt.id, // COUPLED WITH THIS NEW PIECE
      author: randomAuthor,
      emoji: emoji,
      text: randomText,
      timestamp: new Date().toISOString()
    };
    
    setGuestComments((prev) => [autoCmt, ...prev]);
    
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
  const handleAddComment = (artId: string, newComment: Omit<GuestComment, "id" | "timestamp">) => {
    const commentItem: GuestComment = {
      id: "cmt-" + Math.random().toString(36).substr(2, 9),
      artId, // Bind comment securely to specific masterpiece excrement artwork!
      ...newComment,
      timestamp: new Date().toISOString(),
    };
    setGuestComments((prev) => [commentItem, ...prev]);
  };

  // Delete/Decommission items
  const handleDeleteExhibit = (id: string) => {
    setExhibits((prev) => {
      const updated = prev.filter((ex) => ex.id !== id);
      if (selectedDateKey) {
        const remainingOnDate = updated.some(ex => {
          if (!ex.timestamp) return false;
          const d = new Date(ex.timestamp);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          return key === selectedDateKey;
        });
        if (!remainingOnDate) {
          setSelectedDateKey(null); // Auto clear date filter if matching list became empty
        }
      }
      return updated;
    });
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

  // Compute filtered exhibits list based on chosen calendar date key
  const filteredExhibits = exhibits.filter((ex) => {
    if (!selectedDateKey) return true;
    if (!ex.timestamp) return false;
    const d = new Date(ex.timestamp);
    const localY = d.getFullYear();
    const localM = String(d.getMonth() + 1).padStart(2, "0");
    const localD = String(d.getDate()).padStart(2, "0");
    return `${localY}-${localM}-${localD}` === selectedDateKey;
  });

  const handleSelectExhibitIdFromCalendar = (artId: string) => {
    const idx = filteredExhibits.findIndex(ex => ex.id === artId);
    if (idx !== -1) {
      setGalleryActiveIndex(idx);
      playDingSound();
      const el = document.getElementById("grand_museum_showcase_gallery");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
                赛博大屎馆 <span className="text-[10px] font-mono tracking-normal font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded italic select-none">正式运营官方版 v1.01</span>
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

              {/* Instructions conceptual Bible trigger */}
              <button
                onClick={() => {
                  setShowGameInstructions(!showGameInstructions);
                  playTickSound();
                }}
                className="px-3.5 py-1.5 bg-white border-[2.5px] border-art-charcoal text-art-charcoal rounded-xl shadow-[2.5px_2.5px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer hover:bg-zinc-100 animate-pulse"
              >
                <HelpCircle className="w-4 h-4 text-art-red" />
                <span>正式运营官方版 1.02</span>
              </button>
            </div>

          </div>
        </header>

        {/* CONCEPTUAL 1.0 BIBEL RECIPE BANNER - CREAM RETRO STYLE */}
        {showGameInstructions && (
          <div id="conceptual_bible_card" className="p-5 rounded-2xl bg-[#FFFBEB] border-[3.5px] border-art-charcoal text-art-charcoal text-left animate-fade-in font-sans shadow-[5px_5px_0px_#2B2D42] relative select-none animate-fade-in">
            {/* Corners accents */}
            <div className="absolute top-2 left-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute top-2 right-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute bottom-2 left-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />
            <div className="absolute bottom-2 right-2 w-1.2 h-1.2 rounded-full bg-art-charcoal/20" />

            <h4 className="text-base font-black text-art-charcoal pb-2 border-b border-art-charcoal/25 flex items-center gap-1.5 text-art-red">
              <Sparkles className="w-4 h-4 text-art-red animate-bounce" />
              赛博大屎馆 《开馆运营主创官方通告 V1.01》 ：
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-art-charcoal/80 mt-3.5 leading-relaxed">
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-red block mb-1">🥗 1. 跨时间膳食打卡 (最新升级)：</strong>
                <p>
                  录入打卡多餐或憋附历程。支持输入早中晚膳食。憋气发酵时，先前的食物将沉淀为大屎底部的 “古老沉积物”，并与当日释出的最新食材形成多层时空断层，直接体现在创作媒介分析与主厨札记中！
                </p>
              </div>
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-blue block mb-1">⚡ 2. 蓄力指针压力锁：</strong>
                <p>
                  按压“先憋着”启动生理发酵进程。蓄力发酵天数越多（最高第10天），大肠胃合成物理压力极速飙升，作品体积与重力曲线层层暴涨，可触发古董铜、化石、甚至傲世UR级纯黄金箔等传奇纹理！
                </p>
              </div>
              <div className="p-3.5 bg-white border-[2px] border-art-charcoal rounded-xl shadow-[2px_2px_0px_#2B2D42]">
                <strong className="text-art-green block mb-1">🎟️ 3. 卢浮宫流水线法式上盘：</strong>
                <p>
                  拉动红色上膛拉阀，红油、抹茶及百种风味组合将在流体力学解构下旋转喷射，由巴黎高级镊子点缀带有露珠的法国薄荷叶，敲击清脆盖罩铃，庄严呈现高级艺术收藏品。
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
        <section id="grand_museum_showcase_gallery" className="pt-2 flex flex-col space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-mono tracking-widest text-[#FFF] opacity-50 uppercase font-black">
                MASTERPIECE CAROUSEL EXHIBITS (古典展位)
              </span>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-zinc-500 font-bold">
                <Info className="w-3.5 h-3.5 text-zinc-650" />
                <span>{selectedDateKey ? `已应用日历筛选：${selectedDateKey}的展品` : "左右箭头或滑动手势可阅览馆藏珍品"}</span>
              </div>
            </div>
            
            <MuseumGallery
              exhibits={filteredExhibits}
              onDeleteExhibit={handleDeleteExhibit}
              onSelectShare={setActiveShareArt}
              activeIndex={galleryActiveIndex}
              onActiveIndexChange={setGalleryActiveIndex}
            />
          </div>

          {/* CHRONOLOGICAL CALENDAR FILTER INTERACTION BED */}
          <div className="pt-2 border-t border-zinc-900">
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-mono tracking-widest text-[#FFF] opacity-50 uppercase font-black">
                EXHIBITION TIMELINE CHRONICLES (主厨创作年鉴日历)
              </span>
            </div>
            <PoopCalendar
              exhibits={exhibits}
              selectedDateKey={selectedDateKey}
              onSelectDateKey={setSelectedDateKey}
              onSelectExhibitId={handleSelectExhibitIdFromCalendar}
            />
          </div>
        </section>

      </div>

      {/* FOOTER GRAPHICS - RETRO MINIMALIST NO INFRA TELEMETRY */}
      <footer id="museum_pedigree_footer" className="py-6 border-t-[3px] border-art-charcoal/30 bg-black/40 text-center font-sans mt-8">
        <p className="text-[10px] font-mono tracking-widest text-[#FFF] opacity-40 font-black uppercase">
          CYBER POOP MUSEUM © 2026 • PARIS ARTISAN EDITION
        </p>
        <p className="text-[9px] text-zinc-600 mt-1 font-serif italic mb-2">
          “You are what you eat... literally.”
        </p>
        <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
          创作者：QuQu鼠辈、AstoraGray
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
          guestComments={guestComments.filter(c => c.artId === activeShareArt.id)}
          onAddComment={(comment) => handleAddComment(activeShareArt.id, comment)}
        />
      )}

    </div>
  );
}

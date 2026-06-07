import React from "react";
import { MealInput } from "../types";
import { Coffee, Pizza, Utensils, Zap } from "lucide-react";
import { playTickSound, playSteamLeverSound } from "../utils/audio";

interface MealConsoleProps {
  meals: MealInput;
  onChangeMeals: (newMeals: MealInput) => void;
  holdingDays: number;
  onChangeHoldingDays: (days: number) => void;
  onTriggerSynthesize: () => void;
  heldMealsHistory: MealInput[];
}

export const MealConsole: React.FC<MealConsoleProps> = ({
  meals,
  onChangeMeals,
  holdingDays,
  onChangeHoldingDays,
  onTriggerSynthesize,
  heldMealsHistory,
}) => {
  
  // Quick field editor
  const handleFieldChange = (key: keyof MealInput, value: string) => {
    onChangeMeals({
      ...meals,
      [key]: value,
    });
  };

  // Holding incrementor with robust limits
  const incrementHolding = () => {
    if (holdingDays < 10) {
      onChangeHoldingDays(holdingDays + 1);
      playSteamLeverSound();
    } else {
      playTickSound();
    }
  };

  const decrementHolding = () => {
    if (holdingDays > 0) {
      onChangeHoldingDays(holdingDays - 1);
      playTickSound();
    }
  };

  // Decide level of intestinal alarm indicators
  const getPressureConfig = (days: number) => {
    if (days >= 7) {
      return {
        title: "DANGER! EXPLOSIVE LOAD (过载蓄力)",
        desc: "机身红爆过载！释出之物必为传世杰作 (UR级 皇家金箔材质)！",
        textColor: "text-[#FF6B6B] font-black animate-pulse",
      };
    } else if (days >= 3) {
      return {
        title: "WARNING: HIGH COMPRESSION (蓄力压强高)",
        desc: "蓄力充分。释放可获得先锋或史诗级艺术晶体 (SR级 深邃材质)。",
        textColor: "text-amber-600 font-bold",
      };
    } else {
      return {
        title: "STABLE METABOLISM (常规新陈代谢)",
        desc: "常规打卡状态。即刻释出常规经典软雪糕花体展品 (N ~ R级 经典白大理石)。",
        textColor: "text-[#2B2D42]/60 font-semibold",
      };
    }
  };

  const pressure = getPressureConfig(holdingDays);

  return (
    <div 
      id="meal_and_pressure_console" 
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FFFBEB] border-[4px] md:border-[6px] border-art-charcoal p-6 md:p-8 rounded-3xl shadow-[6px_6px_0px_#2B2D42] text-art-charcoal font-sans transition-all"
    >
      
      {/* 1. Meal Input card panel (Breakfast, Lunch, Dinner details - left 7 columns) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        <div className="text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B2D42] opacity-60">
            DAILY DIETARY JOURNAL
          </span>
          <h3 className="text-xl font-black text-art-charcoal flex items-center gap-1.5 mt-1 leading-none uppercase">
            1. 每日御膳投喂打卡
          </h3>
          <p className="text-xs text-art-charcoal/70 mt-1.5 font-medium">
            您吃什么，你就拉什么。请录入具体餐点，留空代表空腹饥饿。
          </p>
        </div>

        {/* Input grid */}
        <div className="space-y-4 mt-4">
          
          {/* Breakfast Input Card */}
          <div className="relative bg-white border-[3px] border-art-charcoal rounded-2xl p-4 shadow-[4px_4px_0px_#2B2D42] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#2B2D42] transition-all duration-150">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-art-red flex items-center gap-1.5 uppercase tracking-wide">
                <Coffee className="w-4 h-4" /> 早膳 breakfast
              </span>
              {!meals.breakfast && <span className="text-[10px] uppercase font-bold text-gray-300 italic">空腹 Empty</span>}
            </div>
            <input
              type="text"
              value={meals.breakfast}
              onChange={(e) => handleFieldChange("breakfast", e.target.value)}
              placeholder="例如：冰美式 + 可颂面包"
              className="w-full bg-transparent focus:outline-none text-base font-bold text-art-charcoal placeholder-zinc-350"
            />
          </div>

          {/* Lunch Input Card */}
          <div className="relative bg-white border-[3px] border-art-charcoal rounded-2xl p-4 shadow-[4px_4px_0px_#2B2D42] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#2B2D42] transition-all duration-150">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-art-blue flex items-center gap-1.5 uppercase tracking-wide">
                <Pizza className="w-4 h-4" /> 午膳 lunch
              </span>
              {!meals.lunch && <span className="text-[10px] uppercase font-bold text-gray-300 italic">空腹 Empty</span>}
            </div>
            <input
              type="text"
              value={meals.lunch}
              onChange={(e) => handleFieldChange("lunch", e.target.value)}
              placeholder="例如：重辣九宫格火锅 / 螺蛳粉"
              className="w-full bg-transparent focus:outline-none text-base font-bold text-art-charcoal placeholder-zinc-350"
            />
          </div>

          {/* Dinner Input Card */}
          <div className="relative bg-white border-[3px] border-art-charcoal rounded-2xl p-4 shadow-[4px_4px_0px_#2B2D42] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#2B2D42] transition-all duration-150">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-art-green flex items-center gap-1.5 uppercase tracking-wide">
                <Utensils className="w-4 h-4" /> 晚膳 dinner
              </span>
              {!meals.dinner && <span className="text-[10px] uppercase font-bold text-gray-300 italic">空腹 Empty</span>}
            </div>
            <input
              type="text"
              value={meals.dinner}
              onChange={(e) => handleFieldChange("dinner", e.target.value)}
              placeholder="例如：养生蔬菜沙拉 / 墨鱼生吐司"
              className="w-full bg-transparent focus:outline-none text-base font-bold text-art-charcoal placeholder-zinc-350"
            />
          </div>

        </div>

        {/* Clear shortcut */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => {
              onChangeMeals({ breakfast: "", lunch: "", dinner: "" });
              playTickSound();
            }}
            className="text-xs font-black text-art-charcoal underline decoration-2 decoration-art-red/40 hover:text-art-red transition-all"
          >
            CLEAR INGESTION (清空当前投喂)
          </button>
        </div>
      </div>

      {/* 2. Intestinal Holding Pressure Gauge indicator dials (right 5 columns) */}
      <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l-[3px] border-art-charcoal/30 pt-6 lg:pt-0 lg:pl-6 text-center">
        
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B2D42] opacity-60">
            PRESSURE GAUGE CONTROL
          </span>
          <h3 className="text-xl font-black text-art-charcoal mt-1 uppercase leading-none">
            2. 胃部蓄力决策系统
          </h3>
        </div>

        {/* Dynamic Horizontal Color progress bar in accordance with the mock theme */}
        <div className="relative flex flex-col items-stretch justify-center my-6 select-none px-2">
          <div className="text-xs font-black text-[#2B2D42] mb-3.5 uppercase tracking-wide">
            Cyber Synthesis Pressure
          </div>
          
          {/* Flat stylized bar */}
          <div className="h-7 w-full bg-[#E9ECEF] border-[3px] border-art-charcoal rounded-full overflow-hidden p-0.5 relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.max(10, Math.min(100, (holdingDays / 10) * 100))}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs font-black text-[#2B2D42] mt-2 tracking-tight">
            <span>EMPTY (空舒)</span>
            <span className="text-[13px] text-zinc-100 font-extrabold bg-art-charcoal px-2 py-0.5 rounded-md">
              {holdingDays} 天蓄发
            </span>
            <span className="text-red-600 animate-pulse font-extrabold">OVERLOAD!</span>
          </div>
        </div>

        {/* Description indicator feedback alert */}
        <div className="p-4 rounded-2xl bg-white border-[3px] border-art-charcoal text-left shadow-[4px_4px_0px_#2B2D42] transition-all">
          <span className={`block text-[10px] font-black uppercase tracking-wider mb-1 ${pressure.textColor}`}>
            {pressure.title}
          </span>
          <p className="text-xs leading-relaxed text-art-charcoal/80 font-bold">
            {pressure.desc}
          </p>

          {/* Chronological list of previously held foods */}
          {heldMealsHistory.length > 0 && (
            <div className="border-t border-art-charcoal/15 pt-3 mt-3 font-sans">
              <span className="text-[9.5px] font-black tracking-wider uppercase text-art-charcoal/50 block mb-2">
                🧬 蓄积已发酵媒介 ({heldMealsHistory.length} 日前膳食)
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-bold">
                {heldMealsHistory.map((m, idx) => {
                  const dayFoods = [m.breakfast, m.lunch, m.dinner].filter(Boolean);
                  const displayFoods = dayFoods.join(" + ") || "空腹发酵";
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between px-2 py-1 bg-[#FFF9E6]/40 border border-art-charcoal/20 rounded-lg"
                    >
                      <span className="text-art-red font-mono text-[9px] uppercase tracking-wider">Day {idx + 1} HELD</span>
                      <span className="font-serif italic text-art-charcoal font-black truncate max-w-[150px] text-right" title={displayFoods}>
                        {displayFoods}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Decision buttons triggers holds and releases with flat shadow offsets */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          
          {/* HOLD button */}
          <button
            onClick={incrementHolding}
            className="flex items-center justify-center space-x-1 py-4 bg-art-yellow border-[3px] border-art-charcoal rounded-2xl font-black text-art-charcoal shadow-[4px_4px_0px_#2B2D42] hover:bg-[#ffe05c] active:translate-y-1 active:shadow-none transition-all cursor-pointer h-14"
          >
            <Zap className="w-4 h-4 text-[#2B2D42]" />
            <span className="tracking-tight uppercase">先憋着 HOLD</span>
          </button>
          
          {/* RELEASE release poop trigger */}
          <button
            onClick={onTriggerSynthesize}
            className="flex items-center justify-center space-x-1 py-4 bg-art-red border-[3px] border-art-charcoal rounded-2xl font-black text-white shadow-[4px_4px_0px_#2B2D42] hover:bg-[#ff8080] active:translate-y-1 active:shadow-none transition-all cursor-pointer h-14"
          >
            <span className="text-base leading-none">💩</span>
            <span className="tracking-tight uppercase">去释放 OUT!</span>
          </button>

        </div>

        {/* Quick controls decrement days */}
        {holdingDays > 0 && (
          <button
            onClick={decrementHolding}
            className="text-[10px] font-bold text-art-charcoal/60 hover:text-art-red underline decoration-1 mt-3 block"
          >
            REDUCE PRESSURE (减轻一天蓄力压强)
          </button>
        )}

      </div>

    </div>
  );
};

import React, { useState } from "react";
import { PoopArt } from "../types";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Info, Sparkles, Trash2 } from "lucide-react";
import { playTickSound, playDingSound } from "../utils/audio";

interface PoopCalendarProps {
  exhibits: PoopArt[];
  selectedDateKey: string | null; // "YYYY-MM-DD"
  onSelectDateKey: (dateKey: string | null) => void;
  onSelectExhibitId?: (id: string) => void;
}

export const PoopCalendar: React.FC<PoopCalendarProps> = ({
  exhibits,
  selectedDateKey,
  onSelectDateKey,
  onSelectExhibitId,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    playTickSound();
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    playTickSound();
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    playTickSound();
  };

  // Generate calendar grid dates
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells: { day: number; isCurrentMonth: boolean; dateKey: string }[] = [];

  // Padding from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthDays - i;
    const prevMonthVal = month === 0 ? 11 : month - 1;
    const prevYearVal = month === 0 ? year - 1 : year;
    const dateKey = `${prevYearVal}-${String(prevMonthVal + 1).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`;
    calendarCells.push({
      day: prevDay,
      isCurrentMonth: false,
      dateKey,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateKey,
    });
  }

  // Padding for next month to complete standard weeks grid (usually 35 or 42 cells)
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthVal = month === 11 ? 0 : month + 1;
    const nextYearVal = month === 11 ? year + 1 : year;
    const dateKey = `${nextYearVal}-${String(nextMonthVal + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateKey,
    });
  }

  // Week days row text
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // Group exhibits by their calendar date key ("YYYY-MM-DD")
  const getExhibitsOnDate = (dateKey: string) => {
    return exhibits.filter((ex) => {
      if (!ex.timestamp) return false;
      const d = new Date(ex.timestamp);
      // Ensure we extract local timezone date parts matching exact calendar YYYY-MM-DD
      const localY = d.getFullYear();
      const localM = String(d.getMonth() + 1).padStart(2, "0");
      const localD = String(d.getDate()).padStart(2, "0");
      return `${localY}-${localM}-${localD}` === dateKey;
    });
  };

  const handleCellClick = (dateKey: string, hasExhibits: boolean) => {
    if (!hasExhibits) {
      // Deselect or play negative feedback
      playTickSound();
      return;
    }
    
    if (selectedDateKey === dateKey) {
      // Toggle deselection
      onSelectDateKey(null);
      playDingSound();
    } else {
      onSelectDateKey(dateKey);
      playDingSound();
    }
  };

  // Count items across exhibits
  const exhibitsCountMap = exhibits.reduce((acc, ex) => {
    if (!ex.timestamp) return acc;
    const d = new Date(ex.timestamp);
    const localY = d.getFullYear();
    const localM = String(d.getMonth() + 1).padStart(2, "0");
    const localD = String(d.getDate()).padStart(2, "0");
    const key = `${localY}-${localM}-${localD}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeFormattedDate = selectedDateKey ? (() => {
    const parts = selectedDateKey.split("-");
    return `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`;
  })() : "";

  return (
    <div 
      id="poop_exhibit_calendar" 
      className="p-4 bg-[#141414] border border-zinc-800 rounded-3xl text-zinc-100 flex flex-col md:flex-row gap-6 relative select-none shadow-xl transition-all"
    >
      {/* Calendar Grid Section */}
      <div className="w-full md:w-2/3 flex flex-col">
        {/* Calendar Nav Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-art-yellow" />
            <h3 className="text-sm font-black tracking-wide text-zinc-200">
              {year}年 {month + 1}月
            </h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleToday}
              className="px-2 py-1 text-[10px] font-bold bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="跳转回今天"
            >
              今天
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="上个月"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="下个月"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {weekDays.map((wd, idx) => (
            <span 
              key={idx} 
              className={`text-[10px] font-black uppercase tracking-wider py-1 font-mono ${
                idx === 0 || idx === 6 ? "text-art-red/70" : "text-zinc-500"
              }`}
            >
              {wd}
            </span>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            const dayExhibits = getExhibitsOnDate(cell.dateKey);
            const hasExhibits = dayExhibits.length > 0;
            const isSelected = selectedDateKey === cell.dateKey;
            
            // Check if this cell is today
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === cell.day && cell.isCurrentMonth;

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(cell.dateKey, hasExhibits)}
                disabled={false} // Always clickable to explore, but styled appropriately
                className={`min-h-[50px] relative rounded-xl border p-1 transition-all flex flex-col justify-between text-left cursor-pointer ${
                  cell.isCurrentMonth ? "text-zinc-100" : "text-zinc-600 border-transparent bg-transparent opacity-30 pointer-events-none"
                } ${
                  isSelected 
                    ? "bg-art-yellow/20 border-art-yellow shadow-[0_0_12px_rgba(234,179,8,0.25)] ring-1 ring-art-yellow" 
                    : hasExhibits
                      ? "bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-850"
                      : "bg-[#18181b]/35 border-[#27272a]/20 hover:border-zinc-800"
                } ${isToday && !isSelected ? "ring-1 ring-zinc-500/50" : ""}`}
              >
                {/* Date Number and Today Marker */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10.5px] font-black font-mono ${
                    isToday ? "bg-art-red px-1.5 py-0.2 rounded-full text-white text-[9.5px]" : ""
                  }`}>
                    {cell.day}
                  </span>
                  {hasExhibits && (
                    <span className="text-[8.5px] font-black text-art-yellow bg-zinc-800/85 px-1 rounded border border-zinc-700">
                      x{dayExhibits.length}
                    </span>
                  )}
                </div>

                {/* Multiple Poop Exhibits Indicators */}
                <div className="flex flex-wrap gap-1 mt-1 justify-start overflow-hidden h-3">
                  {dayExhibits.map((item, artIdx) => {
                    const isUr = item.rarity === "UR";
                    const isSr = item.rarity === "SR";
                    return (
                      <span
                        key={artIdx}
                        className={`w-2 h-2 rounded-full inline-block ${
                          isUr ? "animate-bounce" : ""
                        }`}
                        style={{
                          backgroundColor: item.colorHex || "#78350F",
                          border: isUr ? "1px solid #F59E0B" : "1px solid rgba(255,255,255,0.15)",
                          boxShadow: isUr || isSr ? `0 0 6px ${item.colorHex}` : "none"
                        }}
                        title={`${item.title} (${item.rarity})`}
                      />
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Panel explaining the current filtering */}
      <div className="w-full md:w-1/3 p-4 rounded-2xl bg-[#1B1B1B] border border-zinc-800 flex flex-col justify-between text-left text-xs leading-relaxed">
        <div>
          <h4 className="font-bold text-zinc-300 flex items-center gap-1.5 mb-2.5 pb-2 border-b border-zinc-800">
            <Filter className="w-3.5 h-3.5 text-art-yellow" />
            <span>馆藏时空日记</span>
          </h4>
          
          {selectedDateKey ? (
            <div className="space-y-3">
              <p className="text-[11px] text-zinc-400">
                您正在阅读 <strong className="text-art-yellow">{activeFormattedDate}</strong> 释出的馆藏珍品：
              </p>
              
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {exhibits.filter(ex => {
                  const d = new Date(ex.timestamp);
                  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  return key === selectedDateKey;
                }).map((match, mIdx) => (
                  <div 
                    key={match.id} 
                    onClick={() => {
                      if (onSelectExhibitId) {
                        onSelectExhibitId(match.id);
                      }
                    }}
                    role="button"
                    title="点击在主展窗展台查看此件艺术珍品"
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-art-yellow hover:bg-zinc-850 flex items-center justify-between text-[11px] cursor-pointer transition-all active:scale-95 group"
                  >
                    <div className="truncate flex-1 pr-1.5 text-left">
                      <span className="font-serif italic text-zinc-200 font-bold block truncate group-hover:text-art-yellow transition-colors">{match.title}</span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase font-black">{match.rarity} · 蓄力 {match.holdingDays} 天</span>
                    </div>
                    {/* Click indicator & poop representation */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="text-[10px] text-art-yellow font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        点击查看 🔍
                      </span>
                      <span className="text-base select-none">💩</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onSelectDateKey(null);
                  playTickSound();
                }}
                className="w-full py-1.5 text-center font-bold text-xs bg-art-red/25 border border-art-red/40 hover:bg-art-red/45 text-art-red rounded-xl transition-all cursor-pointer"
              >
                ✕ 清除筛选 (显示全部馆藏)
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-zinc-400">
              <p>
                赛博历程已记录于日历之中。请点击包含 <span className="text-art-yellow font-black">💩 标记或彩色圆点</span> 的具体日期，对展示橱窗进行日期降维筛选。
              </p>
              <div className="p-2 rounded bg-[#101010] border border-zinc-850 font-mono text-[10px] leading-tight space-y-1 text-zinc-500">
                <div className="flex justify-between">
                  <span>总计创作记录：</span>
                  <span className="text-zinc-300 font-bold">{exhibits.length} 次</span>
                </div>
                <div className="flex justify-between">
                  <span>活跃创作天数：</span>
                  <span className="text-zinc-300 font-bold">
                    {Object.keys(exhibitsCountMap).length} 天
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 text-[10.5px] text-zinc-500 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-650 shrink-0 mt-0.5" />
          <span>支持多日打卡！每当您录入膳食并上盘，该日历节点就会记录您在宏大叙事中的神圣流质遗迹。一个日期可对应多个相互重叠的巨制。</span>
        </div>
      </div>
    </div>
  );
};

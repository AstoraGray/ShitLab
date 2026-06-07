import React, { useState } from "react";
import { PoopArt, GuestComment } from "../types";
import { PoopRenderer } from "./PoopRenderer";
import { Award, Share2, Clipboard, Heart, Send, Sparkles, Coffee, ExternalLink } from "lucide-react";
import { playDingSound, playTickSound } from "../utils/audio";

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

  const handleCopyLink = () => {
    const mockURL = `${window.location.origin}/?visit=${art.artist}&artId=${art.id}`;
    navigator.clipboard.writeText(mockURL);
    setCopied(true);
    playDingSound();
    setTimeout(() => setCopied(false), 2000);
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
    <div id="social_poster_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm overflow-y-auto">
      
      {/* Main Overlay dialog - cream box styled in the Duolingo physical thick line visual mode */}
      <div className="relative w-full max-w-4xl bg-[#FFFBEB] border-[4px] md:border-[6px] border-art-charcoal rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#2B2D42] overflow-hidden flex flex-col md:flex-row gap-8 text-art-charcoal animate-fade-in my-8">
        
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

          {/* Postcard Body container styled with luxury ivory cardboard */}
          <div 
            id="gourmet_printable_postcard" 
            className="w-full aspect-[4/5] bg-[#E4E3E0] border-[4px] border-art-charcoal rounded-2xl shadow-[5px_5px_0px_#2B2D42] flex flex-col p-5 relative select-none text-zinc-900 before:absolute before:inset-0.5 before:border before:border-zinc-400/30 before:pointer-events-none transition-all"
          >
            {/* Screws on corner stamps */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-art-charcoal/20 rounded-full" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-art-charcoal/20 rounded-full" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-art-charcoal/20 rounded-full" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-art-charcoal/20 rounded-full" />

            {/* Vintage Postcard Dividers postage spot */}
            <div className="absolute top-4 right-4 w-12 h-14 border-[1.5px] border-dashed border-zinc-500 bg-[#E4E3E0] flex flex-col items-center justify-center text-[7px] font-mono text-zinc-500 leading-tight">
              <span>POST</span>
              <span>CARD</span>
              <span>STAMP</span>
            </div>

            {/* Gold Museum seal stamp */}
            <div className="absolute bottom-16 right-6 w-14 h-14 rounded-full border border-double border-art-red/30 flex items-center justify-center text-center rotate-12 pointer-events-none opacity-80 select-none text-art-red text-art-red">
              <div className="text-[6.5px] font-black leading-none uppercase">
                <strong>CYBER POOP</strong>
                <br />
                MUSEUM
                <br />
                ★ PARIS ★
              </div>
            </div>

            {/* Vintage Aged Duration Stamp */}
            {art.holdingDays > 0 && (
              <div className="absolute top-4 left-4 bg-[#FFF0F2] text-art-red border-[1.5px] border-dashed border-art-red px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-black rotate-[-8deg] shadow-[1px_1px_0px_#B22222]/30 uppercase">
                ★ AGED {art.holdingDays} DAYS ★
              </div>
            )}

            {/* Main Title Head */}
            <div className="border-b border-zinc-400/40 pb-2 mb-4 pr-16 text-left">
              <h4 className="text-base font-serif italic text-[#141414] font-black tracking-tight leading-snug">
                {art.title}
              </h4>
              <span className="text-[9px] font-mono text-zinc-550 uppercase block tracking-wider font-bold">
                Artist: {art.artist}
              </span>
            </div>

            {/* Fecal rendering centerpiece */}
            <div className="flex-1 flex items-center justify-center relative my-[-10px] drop-shadow-md">
              <PoopRenderer art={art} interactive={false} className="transform scale-[0.85]" />
              {/* Artistic caption of medium */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/5 px-2.5 py-0.5 rounded text-[8.5px] font-bold text-zinc-700 uppercase tracking-wide max-w-full truncate border border-black/5">
                Medium: {art.ingredientsAnalyzed.slice(0, 3).join(", ") || "Metabolic Blend"}
              </div>
            </div>

            {/* Bottom Critique and Decors */}
            <div className="mt-auto border-t border-zinc-400/40 pt-3 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">策展人札记 Curator Notes</span>
                  <p className="text-[10px] font-serif leading-relaxed italic text-zinc-800 font-medium line-clamp-4 mt-1 bg-black/5 p-1.5 rounded">
                    “{art.curatorComment}”
                  </p>
                </div>
                {/* Visual grid layout representing writing side */}
                <div className="border-l border-zinc-400/30 pl-3 flex flex-col justify-end">
                  <div className="w-full border-b border-zinc-400/30 h-4" />
                  <div className="w-full border-b border-zinc-400/30 h-4" />
                  <span className="text-[8px] font-bold text-zinc-500 mt-1.5 self-end uppercase font-mono">
                    Grade: {art.rarity} LEVEL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social share actions designed robustly in the Duolingo physical thick line button mode */}
          <div className="flex items-center space-x-3 w-full mt-6">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-art-yellow border-[3px] border-art-charcoal font-black text-xs text-art-charcoal shadow-[4px_4px_0px_#2B2D42] hover:bg-[#ffe05c] active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider cursor-pointer"
            >
              <Clipboard className="w-4 h-4 text-art-charcoal" />
              <span>{copied ? "链接已复制！" : "复制参观海报链接"}</span>
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="p-3 rounded-xl bg-white border-[3px] border-art-charcoal text-art-charcoal hover:bg-zinc-100 shadow-[3px_3px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none transition-all uppercase cursor-pointer"
              title="打印明信片"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
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
          className="absolute top-4 right-4 bg-white border-[3px] border-art-charcoal text-art-charcoal hover:bg-art-red hover:text-white font-extrabold text-xs w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#2B2D42] active:translate-y-0.5 active:shadow-none transition-all"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

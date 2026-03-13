
import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
 
interface Props {
    username: string;
    roomId: string;
    onLeave: () => void;
}
 
export default function ChatScreen({ username, roomId, onLeave }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
 
  const { messages, usersInRoom, connected, sendMessage, leaveRoom } = useChat({
    username,
    roomId,
    onRoomDeleted: onLeave,
  });
 
  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };
 
  const handleLeave = () => {
    leaveRoom();
    onLeave();
  };
 
  return (
        <div className="min-h-screen bg-[#080810] flex flex-col">
            {/* Header */}
            <header className="border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
                <button
                onClick={handleLeave}
                className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
                >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                </button>
        
                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-violet-400 font-bold">#</span>
                    <span className="text-white font-semibold text-sm truncate">{roomId}</span>
                </div>
                <p className="text-white/30 text-xs">
                    {usersInRoom.length} {usersInRoom.length === 1 ? "persona" : "personas"}
                </p>
                </div>
        
                {/* Connection indicator */}
                <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`} />
                <span className="text-white/30 text-xs">{connected ? "Conectado" : "Reconectando..."}</span>
                </div>
        
                {/* Users pill */}
                <div className="flex -space-x-1">
                {usersInRoom.slice(0, 4).map((u, i) => (
                    <div
                    key={i}
                    title={u}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-[#080810] flex items-center justify-center"
                    >
                    <span className="text-white text-[9px] font-bold">{u[0]?.toUpperCase()}</span>
                    </div>
                ))}
                </div>
            </header>
        
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <p className="text-white/20 text-sm">Sé el primero en escribir algo ✨</p>
                </div>
                )}
        
                {messages.map((msg, i) => {
                const isSystem = msg.username === "Sistema";
                const isOwn = msg.username === username;
                const prevMsg = messages[i - 1];
                const isSameAuthor = prevMsg && prevMsg.username === msg.username;
        
                if (isSystem) {
                    return (
                    <div key={i} className="flex justify-center py-1">
                        <span className="text-white/20 text-xs bg-white/[0.03] rounded-full px-3 py-1">
                        {msg.message}
                        </span>
                    </div>
                    );
                }
        
                return (
                    <div
                    key={i}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} ${isSameAuthor ? "mt-0.5" : "mt-3"}`}
                    >
                    <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        {!isSameAuthor && !isOwn && (
                        <span className="text-white/30 text-xs px-1">{msg.username}</span>
                        )}
                        <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                            ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-sm"
                            : "bg-white/[0.06] text-white/90 rounded-bl-sm"
                        }`}
                        >
                        {msg.message}
                        </div>
                    </div>
                    </div>
                );
                })}
                <div ref={bottomRef} />
            </div>
        
            {/* Input */}
            <div className="border-t border-white/[0.06] p-4">
                <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-violet-500/40 transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Mensaje en #${roomId}...`}
                        className="flex-1 bg-transparent text-white placeholder-white/20 text-sm outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || !connected}
                        className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
 
interface Props {
    onClose: () => void;
    onCreate: (roomId: string) => Promise<void>;
    loading: boolean;
}
 
export default function CreateRoomModal({ onClose, onCreate, loading }: Props) {
    const [roomName, setRoomName] = useState("");
    
    const handleCreate = async () => {
        if (!roomName.trim()) return;
        await onCreate(roomName.trim());
    };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Telón de fondo */}
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />
 
      {/* Modal */}
        <div className="relative w-full max-w-sm bg-[#0f0f1a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Nueva Sala</h2>
                <button
                    onClick={onClose}
                    className="text-white/30 hover:text-white/70 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
 
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                        Nombre de la sala
                    </label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        placeholder="ej: general, random..."
                        maxLength={30}
                        autoFocus
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/60 transition-all duration-200"
                    />
                </div>
 
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium rounded-xl py-3 text-sm transition-all duration-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleCreate}
                        disabled={loading || roomName.trim().length === 0}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200"
                    >

                        {loading ? "Creando..." : "Crear sala"}

                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
 
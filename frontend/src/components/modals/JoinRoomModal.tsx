interface Props {
    roomId: string;
    userCount: number;
    onClose: () => void;
    onJoin: () => Promise<void>;
    loading: boolean;
}
 
export default function JoinRoomModal({ roomId, userCount, onClose, onJoin, loading }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />
    
        {/* Modal */}
        <div className="relative w-full max-w-sm bg-[#0f0f1a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
            {/* Room icon */}
            <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
                </svg>
            </div>
            </div>
    
            <h2 className="text-lg font-bold text-white text-center mb-1">
            #{roomId}
            </h2>
            <p className="text-white/30 text-sm text-center mb-6">
            {userCount} {userCount === 1 ? "usuario" : "usuarios"} conectado{userCount !== 1 ? "s" : ""}
            </p>
    
            <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium rounded-xl py-3 text-sm transition-all duration-200"
            >
                Cancelar
            </button>
            <button
                onClick={onJoin}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
                {loading ? "Uniéndose..." : "Unirse"}
            </button>
            </div>
        </div>
        </div>
    );
}

import { useState } from "react";

interface Props {
    onConfirm: (username: string) => void;
}

export default function UsernameScreen({ onConfirm }: Props){
    const [name, setName] = useState("");
 
    const handleSubmit = () => {
        if (name.trim().length === 0) return;
        onConfirm(name.trim());
    };

    return (
        <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4" >

            <div className="relative w-full max-w-sm">
                {/* Logo / Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2x1 bg-linear-to-b from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border  border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-white text-center mb-1 tracking-tight"> Bienvenido</h1>
                    
                    <p className="text-white/40 text-sm text-center mb-8">¿Cóco te llamas?</p>

                    <div className="space-y-4">
                        <input type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Tu nombre de usuario" 
                            maxLength={20}
                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={name.trim().length === 0}
                            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Continuar 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
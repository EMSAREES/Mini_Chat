import { useEffect, useState } from "react";
import { useRooms } from "../hooks/useRooms";
import { getSocket, connectSocket } from "../lib/socket";
import type { Room } from "../types";
import CreateRoomModal from "./modals/CreateRoomModal";
import JoinRoomModal from "./modals/JoinRoomModal";

interface Props {
    username: string;
    onEnterRoom: (roomId: string) => void;
    onLogout: () => void;
}

function toRoomArray(record: Record<string, string[]>): Room[] {
    return Object.entries(record).map(([id, users]) => ({ id, users }));
}

export default function RoomsScreen({ username, onEnterRoom, onLogout }: Props) {
    const { rooms, loading, fetchRooms, createRoom, joinRoom, setRooms } = useRooms();
    const [showCreate, setShowCreate] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        // 1. Carga HTTP inicial para tener datos inmediatos
        fetchRooms();

        // 2. Conectar socket (si ya estaba conectado no hace nada)
        connectSocket();
        const socket = getSocket();

        const handleRoomsUpdated = (data: Record<string, string[]>) => {
            setRooms(toRoomArray(data));
        };

        const handleRoomDeleted = () => {
            // roomDeleted también viene con roomsUpdated, pero por si acaso
            fetchRooms();
        };

        socket.on("roomsUpdated", handleRoomsUpdated);
        socket.on("roomDeleted", handleRoomDeleted);

        return () => {
            socket.off("roomsUpdated", handleRoomsUpdated);
            socket.off("roomDeleted", handleRoomDeleted);
        };
    }, [fetchRooms, setRooms]);

    const handleCreate = async (roomId: string) => {
        setActionLoading(true);
        const ok = await createRoom(roomId, username);
        setActionLoading(false);
        if (ok) {
            setShowCreate(false);
            onEnterRoom(roomId);
        }
    };

    const handleJoin = async () => {
        if (!selectedRoom) return;
        setActionLoading(true);
        const ok = await joinRoom(selectedRoom.id, username);
        setActionLoading(false);
        if (ok) {
            setSelectedRoom(null);
            onEnterRoom(selectedRoom.id);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#080810] flex flex-col">
                <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                        <span className="text-white/80 text-sm font-medium">Chat App</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                            <span className="text-white/70 text-xs font-medium">{username}</span>
                        </div>

                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-full px-4 py-1.5 transition-all duration-200 shadow-md shadow-violet-500/20 hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear sala
                        </button>

                        <button onClick={onLogout} className="text-white/30 hover:text-red-400 text-xs font-medium transition-colors px-2 py-1.5">
                            Salir
                        </button>
                    </div>
                </header>

                <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
                    <div className="mb-6">
                        <h1 className="text-white text-xl font-bold mb-1">Salas disponibles</h1>
                        <p className="text-white/30 text-sm">Elige una sala para unirte</p>
                    </div>

                    {loading && rooms.length === 0 ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-white/[0.03] rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <p className="text-white/30 text-sm">No hay salas activas</p>
                            <p className="text-white/15 text-xs mt-1">Crea la primera sala para comenzar</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl p-4 text-left transition-all duration-200 group hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-200">
                                                <span className="text-violet-400 text-sm font-bold">#</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{room.id}</p>
                                                <p className="text-white/30 text-xs mt-0.5">
                                                    {room.users.length} {room.users.length === 1 ? "persona" : "personas"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1">
                                                {room.users.slice(0, 3).map((u, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-[#080810] flex items-center justify-center">
                                                        <span className="text-white text-[8px] font-bold">{u[0]?.toUpperCase()}</span>
                                                    </div>
                                                ))}
                                                {room.users.length > 3 && (
                                                    <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#080810] flex items-center justify-center">
                                                        <span className="text-white/50 text-[8px]">+{room.users.length - 3}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <svg className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {showCreate && (
                <CreateRoomModal onClose={() => setShowCreate(false)} onCreate={handleCreate} loading={actionLoading} />
            )}
            {selectedRoom && (
                <JoinRoomModal
                    roomId={selectedRoom.id}
                    userCount={selectedRoom.users.length}
                    onClose={() => setSelectedRoom(null)}
                    onJoin={handleJoin}
                    loading={actionLoading}
                />
            )}
        </>
    );
}
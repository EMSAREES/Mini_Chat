// Encapsula toda la lógica de salas: listar, crear, unirse.
// Los componentes solo llaman funciones y leen estado — sin fetch directo.

import { useState, useCallback } from "react";
import { roomsApi } from "../api/rooms.api";
import { ApiError } from "../api/client";
import type { Room } from "../types";

// Convierte el Record<string, string[]> del backend a un array de Room
function toRoomArray(record: Record<string, string[]>): Room[] {
    return Object.entries(record).map(([id, users]) => ({ id, users }));
}

export function useRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    // ─── Obtener todas las salas ──────────────────────────────────────────────
    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await roomsApi.getAll();
        setRooms(toRoomArray(res.allRoom));
        } catch (err) {
        setError(err instanceof ApiError ? err.message : "Error al cargar salas");
        } finally {
        setLoading(false);
        }
    }, []);

    // ─── Crear sala ───────────────────────────────────────────────────────────
    const createRoom = useCallback(async (roomId: string, username: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
        await roomsApi.create({ roomId, username });
        await fetchRooms(); // Refrescar lista después de crear
        return true;
        } catch (err) {
        setError(err instanceof ApiError ? err.message : "Error al crear la sala");
        return false;
        } finally {
        setLoading(false);
        }
    }, [fetchRooms]);

    // ─── Unirse a sala (HTTP) ─────────────────────────────────────────────────
    const joinRoom = useCallback(async (roomId: string, username: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
        await roomsApi.join({ roomId, username });
        return true;
        } catch (err) {
        setError(err instanceof ApiError ? err.message : "Error al unirse a la sala");
        return false;
        } finally {
        setLoading(false);
        }
    }, []);

    return {
        rooms,
        setRooms,   // ← expuesto para que RoomsScreen lo actualice vía socket
        loading,
        error,
        clearError,
        fetchRooms,
        createRoom,
        joinRoom,
    };
}
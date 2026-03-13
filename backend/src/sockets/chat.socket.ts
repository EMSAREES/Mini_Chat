import { Server, Socket } from "socket.io";
import { joinRoom, removeRoom, getAllRooms } from "../services/room.service";
import { removeUserFromRoom } from "../models/room.model";

const connectedUsers = new Map<string, { username: string; roomId: string }>();

export const chatSocket = (io: Server, socket: Socket) => {

    console.log("Cliente conectado:", socket.id);

    // ─── 1. UNIRSE A UNA SALA ─────────────────────────────────────────────────
    socket.on("joinRoom", ({ roomId, username }: { roomId: string; username: string }) => {
        try {
            joinRoom(roomId, username);
            connectedUsers.set(socket.id, { username, roomId });
            socket.join(roomId);

            io.to(roomId).emit("userJoined", {
                username,
                message: `${username} se unió a la sala`,
                users: getAllRooms()[roomId] ?? []
            });

            // ── Tiempo real: notificar a todos la lista actualizada ──
            io.emit("roomsUpdated", getAllRooms());

            console.log(`${username} se unió a la sala: ${roomId}`);
        } catch (error: any) {
            socket.emit("error", { message: error.message || "Error al unirse a la sala" });
        }
    });

    // ─── 2. ENVIAR MENSAJE ────────────────────────────────────────────────────
    socket.on("message", ({ roomId, message }: { roomId: string; message: string }) => {
        const user = connectedUsers.get(socket.id);
        if (!user) {
            socket.emit("error", { message: "No estás en ninguna sala" });
            return;
        }
        io.to(roomId).emit("message", {
            username: user.username,
            message,
            timestamp: new Date().toISOString()
        });
    });

    // ─── 3. SALIR MANUALMENTE ─────────────────────────────────────────────────
    socket.on("leaveRoom", () => {
        handleUserLeave(socket, io);
    });

    // ─── 4. DESCONEXIÓN ───────────────────────────────────────────────────────
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
        handleUserLeave(socket, io);
    });
};

function handleUserLeave(socket: Socket, io: Server) {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const { username, roomId } = user;

    removeUserFromRoom(roomId, username);
    const remainingUsers = getAllRooms()[roomId] ?? [];

    if (remainingUsers.length === 0) {
        try {
            removeRoom(roomId);
            console.log(`Sala "${roomId}" eliminada por quedarse vacía`);
            io.emit("roomDeleted", { roomId });
        } catch (_) {}
    } else {
        io.to(roomId).emit("userLeft", {
            username,
            message: `${username} salió de la sala`,
            users: remainingUsers
        });
    }

    // ── Tiempo real: notificar a todos la lista actualizada ──
    io.emit("roomsUpdated", getAllRooms());

    socket.leave(roomId);
    connectedUsers.delete(socket.id);

    console.log(`${username} salió de la sala: ${roomId}`);
}
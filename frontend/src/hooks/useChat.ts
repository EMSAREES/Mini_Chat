import { useState, useEffect, useCallback, useRef } from "react";
import { getSocket, connectSocket } from "../lib/socket";
import type { ChatMessage, SocketUserJoinedEvent, SocketUserLeftEvent } from "../types";

interface UseChatOptions {
    username: string;
    roomId: string;
    onRoomDeleted?: () => void;
}

export function useChat({ username, roomId, onRoomDeleted }: UseChatOptions) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
    // Inicializar con el estado real del socket, sin setState síncrono en el effect
    const [connected, setConnected] = useState(() => getSocket().connected);
    const joinedRef = useRef(false);

    useEffect(() => {
        const socket = getSocket();

        const handleConnect = () => {
            setConnected(true);
            if (!joinedRef.current) {
                joinedRef.current = true;
                socket.emit("joinRoom", { roomId, username });
            }
        };

        const handleUserJoined = (data: SocketUserJoinedEvent) => {
            setUsersInRoom(data.users);
            setMessages((prev) => [...prev, {
                username: "Sistema",
                message: data.message,
                timestamp: new Date().toISOString(),
            }]);
        };

        const handleMessage = (data: ChatMessage) => {
            setMessages((prev) => [...prev, data]);
        };

        const handleUserLeft = (data: SocketUserLeftEvent) => {
            setUsersInRoom(data.users);
            setMessages((prev) => [...prev, {
                username: "Sistema",
                message: data.message,
                timestamp: new Date().toISOString(),
            }]);
        };

        const handleRoomDeleted = ({ roomId: deletedId }: { roomId: string }) => {
            if (deletedId === roomId) onRoomDeleted?.();
        };

        const handleDisconnect = () => setConnected(false);

        socket.on("connect", handleConnect);
        socket.on("userJoined", handleUserJoined);
        socket.on("message", handleMessage);
        socket.on("userLeft", handleUserLeft);
        socket.on("roomDeleted", handleRoomDeleted);
        socket.on("disconnect", handleDisconnect);

        // Conectar si no lo está — si ya estaba conectado, emitir joinRoom desde aquí
        connectSocket();
            if (socket.connected && !joinedRef.current) {
            joinedRef.current = true;
            socket.emit("joinRoom", { roomId, username });
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("userJoined", handleUserJoined);
            socket.off("message", handleMessage);
            socket.off("userLeft", handleUserLeft);
            socket.off("roomDeleted", handleRoomDeleted);
            socket.off("disconnect", handleDisconnect);
        };
    }, [roomId, username, onRoomDeleted]);

    const sendMessage = useCallback((message: string) => {
        if (!message.trim()) return;
        getSocket().emit("message", { roomId, message });
    }, [roomId]);

    const leaveRoom = useCallback(() => {
        joinedRef.current = false;
        getSocket().emit("leaveRoom");
    }, []);

    return { messages, usersInRoom, connected, sendMessage, leaveRoom };
}
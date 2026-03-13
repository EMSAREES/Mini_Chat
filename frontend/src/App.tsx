import { useState, useEffect } from "react";
import type { AppView } from "./types";
import UsernameScreen from "./components/UsernameScreen";
import RoomsScreen from "./components/RoomsScreen";
import ChatScreen from "./components/ChatScreen";

// ─── Clave para localStorage ──────────────────────────────────────────────────
const SESSION_KEY = "chat_session";

interface Session {
  username: string;
  view: AppView;
  currentRoom: string | null;
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Inicializar desde localStorage si existe sesión guardada
  const saved = loadSession();

  const [view, setView] = useState<AppView>(saved?.view ?? "username");
  const [username, setUsername] = useState(saved?.username ?? "");
  const [currentRoom, setCurrentRoom] = useState<string | null>(saved?.currentRoom ?? null);

  // Guardar sesión cada vez que cambie el estado relevante
  useEffect(() => {
    if (username) {
      saveSession({ username, view, currentRoom });
    }
  }, [view, username, currentRoom]);

  const handleUsernameConfirm = (name: string) => {
    setUsername(name);
    setView("rooms");
  };

  const handleEnterRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    setView("chat");
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setView("rooms");
  };

  const handleLogout = () => {
    clearSession();
    setUsername("");
    setCurrentRoom(null);
    setView("username");
  };

  return (
    <>
      {view === "username" && (
        <UsernameScreen onConfirm={handleUsernameConfirm} />
      )}

      {view === "rooms" && (
        <RoomsScreen
          username={username}
          onEnterRoom={handleEnterRoom}
          onLogout={handleLogout}
        />
      )}

      {view === "chat" && currentRoom && (
        <ChatScreen
          username={username}
          roomId={currentRoom}
          onLeave={handleLeaveRoom}
        />
      )}
    </>
  );
}
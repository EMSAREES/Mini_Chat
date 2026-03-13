// Patrón startup: cada recurso tiene su propio módulo API.
// Los hooks consumen estas funciones — nunca hacen fetch directo.
 
import { apiClient } from "./client";
import type {
  AllRoomsResponse,
  CreateRoomPayload,
  CreateRoomResponse,
  JoinRoomPayload,
  JoinRoomResponse,
  DeleteRoomPayload,
} from "../types";

export const roomsApi = {
    // GET /api/rooms
    getAll: () =>
        apiClient.get<AllRoomsResponse>("/rooms"),
    
    // POST /api/rooms
    create: (payload: CreateRoomPayload) =>
        apiClient.post<CreateRoomResponse>("/rooms", payload),
    
    // POST /api/rooms/join
    join: (payload: JoinRoomPayload) =>
        apiClient.post<JoinRoomResponse>("/rooms/join", payload),
    
    // DELETE /api/rooms
    delete: (payload: DeleteRoomPayload) =>
        apiClient.delete<void>("/rooms", payload),
};
 
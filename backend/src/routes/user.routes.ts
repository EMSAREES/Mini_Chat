import { Router } from "express";
import { CreateRoom, JoinRoom, AllRoom, DeleteRoom } from "../controllers/chat.controller";

const router = Router();

// GET  /rooms        → obtener todas las salas
// POST /rooms        → crear una sala
// POST /rooms/join   → unirse a una sala
// DELETE /rooms      → eliminar una sala

router.get("/rooms", AllRoom);
router.post("/rooms", CreateRoom);
router.post("/rooms/join", JoinRoom);
router.delete("/rooms", DeleteRoom);

export default router;
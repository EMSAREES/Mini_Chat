import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import roomRouter from "./routes/user.routes";
import { chatSocket } from "./sockets/chat.socket.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Health check
app.get("/", (req, res) => {
    res.json({ exito: true, mensaje: "conectado", fecha: new Date().toISOString() });
});

app.use("/api", roomRouter);

const PORT = 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    chatSocket(io, socket);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
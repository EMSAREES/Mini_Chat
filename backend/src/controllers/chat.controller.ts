import { createRoom, joinRoom,  getAllRooms,  removeRoom } from "../services/room.service";
import type { Request, Response } from 'express';
import { CODIGOS_ESTADO } from '../constantes/statusCode';

export const CreateRoom = (req: Request, res: Response) => {
    try {
        const { roomId, username } = req.body;
        const nuevaSala = createRoom(roomId, username);
        
        res.status(CODIGOS_ESTADO.CREADO).json({
            nuevaSala,
            message: "Sala creada exitosamente"
        });
    } catch (error: any) {
        // Si el error tiene un status (definido en el service), lo usamos
        const statusCode = error.status || CODIGOS_ESTADO.ERROR_SERVIDOR;
        res.status(statusCode).json(error);
    }
};

export const JoinRoom = (req: Request, res: Response) => {
    try {
        const { roomId, username } = req.body;
        const unirseSala = joinRoom(roomId, username);
        
        res.status(CODIGOS_ESTADO.EXITO).json({
            unirseSala
        });
    } catch (error: any) {
        // Si el error tiene un status (definido en el service), lo usamos
        const statusCode = error.status || CODIGOS_ESTADO.ERROR_SERVIDOR;
        res.status(statusCode).json(error);
    }
};

export const AllRoom = async (req: Request, res: Response) => {
    try {
        const allRoom = getAllRooms();
        
        res.status(CODIGOS_ESTADO.EXITO).json({
            allRoom
        });
    } catch (error: any) {
        // Si el error tiene un status (definido en el service), lo usamos
        const statusCode = error.status || CODIGOS_ESTADO.ERROR_SERVIDOR;
        res.status(statusCode).json(error);
    }
}


export const DeleteRoom = (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        const borrarSala = removeRoom(roomId);

        res.status(CODIGOS_ESTADO.CREADO).json({
            borrarSala,
        });
    } catch (error: any) {
        // Si el error tiene un status (definido en el service), lo usamos
        const statusCode = error.status || CODIGOS_ESTADO.ERROR_SERVIDOR;
        res.status(statusCode).json(error);
    }
};

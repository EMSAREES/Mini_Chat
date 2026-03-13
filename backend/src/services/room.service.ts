import { create, join, getRooms, deleteRoom } from "../models/room.model";
import { CODIGOS_ESTADO } from "../constantes/statusCode";

const validarDatos = (roomId: string, username: string) => {
  const errores = [];
  
  if (!roomId || roomId.trim().length === 0) {
    errores.push({ campo: 'roomId', mensaje: 'El ID no debe estar vacío' });
  }

  if (!username || username.trim().length === 0) {
    errores.push({ campo: 'username', mensaje: 'El username no puede estar vacío' });
  }
  
  return errores;
}

export function createRoom(roomId: string, username: string) {
  const erroresValidacion = validarDatos(roomId, username);

  if (erroresValidacion.length > 0) {
    throw { 
      status: CODIGOS_ESTADO.DATOS_INVALIDOS, // 422
      message: "Error de validación", 
      errores: erroresValidacion 
    };
  }

  return create({
    id: roomId,
    users: [username]
  });
}

export function joinRoom(roomId: string, username: string) {
  const erroresValidacion = validarDatos(roomId, username);
  
  if (erroresValidacion.length > 0) {
    throw { 
      status: CODIGOS_ESTADO.DATOS_INVALIDOS, // 422
      message: "Error de validación", 
      errores: erroresValidacion 
    };
  }
  
  const result = join(roomId, username);
  
  if (!result) {
    throw { 
      status: CODIGOS_ESTADO.NO_ENCONTRADO, // 404
      message: "La sala solicitada no existe" 
    };
  }
  
  return result;
}

export function getAllRooms() {
  return getRooms();
}

export function removeRoom(roomId: string) {
  const fueEliminado = deleteRoom(roomId);
  
  if (!fueEliminado) {
    throw { 
      status: CODIGOS_ESTADO.NO_ENCONTRADO, // 404
      message: "No se encontró la sala para eliminar" 
    };
  }
  
  return { mensaje: "Sala eliminada con éxito" };
}
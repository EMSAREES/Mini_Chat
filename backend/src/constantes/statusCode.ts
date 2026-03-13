// src/constantes/codigosEstado.ts

export const CODIGOS_ESTADO = {
    // Éxito
    EXITO: 200,              // OK
    CREADO: 201,             // Created
    ACEPTADO: 202,           // Accepted
    SIN_CONTENIDO: 204,      // No Content

    // Errores del cliente
    SOLICITUD_INCORRECTA: 400,    // Bad Request
    NO_AUTORIZADO: 401,           // Unauthorized
    PROHIBIDO: 403,               // Forbidden
    NO_ENCONTRADO: 404,           // Not Found
    CONFLICTO: 409,               // Conflict (ej: email duplicado)
    DATOS_INVALIDOS: 422,         // Unprocessable Entity

    // Errores del servidor
    ERROR_SERVIDOR: 500,           // Internal Server Error
    SERVICIO_NO_DISPONIBLE: 503
};

// Uso en controladores:
// res.status(CODIGO_ESTADO.CREADO).json({ ... });
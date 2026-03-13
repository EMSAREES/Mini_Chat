// ============================================================
// API CLIENT BASE
// ============================================================
// Este archivo centraliza TODAS las peticiones HTTP del proyecto.
// Ventajas:
// 1. Evita repetir fetch en todos los archivos.
// 2. Maneja errores de forma uniforme.
// 3. Permite cambiar de fetch a axios en el futuro sin tocar todo el proyecto.
// 4. Permite agregar autenticación, logs, interceptores, etc.
// ============================================================



// ------------------------------------------------------------
// URL BASE DEL BACKEND
// ------------------------------------------------------------
// Se obtiene de variables de entorno (.env)
// Si no existe, usa localhost por defecto.
//
// Ejemplo .env
// VITE_API_URL=http://localhost:3000/api
//
// Esto permite cambiar entre:
// - desarrollo
// - producción
// - staging
// sin modificar el código.
// ------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";



// ------------------------------------------------------------
// TIPOS DE MÉTODOS HTTP PERMITIDOS
// ------------------------------------------------------------
// Definimos explícitamente los métodos permitidos para evitar
// errores de escritura como:
// "get", "pst", etc.
//
// TypeScript mostrará error si usamos uno inválido.
// ------------------------------------------------------------
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";



// ------------------------------------------------------------
// OPCIONES PARA UNA PETICIÓN HTTP
// ------------------------------------------------------------
// Esta interfaz define las opciones que puede recibir la
// función request.
//
// method  → método HTTP
// body    → datos que se enviarán al backend
// headers → encabezados personalizados
//
// Ejemplo:
//
// request("/users", {
//   method: "POST",
//   body: { name: "Emilio" },
//   headers: { Authorization: "Bearer token" }
// })
// ------------------------------------------------------------
interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
}



// ------------------------------------------------------------
// ERROR PERSONALIZADO PARA LA API
// ------------------------------------------------------------
// Fetch NO lanza error automáticamente cuando el servidor
// responde con 404 o 500.
//
// Por eso creamos nuestra propia clase de error.
//
// Esto permite que los hooks o componentes sepan:
// - el status HTTP
// - el mensaje
// - la respuesta completa del servidor
//
// Ejemplo:
//
// try {
//   await apiClient.get("/rooms")
// } catch(err) {
//   if(err instanceof ApiError){
//       console.log(err.status)
//   }
// }
// ------------------------------------------------------------
export class ApiError extends Error {

    // Código HTTP (404, 500, etc)
    status: number;

    // Datos adicionales devueltos por el backend
    data?: unknown;

    constructor(status: number, message: string, data?: unknown) {

        // Llama al constructor de Error
        super(message);

        // Nombre personalizado del error
        this.name = "ApiError";

        // Guardamos información adicional
        this.status = status;
        this.data = data;
    }
}



// ============================================================
// FUNCIÓN PRINCIPAL PARA HACER PETICIONES HTTP
// ============================================================
// Esta función es el núcleo del cliente API.
// Todos los métodos (GET, POST, DELETE...) terminan usando
// esta función.
//
// <T> significa que la función es genérica.
// Esto permite tipar la respuesta del servidor.
//
// Ejemplo:
// const users = await request<User[]>("/users")
// ============================================================
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {

    // Extraemos las opciones con valores por defecto
    const {
        method = "GET",
        body,
        headers = {}
    } = options;



    // --------------------------------------------------------
    // CONFIGURACIÓN DE FETCH
    // --------------------------------------------------------
    // RequestInit es el tipo oficial de configuración para fetch
    // --------------------------------------------------------
    const config: RequestInit = {
        method,
        headers: {

            // Indicamos que enviamos JSON
            "Content-Type": "application/json",

            // Aquí se podría agregar autenticación
            // Authorization: `Bearer ${getToken()}`,

            // Mezclamos headers personalizados
            ...headers,
        },
    };



    // --------------------------------------------------------
    // SI EXISTE BODY LO CONVERTIMOS A JSON
    // --------------------------------------------------------
    // fetch requiere que el body sea string
    //
    // Ejemplo:
    // { name: "Emilio" }
    //
    // se convierte en
    //
    // '{"name":"Emilio"}'
    // --------------------------------------------------------
    if (body) {
        config.body = JSON.stringify(body);
    }



    // --------------------------------------------------------
    // HACEMOS LA PETICIÓN AL SERVIDOR
    // --------------------------------------------------------
    // endpoint: "/rooms"
    //
    // resultado final:
    // http://localhost:3000/api/rooms
    // --------------------------------------------------------
    const response = await fetch(`${BASE_URL}${endpoint}`, config);



    // --------------------------------------------------------
    // MANEJO UNIFORME DE ERRORES HTTP
    // --------------------------------------------------------
    // response.ok es TRUE solo si el status está entre:
    // 200 y 299
    // --------------------------------------------------------
    if (!response.ok) {

        // Intentamos leer el error enviado por el backend
        // Si no hay JSON, evitamos que explote el código
        const errorData = await response.json().catch(() => ({}));

        // Lanzamos nuestro error personalizado
        throw new ApiError(
            response.status,
            errorData?.message ?? `Error ${response.status}`,
            errorData
        );
    }



    // --------------------------------------------------------
    // RESPUESTAS SIN CONTENIDO
    // --------------------------------------------------------
    // 204 = No Content
    //
    // Ejemplo típico:
    // DELETE /users/123
    //
    // El servidor responde sin body.
    // --------------------------------------------------------
    if (response.status === 204) {
        return null as T;
    }



    // --------------------------------------------------------
    // CONVERTIMOS LA RESPUESTA A JSON
    // --------------------------------------------------------
    // El resultado se tipa con <T>
    //
    // Ejemplo:
    // const users = await apiClient.get<User[]>("/users")
    // --------------------------------------------------------
    return response.json() as Promise<T>;
}



// ============================================================
// MÉTODOS HTTP PÚBLICOS
// ============================================================
// Estas funciones son las que usará el resto del proyecto.
//
// Ejemplo:
//
// apiClient.get("/rooms")
// apiClient.post("/rooms", data)
// apiClient.delete("/rooms", data)
//
// Todas usan internamente request()
// ============================================================
export const apiClient = {

    // --------------------------------------------------------
    // GET
    // --------------------------------------------------------
    // Obtiene datos del servidor
    // --------------------------------------------------------
    get: <T>(endpoint: string) =>
        request<T>(endpoint),



    // --------------------------------------------------------
    // POST
    // --------------------------------------------------------
    // Envía datos para crear recursos
    // --------------------------------------------------------
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: "POST",
            body
        }),



    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------
    // Elimina recursos del servidor
    // --------------------------------------------------------
    delete: <T>(endpoint: string, body?: unknown) =>
        request<T>(endpoint, {
            method: "DELETE",
            body
        }),
};
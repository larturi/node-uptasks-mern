// Genera el hash de un usuario para validar por email
const generarHashUser = async(email) => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
}

export default generarHashUser;
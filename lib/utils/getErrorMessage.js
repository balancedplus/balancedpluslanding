// lib/utils/getErrorMessage.js
export function getErrorMessage(error) {
    const code = error.details || error.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Prueba con otro o inicia sesión.";
    case "auth/invalid-email":
      return "El formato del correo electrónico no es válido.";
    case "auth/operation-not-allowed":
      return "El registro con este método no está habilitado.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";

    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada. Contacta con soporte.";
    case "auth/user-not-found":
      return "No existe ninguna cuenta con este correo.";
    case "auth/wrong-password":
      return "La contraseña no es correcta.";
    case "auth/invalid-credential":
      return "Las credenciales proporcionadas no son válidas.";
    case "auth/invalid-verification-code":
      return "El código de verificación no es válido.";
    case "auth/invalid-verification-id":
      return "El ID de verificación no es válido.";

    case "auth/invalid-user-token":
    case "auth/user-token-expired":
      return "Tu sesión ha caducado. Vuelve a iniciar sesión.";
    case "auth/invalid-custom-token":
      return "El token proporcionado no es válido.";
    case "auth/custom-token-mismatch":
      return "El token no corresponde a este proyecto.";

    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con este correo pero con un método de acceso distinto.";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana emergente. Habilítala e inténtalo de nuevo.";
    case "auth/popup-closed-by-user":
      return "Se cerró la ventana emergente antes de completar el inicio de sesión.";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado para realizar operaciones de autenticación.";

    case "auth/too-many-requests":
      return "Has hecho demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
    case "auth/network-request-failed":
      return "Error de red. Revisa tu conexión a internet.";
    case "auth/internal-error":
      return "Error interno del servidor. Intenta de nuevo más tarde.";

    default:
      return "Ha ocurrido un error inesperado. Intenta de nuevo.";
  }
}

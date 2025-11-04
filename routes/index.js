import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante,
    validarVacante,
    agregarVacante,
    mostrarVacante,
    eliminarVacante,
    formEditarVacante,
    editarVacante,
    contactar,
    mostrarCandidatos,
    buscarVacante
} from '../controllers/vacanteController.js';
import { 
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion,
    formEditarPerfil,
    validarPerfil,
    editarPerfil

} from '../controllers/usuarioController.js';
import { 
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion,
    formRestablecerPassword,
    enviarToken,
    restablecerPassword,
    guardarPassword
} from '../controllers/authController.js';
import upload from '../helpers/subirImagen.js';
import uploadPdf from '../helpers/subirPdf.js';

const router=express.Router();

router.get('/',mostrarTrabajos);

//crear vacantes
router.get('/vacantes/nueva',
    verificarUsuario,
    formularioNuevaVacante
);
router.post('/vacantes/nueva',
    verificarUsuario,
    validarVacante,
    agregarVacante
);

//muestra vacante (singular)
router.get('/vacantes/:url',mostrarVacante);

//editar vacante
router.get('/vacantes/editar/:url',
    verificarUsuario,
    formEditarVacante
);
router.post('/vacantes/editar/:url',
    verificarUsuario,
    validarVacante,
    editarVacante
);

//eliminar vacante
router.delete('/vacantes/eliminar/:id',
    //verificarUsuario,
    eliminarVacante
);

//crear cuentas
router.get('/crear-cuenta',formCrearCuenta);
router.post('/crear-cuenta',
    crearCuenta
);

//iniciar sesión
router.get('/iniciar-sesion', formIniciarSesion);
router.post('/iniciar-sesion', 
    iniciarSesion,
    autenticarUsuario
);

//cerrar sesión
router.get('/cerrar-sesion',
    verificarUsuario,
    cerrarSesion
);

//olvidé mi password
router.get('/restablecer-password',formRestablecerPassword);
router.post('/restablecer-password',enviarToken);

//resetear password
router.get('/restablecer-password/:token',restablecerPassword);
router.post('/restablecer-password/:token',guardarPassword);

router.get('/administracion', 
    verificarUsuario,
    mostrarPanel
);

//editar perfil
router.get('/editar-perfil',
    verificarUsuario,
    formEditarPerfil
);
router.post('/editar-perfil',
    verificarUsuario,
    validarPerfil,
    upload.single('imagen'),
    editarPerfil
);

//recibir mensajes de candidatos
router.post('/vacantes/:url',
    uploadPdf.single('cv'),
    contactar
);

//muestra los candidatos por vacante
router.get('/candidatos/:id',
    verificarUsuario,
    mostrarCandidatos
);


//buscador de vacantes
router.post('/buscador',buscarVacante)

export default router;
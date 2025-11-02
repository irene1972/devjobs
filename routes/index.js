import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante,
    validarNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
} from '../controllers/vacanteController.js';
import { 
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion,
    formEditarPerfil,
    editarPerfil

} from '../controllers/usuarioController.js';
import { 
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion
} from '../controllers/authController.js';

const router=express.Router();

router.get('/',mostrarTrabajos);

//crear vacantes
router.get('/vacantes/nueva',
    verificarUsuario,
    formularioNuevaVacante
);
router.post('/vacantes/nueva',
    verificarUsuario,
    validarNuevaVacante,
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
    editarVacante
);

//crear cuentas
router.get('/crear-cuenta',formCrearCuenta);
router.post('/crear-cuenta',
    //validarRegistro,
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
    editarPerfil
);

export default router;
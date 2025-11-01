import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
} from '../controllers/vacanteController.js';
import { 
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion

} from '../controllers/usuarioController.js';
import { 
    autenticarUsuario,
    mostrarPanel
} from '../controllers/authController.js';

const router=express.Router();

router.get('/',mostrarTrabajos);

//crear vacantes
router.get('/vacantes/nueva',formularioNuevaVacante);
router.post('/vacantes/nueva',agregarVacante);

//muestra vacante (singular)
router.get('/vacantes/:url',mostrarVacante);

//editar vacante
router.get('/vacantes/editar/:url',formEditarVacante);
router.post('/vacantes/editar/:url',editarVacante);

//crear cuentas
router.get('/crear-cuenta',formCrearCuenta);
router.post('/crear-cuenta',
    //validarRegistro,
    crearCuenta
);

//iniciar sesión
router.get('/iniciar-sesion', formIniciarSesion);
router.post('/iniciar-sesion', 
    autenticarUsuario,
    iniciarSesion
);

router.get('/administracion', mostrarPanel);

export default router;
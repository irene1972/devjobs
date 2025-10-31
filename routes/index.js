import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
} from '../controllers/vacanteController.js';

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

export default router;
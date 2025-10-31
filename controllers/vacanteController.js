import Vacante from '../models/Vacante.js';
import {skills} from '../helpers/variables.js';

const formularioNuevaVacante=(req,res)=>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        skills
    });
}

const agregarVacante=async(req,res)=>{
    //const vacante=new Vacante(req.body);
    const vacante=req.body;
    
    //crear array de habilidades
    vacante.skills=req.body.skills.split(',');

    //almacenarlo en la bd
    const nuevaVacante=await Vacante.create(vacante);

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

const mostrarVacante=async(req,res,next)=>{
    const url=req.params.url;
    const vacante=await Vacante.findOne({url}).lean();
    if(!vacante) return next();

    res.render('vacante',{
        nombrePagina:vacante.titulo,
        barra:true,
        vacante
    });
}

const formEditarVacante=async(req,res,next)=>{
    const url=req.params.url;
    const vacante=await Vacante.findOne({url}).lean();
    if(!vacante) return next();

    res.render('editar-vacante',{
        nombrePagina:`Editar - ${vacante.titulo}`,
        barra:true,
        vacante,
        skills
    });
}

const editarVacante=async(req,res)=>{
    const url=req.params.url;
    const vacanteActualizada=req.body;

    vacanteActualizada.skills=req.body.skills.split(',');

    const vacante=await Vacante.findOneAndUpdate({url},vacanteActualizada,{
        new:true,
        runValidators:true
    });

    res.redirect(`/vacantes/${vacante.url}`);
}

export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
}
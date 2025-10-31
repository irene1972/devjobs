import Vacante from '../models/Vacante.js';

const mostrarTrabajos=async(req,res,next)=>{

    const vacantes=await Vacante.find().lean();
    //console.log(vacantes);
    if(!vacantes) return next();

    res.render('home',{
        nombrePagina:'devJobs',
        tagline:'Encuentra y Publica Trabajos para Desarrolladores Web',
        barra:true,
        boton:true,
        vacantes
    });
}

export {
    mostrarTrabajos
}
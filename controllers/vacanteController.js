import Vacante from '../models/Vacante.js';
import Usuario from '../models/Usuario.js';
import {skills} from '../helpers/variables.js';

const formularioNuevaVacante=async(req,res)=>{
    const usuarioId=req.cookies._id;
    const usuario=await Usuario.findById(usuarioId);

    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        skills,
        cerrarSesion:true,
        nombre: usuario.nombre,
    });
}

//validar y sanitizar(con express-validator) los campos de las nuevas vacantes
const validarVacante=async(req,res,next)=>{
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    const usuarioId=req.cookies._id;
    const {titulo,empresa,ubicacion,salario,contrato,descripcion,skills}=req.body;
    const datos=req.body;
    const usuario=await Usuario.findById(usuarioId);

    if(!titulo || !empresa || !ubicacion || !contrato || !descripcion){
        return res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        skills:['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'],
        cerrarSesion:true,
        nombre: usuario.nombre,
        datos,
        error:'Todos los campos son obligatorios'
        });
    }
    next();
}

const agregarVacante=async(req,res)=>{
    //const vacante=new Vacante(req.body);
    const vacante=req.body;
    
    //usuario autor de la vacante
    vacante.autor=req.cookies._id;
    
    //crear array de habilidades
    vacante.skills=req.body.skills.split(',');

    //almacenarlo en la bd
    try {
       const nuevaVacante=await Vacante.create(vacante); 
       res.redirect(`/vacantes/${nuevaVacante.url}`);
    } catch (error) {
        console.log(error);
    }
    
}

const mostrarVacante=async(req,res,next)=>{
    const usuarioId=req.cookies._id;
    const usuario=await Usuario.findById(usuarioId);

    const url=req.params.url;
    const vacante=await Vacante.findOne({url}).lean();
    if(!vacante) return next();

    res.render('vacante',{
        nombrePagina:vacante.titulo,
        barra:true,
        cerrarSesion:true,
        nombre: usuario.nombre,
        vacante
    });
}

const formEditarVacante=async(req,res,next)=>{
    const usuarioId=req.cookies._id;
    const usuario=await Usuario.findById(usuarioId).lean();

    const url=req.params.url;
    const vacante=await Vacante.findOne({url}).lean();
    if(!vacante) return next();

    res.render('editar-vacante',{
        nombrePagina:`Editar - ${vacante.titulo}`,
        barra:true,
        vacante,
        skills,
        cerrarSesion:true,
        nombre: usuario.nombre,
    });
}

const editarVacante=async(req,res)=>{
    //todo: validación campos (tener en cuenta que salario es opcional)
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
    validarVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
}
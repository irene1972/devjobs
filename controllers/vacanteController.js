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
    const vacante=await Vacante.findOne({url}).populate('autor').lean();
    if(!vacante) return next();

    res.render('vacante',{
        nombrePagina:vacante.titulo,
        barra:true,
        cerrarSesion:true,
        nombre: usuario.nombre,
        vacante
    });
}

const eliminarVacante=async(req,res)=>{
    const usuarioId=req.cookies._id;
    const vacanteId=req.params.id;
    const vacante=await Vacante.findById(vacanteId);

    if(usuarioId.toString() !== vacante.autor.toString()) return res.status(403).json({error:'Acción no permitida'});


    try {
        await Vacante.deleteOne({_id:vacanteId});
        res.status(200).json({
                            mensaje:'La vacante fue eliminada correctamente',
                            estado:200
                            });
    } catch (error) {
      console.log(error);  
    }
    
    
    
    
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

const contactar=async(req,res,next)=>{
    const url=req.params.url;
    const {nombre,email}=req.body;
    const vacante=await Vacante.findOne({url});
    const vacantes=await Vacante.find().lean();
    if(!vacante) return next();
    const nuevoCandidato={
        nombre,
        email,
        cv:req.file.filename
    }
    vacante.candidatos.push(nuevoCandidato);
    await Vacante.findByIdAndUpdate(vacante._id,vacante,{
        new:true,
        runValidators:true,
        upsert:true
    });
    res.render('home',{
        nombrePagina:'devJobs',
        tagline:'Encuentra y Publica Trabajos para Desarrolladores Web',
        barra:true,
        boton:true,
        vacantes,
        exito:'Tus datos se enviaron correctamente'
    });
}

const mostrarCandidatos=async(req,res,next)=>{
    const usuarioLogueadoId=req.cookies._id;
    const usuarioLogueado=await Usuario.findById(usuarioLogueadoId);
    const {id}=req.params;
    const vacante=await Vacante.findById(id).lean();
    
    if(!vacante) return next();
    if(vacante.autor.toString() !== usuarioLogueadoId) return next();

    res.render('candidatos',{
        nombrePagina:`Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre:usuarioLogueado.nombre,
        imagen:usuarioLogueado.imagen,
        candidatos:vacante.candidatos
    });
}

const buscarVacante=async(req,res)=>{
    const texto=req.body.q;
    const vacantes=await Vacante.find({
        $text:{
            $search:texto
        }
    }).lean();
    
    //mostrar las vacantes
    res.render('home',{
        nombrePagina:`Resultados para la búsqueda: ${texto}`,
        barra:true,
        vacantes
    })
}

export {
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
}
import passport from "passport";
import Vacante from "../models/Vacante.js";
import Usuario from "../models/Usuario.js";

const autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    //failureRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});

//revisar si el usuario está autenticado
const verificarUsuario=(req,res,next)=>{
    
    const valorCookie = req.cookies._id;
    //console.log(valorCookie);
    
    if(valorCookie){
        return next()
    }
    res.redirect('/iniciar-sesion');
}

const mostrarPanel=async(req,res)=>{
    const usuarioLogueadoId=req.cookies._id;
    //console.log(usuarioLogueadoId);
    if(!usuarioLogueadoId) return res.redirect('/iniciar-sesion');

    const usuario=await Usuario.findById(usuarioLogueadoId);
    const vacantes=await Vacante.find({autor:usuarioLogueadoId}).lean();

    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline:'Crea y administra tus vacantes desde aquí',
        cerrarSesion:true,
        nombre: usuario.nombre,
        vacantes
    });
    
}

const cerrarSesion=(req,res)=>{
    res.clearCookie('_id');
    req.logout();
    return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        exito:'Cerraste sesión correctamente'
    });
}

export {
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion
}
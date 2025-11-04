import passport from "passport";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Vacante from "../models/Vacante.js";
import Usuario from "../models/Usuario.js";
import { emailOlvidePassword } from "../helpers/email.js";

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
        imagen:usuario.imagen,
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

const formRestablecerPassword=(req,res)=>{
    res.render('restablecer-password',{
        nombrePagina: 'Restablece tu password',
        tagline:'¿Olvidate tu password? aquí puedes solicitar un nuevo password'
    });
    
}

//genera el token en la tabla del usuario
const enviarToken=async(req,res,next)=>{
    const {email}=req.body;
    const usuario=await Usuario.findOne({email});
    if(!usuario) return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        error:'No existe el usuario'
    });
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expira=Date.now() + 3600000;

    await Usuario.findOneAndUpdate({_id:usuario._id},usuario,{
                new:true,
                runValidators:true,
                upsert:true
            });
    const resetUrl=`http://${req.headers.host}/restablecer-password/${usuario.token}`;

    console.log(resetUrl);

    //todo: enviar notificación por email
    emailOlvidePassword({
        email,
        nombre:usuario.nombre,
        token:usuario.token
    });

    return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        exito:'Revisa tu email para las indicaciones'
    });
}

const restablecerPassword=async(req,res)=>{
    const usuario=await Usuario.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });
    if(!usuario) return res.render('restablecer-password',{
        nombrePagina: 'Restablece tu password',
        tagline:'¿Olvidate tu password? aquí puedes solicitar un nuevo password',
        error:'Token no válido'
    });
    
    res.render('nuevo-password',{
        nombrePagina: 'Nuevo password',
        tagline:'¿Olvidate tu password? aquí puedes restablecerlo'
    });
    
}

const guardarPassword=async(req,res)=>{
    const {password,repitePassword}=req.body;
    const usuario=await Usuario.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });
    if(!usuario) return res.render('restablecer-password',{
        nombrePagina: 'Restablece tu password',
        tagline:'¿Olvidate tu password? aquí puedes solicitar un nuevo password',
        error:'Token no válido'
    });

    //validar que los dos campos vengan rellenos
    if(!password || !repitePassword) return res.render('nuevo-password',{
        nombrePagina: 'Nuevo password',
        tagline:'¿Olvidate tu password? aquí puedes restablecerlo',
        error:'Los dos campos son obligatorios'
    });

    //validar que los dos passwords sean iguales
    if(password !== repitePassword) return res.render('nuevo-password',{
        nombrePagina: 'Nuevo password',
        tagline:'¿Olvidate tu password? aquí puedes restablecerlo',
        error:'Los passwords deben ser iguales'
    });

    //hashear 
    
    const hash=await bcrypt.hash(password,12);
    usuario.password=hash;

    //borrar info de token y expira
    usuario.token=undefined;
    usuario.expira=undefined;
    
    //guardar en base de datos
    await Usuario.findOneAndUpdate({_id:usuario._id},usuario,{
            new:true,
            runValidators:true,
            upsert:true
        });

    res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        exito:'Has restablecido tu password correctamente'
    });
}

export {
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion,
    formRestablecerPassword,
    enviarToken,
    restablecerPassword,
    guardarPassword
}
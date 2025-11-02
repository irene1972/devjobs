import Usuario from "../models/Usuario.js";
import Vacante from "../models/Vacante.js";
import bcrypt from "bcrypt";

const formCrearCuenta=(req,res)=>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}

const crearCuenta=async(req,res)=>{
    const{nombre,email,password,confirmar}=req.body;
    const datosCuenta=req.body;

    //validar que vengan todos los campos
    if(!nombre || !email || !password || !confirmar){
        return res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
        error:'Todos los campos son obligatorios',
        datos:req.body
        });
    }
    
    //validar que el email sea válido
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(email)){
        return res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
        error:'El email debe ser válido',
        datos:req.body
        });
    }
    
    //validar que no exista ya el usuario en la bd
    const usuario=await Usuario.findOne({email:req.body.email});
    if(usuario){
        return res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
        error:'El usuario ya está registrado, pruebe a loguearse',
        datos:req.body
        });
    }
    
    //validar que los dos passwords son iguales
    if(req.body.password !== req.body.confirmar){
        return res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
        error:'Los dos passwords deben ser iguales',
        datos:req.body
        });
    }
    
    try {
        const usuarioCreado=await Usuario.create(datosCuenta);
    
        if(!usuarioCreado){
            return res.render('crear-cuenta',{
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
            error:'No se han podido guardar los datos',
            datos:req.body
            });
        }
        res.redirect('/iniciar-sesion');
    } catch (error) {
        console.log(error);
        return res.render('crear-cuenta',{
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
            error:'No se han podido guardar los datos',
            datos:req.body
            });
    }
}
/*
const validarRegistro=(req,res)=>{
    //sanitizar los datos
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //validar
    req.checkBody('nombre','El nombre es obligatorio').notEmpty();
    req.checkBody('email','El email debe ser válido').isEmail();
    req.checkBody('password','El password no puede ir vacío').notEmpty();
    req.checkBody('confirmar','Confirmar password no puede ir vacío').notEmpty();
    req.checkBody('confirmar','Los dos passwords deben ser iguales').equals(req.body.password);

    const errores=req.validationErrors();
   
    if(errores){
        req.flash('error',errores.map(error=>error.msg));

        res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:'Empieza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes:req.flash()
        });
        return;
    }

    next();
}
*/

const formIniciarSesion=(req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis'
    });
}

const iniciarSesion=async(req,res,next)=>{
    //validación de campos vacíos
    const {email,password}=req.body;
    if(!email || !password){
        return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        error:'Los dos campos son obligatorios',
        email
        });
    }
    const usuario=await Usuario.findOne({email});

    //validación de que exista el usuario
    if(!usuario){
        return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        error:'El usuario no existe, pruebe a registrarse',
        email
        });
    }

    //validación de que el password coincida
    if(!bcrypt.compareSync(password,usuario.password)){
        return res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en devJobs',
        tagline:'Inicia sesión en devJobs y empieza a publicar tus vacantes gratis',
        error:'El password no coincide',
        email
        });
    }

    res.cookie('_id',usuario._id,{
        httpOnly:true,
        //secure:true,
        //sameSite:true
    });
    next();
}

const formEditarPerfil=async(req,res)=>{
    const usuarioId=req.cookies._id;
    const usuario=await Usuario.findById(usuarioId).lean();
    return res.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario,
        cerrarSesion:true,
        nombre: usuario.nombre,
        });
}

const validarPerfil=async(req,res,next)=>{
    //sanitizar con express-validator
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }

    //validar
    const usuarioId=req.cookies._id;
    const {nombre,email,password}=req.body;
    const usuario={};
    if(!nombre || !email){
        usuario.nombre=nombre;
        usuario.email=email;
        return res.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario,
        cerrarSesion:true,
        nombre: usuario.nombre,
        error:'Los campos NOMBRE y E-MAIL son obligatorios'
        });
    }

    //validar que el email sea válido
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(email)){
        usuario.nombre=nombre;
        usuario.email=email;
        return res.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario,
        cerrarSesion:true,
        nombre: usuario.nombre,
        error:'El email no es válido'
        });
    }

    const existeEmail=await Usuario.findOne({email});
    const usuarioBD=await Usuario.findById(usuarioId); 
    
    if(usuarioBD.email !== email && existeEmail){
        usuario.nombre=nombre;
        usuario.email=email;
        return res.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario,
        cerrarSesion:true,
        nombre: usuario.nombre,
        error:'El email ya está registrado'
        });
    }

    next();
}

const editarPerfil=async(req,res)=>{
    const usuarioId=req.cookies._id;
    const {nombre,email,password}=req.body; 
    const usuario={};

    usuario.nombre=nombre;
    usuario.email=email;
    if(password) {
        const hash=await bcrypt.hash(password,12);
        usuario.password=hash;
    };

    try {
        const ususarioActualizado=await Usuario.findOneAndUpdate({_id:usuarioId},usuario,{
            new:true,
            runValidators:true
        });

        return res.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        exito:'Los datos se guardaron correctamente',
        cerrarSesion:true,
        nombre: ususarioActualizado.nombre,
        });

    } catch (error) {
        console.log(error);
    }
        
    
    
}

export {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion,
    formEditarPerfil,
    validarPerfil,
    editarPerfil
}
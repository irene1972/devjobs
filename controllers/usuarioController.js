import Usuario from "../models/Usuario.js";

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

const iniciarSesion=(req,res)=>{

}

export {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    iniciarSesion
}
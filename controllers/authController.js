import passport from "passport";

const autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});

//revisar si el usuario está autenticado
const verificarUsuario=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/iniciar-sesion');
}

const mostrarPanel=(req,res)=>{
    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline:'Crea y administra tus vacantes desde aquí'
    });
}

export {
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel
}
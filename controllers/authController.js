import passport from "passport";

const autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});

const mostrarPanel=(req,res)=>{
    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline:'Crea y administra tus vacantes desde aquí'
    });
}

export {
    autenticarUsuario,
    mostrarPanel
}
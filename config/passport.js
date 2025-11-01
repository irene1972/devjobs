import passport from "passport";
import LocalStrategy from 'passport-local';
//import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},async(email,password,done)=>{
    const usuario=await Usuario.findOne({email});
    if(!usuario) return done(null,false,{
        message:'Usuario No Existe'
    });
    //el usuario existe, vamos a verificarlo
    const verificarPass=usuario.compararPassword(password);
    if(!verificarPass) return done(null,false,{
        message:'Password Incorrecto'
    })
    //el usuario existe y el password es correcto
    return done(null,usuario);
}));

passport.serializeUser((usuario,done)=>done(null,usuario._id));

passport.deserializeUser(async(id,done)=>{
    const usuario=await Usuario.findById(id).exec();
    return done(null,usuario);
});

export default passport;
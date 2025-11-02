import express from 'express'
//import mongoose from "mongoose";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import ExpressValidator from 'express-validator';
import flash from 'connect-flash';
//import MongoStore from 'connect-mongo';
import conectarDB from './config/db.js';
//import path from 'path';
import router from './routes/index.js';
import passport from './config/passport.js';

const app=express();

//habilitar body-parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

//validación de campos
app.use(ExpressValidator());

dotenv.config({path:'.env'});

conectarDB();

//habilitar handlebars como view
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
//app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','handlebars')

app.use(cookieParser());

app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    //store:new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

//alertas y flash messages
app.use(flash());

//crear nuestro middleware
app.use((req,res,next)=>{
    res.locals.mensajes=req.flash();
    next();
});

app.use('/',router);

app.listen(process.env.PUERTO);
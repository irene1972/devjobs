import express from 'express'
//import mongoose from "mongoose";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pkg from 'express-handlebars';
import bodyParser from 'body-parser';
//import MongoStore from 'connect-mongo';
import conectarDB from './config/db.js';
//import path from 'path';
import router from './routes/index.js';

const app=express();

//habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

dotenv.config({path:'.env'});

conectarDB();

//habilitar handlebars como view
app.engine('handlebars',
    pkg({
        defaultLayout:'layout'
    })
)

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

app.use('/',router);

app.listen(process.env.PUERTO);
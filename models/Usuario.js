import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:'El email es obligatorio',
        trim:true
    },
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    token:String,
    expira:Date,
    imagen:String
});

//método para hashear los passwords
usuarioSchema.pre('save',async function(next) {
    //si el password ya está hasheado no lo volvemos a hashear
    if(!this.isModified('password')){
        return next();
    }
    const hash=await bcrypt.hash(this.password,12);
    this.password=hash;
    next();
})

usuarioSchema.methods={
    compararPassword: function(password){
        return bcrypt.compareSync(password,this.password);
    }
};

const Usuario=mongoose.model('Usuario',usuarioSchema);

export default Usuario;
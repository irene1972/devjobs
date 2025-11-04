import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";

const vacanteSchema=new mongoose.Schema({
    titulo:{
        type:String,
        required:'El nombre de la vacante es obligatorio',
        trim:true
    },
    empresa:{
        type:String,
        trim:true
    },
    ubicacion:{
        type:String,
        required:'La ubicación es obligatoria',
        trim:true
    },
    salario:{
        type:String,
        default:0,
        trim:true
    },
    contrato:{
        type:String,
        trim:true
    },
    descripcion:{
        type:String,
        trim:true
    },
    url:{
        type:String,
        lowercase:true
    },
    skills:[String],
    candidatos:[{
        nombre:String,
        email:String,
        cv:String
    }],
    autor:{
        type:mongoose.Schema.ObjectId,
        ref:'Usuario',
        required:'El autor es obligatorio'
    }
});

vacanteSchema.pre('save', function(next){
    //crear la url
    const url=slug(this.titulo);
    this.url=`${url}-${shortid.generate()}`;

    next();
})

vacanteSchema.index({titulo:'text'});

const Vacante=mongoose.model('Vacante',vacanteSchema);

export default Vacante;
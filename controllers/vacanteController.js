import Vacante from '../models/Vacante.js';

const formularioNuevaVacante=(req,res)=>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        skills:['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress']
    });
}

const agregarVacante=async(req,res)=>{
    //const vacante=new Vacante(req.body);
    const vacante=req.body;
    
    //crear array de habilidades
    vacante.skills=req.body.skills.split(',');

    //almacenarlo en la bd
    const nuevaVacante=await Vacante.create(vacante);

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

export {
    formularioNuevaVacante,
    agregarVacante
}
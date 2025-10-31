document.addEventListener('DOMContentLoaded',()=>{
    const skills=document.querySelector('.lista-conocimientos');
    if(skills){
        skills.addEventListener('click', agregarSkills);
    }
});

const skillsClicked=new Set();

const agregarSkills=(e)=>{
    console.log(e.target);
    if(e.target.tagName==='LI'){
        if(e.target.classList.contains('activo')){
            //quitarlo del set y quitar la clase
            skillsClicked.delete(e.target.textContent);
            e.target.classList.remove('activo');
            console.log(skillsClicked);
        }else{
            //agregarlo al set y agregar la clase
            skillsClicked.add(e.target.textContent);
            e.target.classList.add('activo');            
        }
    }
    const skillsArray=[...skillsClicked];
    document.querySelector('#skills').value=skillsArray;
}
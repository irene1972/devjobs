import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const skills=document.querySelector('.lista-conocimientos');
    if(skills){
        skills.addEventListener('click', agregarSkills);
    }
    skillsSeleccionados();
    contratoSeleccionado();

    //limpiar las alertas
    let alerta=document.querySelector('.error');
    if(alerta){
        setTimeout(()=>{
            alerta.remove();
        },3000);
    }

    let alertaExito=document.querySelector('.alerta');
    if(alertaExito){
        setTimeout(()=>{
            alertaExito.remove();
        },3000);
    }

    if(document.querySelector('h2').textContent==='Panel de Administración'){
        const btnEliminar=document.querySelector('#eliminar');
        btnEliminar.addEventListener('click', eliminarVacante);
    }
});

const skillsClicked=new Set();

const agregarSkills=(e)=>{
    //Si ya hay seleccionadas previamente se mantienen
    const habilidades=document.querySelectorAll('.lista-conocimientos li');
    if(document.querySelector('#seleccionadas')){
        const seleccionadas=document.querySelector('#seleccionadas').value.split(',');
        //console.log(seleccionadas);
        seleccionadas.forEach(seleccionada=>{
            //agregarlo al set y agregar la clase
            skillsClicked.add(seleccionada);
        });
    }

    //si hacemos click en una skill se agrega a las seleccionadas
    if(e.target.tagName==='LI'){
        if(e.target.classList.contains('activo')){
            //quitarlo del set y quitar la clase
            skillsClicked.delete(e.target.textContent);
            e.target.classList.remove('activo');
            
        }else{
            //agregarlo al set y agregar la clase
            skillsClicked.add(e.target.textContent);
            e.target.classList.add('activo');   
            //console.log(Array.from(skillsClicked)); 
            const skillsArray=[...Array.from(skillsClicked)];
            document.querySelector('#skills').value=skillsArray;        
        }
    }
    const skillsArray=[...skillsClicked];
    document.querySelector('#skills').value=skillsArray;
}

const skillsSeleccionados=()=>{
    const habilidades=document.querySelectorAll('.lista-conocimientos li');
    if(document.querySelector('h3') && document.querySelector('h3').textContent==='Información General'){
    
        if(document.querySelector('#seleccionadas')){
            const seleccionadas=document.querySelector('#seleccionadas').value.split(',');
            console.log(seleccionadas);
            //console.log(habilidades);
            
            habilidades.forEach(habilidad=>{
                //console.log(habilidad.textContent);
                if(seleccionadas.includes(habilidad.textContent)){
                    //console.log(habilidad);
                    habilidad.classList.add('activo');
                }
            });
            const skillsSelected=document.querySelectorAll('.lista-conocimientos .activo');
            const skillsArray2=[...skillsSelected];
            document.querySelector('#skills').value=skillsArray2;
        }
    }
    
}

const contratoSeleccionado=()=>{
    if(document.querySelector('h3') && document.querySelector('h3').textContent==='Información General'){
        const contratoSelected=document.querySelector('#contr').value;
        const opcionesContrato=document.querySelectorAll('select.contrato option');
        opcionesContrato.forEach(opcion=>{
            if(opcion.value===contratoSelected){
                opcion.selected=true;
            }
        });
    }
    
}

const eliminarVacante=(e)=>{
    e.preventDefault();
    
    //eliminar por axios y sweetalert2
    Swal.fire({
        title: "¿Confirmar Eliminación?",
        text: "Una vez eliminada no se puede recuperar",
        //icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
        }).then((result) => {
        if (result.isConfirmed) {
            //enviar la petición con fetch
            const url=`${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
            //console.log(url);
            fetch(url,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
                .then(response=response.json())
                .then(data=>{
                    console.log(data);
                })
                .catch(error=>console.log(error));
/*
            Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
            });
            */
        }
        });
}
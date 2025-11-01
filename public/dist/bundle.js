/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("{document.addEventListener('DOMContentLoaded',()=>{\r\n    const skills=document.querySelector('.lista-conocimientos');\r\n    if(skills){\r\n        skills.addEventListener('click', agregarSkills);\r\n    }\r\n    skillsSeleccionados();\r\n    contratoSeleccionado();\r\n\r\n    //limpiar las alertas\r\n    let alerta=document.querySelector('.error');\r\n    if(alerta){\r\n        setTimeout(()=>{\r\n            alerta.remove();\r\n        },3000);\r\n    }\r\n});\r\n\r\nconst skillsClicked=new Set();\r\n\r\nconst agregarSkills=(e)=>{\r\n    console.log(e.target);\r\n    if(e.target.tagName==='LI'){\r\n        if(e.target.classList.contains('activo')){\r\n            //quitarlo del set y quitar la clase\r\n            skillsClicked.delete(e.target.textContent);\r\n            e.target.classList.remove('activo');\r\n            \r\n        }else{\r\n            //agregarlo al set y agregar la clase\r\n            skillsClicked.add(e.target.textContent);\r\n            e.target.classList.add('activo');   \r\n            console.log(Array.from(skillsClicked)); \r\n            const skillsArray=[...Array.from(skillsClicked)];\r\n            document.querySelector('#skills').value=skillsArray;        \r\n        }\r\n    }\r\n    const skillsArray=[...skillsClicked];\r\n    document.querySelector('#skills').value=skillsArray;\r\n}\r\n\r\nconst skillsSeleccionados=()=>{\r\n    const habilidades=document.querySelectorAll('.lista-conocimientos li');\r\n    if(document.querySelector('h3') && document.querySelector('h3').textContent==='Información General'){\r\n    const seleccionadas=document.querySelector('#seleccionadas').value.split(',');\r\n    //console.log(habilidades);\r\n    \r\n    habilidades.forEach(habilidad=>{\r\n        //console.log(habilidad.textContent);\r\n        if(seleccionadas.includes(habilidad.textContent)){\r\n            //console.log(habilidad);\r\n            habilidad.classList.add('activo');\r\n        }\r\n    });\r\n    const skillsSelected=document.querySelectorAll('.lista-conocimientos .activo');\r\n    const skillsArray2=[...skillsSelected];\r\n    document.querySelector('#skills').value=skillsArray2;\r\n    }\r\n    \r\n}\r\n\r\nconst contratoSeleccionado=()=>{\r\n    if(document.querySelector('h3') && document.querySelector('h3').textContent==='Información General'){\r\n        const contratoSelected=document.querySelector('#contr').value;\r\n        const opcionesContrato=document.querySelectorAll('select.contrato option');\r\n        opcionesContrato.forEach(opcion=>{\r\n            if(opcion.value===contratoSelected){\r\n                opcion.selected=true;\r\n            }\r\n        });\r\n    }\r\n    \r\n}\n\n//# sourceURL=webpack://devjobs/./public/js/app.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;
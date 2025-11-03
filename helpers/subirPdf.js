import multer from 'multer';
import path from 'path';
import { generarId } from './token.js';

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/cv');
    },
    filename:function(req,file,cb){
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const uploadPdf=multer({storage});

export default uploadPdf;
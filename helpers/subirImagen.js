import multer from 'multer';
import path from 'path';
import { generarId } from './token.js';

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/perfiles');
    },
    filename:function(req,file,cb){
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload=multer({storage});

export default upload;
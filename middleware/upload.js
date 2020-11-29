const util = require('util');
const multer = require('multer');
const maxSize = 2*1024*1024;
const path = require('path');

let storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        let ext = path.extname(file.originalname).toLowerCase();
        if(ext === '.pdf'){
            return  cb(null,`public/files`)
        }else if(ext === '.png'|| ext === '.jpeg' ||  ext === '.jpg' ){
            return  cb(null,`public/photos`)
        }
    },
    filename:(req,file,cb) =>{
        let ext = path.extname(file.originalname);
        if(ext === '.pdf'){
           return  cb(null,`file_${Date.now()}${path.extname(file.originalname)}`)
        }else{
           return  cb(null,`photo_${Date.now()}${path.extname(file.originalname)}`)
        }
    }
})


let uploadFile = multer({
    storage:storage,
    limits:{fileSize:maxSize}
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);


module.exports = uploadFileMiddleware;

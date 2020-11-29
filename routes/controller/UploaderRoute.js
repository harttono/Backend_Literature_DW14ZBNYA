const uploadFile = require('../../middleware/upload');



// upload file
exports.upload = async (req,res,next) =>{
    try{
        
        await uploadFile(req,res,(err) =>{
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                  return res.status(400).send({
                    status: 'fail',
                    message: `Max file sized 2mb`,
                    code: 400,
                  });
                }
                return res.status(400).send(err);
            }

            if(req.file == undefined){
                return res.status(400).send({
                    message:'Please upload a file !'
                })
            }
            let ext = path.extname(req.file.originalname);
            res.status(200).send({
                message:`Uploaded the ${req.file.originalname} successfully.`,
                filename:`${req.file.originalname}`,
                url:ext === '.pdf' ? `http://localhost:8000/files/${req.file.filename}` : `http://localhost:8000/photos/${req.file.filename}`
            })
        });    
    }
    catch(err){
        res.status(500).send({
            message:`Could not upload the file : ${req.file.originalname}. ${err}`
        })
    }
}


// download file
exports.getFiles = (req,res) =>{
    const filename = req.params.name;
    res.download(`http://localhost:8000/`,filename, err =>{
        if(err){
            res.status(500).send({
                message:'could not download the file'+err
            })
        }
    })
}


const uploadFile = require('../../middleware/upload');

// upload file
exports.upload = async (req,res) =>{
    try{
        await uploadFile(req,res);
        if(req.file == undefined){
            return res.status(400).send({
                message:'Please upload a file !'
            })
        }
        
        res.status(200).send({
            message:`Uploaded the ${req.file.originalname} successfully.`,
            filename:`${req.file.originalname}`,
            url:`http://localhost:8000/files/${req.file.filename}`
        })
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
    res.download(`http://localhost:5000/`,filename, err =>{
        if(err){
            res.status(500).send({
                message:'could not download the file'+err
            })
        }
    })
}


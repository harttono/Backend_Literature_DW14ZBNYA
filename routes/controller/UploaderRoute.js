const uploadFile = require('../../middleware/upload');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const firebase = require('firebase');
const fs = require('fs');

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

                if(req.file === undefined){
                    return res.status(400).send({
                        status: 'check',
                        message:'Please upload a file !',
                        code: 400
                    })
                }
                
                cloudinary.config({
                    cloud_name:'harttonz',
                    api_key:'652211497259339',
                    api_secret:'0Tk8LUBf-e8IE8NqkXinCcSqKRU'
                })
            
                const path = req.file.path
                const uniqueFilename = new Date().toISOString()
            
                cloudinary.uploader.upload(
                  path,
                  { public_id: `literature/${uniqueFilename}`, tags: `literature` }, 
                  function(err, image) {
                    if (err) return res.send(err)
                    fs.unlinkSync(path)
                    res.status(200).send({
                        status:'uploaded',
                        message:`Uploaded the ${req.file.originalname} successfully.`,
                        url:`${image.url}`
                    })
                  }
                )
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


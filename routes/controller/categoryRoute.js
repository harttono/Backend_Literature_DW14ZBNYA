const {Category} = require('../../models');

// show all categories
exports.getAllCategories = async(req,res) =>{
    try{
    const allCategories = await Category.findAll({
        attributes:['id','name']
    });
    res.send({
        message:'list of categories',
        data:allCategories
    })
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// detail category
exports.detailCategory = async(req,res) =>{
    try{
    const {id} = req.params;
    const detailCategory = await Category.findOne({
        where:{
            id
        },  
        attributes:['id','name']    
    })
    if(detailCategory){
        res.send({
            message:'detail category',
            data:detailCategory
        })
    }else{
        res.status(400).send({
            message:`Detail category with Id ${id} not found.`
        })
    }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// add new category
exports.addCategory = async(req,res) =>{
    try{
    const {name} =req.body;
    const data = {name}
    const savedCategory = await Category.create(data);
    if(savedCategory){
        const showCategory = await Category.findOne({
            where:{name:name},
            attributes:['id','name']
        })
        if(showCategory){
            res.send({
                message:`category data has been created successfully.`,
                data:showCategory
            })
        }
    }else{
        res.status(400).send({
            message:'no data to be saved.'
        })
    }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}


// update category
exports.updateCategory = async(req,res) =>{
    try{
     const {id} = req.params;
     const {name} = req.body;
     const Data = {name}   
     const updatedData = await Category.update(Data,{
         where:{id}
     })
     if(updatedData){
        const getUpdated = await Category.findOne({
            where:{id},
            attributes:['id','name']
        })
        res.status(200).send({
            message:`Data with Id ${id} has been updated successfully.`,
            data:getUpdated
        })
     }else{
         res.status(400).send({
             message:`Updated data with Id ${id} failed.`
         })
     }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// delete category 
exports.deleteCategory = async(req,res) =>{
   try{
    const {id} = req.params;
    const DeletedCategory = await Category.destroy({
        where:{id}
    })
    if(DeletedCategory){
        res.status(200).send({
            message:`Data with Id ${id} has been deleted.`,
        })
    }
   }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
   }
}
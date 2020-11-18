const {Literature,User,Category} = require('../../models');

const {Op} = require('sequelize');


// Add Book
exports.add_Literature = async(req,res) =>{
    try{
         const {title,category,author,publication,pages,ISBN,status,cover,attachment,description} = req.body;

         const Data = {
             title:title,
             category:category.id,
             user:req.user.id,
             author:author,
             publication:publication,
             pages:pages,
             ISBN:ISBN,
             status:status,
             cover:cover,
             attachment:attachment,
             description:description
         }
         const saved = await Literature.create(Data);
         if(saved){
             const newLiteratureId = saved.id;
             const detail = await Literature.findOne({
                 where:{id:newLiteratureId},
                 include:[
                    {
                        model:Category,
                        as:"categoryId",
                        attributes:['id','name']
                    },
                     {
                        model:User,
                        as:"userId",
                        attributes:['id','email','fullname','gender','phone','address']
                     }
                 ],
                 attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description']
             })
             if(detail){
                  res.status(200).send({
                    message:'Your literature has been added successfully.',
                    data:detail
                })
             }else{
                  res.status(400).send({
                    message:'there was an error in saving data.'
                })
             }
         }
    }catch(err){
         res.status(500).send({
             message:`error ${err}`
         })
    } 
 }

//  Detail a book
exports.detail_Literature = async(req,res) =>{
    try{
        const {id} = req.params;
        const Detail = await Literature.findOne({
            where:{id},
            include:[
                {
                    model:Category,
                    as:"categoryId",
                    attributes:['id','name']
                },
                {
                    model:User,
                    as:"userId",
                    attributes:['id','email','fullname','gender','phone','address']
                }
            ],
            attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description']
        })

        if(Detail){
            res.status(200).send({
                message:`Your literature with ${id} has loaded sucessfully.`,
                data:Detail
            })
        }else{
            res.status(400).send({
                message:`Your book with Id ${id} is not found.`,
            })
        }         
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// Edit book
exports.edit_Literature = async(req,res) =>{
    try{
        const {id} = req.params;
        const updated = await Literature.update(req.body,{
            where:{id}
        });
        if(updated){
            const GetDetail = await Literature.findOne({
                where:{id},
                include:[
                    {
                        model:Category,
                        as:"categoryId",
                        attributes:['id','name']
                    },
                    {
                        model:User,
                        as:"userId",
                        attributes:['id','email','fullname','gender','phone','address']
                    }
                ],
                attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description']
            })
            res.status(200).send({
                message:`Your literature with id ${id} has been updated successfully.`,
                data:GetDetail
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
 }



// Search a book by title 
exports.searchLiterature = async(req,res) =>{
    try{
    const {title,publication} = req.query;

    if(title && publication){
        const get_title_and_publication = await Literature.findAll({
            attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description'],
            include:[
                {
                    model:Category,
                    as:"categoryId",
                    attributes:['id','name']
                },
                {
                    model:User,
                    as:"userId",
                    attributes:['id','email','fullname','gender','phone','address']
                }
            ],
            where:{
                title:{[Op.like]:`%${title}%`},
                publication:publication,
                status:'approved'
            }
        });
        if(get_title_and_publication.length > 0){
          res.status(200).send({
              data:get_title_and_publication,
              message:'books has been loaded.'
        })
        }else{
            res.status(400).send({
                message:'No Book Available'
            })
        }
    }else if(title){
        const get_by_title = await Literature.findAll({
            attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description'],
            include:[
                {
                    model:Category,
                    as:"categoryId",
                    attributes:['id','name']
                },
                {
                    model:User,
                    as:"userId",
                    attributes:['id','email','fullname','gender','phone','address']
                }
            ]
            ,where:{
                status:'approved',
                title:{[Op.like]:`%${title}%`}
            }
        });
        if(get_by_title.length > 0){
            res.status(200).send({
                message:'literatures has been loaded.',
                data:get_by_title
            })
        }else{
            res.status(400).send({
                message:'No Literature Available'
            })
        }
      
    }else{
        res.status(400).send({
            message:"Type any word to search."
        });
    }
    }catch(err){
        return  res.status(500).send({
            message:`error ${err}`
        })
    }
}

// get all literatures
exports.getLiteratures = async(req,res) =>{
    try{
        const literatures = await Literature.findAll({
            attributes:['id','publication'],
            where:{
                status:'approved'
            }
        });
        if(literatures.length > 0){
            res.status(200).send({
                data:literatures,
                message:'Literatures has been loaded.'
            })
        }else{
            res.status(400).send({
                message:'No Literature Available'
            })
        }   
    }catch(err){
        return  res.status(500).send({
            message:`error ${err}`
        })
    }
}
    

//  Delete book user
exports.delete_Literature = async(req,res) =>{
    try{
        const {id} = req.params;
        const deleted = await Literature.destroy({
                where:{id:id,user:req.user.id}
       })
        if(deleted){
             res.status(200).send({
                   message:`Your Literature with Id ${id} has been deleted.`
               })
        }else{
             res.status(400).send({
                   message:`no Literature with id ${id},`
             })       
        }
       
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// Show my book
exports.myLiteratures = async(req,res) =>{
    try{
        const myLiteratures = await Literature.findAll({
            attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description'],
            where:{
                user:req.user.id
            }
        })
        if(myLiteratures){
            res.status(200).send({
                message:`Here are your Literatures.`,
                data:myLiteratures
            })
        }else{
            res.status(400).send({
                message:`no Literature found.`
            })       
       }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}


// sort literature

exports.sort = async (req,res) =>{
    const {status} =  req.query;
    try{
       if(status){
            const sorted = await Literature.findAll({
                attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment','description'],
                where:{
                    status:status
                }
            })
            if (sorted){
                res.status(200).send({
                    data:sorted
                })
            }else{
                res.status(400).send({
                    message:`use params for sorted data`
                })
            }
       }

    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}
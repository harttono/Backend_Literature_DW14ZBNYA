const {Literature,Category,User} = require('../../models');

// list of books by Admin
exports.list_Literatures = async(req,res) =>{
    const {status} = req.query;
    try{
    if(status){
        const sortedLiteratures = await Literature.findAll({
            order:[['id','ASC']],
            attributes:['id','title','category','user','author','publication','pages','ISBN','status','cover','attachment'],
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
                status:status
            }
        });
        if(sortedLiteratures){
            return res.status(200).send({
                data:sortedLiteratures
            })
        }
    }else{
        const listLiteratures = await Literature.findAll({
            order:[['id','ASC']],
            attributes:['id','title','category','user','author','publication','pages','ISBN','status','cover','attachment'],
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
        });
        if(listLiteratures.length > 0){
            return res.send({data:listLiteratures})
        }else{
            return res.status(400).send({
                message:'list of book is empty.'
            })
        }
    }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// update Book's User by Admin
exports.edit_LiteratureUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        const updateStatus = {
            status:status
        }
        const updated = await Literature.update(updateStatus,{
            where:{id}
        });
        if(updated){
            const getDetail = await Literature.findOne({
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
                attributes:['id','title','category','user','author','publication','pages','ISBN','status','cover','attachment']
            })
            res.send({
                message:`Your book with id ${id} has been updated successfully.`,
                data:getDetail
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
 }


//  Delete book user by admin
exports.delete_literatureUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const deleted = await Literature.destroy({
                where:{id:id}
       })
        if(deleted){
             res.status(200).send({
                   message:`book with Id ${id} has been deleted.`
               })
        }else{
             res.status(400).send({
                 message:`no book with id ${id},`
             })       
        }
       
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

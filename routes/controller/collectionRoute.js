const {Literature,Category,User,Collection} = require('../../models');

// add new add book
exports.addCollection = async (req,res) =>{
    try{
       const {userId,literatureId} = req.query;


        const added = await Collection.create({
            userId:userId,
            literatureId:literatureId
        });
   
        if(added){
               const getDetail = await Literature.findOne({
                   where:{
                       id:literatureId
                   },
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
                   attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment'],
               })
               if(getDetail){
                   res.status(200).send({
                       message:`you've bookmarked this literature !!!`,
                       data:getDetail
                   })
               }else{
                   res.status(200).status({
                       message:`you can't bookmark this literature..`
                })
            }
        }
        
    
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        }) 
    }
    
}


// deleted bookmark
exports.deleteCollection = async (req,res) =>{
   try{
        const {literatureId} = req.params;
        const deleted = await Collection.destroy({
            where:{
                userId:req.user.id,
                literatureId:literatureId
            }
        });
 
        if(deleted){
            const getDetail = await Literature.findOne({
                where:{
                    id:literatureId
                },
                attributes:['id','title','category','user','author','publication','pages','ISBN','status','cover','attachment'],
            })
            if(getDetail){
                res.status(200).send({
                    message:'your bookmark has been deleted successfully !!!',
                    data:getDetail
                })
            }
            
        }else{
            res.status(400).send({
                message:`You've not bookmarked yet !!!`
            })
        }
   }catch(err){
        res.status(500).send({
            message:`error ${err}`
        }) 
   }
}


// get MyBookmark
exports.getMyCollection = async(req,res) =>{
    try{
        const myCollections = await Collection.findAll({
            where:{
                userId:req.user.id
            },
            include:[
                {
                    model:Literature,
                    as:"literatures",
                    attributes:['id','title','author','publication','pages','ISBN','status','cover','attachment'],
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
                },
                {
                    model:User,
                    as:"users",
                    attributes:['id','email','fullname','gender','phone','address'],
                }
            ],
             attributes:['id']
        })
        if(myCollections){
            res.status(200).send({
                message:`list of literatures has marked`,
                data:myCollections
            })
        }else{
            res.status(400).status({
                message:`No Literature.`
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        }) 
    }
}
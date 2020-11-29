const {User}   = require('../../models');
const bycypt = require('bcrypt');
const {getToken} = require('../../middleware/auth');
const validator = require('@hapi/joi');

// Login 
exports.login = async (req,res) =>{
    try{
        const{email,password} = req.body;
        const validateSchema = validator.object({
            email:validator.string().email().min(10).required()
        })
        const {error} = validateSchema.validate({email});
        if(error){
            return res.status(400).send({
                message:error.details[0].message
            })
        } 
        const signInUser = await User.findOne({
            where:{
                email
            }
        })
        if(signInUser){
            if(bycypt.compareSync(password,signInUser.password)){
                res.status(200).send({
                    message:`You've logged in successfully !`,
                    data:{
                        id:signInUser.id,
                        email:signInUser.email,
                        fullname:signInUser.fullname,
                        gender:signInUser.gender,
                        phone:signInUser.phone,
                        address:signInUser.address,
                        isAdmin:signInUser.isAdmin,
                        picture:signInUser.picture,
                        token:await getToken(signInUser),
                    }
                })
            }else{
                return res.status(400).send({
                    message:'Invalid Password.'
                })
            }
        }else{
            return res.status(400).send({
                message:'Invalid username or password.'
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// Register User
exports.register = async (req,res) =>{
    try{
        const {email,password,fullname,gender,phone,address} = req.body;
        const validateSchema = validator.object({
            email:validator.string().email().min(10).required(),
            password:validator.string().min(8).required(),
            fullname:validator.string().min(5).required(),
            gender:validator.string().min(4).required(),
            phone:validator.number().min(12).required(),
            address:validator.string().min(10).required(),  
        })
        const {error} = validateSchema.validate(req.body);
        if(error){
            return res.status(400).send({
                message:error.details[0].message
            })
        } 
        const userData = {
            email:email,
            password:password,
            fullname:fullname,
            gender:gender,
            phone:phone,
            address:address,
            role:"User",
            isAdmin:false,
            picture:'http://localhost:8000/photos/account.png'
        }
        const user = await User.findOne({
            where:{
                email:email
            }
        })
        if(!user){
            bycypt.hash(req.body.password,10,async(err,hash)=>{
                userData.password = hash;
                const newUser = await User.create(userData);
                if(newUser){
                    res.send({
                        message:'Your data has been saved successfully !',
                        data:{
                            id:newUser.id,
                            email:newUser.email,
                            fullname:newUser.fullname,
                            isAdmin:newUser.isAdmin,
                            gender:newUser.gender,
                            phone:newUser.phone,
                            address:newUser.address,
                            picture:newUser.picture,
                            token:getToken(newUser),
                        }
                    })
                }else{
                    return res.status(400).send({
                        message:'Invalid user data !.'
                    })
                }
            })
        }else{
            res.status(400).send({
                message:'Your email already exist !.'
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}


// generate admin
exports.createAdmin = async (req,res) =>{
    try{
        const adminData = {
            email:"harttonz@gmail.com",
            password:"harttonz04",
            fullname:"harttonz",
            gender:"male",
            phone:0895332018,
            address:"pemalang",
            role:"Admin",
            isAdmin:1,
            picture:'https://literature04.herokuapp.com/photos/account.png'
        }
        
        bycypt.hash(adminData.password,10,async(err,hash)=>{
            adminData.password = hash;
            const newAdmin = await User.create(adminData);
            if(newAdmin){
                res.send({data:newAdmin})
            }else{
                res.status(400).send({
                    message:'Invalid Admin Data.'
                })
            }
        })
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// Get  Users by admin
exports.getUsers = async(req,res) =>{
    try{
        const users = await User.findAll({
            attributes:{
                exclude:['password','role','isAdmin','picture','createdAt','updatedAt']
            }
        });
        if(users){
            return res.send({
                data:users
            })
        }
    }catch(err){
            res.status(500).send({
                message:`error ${err}`
            })
    }
}

// delete User
exports.deleteUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const deletedUser = await User.destroy({
            where:{
                id
            }
        })
        if(deletedUser){
            res.status(200).send({
                message:`User with Id ${id} has been deleted successfully !`,
                data:id
            })
        }else{
            res.status(400).send({
                message:`User with Id ${id} not found.`
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}

// update picture user
exports.updateUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const {picture} = req.body;
        const updatedData ={
            picture:picture
        }
        const updatedUser = await User.update(updatedData,{
            where:{
                id
            }
        })
        if(updatedUser){
            res.status(200).send({
                message:`Your profile has been updated successfully !`,
                picture:picture
            })
        }else{
            res.status(400).send({
                message:`failure in updating your profile.`
            })
        }
    }catch(err){
        res.status(500).send({
            message:`error ${err}`
        })
    }
}



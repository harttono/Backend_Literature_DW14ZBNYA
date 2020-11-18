const express = require('express');
const router  = express.Router();
const {isAuth,isAdmin}   = require('../../middleware/auth');



// user endpoint
const {register,login,createAdmin,getUsers,deleteUser,updateUser} = require('../controller/userRoute');

router.post('/register',register);
router.post('/login',login);
router.post('/createAdmin',createAdmin);
router.get('/users',isAuth,isAdmin,getUsers);
router.delete('/user/:id',isAuth,isAdmin,deleteUser);
router.patch('/user/:id',isAuth,updateUser);

// category endpoint
const {addCategory,getAllCategories,detailCategory,updateCategory,deleteCategory} = require('../controller/categoryRoute');

router.get('/category',isAuth,getAllCategories);
router.post('/category',isAuth,isAdmin,addCategory);
router.get('/category/:id',isAuth,isAdmin,detailCategory);
router.patch('/category/:id',isAuth,updateCategory);
router.delete('/category/:id',isAuth,isAdmin,deleteCategory);

// transaction list endpoint
const {list_Literatures,edit_LiteratureUser,delete_literatureUser} = require('../controller/transactionRoute');
router.get('/list_transaction',isAuth,isAdmin,list_Literatures);
router.patch('/list-transaction/:id',isAuth,isAdmin,edit_LiteratureUser);
router.delete('/list-transaction/:id',isAuth,isAdmin,delete_literatureUser);

// literature endpoint
const {sort,add_Literature,detail_Literature,edit_Literature,searchLiterature,delete_Literature,myLiteratures,getLiteratures} = require('../controller/literatureRoute');
router.post('/literature',isAuth,add_Literature);
router.get('/literature/:id',isAuth,detail_Literature);
router.patch('/literature/:id',isAuth,edit_Literature);
router.delete('/literature/:id',isAuth,delete_Literature);
router.get('/literatures',isAuth,searchLiterature);
router.get('/getLiteratures',isAuth,getLiteratures);
router.get('/myLiteratures',isAuth,myLiteratures);
router.get('/sorted',isAuth,sort);


// collection endpoint
const {addCollection,deleteCollection,getMyCollection} = require('../controller/collectionRoute');
router.get('/collection',isAuth,addCollection);
router.delete('/collection/:literatureId',isAuth,deleteCollection);
router.get('/collections',isAuth,getMyCollection);

// upload file
const {upload,getFiles} = require('../controller/UploaderRoute');
router.post('/upload',upload);
router.get('/files/:name',getFiles);

module.exports = router;
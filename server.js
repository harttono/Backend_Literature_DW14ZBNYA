const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = require('./routes/router');
const Port = process.env.PORT || 8000;
app.use(cors());

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
  next();
});

app.get('/',(req,res) =>{
  res.status(200).send({
     message:`use https://literature04.herokuapp.com/api/v1 for accessing this API`
  })
})

app.use('/files',express.static('public/files'));
app.use('/photos',express.static('public/photos'));
app.use('/api/v1',router)
app.listen(Port,() => console.log(`port ${Port} is listening.`))


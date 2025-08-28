const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOvirride = require('method-override');
const mongoose = require('mongoose');
const port = 3000; 
// criar o objeto
 
const app = express();
 
//Vincule middlewares
app.use(cors());

app.use(methodOvirride('X-HTTP-Method'));
app.use(methodOvirride('X-HTTP-Method-Override'));
app.use(methodOvirride('X-Methos-Override'));
app.use(methodOvirride('_method'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
  res.send({status: 'ok'});
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
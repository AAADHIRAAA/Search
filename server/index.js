const express = require("express");
const app = express();

const PORT=8000;
const connectDB = require('./connection');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


connectDB().then(()=>{

    const bookRouter = require('./bookRouter');
    app.use(cors());
  
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/books',bookRouter);
    


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
})
.catch((error) => {
    console.error('Error:', error);
  });

  module.exports=app;

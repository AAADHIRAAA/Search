
const express = require('express');
const router =express.Router();
const Book=require("./models/bookModel");



router.get('/viewbooks',async(req,res)=>{
    try{
     
          const books = await Book.find();
          return res.status(200).json(books);
    }
    catch(e){
        console.error(e);
        return res.status(500).json({message:'Internal Server Error'});
    }
})

module.exports=router;
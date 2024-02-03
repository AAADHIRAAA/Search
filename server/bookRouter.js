
const express = require('express');
const router =express.Router();
const Book=require("./models/bookModel");



router.get('/viewbooks',async(req,res)=>{

        const page = parseInt(req.query.page) || 1; // Current page number, default to 1
        const pageSize = parseInt(req.query.pageSize) || 50; // Number of items per page, default to 50
    try{
        const totalCount = await Book.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;

        // Fetch data with pagination
        const data = await Book.find()
            .skip(skip)
            .limit(pageSize);

        res.json({
            data,
            currentPage: page,
            totalPages,
            totalCount
        });

    }
    catch(e){
        console.error(e);
        return res.status(500).json({message:'Internal Server Error'});
    }
})

router.get('/find/:search',async(req,res)=>{
    try{
        console.log("call");
        const search = req.params.search;
        const data = await Book.findOne({isbn:search});
        if(!data){
            return res.status(200).json([]);
        }
        return res.status(200).json(data);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal Error"});
    }
})

router.get('/count',async(req,res)=>{

    try{
            const count = await Book.countDocuments();
            return res.status(200).json(count);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal Error"});
    }
})

module.exports=router;
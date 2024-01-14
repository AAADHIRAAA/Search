
const express = require('express');
const router =express.Router();
const Book=require("./models/bookModel");



router.get('/viewbooks',async(req,res)=>{

        const page = parseInt(req.query.page) || 1; // Current page number, default to 1
        const pageSize = parseInt(req.query.pageSize) || 50; // Number of items per page, default to 10
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

module.exports=router;
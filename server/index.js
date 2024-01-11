const express = require("express");
const app = express();

const PORT=8000;

const router = express.Router();

app.use(router);






app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
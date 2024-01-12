const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    
    title: String,
    author_editor: String,
    publisher: String,
    isbn:String,
    language:String,
    ProductForm:String,
    Date:String,
});



const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

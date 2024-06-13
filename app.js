require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');
const { checkForAuthenticationCookie } = require('./middleware/authentication') 
const app = express();
const PORT = 9000; 

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
    .then(() => console.log('MongoDB is connected'));


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async(req, res) => {
   const allBlogs = await Blog.find({}); 
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})

app.listen(PORT, () => {
    console.log('Server is running');
})
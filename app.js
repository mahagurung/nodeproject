 const express = require('express');
 const path = require('path');
 const exhbs = require('express-handlebars');
 const mongoose = require('mongoose');
 const bodyParser = require('body-parser');
 const methodOverride = require('method-override');
 const upload = require('express-fileupload');
 const flash = require('connect-flash');
 const session = require('express-session');
 const {
     mongodbUrl
 } = require('./config/db');

 const passport = require('passport');
 const app = express()

 const {
     select,
     GenerateDate, paginate
 } = require('./helpers/handleber-helper')

 // //const main = require('./routes/home')


 app.engine('handlebars', exhbs({
     defaultLayout: 'home',
     helpers: {
         select: select,
         GenerateDate: GenerateDate,
         paginate:paginate
     },
     runtimeOptions: {
         allowProtoPropertiesByDefault: true,
         allowProtoMethodsByDefault: true
     }

 }));

 app.set('view engine', 'handlebars');
 app.use(express.static(path.join(__dirname, 'public')));


 // //Database conection
 //const MONGODB_URI = 'mongodb+srv://aggurung10:toor@cluster0.42cmr.mongodb.net/test?retryWrites=true&w=majority';
 

 mongoose.connect(mongodbUrl, ({
     useNewUrlParser: true,
     useUnifiedTopology: true,
 }), (err) => {
     if (err) return err;
     console.log('Database connected');
 });
 mongoose.set('useFindAndModify', false);
 mongoose.set('useCreateIndex', true);

 // //upload middleware
 app.use(upload());

 // //bodyParser
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
     extended: true
 }));

 //use method override
 app.use(methodOverride('_method'));

 //session for flash message
 app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
 }))


 app.use(flash());


 app.use(passport.initialize());
 app.use(passport.session());

 //local variable using middleware
 app.use((req, res, next) => {
     res.locals.user = req.user || null;
     res.locals.success_message = req.flash('success_message');
     res.locals.error_message = req.flash('error_message');
     res.locals.error = req.flash('error');
     next();
 })
 // app.use((req, res, next) => {
 //     res.locals.user = req.user || null;
 //     res.locals.success_message = req.flash('success_message');
 //     res.locals.error_message = req.flash('error_message');
 //     res.locals.form_errors = req.flash('form_errors');
 //     res.locals.error = req.flash('error');
 //     next();
 // })

 // //Load routes

 const home = require('./routes/home/index');
 const admin = require('./routes/admin/index');
 const posts = require('./routes/admin/post');
 const categories = require('./routes/admin/categories');
 const comments = require('./routes/admin/comments');

 // //use routes
 app.use('/', home);
 app.use('/admin', admin);
 app.use('/admin/posts', posts);
 app.use('/admin/categories', categories);
 app.use('/admin/comments', comments);

 // //Server connection

 const port = process.env.PORT || 8080;
 app.listen(port, (req, res) => {
     console.log(`Server listening at ${port}`);
 });
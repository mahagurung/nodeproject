// const express = require('express');
// const router = express.Router();
// const Post = require('../../models/Post')
// const Category = require('../../models/Category')
// const User = require('../../models/User');
// const bcrypt = require('bcryptjs');
// const flash = require('connect-flash');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// router.all('/*', (req, res, next) => {
//     req.app.locals.layout = 'home';
//     next();
// });


// router.get('/', (req, res) => {

//     Post.find().then(posts => {
//         Category.find().then(categories => {
//             res.render('home/index', {
//                 posts: posts,
//                 categories: categories
//             });
//         })
//     })

// })


// router.get('/login', (req, res) => {
//     res.render('home/login');
// })

// //App Login
// passport.use(new LocalStrategy({
//     usernameField: 'email'
// }, (email, password, done) => {
//     User.findOne({
//         email: email
//     }).then(user => {
//         if (!user) return done(null, false, {
//             message: 'No user found'

//         })

//         bcrypt.compare(password, user.password, (err, matched) => {
//             if (err) return err;
//             if (matched) {
//                 return done(null, user)
//             } else {
//                 return done(null, false, {
//                     message: 'Incorrect password'
//                 });
//             }
//         })
//     })

// }));

// //passport serialzaton
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });



// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/admin',
//         failureRedirect: '/login',
//         failureFlash: true

//     })(req, res, next);

//     //res.render('home/login');
// })


// //Logout
// router.get('/logout', (req, res) => {
//     req.logOut();
//     res.redirect('/login');
// })


// router.get('/register', (req, res) => {
//     res.render('home/register');
// })


// router.post('/register', (req, res) => {
//     let errors = [];

//     if (!req.body.firstName) {
//         errors.push({
//             message: 'Please fill firstname'
//         });
//     }
//     if (!req.body.lastName) {
//         errors.push({
//             message: 'Please fill firstName'
//         });
//     }
//     if (!req.body.email) {
//         errors.push({
//             message: 'Please fill lastName'
//         });
//     }
//     if (!req.body.password) {
//         errors.push({
//             message: 'Please fill Password'
//         });
//     }

//     if (req.body.password !== req.body.passwordConfirm) {
//         errors.push({
//             message: 'field did not match'
//         });
//     }

//     if (!req.body.passwordConfirm) {
//         errors.push({
//             message: 'Please fill Password Confirm'
//         });
//     }

//     if (errors.length > 0) {
//         res.render('home/register', {
//             errors: errors,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email,

//         })
//     } else {

//         User.findOne({
//             email: req.body.email
//         }).then(user => {
//             if (!user) {
//                 const newUser = new User({
//                     firstName: req.body.firstName,
//                     lastName: req.body.lastName,
//                     email: req.body.email,
//                     password: req.body.password

//                 });

//                 bcrypt.genSalt(10, (err, salt) => {
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
//                         //console.log(hash);
//                         newUser.password = hash;
//                         newUser.save().then(userSaved => {
//                             req.flash('success_message', 'You are registered, plz login')
//                             res.redirect('/login')
//                         })
//                     })
//                 })

//             } else {
//                 req.flash('error_message', 'Email already exist', 'plz login');
//                 res.redirect('/login');
//             }
//         })




//     }

// })



// router.get('/post/:id', (req, res) => {
//     Post.findOne({
//             _id: req.params.id
//         })
//         .then(post => {

//             Category.find({}).then(categories => {
//                 res.render('home/post', {
//                     post: post,
//                     categories: categories
//                 })
//             })
//             // res.render('home/post', {
//             //     post: post
//             // })

//         })
// })

// module.exports = router;
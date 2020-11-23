const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const { authenticate } = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
})

router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    Post.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(posts => {

        Post.estimatedDocumentCount().then((postCount=>{
            Category.find({}).then(categories => {
                res.render('home/index', {
                    posts: posts,
                    categories: categories,
                    current:parseInt(page),
                    pages:Math.ceil(postCount/perPage)
                });
            })
        }))
    })

})

router.get('/post/:slug', (req, res) => {
    Post.findOne({
        slug: req.params.slug
    }).populate({
        path: 'comments',
        match:{approveComment:true},
        populate: {
            path: 'user',
            model: 'users'
        }
    }).populate('user').then(post => {
        Category.find({}).then(categories => {
            res.render('home/post', {
                post: post,
                categories: categories
            })
        })
    })
})

// App Login
router.get('/login', (req, res) => {
    res.render('home/login');
})

//App Login
passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.findOne({
        email: email
    }).then(user => {
        if (!user) return done(null, false, {
            message: 'No user found'

        })

        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) return err;
            if (matched) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
        })
    })

}));

//passport serialzaton
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});



router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);

    //res.render('home/login');
})

//Logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})


//Register
router.get('/register', (req, res) => {
    res.render('home/register');
});


router.post('/register', (req, res) => {
    let error = '';
    if (!req.body.firstName) {
        error.push({
            message: 'please add first Name'
        });
    }
    if (!req.body.lastName) {
        error.push({
            message: 'please add last Name'
        });
    }
    if (!req.body.email) {
        error.push({
            message: 'please add email'
        });
    }
    if (!req.body.password) {
        error.push({
            message: 'please add password'
        });
    }
    if (!req.body.passwordConfirm) {
        error.push({
            message: 'please confirm password'
        });
    }

    if (req.body.password !== req.body.passwordConfirm) {
        req.flash('error', 'Password filed did not match');
    }

    if (error.length > 0) {
        res.render('home/register', {
            error: error,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        });
    } else {

        User.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        newUser.password = hash;
                        newUser.save().then(userSaved => {
                            req.flash('success_message', 'You are now registered, Please login');
                            res.redirect('/login');
                        })
                    });
                });

            } else {
                req.flash('error_message', 'user already exist plz register');
                res.redirect('/register');
            }
        })

    }

});

module.exports = router;
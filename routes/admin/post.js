const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category')

const {
    //     Empty,
    uplaodDir
} = require('../../helpers/upload-helper');

// const {
//     userAuthenticated
// } = require('../../helpers/authentication');

// const {
//     post
// } = require('../home');

const fs = require('fs');
//const path = require('path')

// //const {
// //  dir
// //} = require('console');

// //override 
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
})


router.get('/', (req, res) => {
    Post.find({}).populate('category').then(posts => {
        res.render('admin/posts', {
            posts: posts
        });
    })
})

router.get('/my-post', (req, res) => {
    Post.find({
        user: req.user.id
    }).populate('category').then(posts => {
        res.render('admin/posts/my-post', {
            posts: posts
        });
    })
})


router.get('/create', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create', {
            categories: categories
        });
    })

});



router.post('/create', (req, res) => {

    let filename = '';
    let file = req.files.file;
    filename = Date.now + '-' + file.name;

    file.mv('./public/upload/' + filename, (err) => {
        if (err) throw err;
    })

    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }

    const newPost = new Post({
        user: req.user.id,
        title: req.body.title,
        status: req.body.status,
        category: req.body.category,
        allowComments: allowComments,
        body: req.body.body,
        //category: req.body.category,
        file: filename
    })
    newPost.save().then(savedPost => {
        req.flash('success_message', `Post ${savedPost.title} was successfully created`);
        res.redirect('/admin/posts');
    }).catch(error => {
        console.log('Could not saved Data');
    })
})


router.get('/edit/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).then(post => {
        Category.find({}).then(categories => {
            res.render('admin/posts/edit', {
                post: post,
                categories: categories
            });
        })
    })

});

router.put('/edit/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).then(post => {
        if (req.body.allowComments) {
            allowComments = true
        } else {
            allowComments = false
        }
        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.slug = req.body.title;

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;
        post.file = filename;
        file.mv('./public/upload/' + filename, (err) => {
            if (err) throw err;
        });
        post.save().then(savedUpdate => {
            req.flash('success_message', 'Post successfully updated');
            res.redirect('/admin/posts/my-post');
        })

    })

});

router.delete('/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).populate('comments').then(post => {
        fs.unlink(uplaodDir + post.file, (err) => {

            if (!post.comments.length < 1) {
                post.comments.forEach(comment => {
                    comment.remove();
                })
            }
            post.remove().then(postRemove => {
                req.flash('success_message', 'Post deleted')
                res.redirect('/admin/posts/my-post');
            })
        })
    })
})
module.exports = router;
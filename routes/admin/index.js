const express = require('express');
const Category = require('../../models/Category');
const router = express.Router();
// const faker = require('faker');
 const Post = require('../../models/Post');
 const Comment = require('../../models/Comment');
 const Promise = require('promise')
 
// const {
//     userAuthenticated
// } = require('../../helpers/authentication')


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res) => {
const promises = [
    Post.estimatedDocumentCount().exec(),
    Category.estimatedDocumentCount().exec(),
    Comment.estimatedDocumentCount().exec()
];
Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
    res.render('admin/index',{postCount:postCount, categoryCount:categoryCount, commentCount:commentCount});
})
    // Post.estimatedDocumentCount({}).then(postCount=>{
    //     res.render('admin/index',{postCount:postCount});
    // })
    
})


// router.post('/generate-fake-posts', (req, res) => {

//     for (i = 0; i < req.body.amount; i++) {
//         let post = new Post();
//         post.title = faker.name.title();
//         post.status = 'public';
//         post.allowComments = faker.random.boolean();
//         post.body = faker.lorem.sentence();

//         post.save((err) => {
//             if (err) throw err;

//         })

//     }
//     res.redirect('/admin/posts')
// })

module.exports = router;
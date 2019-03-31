/* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const {ListPosts} = require('./blog-post-model.js');

//error handler
function errorHandler(err, req, res, next){
    let code = err.code;
    let message = err.message;

    return res.status(code).send(message);
};

router.use(errorHandler);

router.get('/blog-posts', (req, res, next) => {

    let infoOfAllPosts = ListPosts.get();

    if ( infoOfAllPosts ){
        res.status(200).json({
            message : "Successfully sent the list of sports",
            status : 200,
            sports : infoOfAllPosts
        });
    }else{
        let err = new Error(`Internal server error.`);
        err.code = 500;
        return next(err);
    }
});

router.get('/blog-posts/:author', (req, res, next) => {

    if (!('author' in req.params)){
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }

    let postAuthor = req.params.author;

    if(ListPosts.exist("author",postAuthor)){

        res.status(200).json({
                    message : "Successfully sent the post",
                    status : 200,
                    post : ListPosts.getAllOf("author",postAuthor)

        });

    }else{
        let err = new Error("Author not found in the list");
        err.code = 404;
        return next(err);
    }
});

router.post('/blog-posts', (req, res, next) => {

    let requiredFields = ['title', 'content', 'author', 'publishDate'];

    for ( let i = 0; i < requiredFields.length; i ++){
        let currentField = requiredFields[i];

        if (! (currentField in req.body)){
            let err = new Error(`Missing field ${currentField} in body.`);
            err.code = 406;
            return next(err);
        }
    }

    let objectToAdd = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    };

    if (ListPosts.exist("id",objectToAdd.id))
    {
        let err = new Error(`That id is already in use.`);
        err.code = 409;
        return next(err);
    }else{
        res.status(201).json({
            message : "Successfully added the post",
            status : 201,
            post : ListPosts.post(objectToAdd)
        });
    }
});


router.delete( '/blog-posts/', (req, res, next) => {
    let err = new Error("Send id to delete as parameter");
    err.code = 406;
    return next(err);
});

router.delete( '/blog-posts/:id', (req, res, next) => {

    let postId = "postId Error";

    if (!('id' in req.params)){
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }
    if (!('id' in req.body)){
        let err = new Error(`Missing field id in body.`);
        err.code = 406;
        return next(err);
    }
    if (req.params.id == req.body.id)
        postId = req.params.id;
    else{
        let err = new Error(`ID passed in body must match id passed in path vars`);
        err.code = 406;
        return next(err);
    }

    if(ListPosts.exist("id",postId))
    {
        res.status(204).json({
            message : `Post with id:${postId} deleted.`,
            status : 204,
            post: ListPosts.getAllOf("id",postId)
        });
        ListPosts.delete(postId)
    }else{
        let err = new Error(`Post id not found.`);
        err.code = 400;
        return next(err);
    }
});

router.put( '/blog-posts/:id', (req, res, next) => {

    if (!('id' in req.params)){
        let err = new Error("Parameter not passed correctly");
        err.code = 406;
        return next(err);
    }

    let postId = req.params.id;

    if(ListPosts.exist("id",postId))
    {
        res.status(200).json({
            message : `Post successfully updated.`,
            status : 200,
            post: ListPosts.put(postId,req.body)
        });
    }else{
        let err = new Error(`Post id not found.`);
        err.code = 400;
        return next(err);
    }
});

module.exports = router;
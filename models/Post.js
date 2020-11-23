const express = require('express');
// const {
//     date
// } = require('faker');
const mongoose = require('mongoose');
const urlSlug = require('mongoose-url-slugs');
// const {
//     schema
// } = require('./Category');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    title: {
        type: String,
        required: true

    },

    status: {
        type: String,
        default: 'public'
    },

    allowComments: {
        type: Boolean,
        required: true
    },

    body: {
        type: String,
        required: true

    },

    file: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    },
    
    slug:{
        type:String
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

});

PostSchema.plugin(urlSlug('title', {field:'slug'}));
module.exports = mongoose.model('posts', PostSchema);
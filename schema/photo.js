"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Photo
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */
var commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        require: [true, 'Empty comment provided']
    }, // The text of the comment.
    date_time: {
        type: Date,
        default: Date.now,
        require: [true, 'Date not set']
    }, // The date and time when the comment was created.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'User id not provided']
    }   // 	The user object of the user who created the comment.
});

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    id: String,     // Unique ID identifying this user
    file_name: {
        type: String,
        require: [true, 'Filename not provided']
    },// 	Name of a file containing the actual photo (in the directory project6/images).
    /*thumbnail: {
        type: String, 
        require: [true, 'Thumbnail filename not provided']
    },//*/   //Name of the file containing a thumbnail of the photo (same directory as photos).
    date_time: {
        type: Date,
        default: Date.now,
        require: [true, 'Date not set']
    }, // 	The date and time when the photo was added to the database
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        require: [true, 'User id not provided']
    },// The user object of the user who created the photo.
    comments: {
        type: [commentSchema],
        require: [true, 'Comments array not initialized']
    }// Comment objects representing the comments made on this photo.
});

// static methods

// Returns photo matching specified id
photoSchema.statics.findPhotoById = function(id) {
    return this.findById(id).exec();
};

// Returns all photos matching the specified userId
photoSchema.statics.findPhotosByUserId = function(id) {
    return this.find({user_id: id}).populate('comments.user', '_id first_name last_name').exec();
};

// Returns photo matching specified id and pushes adds comment
// object
photoSchema.statics.addComment = function(photo) {
    return this.findByIdAndUpdate(photo._id, photo, {upsert: true, new: true})
        .populate('comments.user', 'id first_name last_name').exec()
};

// Returns all userIds from comments
photoSchema.statics.getPhotoCounts = function() {
    return this.aggregate(
        [
            { $group: {
                _id: '$user_id',
                nPhotos: { $sum: 1 },
            }}
        ]);
};

photoSchema.statics.getCommentCounts = function() {
    return this.aggregate(
        [
            { $unwind: '$comments' },
            { $group: {
                _id: '$comments.user',
                nComments: { $sum: 1 }
            }}
        ]);
}

photoSchema.statics.getCommentsByUserId = function(id) {
    return this.aggregate(
        [
            {$match: {'comments.user': mongoose.Types.ObjectId(id)}},
            {$project: { 
                _id: '$_id',
                file_name: '$file_name',
                user: '$user_id',
                comments: {$filter: {
                    input: '$comments',
                    as: 'comment',
                    cond: {$eq: ['$$comment.user', mongoose.Types.ObjectId(id)]}
                }}
            }}
        ]);
};

photoSchema.statics.deleteComment = function(id) {
    return this.aggregate(
        [
            { $unwind: '$comments' },
            { $match: { _id: mongoose.Types.ObjectId(id)}}
        ]).remove().exec();
};
// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our photos in our Node applications
module.exports = Photo;

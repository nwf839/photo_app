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
    comment: String,     // The text of the comment.
    date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The user object of the user who created the comment.
});

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    id: String,     // Unique ID identifying this user
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    thumbnail: String, //   Name of the file containing a thumbnail of the photo (same directory as photos).
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The user object of the user who created the photo.
    comments: [commentSchema] // Comment objects representing the comments made on this photo.
});

// static methods

// Returns all photos matching the specified userId
photoSchema.statics.findPhotosByUserId = function(id) {
    return this.find({user_id: id}).exec();
};

// Returns photo matching specified id and pushes adds comment
// object
photoSchema.statics.addComment = function(photoId, userId, comment) {
    return this.findbyIdAndUpdate(photoId, 
        {$push: {
            'comments': {
                comment: comment,
                user_id: userId
            }
        }},
    {new: true}).exec();
};

// Returns all userIds from comments
// XXX DOES NOT WORK CORRECTLY
// WILL NEED TO BE CHANGED OR SPLIT INTO TWO FUNCTIONS
// XXX
photoSchema.statics.getPhotoCounts = function() {
    return this.aggregate(
        [
            { $group: {
                _id: '$user_id',
                nPhotos: { $sum: 1 },
            }},
            { $sort: { _id: 1 }},
        ]);
};

photoSchema.statics.getCommentCounts = function() {
    return this.aggregate(
        [
            { $unwind: '$comments' },
            { $group: {
                _id: '$comments.user_id',
                nComments: { $sum: 1 }
            }},
            { $sort: { _id: 1 }},
        ]);
}

photoSchema.statics.getCommentsByUserId = function(id) {
    return this.aggregate(
        [
            { $unwind: '$comments' },
            { $project: { 
                    comment: '$comments.comment',
                    date_time: '$comments.date_time',
                    user_id: '$comments.user_id',
            }},
            { $match: { user_id: mongoose.Types.ObjectId(id)}}
            //{ $group: { _id: '$comments.user_id', comments: {$sum: 1} }}
        ]);
}

// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our photos in our Node applications
module.exports = Photo;

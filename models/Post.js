const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [50, 'title can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'user required']
  },
  // likes: [
  //   {type: mongoose.Schema.ObjectId, ref: 'User'}
  // ],
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})


// Cascade delete comment when a post is deleted
PostSchema.pre('remove', async function(next) {
  console.log(`comment being removed from post ${this._id}`);
  await this.model('Comment').deleteMany({ post: this._id });
  next();
});

// reverse populate with virtuals
PostSchema.virtual('Comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false
});

module.exports = mongoose.model('Post', PostSchema)
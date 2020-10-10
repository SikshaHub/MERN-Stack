/** Inside form area, we can add posts. Like, comments etc. */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/** @route  POST api/posts
 *  @desc   Create a Post
 *  @access Private  */
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/** @route  GET api/posts
 *  @desc   Get all Posts
 *  @access Private  */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/** @route  GET api/posts/:post_id
 *  @desc   Get Post by Post Id
 *  @access Public  */
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

/** @route  DELETE api/posts/:post_id
 *  @desc   Delete Post by Post Id
 *  @access Private  */
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    /** Check if Post exists */
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    /** Check User */
    if (post.user.toString() != req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

/** @route  PUT api/posts/like/:post_id
 *  @desc   Like a Post
 *  @access Private  */
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    /**Check if Post is already liked */
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    /**If not liked */
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/** @route  PUT api/posts/unlike/:post_id
 *  @desc   Unlike a Post
 *  @access Private  */
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    /**Check id Post is already liked */
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    /** Get Like Index */
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    /** Unlike the Post */
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/** @route  PUT api/posts/comment/:post_id
 *  @desc   Comment on a Post
 *  @access Private  */
router.put(
  '/comment/:post_id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    /** Check for errors */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      /** Get User */
      const user = await User.findById(req.user.id).select('-password');

      /** Get Post by Post ID */
      const post = await Post.findById(req.params.post_id);

      /** Create a new Comment */
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/** @route  DELETE api/posts/comment/:post_id/:comment_id
 *  @desc   Delete Comment from the Post
 *  @access Private  */
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    /** Get current Post */
    const post = await Post.findById(req.params.post_id);

    /** Pull out Comment */
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    /** Make sure comment exists */
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    /** Check if the Logged in User is same as User posted the comment */
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User unauthorized ' });
    }

    /** Get Remove Index of Comment */
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    /** Remove Commment from the Post */
    post.comments.splice(removeIndex, 1);

    /** Save  */
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

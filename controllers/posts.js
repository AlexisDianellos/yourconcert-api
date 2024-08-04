const Post = require('../models/Post');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_SALT;

exports.createPost = async(req,res)=>{
  try {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${tempPath}.${ext}`;
    fs.renameSync(tempPath, newPath);

    const { token } = req.cookies;//jwt token from cookies
    console.log('Request Cookies:', req.cookies);
    console.log('Request Headers:', req.headers);

    
     if (!token) {
      return res.status(401).json('No token found');
    }

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.log('JWT verification error:', err);
        return res.status(401).json('Invalid token');
      }

      const { title, summary, content, performanceQuality, pqComments, stagePresence, spComments, soundQuality, sqComments, visualEffects, veComments, audienceInteraction, aiComments } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath.replace(/\\/g, '/'),
        performanceQuality,
        pqComments,
        stagePresence,
        spComments,
        soundQuality,
        sqComments,
        visualEffects,
        veComments,
        audienceInteraction,
        aiComments,
        author: info.id,
      });
      res.json(postDoc);//save file to Uploads

    });
  } catch (error) {
    console.error('Error during post creation:', error);
    res.status(500).json({ error: error.message || 'Server error during post creation' });
  }
}

exports.getPosts = async(req,res)=>{
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
}

exports.getPostById = async(req,res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
}

exports.updatePost = async(req,res)=>{
  let newPath = null;

  if (req.file) {
    const {originalname,path:tempPath} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${tempPath}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title, summary, content, performanceQuality, pqComments, stagePresence, spComments, soundQuality, sqComments, visualEffects, veComments, audienceInteraction, aiComments } = req.body;
    const postDoc = await Post.findById(id);
    console.log(postDoc)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;
    postDoc.performanceQuality = performanceQuality;
    postDoc.pqComments = pqComments;
    postDoc.stagePresence = stagePresence;
    postDoc.spComments = spComments;
    postDoc.soundQuality = soundQuality;
    postDoc.sqComments = sqComments;
    postDoc.visualEffects = visualEffects;
    postDoc.veComments = veComments;
    postDoc.audienceInteraction = audienceInteraction;
    postDoc.aiComments = aiComments;

    await postDoc.save();
    res.json(postDoc);
  });
}

exports.deletePost = async(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error('JWT verification error', err);
      return res.status(401).json('Token verification failed');
    }
    const postDoc = await Post.findById(req.params.id);
    if (!postDoc) {
      return res.status(404).json('Post not found');
    }

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json('Post deleted');
  });
}

exports.searchPosts = async(req, res) => {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long' });
  }
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: '\\b' + query + '\\b', $options: 'i' } }, // Search by title (case-insensitive)
        { content: { $regex: '\\b' + query + '\\b', $options: 'i' } }, // Search by content (case-insensitive)
      ],
    }).populate('author', ['username']);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found matching the query' });
    }

    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Server error while searching posts' });
  }
};



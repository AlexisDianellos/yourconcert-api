const express = require('express');
const { createPost, getPosts, getPostById, updatePost, deletePost, searchPosts } = require('../controllers/posts');
const { uploadMiddleware,handleMulterError } = require('../middleware/upload');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, uploadMiddleware.single('file'),handleMulterError ,createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, uploadMiddleware.single('file'),handleMulterError, updatePost);
router.delete('/:id', verifyToken, deletePost);
router.get('/search', searchPosts);

module.exports=router;

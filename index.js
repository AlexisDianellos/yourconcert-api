require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const {errorHandler} = require('./utils/errorHandler');

const app = express();

app.use(cors({credentials:true,origin:'https://yourconcert.onrender.com'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(()=>console.log('Connected to MongoDB'))
  .catch(err=>console.error('Connection error with MongoDB: ',err));

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/profile', profileRoutes);

const Post = require('./models/Post');

app.get('/search', async (req, res) => {
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
});


app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
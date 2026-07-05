const express = require('express')
const cors = require('cors')
require('dotenv').config()

const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/news', require('./routes/news'))
app.use('/api/blogs', require('./routes/blogs'))
app.use('/api/members', require('./routes/members'))
app.use('/api/board', require('./routes/board'))
app.use('/api/past-board', require('./routes/pastBoard'))
app.use('/api/branch-board', require('./routes/branchBoard'))
app.use('/api/events', require('./routes/events'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/submissions', require('./routes/submissions'))
app.use('/api/home-content', require('./routes/homeContent'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { authenticate } = require('../middleware/auth')

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Images Only!'))
    }
  }
})

// POST upload single image
router.post('/', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  
  // Return the path relative to the server root
  const filePath = `/uploads/${req.file.filename}`
  res.json({ url: filePath })
})

// POST upload multiple images
router.post('/multiple', authenticate, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  
  const filePaths = req.files.map(file => `/uploads/${file.filename}`)
  res.json({ urls: filePaths })
})

module.exports = router
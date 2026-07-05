const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
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

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])

function listImages(dir, urlPrefix = '/uploads') {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    const urlPath = `${urlPrefix}/${entry.name}`

    if (entry.isDirectory()) {
      return listImages(fullPath, urlPath)
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!imageExtensions.has(ext)) return []

    const stats = fs.statSync(fullPath)
    return [{
      filename: entry.name,
      url: urlPath,
      source: urlPrefix.startsWith('/assets') ? 'site-assets' : 'uploads',
      size: stats.size,
      updated_at: stats.mtime,
    }]
  })
}

// GET uploaded and built site image library for admin selectors
router.get('/images', authenticate, (req, res) => {
  try {
    const serverRoot = path.join(__dirname, '..')
    const appRoot = path.join(serverRoot, '..')
    const imageSources = [
      { dir: path.join(serverRoot, 'uploads'), urlPrefix: '/uploads' },
      { dir: path.join(appRoot, 'dist', 'assets'), urlPrefix: '/assets' },
    ]

    const seenUrls = new Set()
    const images = imageSources
      .flatMap(({ dir, urlPrefix }) => listImages(dir, urlPrefix))
      .filter((image) => {
        if (seenUrls.has(image.url)) return false
        seenUrls.add(image.url)
        return true
      })
      .sort((a, b) => {
        if (a.source !== b.source) return a.source === 'uploads' ? -1 : 1
        return new Date(b.updated_at) - new Date(a.updated_at)
      })
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: err.message })
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

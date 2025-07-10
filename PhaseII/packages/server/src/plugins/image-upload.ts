import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Configure storage
const uploadsDir = path.join(__dirname, '../../../uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Simple image resize function using Canvas API (for demo)
// In production, use Sharp or similar library
function simpleResize(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // This is a mock implementation
    // In a real app, you'd use Sharp:
    // sharp(inputPath).resize(width, height).toFile(outputPath, callback)
    
    // For demo, just copy the file
    fs.copyFile(inputPath, outputPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Upload single image
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  
  const { resize } = req.body;
  let resizedImages: any[] = [];
  
  try {
    // Generate different sizes if requested
    if (resize === 'true') {
      const sizes = [
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 300, height: 300 },
        { name: 'medium', width: 600, height: 600 },
        { name: 'large', width: 1200, height: 1200 }
      ];
      
      for (const size of sizes) {
        const ext = path.extname(req.file.filename);
        const baseName = path.basename(req.file.filename, ext);
        const resizedFilename = `${baseName}-${size.name}${ext}`;
        const resizedPath = path.join(uploadsDir, resizedFilename);
        
        await simpleResize(req.file.path, resizedPath, size.width, size.height);
        
        resizedImages.push({
          size: size.name,
          filename: resizedFilename,
          url: `/api/plugins/image-upload/serve/${resizedFilename}`,
          width: size.width,
          height: size.height
        });
      }
    }
    
    const imageInfo = {
      id: Date.now().toString(),
      original: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/api/plugins/image-upload/serve/${req.file.filename}`
      },
      resized: resizedImages,
      uploadedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: imageInfo
    });
    
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded' });
  }
  
  const { resize } = req.body;
  const results = [];
  
  try {
    for (const file of req.files) {
      let resizedImages: any[] = [];
      
      if (resize === 'true') {
        const sizes = [
          { name: 'thumbnail', width: 150, height: 150 },
          { name: 'small', width: 300, height: 300 }
        ];
        
        for (const size of sizes) {
          const ext = path.extname(file.filename);
          const baseName = path.basename(file.filename, ext);
          const resizedFilename = `${baseName}-${size.name}${ext}`;
          const resizedPath = path.join(uploadsDir, resizedFilename);
          
          await simpleResize(file.path, resizedPath, size.width, size.height);
          
          resizedImages.push({
            size: size.name,
            filename: resizedFilename,
            url: `/api/plugins/image-upload/serve/${resizedFilename}`,
            width: size.width,
            height: size.height
          });
        }
      }
      
      results.push({
        id: Date.now().toString() + Math.random(),
        original: {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `/api/plugins/image-upload/serve/${file.filename}`
        },
        resized: resizedImages
      });
    }
    
    res.json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      images: results
    });
    
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process images', details: error.message });
  }
});

// Serve images
router.get('/serve/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set appropriate headers
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  
  res.sendFile(filePath);
});

// List uploaded images
router.get('/list', (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          url: `/api/plugins/image-upload/serve/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    
    res.json({ images });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to list images', details: error.message });
  }
});

// Delete image
router.delete('/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  try {
    fs.unlinkSync(filePath);
    
    // Also delete resized versions
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const sizes = ['thumbnail', 'small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const resizedFile = `${baseName}-${size}${ext}`;
      const resizedPath = path.join(uploadsDir, resizedFile);
      if (fs.existsSync(resizedPath)) {
        fs.unlinkSync(resizedPath);
      }
    });
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

export default router;

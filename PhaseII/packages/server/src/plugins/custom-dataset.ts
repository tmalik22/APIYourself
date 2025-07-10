import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { parse as csvParse } from 'csv-parse/sync';
import xlsx from 'xlsx';

const uploadsDir = path.join(__dirname, '../../../uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = Router();
const upload = multer({ dest: uploadsDir });

// Upload endpoint (accepts CSV, JSON, Excel)
router.post(
  '/upload',
  upload.single('file'),
  (req: Request & { file?: Express.Multer.File }, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let data: any = null;

    try {
      if (ext === '.csv') {
        const content = fs.readFileSync(req.file.path, 'utf-8');
        data = csvParse(content, { columns: true });
      } else if (ext === '.json') {
        const content = fs.readFileSync(req.file.path, 'utf-8');
        data = JSON.parse(content);
      } else if (ext === '.xlsx' || ext === '.xls') {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }
      res.json({ success: true, rows: data.length, preview: data.slice(0, 5) });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to parse file', details: err.message });
    } finally {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
    }
  }
);

export default router;
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sync_1 = require("csv-parse/sync");
const xlsx_1 = __importDefault(require("xlsx"));
const uploadsDir = path.join(__dirname, '../../../uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: uploadsDir });
// Upload endpoint (accepts CSV, JSON, Excel)
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    let data = null;
    try {
        if (ext === '.csv') {
            const content = fs.readFileSync(req.file.path, 'utf-8');
            data = (0, sync_1.parse)(content, { columns: true });
        }
        else if (ext === '.json') {
            const content = fs.readFileSync(req.file.path, 'utf-8');
            data = JSON.parse(content);
        }
        else if (ext === '.xlsx' || ext === '.xls') {
            const workbook = xlsx_1.default.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            data = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }
        else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        res.json({ success: true, rows: data.length, preview: data.slice(0, 5) });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to parse file', details: err.message });
    }
    finally {
        fs.unlinkSync(req.file.path); // Clean up uploaded file
    }
});
exports.default = router;
//# sourceMappingURL=custom-dataset.js.map
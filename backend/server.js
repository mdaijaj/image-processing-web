const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { path: filePath, filename } = req.file;
    res.json({ filePath, filename });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
});


app.post('/process', async (req, res) => {
  try {
    const { filePath, brightness, contrast, saturation, rotation, crop, format } = req.body;

    let image = sharp(filePath);

    if (brightness !== undefined) {
      image = image.modulate({ brightness: parseFloat(brightness) });
    }
    if (contrast !== undefined) {
      image = image.modulate({ contrast: parseFloat(contrast) });
    }
    if (saturation !== undefined) {
      image = image.modulate({ saturation: parseFloat(saturation) });
    }
    if (rotation !== undefined) {
      image = image.rotate(parseInt(rotation));
    }
    if (crop) {
      const [left, top, width, height] = crop.split(',').map(Number);
      image = image.extract({ left, top, width, height });
    }

    const outputFormat = format || 'jpeg';
    const buffer = await image.toFormat(outputFormat).toBuffer();

    res.set('Content-Type', `image/${outputFormat}`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Error processing image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
});

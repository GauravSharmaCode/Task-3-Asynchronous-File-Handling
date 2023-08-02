const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Create the "uploads" directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Word Count</title>
    </head>
    <body>
      <h1>Word Count</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <button type="submit">Upload File</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(uploadsDir, req.file.filename);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file');
    }

    const wordCount = data.split(/\s+/).filter(word => word !== '').length;
    res.send(`Total word count: ${wordCount}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

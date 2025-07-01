const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DOWNLOAD_DIR = path.join(__dirname, 'videos');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URLが必要です' });

  const id = Date.now();
  const output = path.join(DOWNLOAD_DIR, `${id}.mp4`);
  const command = `yt-dlp -f mp4 -o "${output}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('ダウンロードエラー:', stderr);
      return res.status(500).json({ error: '動画のダウンロードに失敗しました' });
    }

    const videoPath = `/videos/${id}.mp4`;
    res.json({ url: videoPath });
  });
});

app.use('/videos', express.static(DOWNLOAD_DIR));

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});







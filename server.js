const express = require('express');
const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl-exec');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const outputPath = path.join(videosDir, 'output.mp4');

  try {
    await youtubedl(url, {
      output: outputPath,
      format: 'mp4',
      exec: 'ffmpeg',
    });

    res.json({ path: 'videos/output.mp4' });
  } catch (error) {
    console.error('動画の取得エラー:', error);
    res.status(500).send('動画の取得に失敗しました');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








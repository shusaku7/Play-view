const express = require('express');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// 動画の保存先フォルダ
const videosDir = path.join(__dirname, 'videos');

// フォルダがなければ作成
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const outputPath = path.join(videosDir, 'output.mp4');

  try {
    await youtubedl(url, {
      output: outputPath,
      format: 'mp4'
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








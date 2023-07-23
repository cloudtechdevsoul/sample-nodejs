const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

app.get('/download', (req,res) => {
  var URL = req.query.URL;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');

  let video = ytdl(URL, { quality: 'highestvideo' });
  let audio = ytdl(URL, { quality: 'highestaudio' });

  ffmpeg()
    .input(video)
    .videoCodec('copy')
    .input(audio)
    .audioCodec('copy')
    .save('output.mp4')
    .on('end', () => {
      res.download('output.mp4');
    });
});

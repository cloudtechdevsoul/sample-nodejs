const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();

router.get('/', function(req, res) {
    let url = "https://www.youtube.com/watch?v=S9atRW1DgbQ";
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    
    ytdl(url, {
        // Request an audio-only format
        filter: format => format.container === 'webm' && format.audioEncoding === 'opus'
    })
    .pipe(ffmpeg().audioCodec('libmp3lame').format('mp3').on('end', () => {
        console.log('Finished processing');
    }))
    .pipe(res);
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080')
});

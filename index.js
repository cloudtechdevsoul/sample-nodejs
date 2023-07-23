const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const router = express.Router();

router.get('/', function(req, res) {
    let url = "https://www.youtube.com/watch?v=S9atRW1DgbQ";
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    
    ytdl(url, {
        // Request an audio-only format
        filter: 'audioonly',
        // The quality option should be highestaudio for the best available audio quality
        quality: 'highestaudio',
    })
    .pipe(res);
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080')
});

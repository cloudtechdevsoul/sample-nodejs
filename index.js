const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const router = express.Router();

router.get('/', function(req, res) {
    let url = "https://www.youtube.com/watch?v=S9atRW1DgbQ";
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: 'mp4' }).pipe(res);
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080')
});

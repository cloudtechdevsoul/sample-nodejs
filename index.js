const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const fs = require('fs')
var router = express.Router();
router.get('/', function (req, res, next) {
    console.log('rputer calld')
    let url = "https://www.youtube.com/watch?v=S9atRW1DgbQ";
    ytdl(url).pipe(fs.createWriteStream('video.mp4'));
    res.end();
})
app.use(router);
app.listen(8080, () => {
    console.log('app listingin on 8080')
})
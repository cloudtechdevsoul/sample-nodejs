const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const fs = require('fs');
var router = express.Router();

router.get('/', async function (req, res, next) {
    console.log('router called');
    let url = "https://www.youtube.com/watch?v=S9atRW1DgbQ";

    const videoReadableStream = ytdl(url);
    const videoWritableStream = fs.createWriteStream('video.mp4');

    videoReadableStream.pipe(videoWritableStream);
    
    // Wait for the video to finish downloading
    videoWritableStream.on('finish', () => {
        console.log("Video downloaded successfully");
        res.status(200).send("Video downloaded successfully");
    });

    // Handle any errors that occur during the download process
    videoWritableStream.on('error', (error) => {
        console.error("Error downloading the video: ", error);
        res.status(500).send("Error downloading the video");
    });
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080')
});

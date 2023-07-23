const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const router = express.Router();

ffmpeg.setFfmpegPath(ffmpegPath);


// app.get('/download', (req,res) => {
// var URL = req.query.URL;
// res.header('Content-Disposition', 'attachment; filename="video.mp4"');
// ytdl(URL, {
//     format: 'mp4'
//     }).pipe(res);
// });
router.get('/', function (req, res) {
  var url = req.query.url;
  console.log(url);
    // let url = "https://www.youtube.com/watch?v=WUl1ccKaK_Y";

    const videoPath = 'video.mp4';
    const audioPath = 'audio.mp3';
    
    const videoWritableStream = fs.createWriteStream(videoPath);
    const videoReadableStream = ytdl(url);

    videoReadableStream.pipe(videoWritableStream);

    videoWritableStream.on('finish', () => {
        console.log("Video downloaded successfully");
        
        ffmpeg(videoPath)
            .noVideo()
            .audioCodec('libmp3lame')
            .save(audioPath)
            .on('end', () => {
                console.log('Audio extracted successfully');

                res.download(audioPath, (err) => {
                    if (err) {
                        console.log('Error while downloading audio file:', err);
                    } else {
                        console.log('Audio downloaded successfully');
                    }

                    // Delete the video and audio files
                    fs.unlink(videoPath, (err) => {
                        if (err) console.log(`Error deleting video file: ${err}`);
                    });
                    fs.unlink(audioPath, (err) => {
                        if (err) console.log(`Error deleting audio file: ${err}`);
                    });
                });
            });
    });

    videoWritableStream.on('error', (error) => {
        console.error("Error downloading the video: ", error);
        res.status(500).send("Error downloading the video");
    });
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080')
});





// const express = require('express');
// const cors = require('cors');
// const ytdl = require('ytdl-core');
// const app = express();
// app.use(cors());
// app.listen(8080, () => {
//     console.log('Server Works !!! At port 8080');
// });
// app.get('/download', (req,res) => {
// var URL = req.query.URL;
// res.header('Content-Disposition', 'attachment; filename="video.mp4"');
// ytdl(URL, {
//     format: 'mp4'
//     }).pipe(res);
// });

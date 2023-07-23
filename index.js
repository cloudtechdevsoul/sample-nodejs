const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const router = express.Router();

ffmpeg.setFfmpegPath(ffmpegPath);

router.get('/download', function (req, res) {
    let url = req.query.URL;

    if(!ytdl.validateURL(url)) {
        return res.sendStatus(400);
    }

    const videoPath = path.join(__dirname, 'video.mp4');
    const audioPath = path.join(__dirname, 'audio.mp3');
    
    const videoWritableStream = fs.createWriteStream(videoPath);
    const videoReadableStream = ytdl(url, { quality: 'highestvideo' });

    videoReadableStream.pipe(videoWritableStream);

    videoWritableStream.on('finish', () => {
        console.log("Video downloaded successfully");

        ffmpeg(videoPath)
            .noVideo()
            .audioCodec('libmp3lame')
            .save(audioPath)
            .on('end', () => {
                console.log('Audio extracted successfully');

                res.download(audioPath, 'output.mp3', (err) => {
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

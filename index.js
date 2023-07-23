const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const router = express.Router();

ffmpeg.setFfmpegPath(ffmpegPath);

router.get('/', function (req, res) {
    var url = req.query.url;

    if (!ytdl.validateURL(url)) {
        return res.sendStatus(400);
    }

    const audioPath = 'audio.mp4';
    const outputPath = 'output.mp3';

    // Download audio
    ytdl(url, { quality: 'highestaudio' })
        .pipe(fs.createWriteStream(audioPath))
        .on('finish', () => {
            console.log('Audio downloaded successfully');

            // Convert audio to mp3
            ffmpeg(audioPath)
                .audioCodec('libmp3lame') // codec for mp3
                .save(outputPath)
                .on('end', () => {
                    console.log('Output file created successfully');
                    res.download(outputPath, (err) => {
                        if (err) {
                            console.log('Error while downloading output file:', err);
                        } else {
                            console.log('Output file downloaded successfully');
                        }

                        // Delete the audio and output files
                        fs.unlink(audioPath, (err) => {
                            if (err) console.log(`Error deleting audio file: ${err}`);
                        });
                        fs.unlink(outputPath, (err) => {
                            if (err) console.log(`Error deleting output file: ${err}`);
                        });
                    });
                })
                .on('error', (error) => {
                    console.error("Error creating the output file: ", error);
                    res.status(500).send("Error creating the output file");
                });
        })
        .on('error', (error) => {
            console.error("Error downloading the audio: ", error);
            res.status(500).send("Error downloading the audio");
        });
});

app.use('/', router);
app.listen(8080, () => {
    console.log('app listening on port 8080');
});

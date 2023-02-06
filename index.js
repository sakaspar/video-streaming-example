const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const port = 3000;

app.use(express.static("public"));

app.get("/works-in-chrome", (req, res) => {
    const videoDir = "./videos";

    fs.readdir(videoDir, (err, files) => {
        if (err) {
            console.error(`Error reading video directory ${videoDir}.`);
            console.error(err);
            res.sendStatus(500);
            return;
        }

        const videoFiles = files.filter(file => {
            return path.extname(file).toLowerCase() === ".mp4";
        });

        if (videoFiles.length === 0) {
            console.error(`No video files found in ${videoDir}.`);
            res.sendStatus(500);
            return;
        }

        const filePath = path.join(videoDir, videoFiles[0]);

        res.setHeader("content-type", "video/mp4");
        
        fs.stat(filePath, (err, stat) => {
            if (err) {
                console.error(`File stat error for ${filePath}.`);
                console.error(err);
                res.sendStatus(500);
                return;
            }

            res.setHeader("content-length", stat.size);

            const fileStream = fs.createReadStream(filePath);
            fileStream.on("error", error => {
                console.log(`Error reading file ${filePath}.`);
                console.log(error);
                res.sendStatus(500);
            });

            fileStream.pipe(res);
        });
    });
});

app.listen(port, () => {
    console.log(`Open your browser and navigate to http://localhost:${port}`);
});

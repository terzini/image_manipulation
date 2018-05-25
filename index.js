const {
    thumbnail
} = require("easyimage");

const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

let processed = 0;

function convertAllImagesEasyimage(sourceFolder, destinationFolder) {
    const files = fs.readdirSync(sourceFolder);
    for (let f of files) {
        thumbnail({
            src: path.resolve(__dirname, sourceFolder, f),
            width: 24,
            height: 24,
            quality: 8
        }).then(info => {
            console.log(info.path);
            fs.createReadStream(info.path).pipe(fs.createWriteStream(path.resolve(__dirname, destinationFolder, f)));
            processed++;
        }).catch((err) => console.log("Error: ", err));
    }
}

function convertAllImagesJimp(sourceFolder, destinationFolder) {
    const files = fs.readdirSync(sourceFolder);
    for (let f of files) {
        jimp.read( path.resolve(sourceFolder, f), (err, data) => {
            if (err) {
                console.log(err);
            }
            data.resize(24, 24,)
                .quality(10)
                .dither565()
                .write(path.resolve(__dirname, destinationFolder, f));
        })
    }
}

// convertAllImagesEasyimage("./data/big", "./data/small");

convertAllImagesJimp("./data/big", "./data/small");
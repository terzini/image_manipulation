const {
    thumbnail
} = require("easyimage");

const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

let processed = 0;

const options = {
    width: 24,
    height: 24,
    quality: 8
};

function convertAllImages(sourceDir, targetDir, method, opt) {
    return new Promise((resolve, reject) => {
        fs.readdir(sourceDir, (err, files) => {
            if (err) {
                return reject(err.message);
            }

            for (let f of files) {
                transformImage(f, sourceDir, targetDir, method, opt)
                    .then(rs => {
                        saveImage(rs, f, targetDir);
                        processed++;
                    });
            }
        })
    });
}

function transformByJimp(f, sourceDir, targetDir, opt) {
    return new Promise((resolve, reject) => {
        jimp.read(path.resolve(sourceDir, f), (err, data) => {
            if (err) {
                return reject(err);
            }
            const jimp = data.resize(opt.width, opt.height)
                .quality(opt.quality)
                .dither565();
            return resolve( fs.createReadStream(jimp.info));
        })
    })

}

function transformByEasyimage(f, sourceDir, targetDir, opt) {
    return thumbnail({
        src: path.resolve(__dirname, sourceDir, f),
        width: opt.width,
        height: opt.height,
        quality: opt.quality
    }).then(info => {
        return fs.createReadStream(info.path);
    }).catch((err) => console.error("Error: ", err));
}

function transformImage(f, sourceDir, targetDir, method, opt) {
    switch (method) {
        case "easy":
            return transformByEasyimage(f, sourceDir, targetDir, opt);
            break;
        case "jimp":
            return transformByJimp(f, sourceDir, targetDir, opt);
            break;
    }
}

function saveImage(readStream, f, dir) {
    return readStream.pipe(fs.createWriteStream(path.resolve(__dirname, dir, f)));
}

convertAllImages("./data/big", "./data/small", "jimp", options)
    .then(() => console.log(`${processed} images processed.`))
    .catch(err => console.error(err));
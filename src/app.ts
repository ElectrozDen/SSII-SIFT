import * as cv from 'opencv4nodejs';
import * as path from 'path';
import * as fs from 'fs';
import * as kmeans from 'ml-kmeans'
import {KeyPoint, SIFTDetector} from 'opencv4nodejs';

class ImageDescription {
    name : string;
    image : cv.Mat;
    label : number;
    keypoints: KeyPoint[];
    constructor(name: string, image: cv.Mat){
        this.name = name;
        this.image = image;
        this.label = -1;
    }
}

const dirPath : string = path.resolve('./images');
const files : string [] = fs.readdirSync(dirPath);

const images : ImageDescription[] = files
    .map(file => path.resolve(dirPath,file))
    .map(filepath => cv.imread(filepath))
    .map(img => img.bgrToGray())
    .map((realImg, i) => new ImageDescription(files[i], realImg));



const isImageFour = (_, i : number) : boolean => files[i].match(/.*4.*/) != null;
const isNotImageFour = (_, i) : boolean => !isImageFour(_, i);


const trainImg : ImageDescription[] = images.filter(isNotImageFour);
const testImg : ImageDescription[] = images.filter(isImageFour);


const siftD = new SIFTDetector();
testImg.forEach(img=>img.keypoints = siftD.detect(img.image));


console.log("testImages: "+testImg.map(id => id.name));
console.log("trainImg: "+trainImg.map(id => id.name));

console.log("keypoints: "+testImg[0].keypoints.map(k=>k.angle));



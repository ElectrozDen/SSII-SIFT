import * as cv from 'opencv4nodejs';
import * as path from 'path';
import * as fs from 'fs';
import { SIFTDetector, KeyPoint, Mat } from 'opencv4nodejs';

class ImageDescription {
    private static detector :SIFTDetector = new SIFTDetector();

    name : string;
    image : Mat;
    label : number;
    keypoints: KeyPoint[];
    descriptors: Mat;
    constructor(name: string, image: Mat){
        this.name = name;
        this.image = image;
        this.label = -1;
        this.keypoints = ImageDescription.detector.detect(this.image);
        this.descriptors = ImageDescription.detector.compute(this.image, this.keypoints);
    }

    drawWithKeypoints() : void {
        const im : Mat = cv.drawKeyPoints(this.image, this.keypoints);
        cv.imwriteAsync("./bin/keyPoints_"+this.name, im);
    }
}

const dirPath : string = path.resolve('./images');
const files : string [] = fs.readdirSync(dirPath);
const isImageFour = (_, i : number) : boolean => files[i].match(/.*4.*/) != null;
const isNotImageFour = (_, i) : boolean => !isImageFour(_, i);

const images : ImageDescription[] = files
    .map(file => path.resolve(dirPath,file))
    .map(filepath => cv.imread(filepath))
    .map(img => img.bgrToGray())
    .map((realImg, i) => new ImageDescription(files[i], realImg));
images.map(im => console.log('name: '+im.name+' number of keypoints '+im.keypoints.length))
images.map(im => im.drawWithKeypoints());


const trainImg : ImageDescription[] = images.filter(isNotImageFour);
const testImg : ImageDescription[] = images.filter(isImageFour);


const siftD = new SIFTDetector();
testImg.forEach(img=>img.keypoints = siftD.detect(img.image));


console.log("testImages: "+testImg.map(id => id.name));
console.log("trainImg: "+trainImg.map(id => id.name));

//console.log("keypoints: "+testImg[0].keypoints.map(k=>k.angle));
// useless ??


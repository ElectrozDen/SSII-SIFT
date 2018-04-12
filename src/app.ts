import * as cv from 'opencv4nodejs';
import * as path from 'path';
import * as fs from 'fs';
import {KmeanReturn, kmeans} from './kmeans';
import {ImageDescription} from './ImageDescription';
//import {KmeanReturn, kmeans} from './Kmeans/kmeansWrap';


fs.mkdir(path.resolve("./output"),(err) : void => {return});

const dirPath : string = path.resolve('./images');
const files : string [] = fs.readdirSync(dirPath);
const isImageFour = (_, i : number) : boolean => files[i].match(/.*4.*/) != null;
const isNotImageFour = (_, i) : boolean => !isImageFour(_, i);

console.log("## generating images ##");
const images : ImageDescription[] = files
    .map(file => path.resolve(dirPath,file))
    .map(filepath => cv.imread(filepath))
    .map(img => img.bgrToGray())
    .map((realImg, i) => new ImageDescription(files[i], realImg));
console.log('## images generated ##');

//images.map(im => console.log('name: '+im.name+' number of keypoints '+im.keypoints.length));
console.log('## writing images ##');
images.forEach(im => {im.drawWithKeypoints(); im.drawDescriptors();});
console.log('## images successfully writen ##');

//TODO Later
// const trainImg : ImageDescription[] = images.filter(isNotImageFour);
// const testImg : ImageDescription[] = images.filter(isImageFour);
// console.log("testImages: "+testImg.map(id => id.name));
// console.log("trainImg: "+trainImg.map(id => id.name));

const dataK1 : any[] = new Array<any>();
images.forEach(im => im.getdescriptors().forEach(d => dataK1.push(d)));

console.log('## performing first kmeans ##');
console.log('## 10 clusters and '+dataK1.length+' descriptors of '+dataK1[0].length+' values ##');
const clusters1 : KmeanReturn = kmeans(dataK1, 10);
console.log('## first kmeans OK ##');
console.log('## '+clusters1.it+' iteration(s) ##')
console.log('## associating Bows to images ##');
const labels1 : number[] = new Array<number>().concat(clusters1.idxs).reverse();
images.forEach(im => im.obtainBows(labels1,10));
console.log('## Bows OK ##');
//images.forEach(im => console.log(im.bows));

const dataK2 : number[][] = new Array();
images.forEach(im => dataK2.push(im.bows));
console.log("## Performing second Kmeans ##");
const clusters2 : KmeanReturn = kmeans(dataK2,2);
const labels2 : number[] = new Array<number>().concat(clusters2.idxs).reverse();
console.log('## second Kmeans OK ##');

images.forEach(im => im.obtainlabel(labels2));
images.forEach(im => console.log(im.name+": "+im.label));
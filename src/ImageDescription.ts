import { SIFTDetector, KeyPoint, Mat, drawKeyPoints, imwriteAsync} from 'opencv4nodejs';

/**
 * @author Corentin Artaud
 * 
 */
export class ImageDescription {
    /**
     * a detector to rule them all
     */
    private static detector :SIFTDetector = new SIFTDetector();

    name : string;
    image : Mat;
    keypoints: KeyPoint[];
    descriptors: Mat;
    bows: number[];
    label : number;

    constructor(name: string, image: Mat){
        this.name = name;
        this.image = image;
        this.label = -1;
        this.keypoints = ImageDescription.detector.detect(this.image);
        this.descriptors = ImageDescription.detector.compute(this.image, this.keypoints);
    }

    /**
     * draw the image with interest points in ./bin
     */
    drawWithKeypoints() : void {
        const im : Mat = drawKeyPoints(this.image, this.keypoints);
        imwriteAsync("./output/keyPoints_"+this.name, im);
    }

    /**
     * @returns an array of descriptors as arrays of 128 numbers
     */
    getdescriptors() :number[][] {
        let res: number[][] = new Array<any>();
        this.descriptors.getDataAsArray().forEach(data => {
            res.push(data);
        });
        return res;
    }

    /**
     * @param labels of first Kmean in reverse order (to allow pop)
     */
    obtainBows(labels: number[]) : void {
        this.bows = new Array<number>(this.descriptors.rows);
        this.bows.fill(0);
        for (let i = 0; i < this.bows.length; ++i) {
            this.bows[i] = labels.pop();
        }
    }

    /**
     * @param labels labels of second kmean in reverse order (to allow pop)
     */
    obtainlabel(labels: number[]) : void {
       this.label = labels.pop();
    }
}

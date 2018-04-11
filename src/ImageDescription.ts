import { SIFTDetector, KeyPoint, Mat, drawKeyPoints, imwriteAsync} from 'opencv4nodejs';

function isNotAllZero(array : number[]): boolean{
    for (let i = 0; i < array.length; ++i){
        if (array[i] != 0) return true;
    }
    return false;
}

/**
 * @author Corentin Artaud
 * 
 */
export class ImageDescription {
    /**
     * a detector to rule them all
     */
    private static detector :SIFTDetector = new SIFTDetector();

    private numberOfDescriptors: number;

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

    drawDescriptors() : void {
        imwriteAsync("./output/descriptors_"+this.name, this.descriptors);
    }

    /**
     * @returns an array of descriptors as arrays of 128 numbers
     */
    getdescriptors() :number[][] {
        let res: number[][] = new Array<any>();
        this.descriptors.getDataAsArray().forEach(data => {
            if(isNotAllZero(data))
                res.push(data);
        });
        this.numberOfDescriptors = res.length;
        return res;
    }

    /**
     * @param labels of first Kmean in reverse order (to allow pop)
     */
    obtainBows(labels: number[], k: number) : void {
        this.bows = new Array<number>(k);
        this.bows.fill(0);
        for (let i = 0; i < this.bows.length; ++i) {
            ++this.bows[labels.pop()]
        }
    }

    /**
     * @param labels labels of second kmean in reverse order (to allow pop)
     */
    obtainlabel(labels: number[]) : void {
       this.label = labels.pop();
    }
}

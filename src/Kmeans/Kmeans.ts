import {MultiDimentionalPoint} from './MultiDimentionalPoint';

export class KmeanClusters {
    it: number;
    k : number;
    idxs: number[];
    centroids: MultiDimentionalPoint[];

    copy() : KmeanClusters {
        let res : KmeanClusters = new KmeanClusters();
        res.it = this.it;
        res.k = this.k;
        res.idxs = new Array().concat(this.idxs);
        res.centroids = new Array().concat(this.centroids);
        return res;
    }
}

export class Kmeans {
    private previousCluster : MultiDimentionalPoint[];
    public clusters : KmeanClusters;
    private data: MultiDimentionalPoint[];


    constructor(){

    }

    private subinit(data: MultiDimentionalPoint[], existing: MultiDimentionalPoint[]): MultiDimentionalPoint {
        let pos = Math.floor(Math.random()*data.length);
        let dist: number = 0;
        let cur: number = 0;
        for (let i = 0; i < data.length; ++i) {
            let curdist = existing[data[i].neerest(existing)].distance(data[i]);
            if (curdist > dist) {
                dist = curdist;
                cur = i;
            }
        }
        let res = data[cur];
        data[cur] = data.pop();
        return res;
    }

    private init(dim : number, k: number) : void {
        let centroids :MultiDimentionalPoint[] = new Array();
        let data = new Array().concat(this.data);
        let posf = Math.floor(Math.random()*data.length);
        centroids.push(data[posf]);
        data[posf] = data.pop();
        //let center : MultiDimentionalPoint = MultiDimentionalPoint.Mean(data, undefined);
        for (let i = 1; i < k; ++i) {
            let existing = new Array().concat(centroids);
            centroids.push(this.subinit(data, existing));
        }
        this.clusters = new KmeanClusters();
        this.clusters.centroids = centroids;
        this.clusters.it = 0;
        this.clusters.k = k;
        this.clusters.idxs = new Array();
    }


    private closestCluster(point : MultiDimentionalPoint) : number {
        let centroids = this.clusters.centroids;
        return point.neerest(centroids);        
    }

    private continue() : boolean{
        if (this.clusters.it <= 1) return true;
        let centroids = this.clusters.centroids;
        for (let i = 0; i < centroids.length; ++i) {
            if (centroids[i].equals(this.previousCluster[i])) return false;
        }
        return true;
    }

    private getnewCentroids(k: number) {
        this.clusters.centroids.forEach((e, n) =>{e = MultiDimentionalPoint.Mean(this.data.filter((_,i) => {
            this.clusters.idxs[i] == n}), e)});
    }

    compute (data : MultiDimentionalPoint[], k: number) : KmeanClusters{
        this.data = data;
        this.init(data[0].length(), k);
        while (this.continue()) {
            ++this.clusters.it;
            this.previousCluster = new Array().concat(this.clusters.centroids);
            this.clusters.idxs = new Array(data.length);
            data.forEach((d,i) => this.clusters.idxs[i] = this.closestCluster(d));
            this.getnewCentroids(k);
        }

        return this.clusters;
    }

    fit (data : number[][], k: number) : KmeanClusters{
        let param : MultiDimentionalPoint[] = new Array<MultiDimentionalPoint>();
        for (let i = 0; i < data.length; ++i){
            param[i] = new MultiDimentionalPoint(data[i]);
        } 
        return this.compute(param ,k);
    }
}
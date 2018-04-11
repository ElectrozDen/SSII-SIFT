import * as skmeans from 'skmeans';

export interface KmeanReturn {
    it: number;
    k : number;
    idxs: number[];
    centroids: any[];
}

export function kmeans(data: any[], nbCluster: number):KmeanReturn{
    return skmeans(data, nbCluster, "kmpp");
}
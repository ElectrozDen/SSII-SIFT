import * as Mkmeans from './Kmeans';

export interface KmeanReturn {
    it: number;
    k : number;
    idxs: number[];
    centroids: any[];
}

export function kmeans(data: any[], nbCluster: number):KmeanReturn{
    let kmeans = new Mkmeans.Kmeans();
    let kmeanClusters = kmeans.fit(data, nbCluster);
    return {
        it: kmeanClusters.it,
        k : kmeanClusters.k,
        idxs: kmeanClusters.idxs,
        centroids: kmeanClusters.centroids.map(e => e.getPoint())
    }
}
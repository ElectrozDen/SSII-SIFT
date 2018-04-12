import * as nkmeans from 'node-kmeans';

export interface KmeanReturn {
    it: number;
    k : number;
    idxs: number[];
    centroids: any[];
}

// export async function kmeans(data: any[], nbCluster: number):KmeanReturn{
//     var val;
//     const a = async () =>{
//         return await nkmeans.clusterize(data, {'k':nbCluster}, (err, res) => {val = res;});
//     }
//     a();
//     return val;
// }
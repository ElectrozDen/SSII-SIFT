export class MultiDimentionalPoint {
    constructor(private point: number[]){}

    distance(other: MultiDimentionalPoint) : number {
        if (this.point.length != other.point.length) throw new Error("not the same dimention : "+this.point.length+" != "+other.point.length+ "\n"+this.point+"\n"+other.point);
        let total : number = 0;
        let diff: number = 0;
        for (let i = 0; i < this.point.length; ++i) {
            diff = other.point[i] - this.point[i];
            total = diff*diff;
        }
        return Math.sqrt(total);
    }

    equals(other: MultiDimentionalPoint) : boolean {
        if (this.point.length != other.point.length) return false;
        for (let i = 0; i < this.point.length; ++i) {
            if(this.point[i] != other.point[i]) return false;
        }
        return true;
    }

    length() : number{
        return this.point.length;
    }

    alterRandomly() : void {
        for (let i = 0; i < this.point.length; ++i){
            this.point[i] -= Math.random()*100;
        }
    }

    clone() : MultiDimentionalPoint {
        return new MultiDimentionalPoint(new Array().concat(this.point));
    }

    getPoint() : Array<number>{
        return new Array().concat(this.point);
    }

    neerest(points : MultiDimentionalPoint[]) {
        let res : number;
        let lastDistance : number;
        for (let i = 0; i < points.length; ++i) {
            let curDist = points[i].distance(this);
            if (i == 0) {res = 0; lastDistance = curDist};
            if (lastDistance > curDist) {res = i; lastDistance = curDist} 
        }
        return res;
    }

    longest(points : MultiDimentionalPoint[]) {
        let res : number;
        let lastDistance : number;
        for (let i = 0; i < points.length; ++i) {
            let curDist = points[i].distance(this);
            if (i == 0) {res = 0; lastDistance = curDist};
            if (lastDistance < curDist) {res = i; lastDistance = curDist} 
        }
        return res;
    }

    static Mean(points: MultiDimentionalPoint[], defaultPoint: MultiDimentionalPoint) : MultiDimentionalPoint{
        if(points.length < 1) return defaultPoint;
        let res : number[] = new Array<number>(points[0].point.length);
        res.fill(0);
        for (let i = 0; i < res.length; ++i) {
            let mean = 0;
            for (let j = 0; j < points.length; ++j){
                mean += points[j].point[i];
            }
            res[i] = mean/points.length;
        }
        return new MultiDimentionalPoint(res);
    }
}
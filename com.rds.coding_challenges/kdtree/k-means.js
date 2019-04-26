class KMeans {
    /**
     * Constructor of class
     * @param {array[array]} data input data
     * @param {int} k desired clusters (centroids)
     */
    constructor(data, clusterSize) {
        if (!Array.isArray(data) || data.length <= 0)
            throw "The given data must be an array and can't be empty";

        this.log('k-means init...');

        this.data = data;
        this.k = data.length / clusterSize;
        this.DIM = 2; // dimension of input data
        this.MAX_ITERATIONS = 50;
        this.kdTree = null;

        this.iterations = 0;
        this.oldCentroids = null;
        this.centroids = null;
        this.build();
    }

    build() {
        this.centroids = this.getRandomCentroids();
        console.log(this.centroids);
        // build kdtree for clusters
        this.kdTree = new KDTree(this.centroids, this.DIM);
    }

    process() {
        console.log('process start...', this.iterations, this.MAX_ITERATIONS);
        this.oldCentroids = this.centroids;
        this.iterations++;

        this.getLabels();
        this.getCentroids();

        return this.data;
    }

    shouldStop() {

        if (this.iterations > this.MAX_ITERATIONS)
            return true;
        /*
        var stop = true;

        for (var i = 0; i < this.centroids.length; i++) {
            if (!this.isEqual(this.centroids[i], this.oldCentroids[i])) {
                stop = false;
                break;
            }
        }
        return stop;
        */
    }

    getLabels() {
        for (var i = 0; i < this.data.length; i++) {
            var centroid = this.kdTree.nearest(this.data[i]);
            this.data[i].label = centroid.label;
            this.data[i].centroid = centroid;
        }
    }

    getCentroids() {
        for (var i = 0; i < this.centroids.length; i++) {
            this.centroids[i].data = [];
        }

        for (var i = 0; i < this.data.length; i++) {
            this.centroids[this.data[i].label].data.push(this.data[i]);
        }

        for (var i = 0; i < this.centroids.length; i++) {
            var meanX = 0;
            var meanY = 0;
            var length = this.centroids[i].data.length;
            for (var j = 0; j < length; j++) {
                meanX += this.centroids[i].data[j][0];
                meanY += this.centroids[i].data[j][1];
            }
            this.centroids[i][0] = meanX / length;
            this.centroids[i][1] = meanY / length;
        }
        this.kdTree = new KDTree(this.centroids, this.DIM);

        this.log(this.centroids);
    }

    /**
     * Return true if actual node are equal to the input point
     * @param {array} point data to compare
     * @param {float} k dimension of tree 
     */
    isEqual(a, b) {
        for (var i = 0; i < this.DIM; i++)
            if (a[i] != b[i])
                return false;
        return true;
    }

    getRandomCentroids() {
        var minVal = 100;
        var maxVal = 500;
        var centroids = [];
        for (var i = 0; i < this.k; i++) {
            var centroid = [];
            for (var j = 0; j < this.DIM; j++) {
                centroid.push(Math.random() * (maxVal - minVal) + minVal);
            }
            centroid.label = i;
            centroid.data = [];
            centroids.push(centroid);
        }
        return centroids;
    }

    log(message) {
        console.log(new Date(), message);
    }
}
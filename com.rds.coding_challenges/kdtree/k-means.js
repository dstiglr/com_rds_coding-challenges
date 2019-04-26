class KMeans {
    /**
     * Constructor of class
     * @param {array[array]} data input data
     * @param {int} k desired clusters (centroids)
     */
    constructor(data, clusterSize) {
        if (!Array.isArray(data) || data.length <= 0)
            throw "The given data must be an array and can't be empty ---";

        this.data = data;
        this.k = Math.floor(data.length / clusterSize);
        this.DIM = 2; // dimension of input data
        this.MAX_ITERATIONS = 80;
        this.kdTree = null;

        this.iterations = 0;
        this.oldCentroids = null;
        this.centroids = null;
        this.build();
    }

    build() {
        this.centroids = this.getRandomCentroids();
        // build kdtree for clusters
        this.kdTree = new KDTree(this.centroids, this.DIM);
    }

    process() {
        console.log('process start...', this.iterations, this.MAX_ITERATIONS);
        this.oldCentroids = JSON.parse(JSON.stringify(this.centroids));
        this.iterations++;

        this.getLabels();
        this.getCentroids();
        return this.data;
    }

    shouldStop() {

        if (this.iterations > this.MAX_ITERATIONS)
            return true;

        var stop = true;

        for (var i = 0; i < this.centroids.length; i++) {
            if (!this.isEqual(this.centroids[i], this.oldCentroids[i])) {
                stop = false;
            }
        }
        return stop;

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
        var minVal = 0;
        var maxVal = 10;
        var centroids = [];
        for (var i = 0; i < this.k; i++) {
            centroids.push(this.data[i]);
            centroids[i].label = i;
        }
        return centroids;
    }

    log(message) {
        console.log(new Date(), message);
    }
}
/* 
 * The MIT License
 *
 * Copyright 2019 rdesantiago.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class KDTree {

    /**
     * Initialize kd-tree structure
     * @param {array[array]} data 
     * @param {float} k dimension of three
     */
    constructor(data, k) {
        this.k = k;

        this.data = data;
        this.root = null;
        this._nearest = null; // manages nearest point to input data
        this._nearestK = []; // storage nearest points for given distance
        this._distance = Infinity; // manages distance on query search
        this._visited = []; // debug only
        this.distanceTo = this.nVectorDistance;
        // build kd-tree
        this.build();
    }

    /**
     * Sort input data based on first coordinate.
     * Besides, set the root of tree as the median of sorted data and pop them.
     */
    sortData() {
        // sort by the 0 axis
        this.data.sort(function(a, b) {
            return a[0] - b[0];
        });
        var median = Math.floor(this.data.length / 2);
        var mRoot = this.data.splice(median, 1);
        this.root = this.insert(this.root, mRoot[0]);
    }

    /**
     * Build the tree
     */
    build() {
        if (!Array.isArray(this.data) || this.data.length <= 0)
            throw "The given data must be an array and can't be empty ...";

        this.log('build started...');

        //this.sortData();

        // start building
        for (var i = 0; i < this.data.length; i++) {
            this.root = this.insert(this.root, this.data[i]);
        }
        this.log('build finished...');
    }

    /**
     * Recurrent function to inser data on the tree
     * @param {KDNode} node 
     * @param {array} point 
     * @param {int} depth 
     */
    _insertRec(node, point, depth) {

        var axis = depth % this.k;

        // Tree is empty? 
        if (node == null) {
            return new KDNode(point, axis, node);
        }

        // building  the kd-tree
        if (point[axis] < node.point[axis])
            node.left = this._insertRec(node.left, point, axis + 1);
        else
            node.rigth = this._insertRec(node.rigth, point, axis + 1);

        return node;

    }

    /**
     * Insert new point on the tree
     * @param {KDNode} root 
     * @param {array} point 
     */
    insert(root, point) {
        return this._insertRec(root, point, 0);
    }

    preorden(node) {
        if (node == null)
            return;

        node.print();
        this.preorden(node.left);
        this.preorden(node.rigth);
    }

    inorden(node) {
        if (node == null)
            return;
        this.inorden(node.left);
        node.print();
        this.inorden(node.rigth);
    }

    /**
     * Search nearest neighboors recursively from input point
     * @param {KDNode} node current node
     * @param {array} point input point
     * @param {float} dist distance constraint
     */
    _nearestNeighborsRec(node, point, dist) {
        if (node == null) {
            return;
        }

        var _dist = this.distanceTo(node.point, point);
        this._visited.push(node.point);
        if (_dist <= dist) {
            node.point['dist'] = _dist;
            this._nearestK.push(node.point);
        }

        if (point[node.axis] <= node.getValue()) {
            if (point[node.axis] - dist <= node.getValue())
                this._nearestNeighborsRec(node.left, point, dist);
            if (point[node.axis] + dist > node.getValue())
                this._nearestNeighborsRec(node.rigth, point, dist);
        } else {
            if (point[node.axis] + dist > node.getValue())
                this._nearestNeighborsRec(node.rigth, point, dist);
            if (point[node.axis] - dist <= node.getValue())
                this._nearestNeighborsRec(node.left, point, dist);
        }
    }

    /**
     * Search nearest neghboors for given point
     * @param {array} point input point
     * @param {float} distance distance constraint
     */
    nearestNeighbors(point, distance) {
        this._nearestK = [];
        this._visited = [];
        this._nearestNeighborsRec(this.root, point, distance);
        this._nearestK.sort(function(a, b) {
            return a.dist > b.dist;
        });
        return this._nearestK;
    }

    /**
     * Search k nearest neghboors for given point
     * @param {array} point input point
     * @param {float} distance distance constraint
     * @param {floar} k k number of required neighboors 
     */
    nearestNeighborsK(point, distance, k) {
        var nearest = this.nearestNeighbors(point, distance);
        if (nearest.length > k) {
            return nearest.splice(0, k);
        }
        return nearest;
    }


    /**
     * Search nearest neighboor recursively
     * @param {*} node 
     * @param {*} point 
     */
    _searchNearestRec(node, point) {
        if (node == null) {
            return;
        }

        var _dist = this.distanceTo(node.point, point);
        this._visited.push(node.point);
        if (_dist < this._distance) {
            this._distance = _dist;
            this._nearest = node.point;
        }

        if (point[node.axis] <= node.getValue()) {
            if (point[node.axis] - this._distance <= node.getValue())
                this._searchNearestRec(node.left, point);
            if (point[node.axis] + this._distance > node.getValue())
                this._searchNearestRec(node.rigth, point);
        } else {
            if (point[node.axis] + this._distance > node.getValue())
                this._searchNearestRec(node.rigth, point);
            if (point[node.axis] - this._distance <= node.getValue())
                this._searchNearestRec(node.left, point);
        }
    }

    /**
     * Search nearest point from given input
     * @param {array} point 
     */
    nearest(point) {
        this._nearest = null;
        this._nearestK = [];
        this._visited = [];
        this._distance = Infinity;
        this._searchNearestRec(this.root, point);
        return this._nearest;
    }

    /**
     * Return visited nodes for anyone search
     */
    getVisitedPoints() {
        return this._visited;
    }

    /**
     * Compute the euclidian distance
     * @param {array} pointA
     * @param {array} pointB 
     */
    euclidianDist(a, b) {
        var dist = 0;
        for (var i = 0; i < this.k; i++)
            dist += Math.pow((a[i] - b[i]), 2);
        return Math.sqrt(dist);
    }

    nVectorDistance(a, b) {
        const aVec = NVector.build(a[0], a[1], a[2]);
        const bVec = NVector.build(b[0], b[1], b[2]);
        return aVec.distanceTo(bVec);
    }

    log(message) {
        console.log(new Date(), ': ' + message);
    }

}

class KDNode {

    /**
     * Initialize new node
     * @param {array} point 
     * @param {int} axis 
     */
    constructor(point, axis) {
        this.point = point;
        this.axis = axis;
        this.left = null;
        this.rigth = null;
    }

    /**
     * Return true if actual node are equal to the input point
     * @param {array} point data to compare
     * @param {float} k dimension of tree 
     */
    isEqual(point, k) {
        for (var i = 0; i < k; i++)
            if (this.point[i] != point[i])
                return false;
        return true;
    }

    /**
     * Return true when left and rigth nodes are null
     */
    isLeaft() {
        return !this.left && !this.rigth;
    }

    /**
     * Return the value of current axis (depth)
     */
    getValue() {
        return this.point[this.axis];
    }

    /**
     * Print the point data
     */
    print() {
        console.log("(" + this.point.join(',') + "),")
    }
}
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
    constructor(points, k) {
        console.log('binary search tree is init...');
        this.k = k;

        // total number of nodes
        this.count = 0;
        // build kd-tree
        this.points = points;
        this.root = null;
        this._nearest = [];
        this._visited = [];
        this.build();
    }

    sortData() {
        // sort by the 0 axis
        this.points.sort(function(a, b) {
            return a[0] - b[0];
        });
    }

    /**
     * recurrent function to inser data on the tree
     * @param {*} node 
     * @param {*} point 
     * @param {*} depth 
     */
    _insertRec(node, point, depth) {

        var axis = depth % this.k;

        // Tree is empty? 
        if (node == null) {
            this.count++;
            return new KDNode(point, axis, node);
        }


        // building  the kd-tree
        if (point[axis] < node.point[axis]) {
            node.left = this._insertRec(node.left, point, axis + 1);
            node.left.parent = node;
        } else {
            node.rigth = this._insertRec(node.rigth, point, axis + 1);
            node.rigth.parent = node;
        }
        return node;

    }

    /**
     * insert new point on the tree
     * @param {*} root 
     * @param {*} point 
     */
    insert(root, point) {
        return this._insertRec(root, point, 0);
    }

    /**
     * build the tree
     */
    build() {
        if (!Array.isArray(this.points) || this.points.length <= 0)
            throw "The given data must be an array and can't be empty";


        console.log(new Date(), 'build started...');

        /*
        this.sortData();
        var median = Math.floor(this.points.length / 2);
        var mRoot = this.points.splice(median, 1);
        this.root = this.insert(this.root, mRoot[0]);
        */
        for (var i = 0; i < this.points.length; i++) {
            this.root = this.insert(this.root, this.points[i]);
        }
        console.log(new Date(), 'build finished...');
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

    _nearestSearchRec(node, point, dist) {
        if (node == null) {
            return;
        }

        var _dist = node.euclidianDist(point, this.k);
        this._visited.push(node.point);
        if (_dist <= dist) {
            //node.print();
            this._nearest.push(node.point);
        }

        if (point[node.axis] <= node.getValue()) {
            if (point[node.axis] - dist <= node.getValue())
                this._nearestSearchRec(node.left, point, dist);
            if (point[node.axis] + dist > node.getValue())
                this._nearestSearchRec(node.rigth, point, dist);
        } else {
            if (point[node.axis] + dist > node.getValue())
                this._nearestSearchRec(node.rigth, point, dist);
            if (point[node.axis] - dist <= node.getValue())
                this._nearestSearchRec(node.left, point, dist);
        }
    }

    nearest(point, distance) {
        console.log(new Date(), '_nearestSearchRec star...');
        this._nearest = [];
        this._visited = [];
        this._nearestSearchRec(this.root, point, distance);
        console.log(new Date(), '_nearestSearchRec finish...');
        return this._nearest;
    }


}

class KDNode {
    constructor(point, axis, parent) {
        this.point = point;
        this.axis = axis;
        this.parent = parent;
        this.left = null;
        this.rigth = null;
    }

    isEqual(point, k) {
        for (var i = 0; i < k; i++)
            if (this.point[i] != point[i])
                return false;
        return true;
    }

    isLeaft() {
        return !this.left && !this.rigth;
    }

    getValue() {
        return this.point[this.axis];
    }

    euclidianDist(point, k) {
        var dist = 0;
        for (var i = 0; i < k; i++)
            dist += Math.pow((this.point[i] - point[i]), 2);
        return Math.sqrt(dist);
    }

    print() {
        console.log("(" + this.point.join(',') + "),")
    }
}
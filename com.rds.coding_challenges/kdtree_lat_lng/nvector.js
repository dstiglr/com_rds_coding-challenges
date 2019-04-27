class NVector {

    /**
     * Crate new n-vector from given lat, lng
     * @param {decial} lat 
     * @param {decimal} lng 
     * @example
     *  var _vector = new NVector(22.154311, -100.997803);
     * https://www.movable-type.co.uk/scripts/latlong-vectors.html
     */
    constructor(lat, lng) {
        var vector = this.toNvector(parseFloat(lat), parseFloat(lng));
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        this.R = 6371e3;
    }

    static build(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        const vector = new NVector(0, 0);
        vector.x = x;
        vector.y = y;
        vector.z = z;
        return vector;
    }

    toNvector(lat, lng) {
        this._lat = lat;
        this._lng = lng;
        const fi = lat.toRadians();
        const lambda = lng.toRadians();

        const cosFi = Math.cos(fi);
        const sinFi = Math.sin(fi);
        const cosLamb = Math.cos(lambda);
        const sinLamb = Math.sin(lambda);

        var _x = cosFi * cosLamb;
        var _y = cosFi * sinLamb;
        var _z = sinFi;
        return { x: _x, y: _y, z: _z };
    }

    distanceTo(v) {
        const aXb = this.cross(v);
        return this.R * Math.atan2(aXb.length(), this.dot(v));
    }

    toLocation() {
        const fi = Math.atan2(this.z, Math.sqrt((this.x * this.x) + (this.y * this.y)));
        const lambda = Math.atan2(this.y, this.x);
        return { lat: fi.toDegrees(), lng: lambda.toDegrees() };
    }


    /**
     * Length (magnitude or norm) of ‘this’ vector.
     *
     * @returns {number} Magnitude of this vector.
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Multiplies ‘this’ vector by the supplied vector using dot (scalar) product.
     *
     * @param   {Vector3d} v - Vector to be dotted with this vector.
     * @returns {number}   Dot product of ‘this’ and v.
     */
    dot(v) {
        if (!(v instanceof NVector)) throw new TypeError('v is not NVector object');

        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Multiplies ‘this’ vector by the supplied vector using cross (vector) product.
     *
     * @param   {NVector} v - Vector to be crossed with this vector.
     * @returns {NVector}} Cross product of ‘this’ and v.
     */
    cross(v) {
        if (!(v instanceof NVector)) throw new TypeError('v is not Vector3d object');
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;

        return NVector.build(x, y, z);
    }

    toString() {
        return "[" + this.x + "," + this.y + "," + this.z + "]";
    }

}

// Extend Number object with methods to convert between degrees & radians
Number.prototype.toRadians = function() { return this * Math.PI / 180; };
Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
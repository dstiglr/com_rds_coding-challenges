class Star {
    constructor() {
        this.x = random(-width / 2, width / 2);
        this.y = random(-height / 2, height / 2);
        this.z = random(400, 800);
        this.pz = this.z;
    }

    update() {
        this.z = this.z - speed;
        if (this.z < 1) {
            this.z = random(400, 800);
            this.x = random(-width / 2, width / 2);
            this.y = random(-height / 2, height / 2);
            this.pz = this.z;
        }
    }

    show() {
        fill(255);
        noStroke();
        var sx = map(this.x / this.z, 0, 1, 0, width);
        var sy = map(this.y / this.z, 0, 1, 0, height);
        var size = map(this.z, width, 0, 1, 5);

        var px = map(this.x / this.pz, 0, 1, 0, width);
        var py = map(this.y / this.pz, 0, 1, 0, height);
        ellipse(sx, sy, size, size);
        this.pz = this.z;
        strokeWeight(2);
        stroke(255);
        line(sx, sy, px, py);
    }
}
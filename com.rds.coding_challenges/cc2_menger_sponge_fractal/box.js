class Box {
    constructor(x, y, z, size) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
    }

    split() {
        var newBoxes = [];
        var size = this.size / 3;
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var z = -1; z < 2; z++) {
                    var sum = abs(x) + abs(y) + abs(z);
                    if (sum > 1) {
                        var newBox = new Box(this.x + x * size, this.y + y * size, this.z + z * size, size);
                        newBoxes.push(newBox);
                    }
                }
            }
        }
        return newBoxes;
    }

    draw() {
        push()
        translate(this.x, this.y, this.z);
        box(this.size);
        pop()
    }
}
let boxes = [];

function setup() {
    createCanvas(600, 600, WEBGL);
    var b = new Box(0, 0, 0, 200);
    boxes.push(b);
}

function draw() {
    background(0);
    // rotate over x and y axis
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    for (var id in boxes) {
        boxes[id].draw();
    }

}

function mouseClicked() {
    var nextBoxes = [];
    for (var id in boxes) {
        Array.prototype.push.apply(nextBoxes, boxes[id].split());
    }
    boxes = nextBoxes;
}
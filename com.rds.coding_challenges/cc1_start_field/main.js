let stars = new Array();
let speed;

function setup() {
    var myCanvas = createCanvas(500, 600);
    myCanvas.parent('container');
    for (var x = 0; x < 300; x++) {
        stars.push(new Star());
    }
}

function draw() {
    background(0);
    speed = map(mouseX, 0, width, 1, 20);
    translate(width / 2, height / 2);
    stars.forEach(function(star) {
        star.update();
        star.show();
    });
}
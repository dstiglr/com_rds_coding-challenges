var sun;

function setup() {
    createCanvas(600, 600);
    sun = new Planet(30, 0, 0);
    sun.initPlanets(12, 1);
}

function draw() {
    background(0);
    fill(255, 150);
    translate(width / 2, height / 2);
    sun.show();
    sun.orbit();
}
class Planet {

    constructor(radius, dist, speed) {
        this.radius = radius;
        this.angle = random(TWO_PI);
        this.dist = dist;
        this.planets = [];
        this.speed = speed;
    }

    initPlanets(numner_of_planets, level) {
        var n = level;
        for (var i = 0; i < numner_of_planets; i++) {
            var speed = random(-0.05, 0.05);
            var radius = this.radius * 0.4;
            var length = random(20, 40);
            if (level == 1) {
                length = random(120, 240);
                speed = random(-0.01, 0.01);
            }
            this.planets[i] = new Planet(radius, length, speed);
            if (level < 2) {
                this.planets[i].initPlanets(random(1, 3), n += 1);
            }
        }
    }

    orbit() {
        this.angle += this.speed;
        if (this.planets) {
            for (var p in this.planets) {
                this.planets[p].orbit();
            }
        }
    }

    show() {
        push();
        rotate(this.angle);
        translate(this.dist, 0);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        if (this.planets) {
            for (var p in this.planets) {
                this.planets[p].show();
            }
        }
        pop();
    }
}
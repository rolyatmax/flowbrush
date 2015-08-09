var animitter = require('animitter');
var vectorField = require('./vector_field');
var imagePixelPicker = require('./image_pixel_picker');

var VParticle = toxi.physics2d.VerletParticle2D;
var VPhysics = toxi.physics2d.VerletPhysics2D;
var Attraction = toxi.physics2d.behaviors.AttractionBehavior;
var Vec2D = toxi.geom.Vec2D;
var Rect = toxi.geom.Rect;

// require('toxi/physics2d/behaviors/GravityBehavior')


module.exports = function(canvas, ctx, img, opts) {
    opts = opts || {};
    opts.iterations = opts.iterations || 4;
    opts.duration = opts.duration || 100;
    opts.alpha = opts.alpha || 0.175;
    opts.wander = opts.wander === true;
    opts.radius = opts.radius || 35;
    opts.decay = opts.decay || 0.95;
    var imagePixel = imagePixelPicker(img);
    var physics = new VPhysics();
    var rect = new Rect(0, 0, canvas.width, canvas.height);
    var center = new Vec2D(canvas.width, canvas.height).scaleSelf(0.5);
    physics.addBehavior(new Attraction(center, canvas.width / 6, canvas.width / 240));
    var color;
    var vec = new Vec2D();
    var pVec = new VParticle();
    var expired = [];
    var drawDrops = function() {
        physics.update();
        var particles = [];
        for (var i = 0, len = physics.particles.length; len > i; i++) {
            var particle = physics.particles[i];
            if (particle.isInRectangle(rect) && particle.radius > 0) {
                pVec.set(particle);
                var alpha = particle.color._alpha * (0.25 + 0.75 * pVec.normalize().x);
                color = imagePixel.tcolor(Math.floor(particle.x), Math.floor(particle.y), color).setAlpha(alpha);
                ctx.fillStyle = color.toRGBACSS();
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
                particle.radius *= opts.decay;
                ctx.closePath();
                ctx.fill();
            } else {
                particles.push(particle);
            }
            if (opts.wander) {
                vec = vectorField.atCell(imagePixel.imageData, Math.floor(particle.x), Math.floor(particle.y), vec);
                particle.addForce(vec.scaleSelf(0.05));
            }
        }
        for (len = particles.length, i = 0; len > i; i++) {
            physics.removeParticle(particles[i]);
            expired.push(particles[i]);
        }
    };
    var brush = animitter(function() {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        imagePixel.index(x, y);

        vec = vectorField.atCell(imagePixel.imageData, x, y, vec);
        var particle;
        particle = new VParticle(x, y);
        particle.setWeight(0.75 + 0.75 * Math.random());
        particle.color = imagePixel.tcolor(x, y, particle.color).setAlpha(opts.alpha);
        particle.radius = opts.radius * (1 - this.frameCount / opts.duration);
        if (particle.y + particle.radius < canvas.height - 25) {
            physics.addParticle(particle);
            particle.addForce(vec.scaleSelf(0.5, 0.025).scaleSelf(1, -0.15));
        }
        for (var r = 0; r < opts.iterations; r++) {
            drawDrops();
        }
        if (this.frameCount % 5 === 0) {
            physics.particles.shift();
        }
        if (this.frameCount > opts.duration) {
            this.complete();
        }
    });
    return brush;
};

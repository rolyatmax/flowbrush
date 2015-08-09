var flowBrush = require('./flow_brush');
var resizedCanvasSync = require('./resized_canvas_sync');
var tween = require('./lib/tweenlite');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.querySelector('.container').appendChild(canvas);

function scaleToFill(t, e, i, n) {
    if (arguments.length === 2) {
        n = e.height;
        i = e.width;
        e = t.height;
        t = t.width;
    }
    var width = Math.max(i, t * (n / e));
    var height = Math.max(n, e * (i / t));
    return {
        x: -((width - i) / 2),
        y: -((height - n) / 2),
        width: width,
        height: height
    };
}

var IMG_COUNT = 18;

var num = Math.round(Math.random() * IMG_COUNT);

var img = document.createElement('img');
img.src = '/img/' + num + '.jpg';
// img.src = '/img/1.png';
img.onload = main;

function main() {
    var l = scaleToFill(img.width, img.height, window.innerWidth - 2 * 10, 1.2 * window.innerHeight);
    var imgCanvas = resizedCanvasSync(img, l);

    canvas.width = imgCanvas.width;
    canvas.height = imgCanvas.height;

    ctx.translate(canvas.width / 2 - imgCanvas.width / 2, canvas.height / 2 - imgCanvas.height / 2);
    var brushes = [flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(0.25 * canvas.width),
        alpha: 0.05,
        radius: 240
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(0.5 * canvas.width),
        alpha: 0.025,
        radius: 140
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(0.75 * canvas.width),
        alpha: 0.25,
        radius: 20,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(0.33 * canvas.width),
        alpha: 0.025,
        radius: 15,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(0.2 * canvas.width),
        alpha: 0.25,
        radius: 10,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 8,
        duration: Math.floor(1 * canvas.width),
        alpha: 0.25,
        radius: 10,
        wander: false,
        decay: 0.9
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 8,
        duration: Math.floor(1.2 * canvas.width),
        alpha: 0.35,
        radius: 8,
        wander: true,
        decay: 0.9
    })];
    setTimeout(brushes[1].start.bind(brushes[0]), 150);
    // brushes[0].on('complete', function() {
        // brushes[1].start();
        // brushes[2].start();
        // brushes[3].start();
        // brushes[6].start();
    // });
    // brushes[2].on('complete', function() {
        // brushes[4].start();
    // });
    // brushes[4].on('complete', function() {
        // brushes[5].start();
    // });
    tween.set(canvas, {
        transformOrigin: 'top left'
    });
    resize();
}

function resize() {
    var t = window.innerWidth;
    t = Math.ceil(100 * t) / 100;
    tween.set(canvas, {scale: t});
}

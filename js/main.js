var flowBrush = require('./flow_brush');
var resizedCanvasSync = require('./resized_canvas_sync');
var tween = require('./lib/tweenlite');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.querySelector('.container').appendChild(canvas);

function scaleToFill(imgWidth, imgHeight, containerWidth, containerHeight) {
    if (arguments.length === 2) {
        containerHeight = imgHeight.height;
        containerWidth = imgHeight.width;
        imgHeight = imgWidth.height;
        imgWidth = imgWidth.width;
    }
    var width = Math.max(containerWidth, imgWidth * (containerHeight / imgHeight));
    var height = Math.max(containerHeight, imgHeight * (containerWidth / imgWidth));
    return {
        x: -((width - containerWidth) / 2),
        y: -((height - containerHeight) / 2),
        width: width,
        height: height
    };
}

var IMG_COUNT = 16;

var num = Math.round(Math.random() * IMG_COUNT);

var img = document.createElement('img');
img.src = 'img/' + num + '.jpg';
// img.src = 'img/3.png';
img.onload = main;

function main() {
    var dimensions = scaleToFill(img.width, img.height, window.innerWidth - 2 * 10, 1.2 * window.innerHeight);
    var imgCanvas = resizedCanvasSync(img, dimensions);

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
        radius: 140,
        decay: 0.95
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(1.75 * canvas.width),
        alpha: 0.25,
        radius: 20,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(1.33 * canvas.width),
        alpha: 0.025,
        radius: 15,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 1,
        duration: Math.floor(2.5 * canvas.width),
        alpha: 0.25,
        radius: 10,
        wander: true
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 8,
        duration: Math.floor(2.5 * canvas.width),
        alpha: 0.25,
        radius: 10,
        wander: false,
        decay: 0.93
    }), flowBrush(imgCanvas, ctx, imgCanvas, {
        iterations: 8,
        duration: Math.floor(3.2 * canvas.width),
        alpha: 0.35,
        radius: 8,
        wander: true,
        decay: 0.92
    })];
    setTimeout(brushes[0].start.bind(brushes[0]), 150);
    brushes[0].on('complete', function() {
        brushes[1].start();
        brushes[2].start();
        brushes[3].start();
        brushes[6].start();
    });
    brushes[2].on('complete', function() {
        brushes[4].start();
    });
    brushes[4].on('complete', function() {
        brushes[5].start();
    });
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

var TColor = toxi.color.TColor;
var canvasSync = require('./canvas_sync');

module.exports = function(img) {
    function index(x, y) {
        return 4 * (x + y * imageData.width);
    }

    function pixel(x, y, color) {
        color = color || {};
        var i = index(x, y);
        color.red = imageData.data[i];
        color.green = imageData.data[i + 1];
        color.blue = imageData.data[i + 2];
        color.alpha = imageData.data[i + 3];
        return color;
    }

    var canvas = canvasSync(img);
    var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    var color = {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
    };

    return {
        canvas: canvas,
        imageData: imageData,
        index: index,
        pixel: pixel,
        pixelData: function(x, y) {
            var i = index(x, y);
            return imageData.data.subarray(i, i + 4);
        },
        tcolor: function(x, y, color) {
            var s = pixel(x, y, color);
            var r = s.red / 255;
            var g = s.green / 255;
            var b = s.blue / 255;
            var alpha = s.alpha / 255;
            return color ? (color.setRGB(r, g, b).setAlpha(alpha), color) : TColor.newRGBA(r, g, b, alpha);
        }
    };
};

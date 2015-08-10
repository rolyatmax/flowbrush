var Vec2D = toxi.geom.Vec2D;

function average(a, b, c) {
    return (a + b + c) / 3;
}

function grayscale(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function vector(pixels, copyTo) {
    var i;
    var neighbors = [];
    for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 3; k++) {
            i = j + 3 * k * 4;
            neighbors.push(grayscale(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]));
        }
    }
    var west = average(neighbors[0], neighbors[3], neighbors[6]);
    var east = average(neighbors[2], neighbors[5], neighbors[8]);
    var x = west - east;
    var north = average(neighbors[0], neighbors[1], neighbors[2]);
    var south = average(neighbors[6], neighbors[7], neighbors[8]);
    var y = north - south;
    return copyTo ? (copyTo.x = x, copyTo.y = y, copyTo) : new Vec2D(x, y);
}

function index(imgData, x, y) {
    return 4 * (x + y * imgData.width);
}

function getCell(imgData, x, y) {
    var neighbors = new Uint8Array(36);
    var i = 0;
    for (var xOffset = -1; xOffset < 2; xOffset++) {
        for (var yOffset = -1; yOffset < 2; yOffset++) {
            var idx = index(imgData, x + xOffset, y + yOffset);
            neighbors[i] = imgData.data[idx];
            neighbors[i + 1] = imgData.data[idx + 1];
            neighbors[i + 2] = imgData.data[idx + 2];
            neighbors[i + 3] = imgData.data[idx + 3];
            i += 4;
        }
    }
    return neighbors;
}

function atCell(imgData, x, y, copyTo) {
    return vector(getCell(imgData, x, y), copyTo);
}

module.exports = {
    vector,
    index,
    getCell,
    atCell
};

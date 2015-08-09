var Vec2D = toxi.geom.Vec2D;

function average(a, b, c) {
    return (a + b + c) / 3;
}

function grayscale(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function vector(t, e) {
    for (var s, o = [], a = 0; a < 3; a++) {
        for (var l = 0; l < 3; l++) {
            s = a + 3 * l * 4;
            o.push(grayscale(t[s], t[s + 1], t[s + 2], t[s + 3]));
        }
    }
    var c = average(o[0], o[3], o[6]);
    var u = average(o[2], o[5], o[8]);
    var h = c - u;
    var d = average(o[0], o[1], o[2]);
    var p = average(o[6], o[7], o[8]);
    var f = d - p;
    return e ? (e.x = h, e.y = f, e) : new Vec2D(h, f);
}

function index(t, e, i) {
    return 4 * (e + i * t.width);
}

function getCell(t, i, n) {
    for (var r = new Uint8Array(36), s = 0, o = -1; o < 2; o++) {
        for (var a = -1; a < 2; a++) {
            var l = index(t, i + o, n + a);
            r[s] = t.data[l];
            r[s + 1] = t.data[l + 1];
            r[s + 2] = t.data[l + 2];
            r[s + 3] = t.data[l + 3];
            s += 4;
        }
    }
    return r;
}

function atCell(t, i, n, r) {
    return vector(getCell(t, i, n), r);
}

module.exports = {
    vector,
    index,
    getCell,
    atCell
};

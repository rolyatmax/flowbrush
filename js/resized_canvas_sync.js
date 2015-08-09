module.exports = function(img, canvas, newCanvas) {
    function resize(prop1, prop2) {
        void 0 !== canvas[prop1] && void 0 === canvas[prop2] && (canvas[prop2] = img[prop2] / img[prop1] * canvas[prop1]);
    }

    var ctx;
    resize('width', 'height');
    resize('height', 'width');
    newCanvas = newCanvas || document.createElement('canvas');
    ctx = newCanvas.getContext('2d');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    ctx.drawImage(img, 0, 0, img.naturalWidth || img.width, img.naturalHeight || img.height, 0, 0, canvas.width, canvas.height);
    return newCanvas;
};

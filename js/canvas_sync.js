module.exports = function(img, canvas) {
    canvas = canvas || document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    if (!canvas.width || !canvas.height) {
        var rect = img.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    ctx.drawImage(img, 0, 0);
    return canvas;
};

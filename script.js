var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

class FretboardDiagram {
    constructor(frets, strings, a1, height, padding) {
        this.frets = frets;
        this.strings = strings;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var N = 14; // fret count
    var STRINGS = 6; // string count
    var a1 = 80; // first fret width
    var H = 160; // fretboard height
    var d = a1 / 24; // arithmetic progression coefficient
    var W = Math.floor(N * a1 - d * N * (N - 1) / 2); // fretboard width
    var R = H / (STRINGS - 1) * 0.4 / 2;

    var PADDING = 50;

    var canvas = createHiDPICanvas(W + PADDING, H + PADDING);
    canvas.getContext("2d").translate(PADDING / 2, PADDING / 2);
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    for (var i = 0; i < STRINGS; ++i) {
        var y = stringY(i); //H / (STRINGS - 1) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
    }
    for (var i = 0; i < N; ++i) {
        var x = fretX(i);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
    }
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Render NUT
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, H + 5);
    ctx.strokeStyle = '#AAA';
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.beginPath();
    var SINGLE_CIRCLES = [3, 5, 7, 9, 15, 17, 19, 21];
    for (var fretNumber of SINGLE_CIRCLES) {
        if (fretNumber > N)
            break;
        var x = (fretX(fretNumber - 1) + fretX(fretNumber)) / 2;
        var y = H / 2;
        ctx.moveTo(x, y);
        ctx.arc(x, y, R, 0, 360, false);
    }
    // Render double circles.
    if (12 < N) {
        var x = (fretX(11) + fretX(12)) / 2;
        var y1 = (stringY(STRINGS / 2 - 1) + stringY(STRINGS / 2 - 2)) / 2;
        ctx.moveTo(x, y1);
        ctx.arc(x, y1, R, 0, 360, false);
        var y2 = (stringY(STRINGS / 2) + stringY(STRINGS / 2 + 1)) / 2;
        ctx.moveTo(x, y2);
        ctx.arc(x, y2, R, 0, 360, false);
    }
    ctx.fillStyle = '#BBB';
    ctx.lineWidth = 1;
    ctx.fill();

    renderNote(3, 5, "C#");
    renderNote(0, 5, "A");
    renderNote(1, 5, "A#");
    renderNote(2, 5, "B");
    renderNote(0, 6, "E");

    function fretX(n) {
        return n === 0 ? 0 : n * a1 - d * (n - 1) * n / 2;
    }

    function stringY(n) {
        return H / (STRINGS - 1) * n;
    }

    function renderNote(fret, string, text) {
        --string;
        ctx.beginPath();
        var x = fret === 0 ? 0 : (fretX(fret - 1) + fretX(fret)) / 2;
        var y = stringY(string);
        var R = H / (STRINGS - 1) * 0.4;
        ctx.moveTo(x, y);
        ctx.arc(x, y, R, 0, 360, false);
        ctx.fillStyle = '#555';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.font = '16px arial';
        ctx.fontWeight = 'bold';
        ctx.lineWidth = 1;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.moveTo(x, y);
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);
    }
});


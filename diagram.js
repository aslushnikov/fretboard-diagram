(function(window) {

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

window.renderFretboard = function(options) {
    var N = options.N;
    var STRINGS = options.strings;
    var a1 = options.a1;
    var H = options.height;
    var d = typeof options.d === 'number' ? options.d : a1 / 24;
    var W = Math.floor(N * a1 - d * N * (N - 1) / 2); // fretboard width
    var R = H / (STRINGS - 1) * 0.4 / 2;

    var PADDING = 50;

    var canvas = createHiDPICanvas(W + PADDING, H + PADDING);
    canvas.getContext("2d").translate(PADDING / 2, PADDING / 2);
    var ctx = canvas.getContext("2d");

    // Render fret highlight.
    for (var highlight of options.fretHighlight) {
        for (var fret = highlight.from; fret <= highlight.to; ++fret) {
            if (fret <= 0 || fret > N) {
                console.error('Fret highlight out of bounds: ' + JSON.stringify(highlight));
                continue;
            }
            ctx.fillStyle = highlight.color;
            ctx.fillRect(fretX(fret - 1), -PADDING/2, fretX(fret) - fretX(fret - 1), H + PADDING);
        }
    }

    // Render fretboard.
    ctx.beginPath();
    for (var i = 0; i < STRINGS; ++i) {
        var y = stringY(i);
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
    }
    if (STRINGS > 1) {
        for (var i = 0; i < N; ++i) {
            var x = fretX(i);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
        }
    }
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Render NUT
    if (!options.hideNut) {
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, H + 10);
        ctx.strokeStyle = '#AAA';
        ctx.lineWidth = 15;
        ctx.stroke();
    }

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

    for (var note of options.notes) {
        if (note.fret < 0 || note.fret > N || note.string > STRINGS || note.string <= 0) {
            console.error('note outside fretboard: ' + note.text + `[${note.fret}:${note.string}]`);
            continue;
        }
        renderNote(note.fret, note.string, note.text);
    }

    return canvas;

    function fretX(n) {
        return n === 0 ? 0 : n * a1 - d * (n - 1) * n / 2;
    }

    function stringY(n) {
        return STRINGS > 1 ? H / (STRINGS - 1) * n : H / 2;
    }

    function renderNote(fret, string, text) {
        --string;
        ctx.beginPath();
        var x = fret === 0 ? 0 : (fretX(fret - 1) + fretX(fret)) / 2;
        var y = stringY(string);
        var R = STRINGS > 1 ? H / (STRINGS - 1) * 0.4 : H / 2;
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

    function createHiDPICanvas(w, h) {
        var can = document.createElement("canvas");
        can.width = w * PIXEL_RATIO;
        can.height = h * PIXEL_RATIO;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
        return can;
    }
};
})(self);

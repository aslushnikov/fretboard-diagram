document.addEventListener('DOMContentLoaded', function() {
    var fret = 1;
    var notes = [
        {fret: fret + 1, string: 1, text: 'C'},
        {fret: fret + 3, string: 1, text: 'D'},
        {fret: fret + 5, string: 1, text: 'E'},
        {fret: fret + 6, string: 1, text: 'F'},
        {fret: fret + 8, string: 1, text: 'G'},
        {fret: fret + 10, string: 1, text: 'A'},
        {fret: fret + 12, string: 1, text: 'B'},
        {fret: fret + 13, string: 1, text: 'C'},
        /*
        {fret: 0, string: 5, text: 'A'},
        {fret: 1, string: 5, text: 'A#'},
        {fret: 2, string: 5, text: 'B'},
        {fret: 3, string: 5, text: 'C'},
        {fret: 0, string: 6, text: 'E'},
        */
    ];
    var fretboard = renderFretboard({
        N: 16, // fret count
        strings: 1, // string count
        a1: 50, // first fret width in pixels
        d: 0, // fret size decrease. Default guitar has a1 / 24.
        height: 30, // fretboard height in pixels
        padding: 50, // canvas padding
        hideNut: true, // hide guitar nut
        notes: notes
    });
    document.body.appendChild(fretboard);
});


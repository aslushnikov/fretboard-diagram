var C1 = '#05b';
var C2 = '#5b0';

document.addEventListener('DOMContentLoaded', function() {
    addTitle('full-tone groups');
    renderOneString();

    appendFretboard('empty fret', [], true);

    var all = allNotes(0, 14);
    var allNatural = all.filter(natural);
    var nut = all.filter(fret(0));

    var notes = nut;
    notes = notes.concat(allNatural.filter(subset(6, 0, 12)));
    notes = notes.concat(allNatural.filter(subset(1, 0, 12)));
    notes = notes.concat(all.filter(fret(12)));
    appendFretboard('rock notes', notes, true);
    appendFretboard('all notes', all, true);
    appendFretboard('natural notes', all.filter(natural), true);

    var root = allNatural.filter(subset(4, 3, 9)).map(setColor(C1));
    var below = allNatural.filter(subset(5, 3, 7)).map(setColor(C2));
    var up = allNatural.filter(subset(3, 5, 9)).map(setColor(C2));
    var shifted = allNatural.filter(subset(2, 1, 5)).map(setColor(C2));

    appendFretboard('the ROOT', root);
    appendFretboard('below', root.concat(below));
    appendFretboard('below & up', root.concat(below).concat(up));
    appendFretboard('below & up & around', root.concat(below).concat(up).concat(notes));
    appendFretboard('shifted', root.concat(below).concat(up).concat(shifted).concat(notes));
});

function addTitle(text) {
    var div = document.createElement('div');
    div.classList.add('title');
    div.textContent = text;
    document.body.appendChild(div);
}

function appendFretboard(title, notes) {
    var group1 = '#5B0'
    var group2 = '#05B'
    addTitle(title);
    var options = {
        N: 14, // fret count
        strings: 6, // string count
        a1: 80, // first fret width in pixels
        //d: 0, // fret size decrease. Default guitar has a1 / 24.
        height: 160, // fretboard height in pixels
        padding: 50, // canvas padding
        notes: notes,
    };
    var element = renderFretboard(options);
    document.body.appendChild(element);
}

function renderOneString() {
    var N = 17;
    var notes = allNotes(0, N).filter(natural).filter(subset(1, 1, N));
    var notes = getNotes(1, 'G', 0, 17).filter(natural);
    var g1 = notes.filter(subset(1, 1, 4)).map(setColor(C1));
    var g2 = notes.filter(subset(1, 5, 9)).map(setColor(C2));
    var g3 = notes.filter(subset(1, 10, 16)).map(setColor(C1));
    var g4 = notes.filter(subset(1, 17, 17)).map(setColor(C2));
    var notes = g1.concat(g2).concat(g3).concat(g4);
    var fretboard = renderFretboard({
        N: N, // fret count
        strings: 1, // string count
        a1: 50, // first fret width in pixels
        d: 0, // fret size decrease. Default guitar has a1 / 24.
        height: 30, // fretboard height in pixels
        padding: 50, // canvas padding
        hideNut: true, // hide guitar nut
        notes: notes,
    });
    document.body.appendChild(fretboard);
}

var NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNotes(string, stringTune, fromFret, toFret) {
    var result = [];
    var index = NOTES.indexOf(stringTune);
    console.assert(index !== -1, 'Failed to find note: ' + stringTune);
    var fret = 0;
    while (fret <= toFret) {
        var note = NOTES[index];
        if (fret >= fromFret) {
            result.push({
                fret: fret,
                string: string,
                text: note
            });
        }
        index = (index + 1) % NOTES.length;
        fret += 1;
    }
    return result;
}

function allNotes(fromFret, toFret) {
    var tune = ['E', 'B', 'G', 'D', 'A', 'E'];
    var notes = [];
    for (var i = 0; i < tune.length; ++i)
        notes = notes.concat(getNotes(i + 1, tune[i], fromFret, toFret));
    return notes;
}

function naturalNotes(string, stringTune, fromFret, toFret) {
    return getNotes(string, stringTune, fromFret, toFret).filter(natural);
}

function subset(string, fromFret, toFret) {
    return function(note) {
        return note.string === string && note.fret >= fromFret && note.fret <= toFret;
    }
}

function setColor(color) {
    return function(note) {
        return {
            fret: note.fret,
            string: note.string,
            text: note.text,
            color: color
        }
    }
}

function fret(x) {
    return function(note) {
        return note.fret === x;
    }
}

function natural(note) {
    return !note.text.endsWith('#');
}


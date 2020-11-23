const fs = require('fs');
const dirname = "./song-files";
const outputDir = "./json-files";

function createSongFromData(filename, data) {
    const lines = data.split('\n');
    const sections = [];
    let tempo = 120;
    let measures = null;
    let section = null;
    let endings = null;
    let name = filename;

    const numberOfBeats = 4;
    let style = "fourFourTime";
    let originalMeasureNumber = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // name of the tune:
        if (line.startsWith("!")) {
            name = line.substring(1);
        }

        // tempo of the tune:
        else if (line.startsWith("^")) {
            tempo = Number.parseInt(line.substring(1));
        }

        // style change:
        else if (line.startsWith("$")) {
            style = line.substring(1);
        }

        // beginning of a new section:
        else if (line.startsWith("=")) {
            if (section) {
                section.measures = measures;
                if (endings) {
                    endings.push(ending)
                    section.endings = endings;
                    endings = [];
                }
            }

            measures = [];
            endings = null;

            if (section) {
                // if we are working on a section right now, push it onto the list
                sections.push(section);
            }

            section = { name: line.substring(1), repeat: false, numRepeats: 0, measures: [] };

            // a new ending
        } else if (line === "-") {

            // if we are still on measures, start a new ending
            if (!endings) {
                endings = [];
                ending = [];
            } else {
                endings.push(ending);
                ending = [];
            }
            section.repeat = true;
            section.numRepeats++;

            // a new measure
        } else {
            const chords = [];
            const rawChords = line.split(" ");
            const parsedChords = [];
            const cnt = 4;
            for (let c of rawChords) {
                if (!c.match(/^[ABCDEFG][#b]*/gm)) {
                    console.log("failed to parse chord " + c);
                    return;
                }
                const root = c.match(/^[ABCDEFG][#b]*/gm)[0];
                const type = c.replace(root, "");
                parsedChords.push([root, type]);
            }
            for (let i = 0; i < cnt; i++) {
                if (parsedChords.length >= 4) {
                    chords.push(parsedChords[i]);
                } else if (parsedChords.length === 2 && i > 1) {
                    chords.push(parsedChords[1]);
                } else if (parsedChords.length === 3) {
                    if (i < 2) {
                        chords.push(parsedChords[0]);
                    } else if (i === 2) {
                        chords.push(parsedChords[1]);
                    } else if (i === 3) {
                        chords.push(parsedChords[2]);
                    }
                } else {
                    chords.push(parsedChords[0]);
                }
            }

            const measure = {
                arrangementMeasureNumber: null,
                originalMeasureNumber: originalMeasureNumber,
                style: style,
                chords: chords,
                numberOfBeats: numberOfBeats,
                nextMeasure: null
            };
            originalMeasureNumber++;
            if (!endings) {
                measures.push(measure);
            } else {
                ending.push(measure);
            }
        }
    }

    // add final section

    section.measures = measures;
    if (endings) {
        endings.push(ending)
        section.endings = endings;
    }
    sections.push(section);

    return {
        name: name,
        sections: sections,
        tempo: tempo
    };
}


fs.readdir(dirname, function(err, filenames) {
    if (err) {
        console.log(err);
        return;
    }
    filenames.forEach(function(filename) {
        fs.readFile(dirname + "/" + filename, 'utf-8', function(err, content) {
            if (err) {
                console.log(err);
                return;
            }
            const songObj = createSongFromData(filename, content);
            fs.writeFile(`${__dirname}/../${outputDir}/${filename.replace(".txt", "")}.json`, JSON.stringify(songObj, null, 4), (err) => {
                if (err) {
                    console.log(`failed to save:\n${err}`);
                } else {
                    console.log(`finished making json file for '${filename}'`);
                }
            });
        });
    });
});

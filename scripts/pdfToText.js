const pdfjsLib = require("../pdfjs-dist/es5/build/pdf.js");
const fs = require('fs');
const outputDir = "./intermediateFiles";

const inputPDF = process.argv[2];

(async function GetTextFromPDF(path) {
    let doc = await pdfjsLib.getDocument(path).promise;
    let page1 = await doc.getPage(1);
    let content = await page1.getTextContent();
    let strings = content.items.map(function(item) {
        return item.str;
    });

    let data = "".concat(strings);
    data = data.substr(3);

    let tokenMap = {
        "44": "",
        "&c": "",
        ",": "",
        "’’’’": "|",
        "ÕÕÕÕ": "|",
        "bbb": "",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
        "E": "E",
        "F": "F",
        "G": "G",
        "#": "#",
        "b": "b",
        "Maj7": "maj7",
        "-7": "min7",
        "m7": "min7",
        "o": "dim7",
        "dimin7": "dim7",
        "7": "7",
        "-7b5": "min7b5",
        "(b5)": "b5",
        "(b9)": "b9",
        "||": "|%|",
        "||": "|%|",
        "&": "",
        "##": "",
        ".": "",
        " ": ""
    };

    for (const token in tokenMap) {
        data = data.split(token).join(tokenMap[token]).replace(token, tokenMap[token]);
    }
    return data;
})(inputPDF).then(data => {
    while (data.includes("|")) {
        data = data.replace("|", "\n")
    }
    fs.writeFile(`${__dirname}/../${outputDir}/${inputPDF.replace(".pdf", "")}.txt`, data, (err) => {
        if (err) {
            console.log(`failed to save:\n${err}`);
        } else {
            console.log(`finished making intermediate file for '${inputPDF}'`);
        }
    });
});
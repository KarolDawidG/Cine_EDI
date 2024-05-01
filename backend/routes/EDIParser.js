const fs = require('fs');
const { Parser, Validator } = require('edifact');

const fileName = 'path_to_your_edi_file.edi';  // Ścieżka do pliku EDI
const ediData = fs.readFileSync(fileName, 'utf8');

const validator = new Validator();
const parser = new Parser(validator);

// Możesz zdefiniować segmenty i elementy, które są istotne dla Twojej specyfikacji EDIFACT
// validator.define(...);

const result = [];
let elements, components;

parser.on('opensegment', function (segment) {
  elements = [];
  result.push({ name: segment, elements: elements });
});

parser.on('element', function () {
  components = [];
  elements.push(components);
});

parser.on('component', function (data) {
  components.push(data);
});

parser.on('closesegment', function () {
  // Segment zamknięty
});

// Parsuj dane
parser.write(ediData);
parser.end();

console.log(result);  // Wyświetl sparsowane segmenty

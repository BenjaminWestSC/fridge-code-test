const express = require("express");
const app = express();
const port = 3000;

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  const json = req.body;
  const results = analyse(json);
  res.send(results);
});

function analyse(data) {
  const sorted = sort(data);
  const results = sorted.map(group => getResults(group));
  return results;
}

function sort(data) {
  let sorted = [];
  data.forEach((element, i) => {
    let group = [element];
    data.splice(i, 1);
    for (i = 0; i < data.length; i++) {
      if (data[i].id === element.id) {
        group.push(data[i]);
        data.splice(i, 1);
        i--;
      }
    }
    sorted.push(group);
  });
  return sorted;
}

function getResults(data) {
  temps = data.map(function(reading) {
    return reading.temperature;
  });
  let results = {};
  results.id = data[0].id;
  results.average = getAverage(temps);
  results.median = getMedian(temps);
  results.mode = getMode(temps);
  return results;
}

function getAverage(temps) {
  let total = 0;
  let num = 0;
  temps.forEach(temp => {
    total += temp;
    num++;
  });
  return parseFloat((total / num).toFixed(2));
}

function getMedian(temps) {
  temps.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
  const half = Math.floor(temps.length / 2);
  return temps.length % 2 != 0
    ? temps[half]
    : parseFloat(((temps[half - 1] + temps[half]) / 2).toFixed(2));
}

function getMode(temps) {
  let highestSoFar = [];
  let numOfOccurrances = 0;
  temps.forEach(tempA => {
    let count = 0;
    temps.forEach(tempB => {
      if (tempA === tempB) {
        count++;
      }
    });
    if (count > numOfOccurrances) {
      numOfOccurrances = count;
      highestSoFar = [tempA];
    } else if (count == numOfOccurrances) {
      highestSoFar.push(tempA);
    }
  });
  let unique = [...new Set(highestSoFar)];
  return unique;
}

app.listen(port, () => console.log(`App listening on port ${port}!`));

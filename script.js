const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800;
const height = 400;
const padding = 40;

const svg = d3.select("svg");
let xScale;
let yScale;

const drawContainer = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = (arr) => {
  xScale = d3
    .scaleLinear()
    .domain([d3.min(arr, (item) => item.Year), d3.max(arr, (item) => item.Year)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    // .domain([0, d3.max(arr, (item) => item.Time)])
    .range([height - padding, padding]);
};

const generateAxis = () => {
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  drawContainer();
  generateScales(data);
  generateAxis();
}

fetchData();

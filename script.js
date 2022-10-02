const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800;
const height = 400;
const padding = 30;

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
};

const generateAxis = () => {
  let xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");
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

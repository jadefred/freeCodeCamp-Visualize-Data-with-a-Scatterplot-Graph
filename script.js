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
  //tickFormat here is to round up the number to integer (orginally is shown as eg:1,994)
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
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

const drawPoints = (arr) => {
  svg
    .selectAll("circle")
    .data(arr)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (item) => {
      return item.Year;
    })
    .attr("data-yvalue", (item) => {
      return new Date(item.Seconds * 1000);
    })
    .attr("cx", (item) => {
      return xScale(item.Year);
    });
};

async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  drawContainer();
  generateScales(data);
  generateAxis();
  drawPoints(data);
}

fetchData();

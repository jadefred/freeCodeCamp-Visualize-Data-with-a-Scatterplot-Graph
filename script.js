const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800;
const height = 400;
const padding = 40;

const svg = d3.select("svg");
let tooltip = d3.select("#tooltip");
let xScale;
let yScale;

const drawContainer = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = (arr) => {
  xScale = d3
    .scaleLinear()
    //minus 1 and plus 1, to make more space in the chart for the dot
    .domain([d3.min(arr, (item) => item.Year - 1), d3.max(arr, (item) => item.Year + 1)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    //format seconds to milliseconds before make it to be Date object
    .domain([
      d3.min(arr, (item) => {
        return new Date(item.Seconds * 1000);
      }),
      d3.max(arr, (item) => {
        return new Date(item.Seconds * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

const generateAxis = () => {
  //tickFormat here is to round up the number to integer (orginally is shown as eg:1,994)
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  //timeFormat to reformat the time to be MM:SS
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

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
    })
    .attr("cy", (item) => {
      return yScale(new Date(item.Seconds * 1000));
    })
    //change the dots' color according to the array has doping title or not
    .attr("fill", (item) => {
      if (item.Doping === "") {
        return "green";
      } else {
        return "orange ";
      }
    })
    //mouse over to make it visible, show details of the person depending on when he doped or not
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");
      tooltip.html(
        item.Name +
          ": " +
          item.Nationality +
          "<br/>" +
          "Year: " +
          item.Year +
          ", Time: " +
          item.Time +
          (item.Doping ? "<br/><br/>" + item.Doping : "")
      );
      tooltip.attr("data-year", item.Year);
    })
    //change visibility back to hidden when mouse is not on the bar
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
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

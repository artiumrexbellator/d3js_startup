//variables
const radius = 6;
//promise to load data to use it within a function
const dataLoader = async (file) => {
  let promise = new Promise((resolve, reject) => {
    d3.tsv(file)
      .row((row, index) => {
        return {
          codePostal: +row["Postal Code"],
          inseeCode: +row.inseecode,
          place: row.place,
          longitude: +row.y,
          latitude: +row.x,
          population: +row.population,
          density: +row.density,
        };
      })
      .get((error, rows) => {
        resolve(rows);
      });
  });

  return await promise;
};
//function to draw point on svg
const draw = (svg, x, y, name, postalCode) => {
  svg
    .append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("name", name + "|" + postalCode)
    .attr("width", "1px")
    .attr("height", "1px")
    .attr("stroke", "black")
    .attr("opacity", "0.5");
};
//function to add axis to svg
const addAxis = (svg, axis, x, y, transform, text) => {
  svg
    .append("g")
    .call(axis)
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", transform)
    .attr("y", y)
    .attr("x", x)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text(text);
};
//function to handle mouseover event
const onMouseOverHandler = () => {
  d3.selectAll("rect").on("mouseover", function () {
    const place = d3
      .select(this)
      .attr("opacity", 1)
      .attr("stroke", "yellow")
      .attr("width", "1.5px")
      .attr("height", "1.5px")
      .attr("name")
      .split("|");
    d3.select("#name").text(place[0]);
    d3.select("#postalCode").text(place[1]);
  });
};
//loading data and begin treatment
dataLoader("/data/france.tsv").then((res) => {
  //scale stands for width of svg to expand points over the width
  let scale = 600;
  var xValues = [];
  var yValues = [];
  var names = [];
  var postalCode = [];
  res.map((row) => {
    xValues.push(row.latitude);
    yValues.push(row.longitude);
    names.push(row.place);
    postalCode.push(row.codePostal);
  });
  //2 different scaleLinear for both x and y values,so i can manage dispersing of values
  const xCoord2pixels = d3
    .scaleLinear()
    .domain([d3.min(xValues), d3.max(xValues)]) // unit
    .range([100, scale]);

  const yCoord2pixels = d3
    .scaleLinear()
    .domain([d3.min(yValues), d3.max(yValues)]) // unit
    .range([0, scale - 50]);

  //create svg with coordinates
  const svg = d3
    .select("#france")
    .append("svg")
    .attr("width", scale)
    .attr("height", scale)
    .attr("alignment-baseline", "middle");
  if (xValues.length === yValues.length) {
    for (var i = 0; i < xValues.length; i++) {
      draw(
        svg,
        xCoord2pixels(xValues[i]),
        scale - yCoord2pixels(yValues[i]),
        names[i],
        postalCode[i]
      );
    }
  }
  //add event listener
  onMouseOverHandler();
  // Add scales to axis
  var x_axis = d3.axisBottom().scale(xCoord2pixels);
  var y_axis = d3.axisRight().scale(yCoord2pixels);

  //Append group and insert axis
  addAxis(svg, x_axis, 0, 40, "rotate(-90)", "(Y coordinates)");
  addAxis(svg, y_axis, scale - 50, 30, "translate(50, 10)", "(X coordinates)");
});

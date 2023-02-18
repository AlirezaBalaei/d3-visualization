// set the dimensions and margins of the graph
var margin = {top: 100, right: 80, bottom: 80, left: 80},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart-wrapper")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left} ,${margin.top})`);

// Read the data and compute summary statistics for each specie
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3
    .nest() // nest function allows to group the calculation per level of a factor
    .key(d=>d.Species)
    .rollup((d) => {
      q1 = d3.quantile(
        d
          .map(g=>g.Sepal_Length)
          .sort(d3.ascending),
        0.25
      )
      median = d3.quantile(
        d
          .map(g => g.Sepal_Length)
          .sort(d3.ascending),
        0.5
      )
      q3 = d3.quantile(
        d
          .map(g => g.Sepal_Length)
          .sort(d3.ascending),
        0.75
      )
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return {
        q1: q1,
        median: median,
        q3: q3,
        interQuantileRange: interQuantileRange,
        min: min,
        max: max
      }
    })
    .entries(data)
  
    let strokeColor = "#6497b1"
     
  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["setosa", "versicolor", "virginica"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", `translate(0,+10)`)

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([3,9])
    .range([height, 0])
  svg
    .append("g")
    .attr("class", "axisleft")
    .call(d3.axisLeft(y).tickSizeInner(-width))
    .selectAll("text")
    .attr("transform", `translate(-10,0)`)

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.key))
    .attr("x2", (d) => x(d.key))
    .attr("y1", (d) => y(d.value.min))
    .attr("y2", (d) => y(d.value.max))
    .attr("stroke", strokeColor)
    .attr("stroke-width", 6)
    .style("width", 40)

      // rectangle for the main box
      var boxWidth = 100
      svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.key) - boxWidth / 2
        })
        .attr("y", function (d) {
          return y(d.value.q3)
        })
        .attr("height", function (d) {
          return y(d.value.q1) - y(d.value.q3)
        })
        .attr("width", boxWidth)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 5)
        .style("fill", "#b3cde0")
      
      // Show the median
      svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.key) - boxWidth / 2)
        .attr("x2", (d) => x(d.key) + boxWidth / 2)
        .attr("y1", (d) => y(d.value.median))
        .attr("y2", (d) => y(d.value.median))
        .attr("stroke", strokeColor)
        .attr("stroke-width", 5)
        .style("width", 80)
      
})
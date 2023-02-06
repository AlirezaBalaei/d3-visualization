console.log("main.js loaded...")

let rect = d3
  .select("#canvas")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "red")

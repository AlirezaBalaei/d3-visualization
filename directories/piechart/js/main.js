const data = [29,12,44,63,33]
let width = window.innerWidth
let height = window.innerHeight
let radius = Math.min(width,height)/2
let color = d3.scaleOrdinal(["#072F5F","#1261A0","#3895D3","#58CCED","#58CCED","#ACE6F6"])
let div = d3.select("#chart-area")
let svg = div
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("transform",`translate(${width/2},${height/2})`)
    .style("fill", "#000000")
// pie does the math to calculate the angles , etc.
let pie = d3.pie().value(d=>d)
// arc draws pie
let arc = d3.arc().outerRadius(radius*0.9).innerRadius(radius*0.6)
let g = svg.selectAll(".arc")
  .data(pie(data))
  .enter().append("g")
g.append("path")
  .attr("d", arc)
  .style("fill", (d,i)=>color(i))
  .style("stroke", "white")
  .style("stroke-width", 10)
// Variables Declarations
let width = window.innerWidth * 0.9
let height = window.innerHeight * 0.9
let margin = {top: 50 , right: 50 , bottom: 50 , left: 100}
let graphWidth = width - margin.left - margin.right
let graphHeight = height - margin.top - margin.bottom

// D3 declarations
let chart = d3.select("#chart-wrapper").append("svg")
  .attr("width", width)
  .attr("height", height)
let mainCanvas = chart.append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`)
// Where You Get Data
let getCSVData = async ()=>{
  await d3.csv("./daca.csv", d=> d).then(drawPieChart)
}

getCSVData()
drawPieChart = () => {}

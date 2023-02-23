width = window.innerWidth * 0.95
height = window.innerHeight * 0.95
let color= ["#011f4b", "#03396c", "#005b96", "#6497b1", "#b3cde0"]
let data = [
  42.993921227429844, 75.4681737013701, 39.866170714284756, 75.53925990893642,
  61.74279718548566, 25.28480439580325, 10.753950718707394, 42.72517219021683,
  48.70895195457947, 65.1813115481743, 40.96214411260988, 20.116042974145575
]
let months = [
  "January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December"
]
// give "January" to this function and it will return `new Date()` of that
let parseMonths = d3.timeParse("%B")
console.log(d3.extent(months , m=>parseMonths(m)))
//Millisecond ==> .%L
//Second ==> :%S
//Minute ==> %I:%M
//Hour ==> %I %p
//Day ==> %a %d
//Week ==> %b %d
//Month ==> %B
//Year ==> %Y

data = data.sort((a,b)=>a-b)
console.log(data)

let margin = {top: 10, right: 10, bottom: 10, left: 50}
svg = d3
  .select("#chart-wrapper")
  .append("svg")
  .attr("width",width)
  .attr("height", height)
graph = svg
.append("g")
.attr("class", "graph")
.attr("width", width-margin.left-margin.right)
.attr("height", height-margin.top-margin.bottom-10)
.attr("transform", `translate(${margin.left},${margin.top})`)

let graphWidth = d3
  .select(".graph")
  .attr("width")
let graphHeight = d3
  .select(".graph")
  .attr("height")
// X Scale
let x = d3
  .scaleTime()
  .domain(d3.extent(months, m=>parseMonths(m)))
  .range([0,graphWidth])
// Y Scale
let y = d3
  .scaleLinear()
  .domain([0,data[data.length-1]])
  .range([graphHeight,0])
let area = d3
  .area()
  .x((d,i)=>x(parseMonths(months[i])))
  .y0(graphHeight)
  .y1(d=>y(d))
  .curve(d3.curveBasis)

graph
  .append("path")
  .attr("fill", color[4])
  .attr("stroke", color[3])
  .attr("d", area(data))

// X Axis
let xAxis = d3
  .axisBottom(x)
  .tickFormat(d3.timeFormat("%b"))
graph
  .append("g")
  .attr("class", "xAxis")
  .call(xAxis)
  .attr("transform", `translate(0, ${graphHeight})`)
  .attr("text-anchor", "end")

// Y Axis
graph
  .append("g")
  .attr("class", "yAxis")
  .call(d3.axisLeft(y))

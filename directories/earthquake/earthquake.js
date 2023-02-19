var windowHeight = window.innerHeight * 0.99
var windowWidth = window.innerWidth * 0.99
var rScale = 5


const api_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
const margin = {top:120,right:100,bottom:100,left:150}
const marginedWidth = windowWidth - margin.right - margin.left
const marginedHeight = windowHeight - margin.top - margin.bottom

const options = {
  backgroundColor: "#fff",
  title: {
    show: true,
    text: "earthquake bubble chart",
    subtext: "significant earthquakes last 30 days",
    left: null,
    textStyle: {
      textBorderType: null,
      color: "#000"
    },
    subtextStyle: {
      color: "#333"
    }
  }
}

const svg = d3
  .select("#chart-wrapper")
  .append("svg")
  .attr("width", windowWidth)
  .attr("height", windowHeight)

const textGraph = svg.append("g").attr("class", "chart-title")
textGraph
  .append("text")
  .attr("class", "title-text")
  .attr("x", margin.left + marginedWidth / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .attr("class", "h4")
  .style("fill", options.title.textStyle.color)
  .text(options.title.show ? options.title.text : "")
  .style("opacity", 0)
  .transition()
  .duration(400)
  .style("opacity", 1)
textGraph
  .append("text")
  .attr("class", "title-subtext")
  .attr("x", margin.left + marginedWidth / 2)
  .attr("y", margin.top / 2 + 20)
  .attr("text-anchor", "middle")
  .attr("class", "p")
  .style("fill", options.title.subtextStyle.color)
  .text(options.title.show ? options.title.subtext : "")
  .style("opacity", 0)
  .transition()
  .duration(600)
  .style("opacity", 1)

const g = svg
  .append("g")
  .attr("width", marginedWidth)
  .attr("height", marginedHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`)

const tooltip = d3
  .select("#chart-wrapper")
  .append("div")
  .attr("class", "tooltip card p-0 shadow")
  .style("opacity", 0)

const plusOrMinus = () => {
  return Math.random() < 0.5 ? -1 : 1
}


const getDate = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  const date = new Date(timestamp)
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const getTime = (timestamp) => {
  const time = new Date(timestamp)
  return `${time.getHours()}:${time.getMinutes()}`
}

// Data working place
d3.json(api_url).then((data) => {
  const color = d3
    .scaleLinear()
    .domain([
      d3.min(data.features, (d) => d.properties.mag),
      d3.max(data.features, (d) => d.properties.mag)
    ])
    .range([0, 1])
  const x = d3
    .scaleBand()
    .domain(data.features.map((d) => getDate(d.properties.time)))
    .range([marginedWidth, 0])
  console.log()

  const xAxis = d3.axisBottom(x)
  g.append("g")
    .attr("class", "xAxis")
    .call(xAxis)
    .attr("transform", `translate(${0},${marginedHeight})`)
    .style("opacity", 0)
    .transition()
    .duration(400)
    .style("opacity", 1)

  const circle = g
    .selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")

  circle
    .attr("cx", (d) => {
      return (
        x(getDate(d.properties.time)) +
        margin.left / 2 +
        Math.random() * plusOrMinus() * 20
      )
    })
    .attr("cy", (d) => {
      return Math.random() * marginedHeight * 0.8 + d.properties.mag * rScale
    })
    .attr("r", (d) => d.properties.mag * rScale)
    .attr("place", (d) => d.properties.place)
    .attr("mag", (d) => d.properties.mag)
    .style("filter", "drop-shadow(0px 0px 5px rgb(0 0 0 / 0.4))")
    .style("fill", (d) => d3.interpolateOrRd(color(d.properties.mag)))
    .style("opacity", 0)
    .transition()
    .duration(600)
    .style("opacity", 0.9)

    circle
    .on("mouseover", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(200)
        .attr("r", (d) => d.properties.mag * rScale * 0.91)
      tooltip
        .transition()
        .duration(200)
        .attr("prevent-select")
        .style("opacity", 100)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("top", `${d3.event.pageY + 10}px`)

      tooltip.html(
        `<div class="card-header">Magnitude: ${
          d.properties.mag
        }</div><ul class="list-group list-group-flush">
        <li class="list-group-item">Place: ${d.properties.place}</li>
        <li class="list-group-item">${getDate(d.properties.time)}</li>
        <li class="list-group-item">${getTime(d.properties.time)}</li>
      </ul>`
      )
    })
    .on("mouseout", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(200)
        .attr("r", (d) => d.properties.mag * rScale)

      tooltip.transition().duration(100).style("opacity", 0)
    })
    .on("click", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(1000)
        .attr("cx", windowWidth * plusOrMinus())
        .attr("cy", windowHeight * plusOrMinus())
    })
})

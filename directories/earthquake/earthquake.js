var height = window.innerHeight * 0.99
var width = window.innerWidth * 0.99
var rScale = 5
const api_url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("height", height)
  .attr("width", width)

const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("class", "tooltip card p-0 shadow")
  .style("opacity", 0)

const plusOrMinus = (cx) => {
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
//new Date(d.properties.time).getHours()
//new Date(d.properties.time).getMinutes()

// Data working place
d3.json(api_url).then((data) => {
  const color = d3
    .scaleLinear()
    .domain([
      d3.min(data.features, (d) => d.properties.mag),
      d3.max(data.features, (d) => d.properties.mag)
    ])
    .range([0, 1])
  const circle = svg
    .selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")
  circle
    .attr("cx", (d) => {
      return Math.random() * width * 0.8 + d.properties.mag * rScale
    })
    .attr("cy", (d) => {
      return Math.random() * height * 0.8 + d.properties.mag * rScale
    })
    .attr("r", (d) => d.properties.mag * rScale)
    .attr("place", (d) => d.properties.place)
    .attr("mag", (d) => d.properties.mag)
    .style("filter", "drop-shadow(0px 0px 5px rgb(0 0 0 / 0.4))")
    .style("fill", (d) => d3.interpolateOrRd(color(d.properties.mag)))
    .on("mouseover", (d, i, n) => {
      console.log("d",d,"i",i,"n",n)
      console.log("this", d3.select(n[i]))
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
        .attr("cx", width * plusOrMinus())
        .attr("cy", height * plusOrMinus())
      console.log(n[i])
    })
})

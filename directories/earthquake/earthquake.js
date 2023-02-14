var height = window.innerHeight * 0.99
var width = window.innerWidth * 0.99
var rScale = 8
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
  .attr("class", "tooltip")
  .style("opacity", 0)

// Data working place
d3.json(api_url).then((data) => {
  const color = d3
    .scaleOrdinal()
    .domain([0, 4])
    .range(["#B1E1FF", "#AFB4FF", "#9C9EFE", "#A66CFF"])
  console.log(color(1.2))
  const circle = svg
    .selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")
  circle
    .attr("cx", (d) => {
      return Math.random() * width * 0.9 + d.properties.mag * rScale
    })
    .attr("cy", (d) => {
      return Math.random() * height * 0.9 + d.properties.mag * rScale
    })
    .attr("r", (d) => d.properties.mag * rScale)
    .attr("place", (d) => d.properties.place)
    .attr("mag", (d) => d.properties.mag)
    .style("fill", (d) => color(d.properties.mag))
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
        `<p class="prevent-select">${
          d.properties.mag
        } magnitude earthquake happend at ${
          d.properties.place
        } </p><p>${new Date(d.properties.time).getHours()}:${new Date(
          d.properties.time
        ).getMinutes()}</p>`
      )
    })
    .on("mouseout", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(200)
        .attr("r", (d) => d.properties.mag * rScale)

      tooltip.transition().duration(100).style("opacity", 0)
    })
})

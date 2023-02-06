d3.json("/directories/svg/data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = parseFloat(element.height)
    })
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("class", "shadow border")
      .attr("width", 1024)
      .attr("height", 400)
    let rectangles = svg.selectAll("rect").data(data)
    rectangles
      .enter()
      .append("rect")
      .attr("x", (data, index) => {
        return index * 50 + 10
      })
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", (data, index) => {
        return data.height
      })
      .attr("name", (data) => {
        return data.name
      })
      .attr("fill", "grey")
  })
  .catch((err) => {
    console.log(err)
  })

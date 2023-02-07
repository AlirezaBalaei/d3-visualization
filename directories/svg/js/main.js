d3.json("/directories/svg/data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = parseFloat(element.height)
    })
    // create a scaling function named y
    let y = d3.scaleLinear().domain([0, 800]).range([0, 380])
    let x = d3.scaleLinear().domain([0, 4]).range([0, 920])
    let color = d3.scaleOrdinal().domain([0, 4]).range(d3.schemeSet3)
    console.log(color)
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
        console.log(index)
        return x(index) + 25
      })
      .attr("y", 0)
      .attr("width", 50)
      .attr("height", (data, index) => {
        return y(data.height)
      })
      .attr("name", (data) => {
        return data.name
      })
      .attr("fill", (data, index) => {
        return color(index)
      })
  })
  .catch((err) => {
    console.log(err)
  })

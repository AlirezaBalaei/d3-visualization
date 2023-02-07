d3.json("/directories/svg/data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = parseFloat(element.height)
    })

    let svgWidth = 1024
    let svgHeight = 500
    let color = d3.scaleOrdinal().domain([0, 4]).range(d3.schemeSet3)
    let y = d3.scaleLinear().domain([0, 800]).range([0, 380])
    let x = d3
      .scaleBand()
      .domain(Object.keys(data))
      .range([0, svgWidth])
      .paddingInner(0.3)
      .paddingOuter(0.2)

    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("class", "shadow border")
      .attr("width", svgWidth)
      .attr("height", svgHeight)

    let rectangles = svg.selectAll("rect").data(data)

    rectangles
      .enter()
      .append("rect")
      .attr("x", (data, index) => x(index))
      .attr("y", 0)
      .attr("width", x.bandwidth())
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

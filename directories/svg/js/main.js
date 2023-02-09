d3.json("/directories/svg/data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = parseFloat(element.height)
    })

    // Essentials
    let margin = { left: 100, right: 10, top: 10, bottom: 100 }
    let svgWidth = 1024
    let svgHeight = 500
    let marginedWidth = svgWidth - margin.left - margin.right
    let marginedHeight = svgHeight - margin.top - margin.bottom
    let color = d3.scaleOrdinal().domain([0, 4]).range(d3.schemeSet3)

    // Y attribute
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.height)])
      .range([0, marginedHeight])

    // X attribute
    let x = d3
      .scaleBand()
      .domain(data.map((e) => e.name))
      .range([0, marginedWidth])
      .paddingInner(0.3)
      .paddingOuter(0.3)

    // SVG
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("class", "shadow border")
      .attr("width", svgWidth)
      .attr("height", svgHeight)

    // Group to apply margin inside of svg
    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Bands as rectangle
    let rectangles = g.selectAll("rect").data(data)
    rectangles
      .enter()
      .append("rect")
      .attr("x", (data) => x(data.name))
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

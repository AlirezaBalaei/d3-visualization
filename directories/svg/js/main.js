let margin = { left: 100, right: 10, top: 10, bottom: 150 };
let svgWidth = 1024;
let svgHeight = 700;
let marginedWidth = svgWidth - margin.left - margin.right;
let marginedHeight = svgHeight - margin.top - margin.bottom;

d3.json("/directories/svg/data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = parseFloat(element.height);
    });

    // Essentials
    let color = d3.scaleOrdinal().domain([0, 4]).range(d3.schemeSet3);

    // Y attribute
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.height)])
      .range([marginedHeight, 0]);

    // X attribute
    let x = d3
      .scaleBand()
      .domain(data.map((e) => e.name))
      .range([0, marginedWidth])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // SVG
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("class", "shadow border")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Group to apply margin inside of svg
    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axis X
    let xAxisCall = d3.axisBottom(x);
    g.append("g")
      .call(xAxisCall)
      .attr("transform", `translate(${0},${marginedHeight})`)
      .attr("class", "x-axis")
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-20)");

    // Axis Y
    let yAxisCall = d3.axisLeft(y).tickFormat((d) => d + " m");
    g.append("g").call(yAxisCall).attr("class", "y-axis");

    // X Lable
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("class", "y axis-label h4")
      .attr("x", -marginedHeight / 2)
      .attr("y", -margin.left / 2)
      .text("height m()");
    // Y Lable
    g.append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${marginedWidth / 2},${marginedHeight + 120})`
      )
      .attr("class", "y axis-label h4")
      .text("Tall Buildings");

    // Bands as rectangle
    let rectangles = g.selectAll("rect").data(data);
    rectangles
      .enter()
      .append("rect")
      .attr("x", (data) => x(data.name))
      .attr("y", (data) => y(data.height))
      .attr("width", x.bandwidth())
      .attr("height", (data, index) => {
        return marginedHeight - y(data.height);
      })
      .attr("name", (data) => {
        return data.name;
      })
      .attr("fill", (data, index) => {
        return color(index);
      });
  })
  .catch((err) => {
    console.log(err);
  });

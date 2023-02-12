d3.json("/directories/starbucks-profit/data/revenues.json")
  .then((data) => {
    data.forEach((e) => {
      e.profit = parseFloat(e.profit);
      e.revenue = parseFloat(e.revenue);
    });

    // Essential declaration
    let svgWidth = 720;
    let svgHeight = 400;
    let margin = { top: 10, right: 10, bottom: 100, left: 130 };
    let marginWidth = svgWidth - margin.left - margin.right;
    let marginHeight = svgHeight - margin.top - margin.bottom;
    let color = d3.scaleOrdinal().domain([0, 5]).range(d3.schemeAccent);
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "shadow m-5");

    // X Attribiute
    let x = d3
      .scaleBand()
      .domain(data.map((e) => e.month))
      .range([0, marginWidth])
      .paddingInner(0.3)
      .paddingOuter(0.3);
    console.log(
      "data",
      data,
      "revenue type",
      typeof data[0].revenue,
      "max revenue",
      d3.max(data, (d) => d.revenue)
    );

    // Y Attribiute
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue)])
      .range([marginHeight, 0]);

    // Margin Group
    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X Label
    g.append("text")
      .attr("class", "h4")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${marginWidth / 2},${
          marginHeight + (margin.bottom + margin.top) / 2
        } )`
      )
      .text("starbucks revenue in months");

    // Y Label
    g.append("text")
      .attr("class", "h4")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -marginHeight / 2)
      .attr("y", -margin.left * 0.6)
      .text("revenue (USD)");

    // Axis X
    let xAxis = d3.axisBottom(x);
    g.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${marginHeight})`)
      .call(xAxis);

    // Axis Y
    let yAxis = d3.axisLeft(y).tickFormat((d) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(d)
    );
    g.append("g").attr("class", "yAxis").call(yAxis);

    // Bands
    let rectangles = g.selectAll("rect").data(data);
    rectangles
      .enter()
      .append("rect")
      .attr("month", (data) => data.month)
      .attr("revenue", (data) => data.revenue)
      .attr("profit", (data) => data.profit)
      .attr("width", x.bandwidth())
      .attr("height", (data) => {
        return marginHeight - y(data.revenue);
      })
      .attr("fill", (data, index) => {
        return color(index);
      })
      .attr("x", (data) => x(data.month))
      .attr("y", (data) => {
        return marginHeight - (marginHeight - y(data.revenue));
      });
  })

  .catch((err) => console.log(err));
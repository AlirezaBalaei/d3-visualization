let svgWidth = 720;
let svgHeight = 400;
let margin = { top: 10, right: 10, bottom: 100, left: 130 };
let marginWidth = svgWidth - margin.left - margin.right;
let marginHeight = svgHeight - margin.top - margin.bottom;

d3.json("/directories/starbucks-profit/data/revenues.json")
  .then((data) => {
    // then block start -->
    data.forEach((e) => {
      e.profit = parseFloat(e.profit);
      e.revenue = parseFloat(e.revenue);
    });

    // Essential declaration
    data.maxRevenue = d3.max(data, (d) => d.revenue);
    let color = d3
      .scaleOrdinal()
      .domain([0, data.maxRevenue])
      .range(["#91f086", "#48bf53", "#11823B", "#004d25"]);
    let svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "shadow m-5");

    // X scale
    let x = d3
      .scaleBand()
      .range([0, marginWidth])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // Y scale
    let y = d3.scaleLinear().range([marginHeight, 0]);

    // Margin Group
    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Axis X
    let xAxisGroup = g
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${marginHeight})`);

    // Axis Y
    let yAxisGroup = g.append("g").attr("class", "yAxis");

    // X Label
    g.append("text")
      .attr("class", "Axis-Label h4")
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
      .attr("class", "Axis-Label h4")
      .attr("style", "font-weight: normal")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -marginHeight / 2)
      .attr("y", -margin.left * 0.6)
      .text("revenue (USD)");

    // Interval dynamic
    d3.interval(() => {
      update(data);
    }, 1000);
    // <-- then block ends

    const update = (data) => {
      // X,Y domain scale
      x.domain(data.map((e) => e.month));
      y.domain([0, data.maxRevenue]);
      // xy axis update
      let xAxisCall = d3.axisBottom(x);
      let yAxisCall = d3
        .axisLeft(y)
        .tickFormat((d) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(d)
        )
        .ticks(7);
      xAxisGroup.call(xAxisCall);
      yAxisGroup.call(yAxisCall);

      // Bars
      // Join
      let rectangles = g.selectAll("rect").data(data);
      // Exit
      rectangles.exit().remove();
      // Update
      rectangles
        .attr("x", (data) => x(data.month))
        .attr("y", (data) => y(data.revenue))
        .attr("width", x.bandwidth())
        .attr("height", (data) => {
          return marginHeight - y(data.revenue);
        });
      // Enter
      rectangles
        .enter()
        .append("rect")
        .attr("width", x.bandwidth())
        .attr("height", (data) => {
          return marginHeight - y(data.revenue);
        })
        .attr("fill", (data) => {
          return color(data.revenue);
        })
        .attr("x", (data) => x(data.month))
        .attr("y", (data) => {
          return marginHeight - (marginHeight - y(data.revenue));
        });
    };
  })
  .catch((err) => console.log(err));

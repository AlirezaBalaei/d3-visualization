// set the dimensions and margins of the graph
let colors={
  stroke: "#6497b1"
}
let margin = {top: 100, right: 80, bottom: 80, left: 80},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;
// append the svg object to the body of the page
let svg = d3.select("#chart-wrapper")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left} ,${margin.top})`);

// change data.name ==> d[col_rel["labels"]] 
// change data ==> 


d3.csv("data.csv", (data) => {
  
  d = []
  d.push(data)
  console.log(d)






})




// Read the data and compute summary statistics for each specie
d3.csv("data.csv", (data) => {
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  let sumstat = d3
    .nest() // nest function allows to group the calculation per level of a factor
    .key((d) => d.name)
    .rollup((d) => {
      q1 = d3.quantile(d.map((g) => g.value).sort(d3.ascending), 0.25)
      median = d3.quantile(d.map((g) => g.value).sort(d3.ascending), 0.5)
      q3 = d3.quantile(d.map((g) => g.value).sort(d3.ascending), 0.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      outliers = d.map((d) => parseFloat(d.value))
      outliers = outliers.filter((i) => i < min || i > max)
      //outliersLength = outliers.length
      //outliers.push({key: d[0].name}, {length: outliersLength})
      //console.log("outliers", outliers)
      //filter(i => Y[i] < r0 || Y[i] > r1)
      return {
        q1: q1,
        median: median,
        q3: q3,
        interQuantileRange: interQuantileRange,
        min: min,
        max: max,
        outliers: outliers
      }
    })
    .entries(data)
  const minValue = d3.min(data, (d) => d.value)
  const maxValue = d3.max(data, (d) => d.value)
  let dataKeys = sumstat.map((d) => d.key)
  // Show the X scale
  let x = d3
    .scaleBand()
    .range([0, width])
    .domain(dataKeys)
    .paddingInner(1)
    .paddingOuter(0.5)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", `translate(0,+10)`)
    .attr("fill", "#6497b1")
    .attr("font-weight", "bold")
    .attr("font-size", "0.8rem")

  // Show the Y scale
  let y = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0])
  svg
    .append("g")
    .attr("class", "axisleft")
    .call(d3.axisLeft(y).tickSizeInner(-width))
    .selectAll("text")
    .attr("transform", `translate(-10,0)`)
    .attr("fill", "#6497b1")
    .attr("font-weight", "bold")
    .attr("font-size", "0.8rem")

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.key))
    .attr("x2", (d) => x(d.key))
    .attr("y1", (d) => {
      return y(d.value.min)
    })
    .attr("y2", (d) => {
      return y(d.value.max)
    })
    .attr("stroke", colors.stroke)
    .attr("stroke-width", 6)
    .style("width", 40)

  // rectangle for the main box
  let boxWidth = 60
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.key) - boxWidth / 2
    })
    .attr("y", function (d) {
      return y(d.value.q3)
    })
    .attr("height", function (d) {
      return y(d.value.q1) - y(d.value.q3)
    })
    .attr("width", boxWidth)
    .attr("stroke", colors.stroke)
    .attr("stroke-width", 5)
    .style("fill", "#b3cde0")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.key) - boxWidth / 2)
    .attr("x2", (d) => x(d.key) + boxWidth / 2)
    .attr("y1", (d) => y(d.value.median))
    .attr("y2", (d) => y(d.value.median))
    .attr("stroke", colors.stroke)
    .attr("stroke-width", 5)
    .style("width", 80)

  // Show the outlier circles    
  let outliersData = []
    console.log(sumstat)
    sumstat.forEach((candel)=>{
      for (let i = 0; i < candel.value.outliers.length; i++) {
        outliersData.push({key: candel.key, value: candel.value.outliers[i]})
        
      }
    })
  let circles = svg
    .selectAll("circle")
    .data(outliersData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.key))
    .attr("cy", (d) => y(d.value))
    .attr("r", 3)
    .style("opacity", 0.8)
    .style("fill", colors.stroke)
})
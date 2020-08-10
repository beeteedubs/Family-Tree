(function () {
  var width = 500,
    height = 500;
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)");

  var defs = svg.append("defs");

  defs
    .append("pattern")
    .attr("id", "paula-deen")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", "Grandma.jpg");

  var radiusScale = d3.scaleSqrt().domain([1, 300]).range([10, 80]);

  var simulation = d3
    .forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force(
      "collide",
      d3.forceCollide(function (d) {
        return radiusScale(d.sales) + 1;
      })
    );
  d3.queue().defer(d3.csv, "sales.csv").await(ready);
});

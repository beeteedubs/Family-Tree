const img_height = 100;
const img_width = 200;

// stratifies data, provides x and y coord
var dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(data);

console.log("dataStructure: ");
console.log(dataStructure);

const tree_y = img_height * (dataStructure.height + 1);
const tree_x = 2 ** (dataStructure.height + 1) * img_width;

// creates a frame, anything past is cutt off, all elements shifted ↓ & → 50 px

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", tree_x)
  .attr("height", 2 * tree_y)
  .append("g")
  .attr("transform", "translate(100,100)");
var defs = svg.append("defs");

console.log("tree_y: " + tree_y);
console.log("tree_x: " + tree_x);

// painting size, careful don't go too far, should not be bigger tha canvas size or svg size
var treeStructure = d3.tree().size([tree_x, tree_y]);

svg.call(
  d3
    .zoom()
    //.extent([[0,0],[width, height]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed)
);

function zoomed() {
  svg.attr("transform", d3.event.transform);
}

// //??? doesn't seem necessary according to prints of descendants and links
// // But if we dont use it, the code doent work
var information = treeStructure(dataStructure);

// // Path drawing stuff??? why 20 -> variablize later with once we decide dimensions of buttons
var connections = svg.append("g").selectAll("path").data(information.links());
connections
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 1)
  .attr("d", function (d) {
    // start pt, control pt, 2nd control pt, end pt for curved path
    return (
      "M " +
      d.source.x +
      "," +
      d.source.y +
      " v " +
      (img_height - 10) +
      " H " +
      d.target.x + //- img_height / 2 +
      " V" +
      d.target.y
    );
  });

defs
  .selectAll(".family-image")
  .data(data)
  .enter()
  .append("pattern")
  .attr("class", "family-image")
  .attr("id", function (d) {
    return d.img;
  })
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", function (d) {
    return "/static/images/" + d.img;
  });

var rectangles = svg.selectAll("rect").data(information.descendants());
rectangles
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return d.x - img_width / 2;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "rect")
  .attr("fill", function (d) {
    return "url(#" + d.data.img + ")";
  })
  .on("click", function (d) {
    console.log(d.data.img);
  });
// .attr("onclick", "console.log('hi')")

// Names
var names = svg.append("g").selectAll("text").data(information.descendants());
names
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .classed("bigger", true);

// DRAG AND DROP SHIT
$(document).ready(function () {
  $(".droparea")
    .on("dragover", function (e) {
      e.preventDefault();
    })
    .on("drop", function (e) {
      e.preventDefault();
      var files = e.originalEvent.dataTransfer.files;
      console.log(files[0]);
    });
});

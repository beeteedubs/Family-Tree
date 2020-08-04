const img_height = 100;
const img_width = 200;

// const app = express();
// app.listen(5000, () => console.log("listening at 5000"));
// app.use(express.static("public"));
// app.use(express.json({ limit: "1mb" }));

// const database = new Datastore("../data/family_tree.db");
// database.loadDatabase();

// app.get("/api", (request, response) => {
//   database.find({}, (err, data) => {
//     response.json(data);
//   });
// });

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
//return svg.node();
//console.log(zoom);

//??? doesn't seem necessary according to prints of descendants and links
// But if we dont use it, the code doent work
var information = treeStructure(dataStructure);

// console.log(treeStructure)
console.log("information.descendants():");
console.log(information.descendants());
console.log("information.links():");
console.log(information.links());
console.log("---------------");
var i;
var depths;
for (i = 0; i < information.descendants().length; i++) {
  console.log(information.descendants()[i].depth);
}
// looking at log info:
// height: how many layers of descedants r directly below this node
// depth: how many above, opposite to height

// Path drawing stuff??? why 20 -> variablize later with once we decide dimensions of buttons
var connections = svg.append("g").selectAll("path").data(information.links());

connections
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
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

      // For with spouse original code:
      // "M " +
      // (d.source.x + img_width / 2) +
      // "," +
      // d.source.y +
      // " v " +
      // (img_height - 10) +
      // " H " +
      // (d.target.x - img_height / 2) +
      // " V" +
      // d.target.y
    );

    // "C" +
    //   d.source.x +
    //   "," +
    //   (d.source.y + d.target.y) / 2 +
    //   " " +
    //   d.target.x +
    //   "," +
    //   (d.source.y + d.target.y) / 2 +
    //   " " +
    //   d.target.x +
    //   "," +
    //   d.target.y;
  });

var rectangles = svg
  .append("g")
  .selectAll("rect")
  .data(information.descendants());
rectangles
  .enter()
  .append("rect")
  .attr("fill", "none")
  .attr("stroke", "silver")
  .attr("x", function (d) {
    return d.x - img_width / 2;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "rect");
// .attr("onclick", "console.log('hi')")
// .attr("onclick", function (d) {
//     if (d3.select('image').style('visibility', 'visible') === true) {
//         d3.select('image').style('visibility', 'hidden');
//     } else {
//         d3.select('image').style('visibility', 'visible');
//     }
// })

// .attr("width", function (d) { return img_height; })
// .attr("height", function (d) { return img_width; })

// .on("mouseup", function () {
//     d3.select("#details").style("visibility","hidden");
// });;

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

//   var spouseConnections = svg
//   .append("g")
//   .selectAll("path")
//   .data(information.links());
// connections
//   .enter()
//   .append("path")
//   .attr("d", function (d) {
//     return "M" + d.source.x + "," + d.source.y + "v 0" + "h " + img_height * 2;
//   });

// // Creates the boxes to represent nodes

// var spouseRectangles = svg
//   .append("g")
//   .selectAll("image")
//   .data(information.descendants());
// spouseRectangles
//   .enter()
//   .append("image")
//   .attr("x", function (d) {
//     return d.x + (img_width + img_height) / 2;
//   })
//   .attr("y", function (d) {
//     return d.y - img_height / 2;
//   })
//   .attr("height", img_height)
//   .attr("width", img_width)
//   .classed("hide", function (d) {
//     // prevents spouse rect from appearing for ppl w/out spouses
//     if (d.data.spouse == undefined) return true;
//     else return false;
//   });

// // var pictures = svg.append("g").selectAll("img")
// //     .data(information.descendants());
// // pictures.enter().append("img")
// //     .img(function (d) { return d.data.img; });

// var spouseNames = svg
//   .append("g")
//   .selectAll("text")
//   .data(information.descendants());
// spouseNames
//   .enter()
//   .append("text")
//   .text(function (d) {
//     return d.data.spouse;
//   })
//   .attr("x", function (d) {
//     return d.x + (img_width + img_height / 2);
//   })
//   .attr("y", function (d) {
//     return d.y;
//   })
//   .classed("bigger", true);

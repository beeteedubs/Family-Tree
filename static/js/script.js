var img_height = 100;
var img_width = 200;
// creates a frame, anything past is cutt off, all elements shifted ↓ & → 50 px
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 2000)
  .attr("height", 2000)
  .append("g")
  .attr("transform", "translate(50,50)"); //can comment out ot show signif

// self-explanatory data
var familytree_Steve = [
  {
    name: "Steve",
    parent: "",
    spouse: "Shirley",
    Generation: 1,
    img: "data/Grandpa.jpg",
    spouse_img: "data/Grandma.jpg",
  },
  {
    name: "Alex",
    parent: "Steve",
    spouse: "Alexis",
    Generation: 2,
    img: "data/Grandpa.jpg",
    spouse_img: "data/Grandma.jpg",
  },
  {
    name: "Jocelyn",
    parent: "Steve",
    spouse: "Johnny",
    Generation: 3,
    img: "data/Grandma.jpg",
    spouse_img: "data/Grandpa.jpg",
  },
  //{ "name": "Johnny", "parent": "", "spouse": "Jocelyn", "Generation": 2 },
  //{ "name": "Johnny", "parent": "", "spouse": "Jocelyn", "Generation": 2 },
  //{ "name": "Alexis", "parent": "Alexandra", "spouse": "Alex", "Generation": 2 },
  //{ "name": "Shirley", "parent": "", "spouse": "Steve", "Generation": 1 },
  { name: "Ingrid", parent: "Alex", Generation: 3, img: "data/Grandma.jpg" },
  { name: "Sasha", parent: "Alex", Generation: 3, img: "data/Grandpa.jpg" },
  {
    name: "Suzie Q",
    parent: "Jocelyn",
    Generation: 3,
    img: "data/Grandma.jpg",
  },
];

// stratifies data, provides x and y coord
var dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(familytree_Steve);
console.log(dataStructure);

const tree_y = img_height * (dataStructure.height + 1);
// variablize 150 to change based on number of ppl in tree so everyone is spaced out properly
const tree_x = 2 ** (dataStructure.height + 0.5) * img_width;
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
console.log(information.descendants());
console.log(information.links());
// looking at log info:
// height: how many layers of descedants r directly below this node
// depth: how many above, opposite to height

// Path drawing stuff??? why 20 -> variablize later with once we decide dimensions of buttons
var connections = svg.append("g").selectAll("path").data(information.links());

connections
  .enter()
  .append("path")
  .attr("d", function (d) {
    // start pt, control pt, 2nd control pt, end pt for curved path
    // CHANGE: d.source.x + wat t obe
    return (
      "M" +
      (d.source.x + img_height) +
      "," +
      d.source.y +
      " v  " +
      (img_height - 10) +
      "H" +
      (d.target.x - img_height / 2) +
      " V" +
      d.target.y
    );

    //"C" + d.source.x
    //     + "," + (d.source.y + d.target.y) / 2 + " "
    //     + d.target.x + "," + (d.source.y + d.target.y) / 2 + " "
    //     + d.target.x + "," + d.target.y;
  });

var spouseConnections = svg
  .append("g")
  .selectAll("path")
  .data(information.links());
connections
  .enter()
  .append("path")
  .attr("d", function (d) {
    return "M" + d.source.x + "," + d.source.y + "v 0" + "h " + img_height * 2;
  });

// Creates the boxes to represent nodes

var rectangles = svg
  .append("g")
  .selectAll("image")
  .data(information.descendants());
rectangles
  .enter()
  .append("image")
  .attr("x", function (d) {
    return d.x - (img_width + img_height) / 2;
  }) //how not hardcode 40 and 20? make variables gloablly in non-script tags?
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "btn")
  .attr("onclick", "console.log('hi')")
  .on("mousedown", function (d) {
    d3.select("#details")
      .style("visibility", "visible")
      .html(function () {
        if (d.data.spouse != undefined) return "Spouse: " + d.data.spouse;
        else return "No Spouse";
      });
  })
  .attr("href", function (d) {
    var out = d.data.img;
    return out;
  });
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

var spouseRectangles = svg
  .append("g")
  .selectAll("image")
  .data(information.descendants());
spouseRectangles
  .enter()
  .append("image")
  .attr("x", function (d) {
    return d.x + (img_width + img_height) / 2;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("href", function (d) {
    var out = d.data.spouse_img;
    return out;
  })
  .classed("hide", function (d) {
    // prevents spouse rect from appearing for ppl w/out spouses
    if (d.data.spouse == undefined) return true;
    else return false;
  });

// var pictures = svg.append("g").selectAll("img")
//     .data(information.descendants());
// pictures.enter().append("img")
//     .img(function (d) { return d.data.img; });

// Names
var names = svg.append("g").selectAll("text").data(information.descendants());
names
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x - img_height / 2;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .classed("bigger", true);

var spouseNames = svg
  .append("g")
  .selectAll("text")
  .data(information.descendants());
spouseNames
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.spouse;
  })
  .attr("x", function (d) {
    return d.x + (img_width + img_height / 2);
  })
  .attr("y", function (d) {
    return d.y;
  })
  .classed("bigger", true);

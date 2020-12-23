const img_height = 50;
const img_width = 100;
const canvas_inf = 2;
let pivot = "";

// stratifies data, provides x and y coord
var dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(family_tree_data);

var spouse_dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(spouse_data);

var queue = [];
var temp;
var depth = [];
queue.push(dataStructure);
while (queue.length > 0) {
  temp = queue.shift();
  depth.push(temp.depth);
  if (temp.children === undefined) {
    continue;
  } else {
    temp.children.forEach((child) => {
      queue.push(child);
    });
  }
}
function mode(array) {
  if (array.length == 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return modeMap[maxEl];
}

const tree_y = 6 * img_height;
const tree_x = 2.9 * img_width * mode(depth);
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", tree_x)
  .attr("height", 2 * tree_y)
  .append("g")
  .attr("transform", "translate(100,100)");

// these 3 worked well before
// var spouse_spacing = 0.75;
// var spouseless_spacing = 0.25; //0.007 * img_width;
// var cousin_spacing = 0.005 * img_width;

var spouse_spacing = 0.15;
var spouseless_spacing = 0.05; //0.007 * img_width;
var cousin_spacing = 0.001 * img_width;
// painting size, careful don't go too far, should not be bigger tha canvas size or svg size
var spouse_treeStructure = d3
  .tree()
  .separation(function (a, b) {
    if (a.parent == b.parent) {
      if (b.data.image != "") {
        return spouse_spacing;
      } else {
        return spouseless_spacing; //spacing between spouseless kids, ideal is 0.5
      }
    } else {
      return cousin_spacing;
    }
  })
  .size([tree_x, tree_y]);

var treeStructure = d3
  .tree()
  .separation(function (a, b) {
    // console.log("a, b");
    // console.log(a.data);
    // console.log(b.data);
    if (a.parent == b.parent) {
      if (b.data.spouse != "") {
        //there is a spouse
        return spouse_spacing;
      } else {
        return spouseless_spacing; //spacing between spouseless kids, ideal is 0.5
      }
    } else {
      return cousin_spacing;
    }
    //return a.parent == b.parent ? 1 : 2;
  })
  .size([tree_x, tree_y]);

var spouse_information = spouse_treeStructure(spouse_dataStructure);
var information = treeStructure(dataStructure);

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

/////////////////////////////////////////////////////////////////////////////////////
var defs = svg.append("defs");
var spouse_defs = svg.append("defs");
var add_def = svg.append("defs");

add_def
  .enter()
  .append("pattern")
  .attr("id", "plus.png")
  .attr("class", "family-image")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", "../static/images/plus.png");

defs
  .selectAll(".family-image")
  .data(family_tree_data)
  .enter()
  .append("pattern")
  .attr("id", function (d) {
    return d.image;
  })
  .attr("class", "family-image")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", function (d) {
    return "../static/images/" + d.image;
  });

spouse_defs
  .selectAll(".family-image")
  .data(spouse_data)
  .enter()
  .append("pattern")
  .attr("class", "family-image")
  .attr("id", function (d) {
    return d.image;
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
    return "../static/images/" + d.image;
  });
//////////////////////////////////////////////////////////////////////////////////////////
var plus_sign = svg.append('g').attr('id','plus_sign').selectAll('a').data(information.descendants());
plus_sign.enter().append('a').attr('href','#').attr("class","btn btn-secondary dropdown-toggle")
  .attr("data-toggle","dropdown")
  .attr("aria-haspopup","true")
  .attr("aria-expanded","false")
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 1)
  .attr("stroke-width", 4)
  .attr("d", function (d){
    return ('M' + (d.x-80) + ',' + (d.y-10) + ' v20 M' + (d.x-90) + ',' + d.y +' h20')
    //  d="M0,-5 v10 M-5,0 h10"
    // M x,y-10
  });

plus_sign.enter().append('g').attr('id',function(d){return d.data.name})
// var gtag = achor1.append('g').selectAll('a').data([1,2,3])
//   gtag.append('a')
//   .attr

var connections = svg.append("g").attr('id','connections').selectAll("path").data(information.links());
connections
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 1)
  .attr("stroke-width", 2)
  .attr("d", function (d) {
    if (d.source.data.spouse == "") {
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
    } else {
      return (
        "M " +
        (d.source.x + img_width * 0.75) +
        "," +
        d.source.y +
        " v " +
        (img_height - 10) +
        " H " +
        d.target.x + //- img_height / 2 +
        " V" +
        d.target.y
      );
    }
  });

var spouse_lines = svg // just the horizontal line
  .append("g")
  .attr('id','spouse_connections')
  .selectAll("path")
  .data(spouse_information.descendants());

spouse_lines
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 1)
  .attr("stroke-width", 2)
  .attr("d", function (d) {
    return "M " + d.x + "," + d.y + "h" + img_width;
  })
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });

// Rectangles ----------------------------------------------------------------
var rectangles = svg
  .append("g")
  .attr('id','rect')
  .selectAll("rect")
  .data(information.descendants());

var spouseRectangles = svg
  .append("g")
  .attr('id','spouse_rect')
  .selectAll("rect")
  .data(spouse_information.descendants());

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
  .on("click", function (d) {
    pivot = d.data.name; // same sa d.id since made id = name
    console.log(pivot);
    return pivot;
  })
  .on("mouseover",function(d){
    console.log(d.data.name);
  })
  .attr("fill", function (d) {
    return "url(#" + d.data.image + ")";
  });

spouseRectangles
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return d.x + img_width;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "rect")
  .attr("fill", function (d) {
    return "url(#" + d.data.image + ")";
  })
  .on("click", function (d) {
    // issue how to return pivot to flask
    pivot = d.id; //provides name
    console.log(pivot);
    return pivot;
  })
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });


/////////////////////////////////////////
// Add button --------------------------
///////////////////////////////////////

// var add = svg.append("g").selectAll("circle").data(information.descendants());

// var add_spouse = svg
//   .append("g")
//   .selectAll("circle")
//   .data(spouse_information.descendants());

// add
//   .enter()
//   .append("circle")
//   .attr("cx", function (d) {
//     return d.x;
//   })
//   .attr("cy", function (d) {
//     return d.y;
//   })
//   .attr("r", 5)
//   .attr("fill", function (d) {
//     return "url(#" + "plus.png" + ")";
//   })
//   .on("click", function (d) {
//     pivot = d.data.name;
//     console.log(pivot);
//     return pivot;
//   });

// add_spouse
//   .enter()
//   .append("circle")
//   .attr("cx", function (d) {
//     return d.x + 100;
//   })
//   .attr("cy", function (d) {
//     return d.y;
//   })
//   .attr("r", 50)
//   .attr("fill", function (d) {
//     return "url(#" + "plus.png" + ")";
//   })
//   .on("click", function (d) {
//     pivot = d.data.name;
//     console.log(pivot);
//     return pivot;
//   });

/////////////////////////////////////////////////////////////////////////
// Names----------------------------------------------------------------
////////////////////////////////////////////////////////////////////////

// why do we say "selectAll" when we didn't create any texts?
// https://medium.com/@binyamin/d3-select-selectall-data-enter-and-exit-f0e4f0d3e1d0 
// doesn't what if "selectAll('a') or selectAll('body')" since nothing inside 'g'

var names = svg.append("g").attr('id','name').selectAll("text").data(information.descendants());
var spouse_names = svg
  .append("g")
  .attr('id','spouse_name')
  .selectAll("text")
  .data(spouse_information.descendants());

// var test = svg.append('g').attr('id','test').attr('class','dropdown').selectAll('a').data(information.descendants());
// test
//   .enter()
//   .append('a')
//   .attr('href',function(d){
//     return "/update/"+d.data.id;
//   })
//   .append("text")
//   .text(function (d) {
//     return d.data.name;
//   })
//   .attr("x", function (d) {
//     return d.x;
//   })
//   .attr("y", function (d) {
//     return d.y + 35;
  // });


// test
//   .enter()
//   .append('a')
//   .attr('href',function(d){
//     return "/delete/"+d.data.id;
//   })
  // .attr("x", function (d) {
  //   return d.x;
  // })
  // .attr("y", function (d) {
  //   return d.y + 35;
  // });

names
  .enter()
  // .append('a')
  // .attr('href',function(d){
  //   return '/pivot/' + d.data.id
  // })  
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y + 35;
  });


spouse_names
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x + img_width * 1.5;
  })
  .attr("y", function (d) {
    return d.y + img_height * 0.7;
  })
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });


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

// export default names;


var members = [
  {
    label: "BMW",
    value: 2
  },
  {
    label: "Audi",
    value: 2
  },
  {
    label: "Mercedes"
  },
  {
    label: "This is long text to check text overflow"
  }
];

var config = {
  width: 200,
  container: svg,
  members,
  fontSize: 14,
  color: "#333",
  fontFamily: "calibri",
  x: 20,
  y: 45,
  changeHandler: function(option) {
    // "this" refers to the option group
    // Change handler code goes here
    document.getElementById("selectedInput").value = option.label;
  }
};

svgDropDown(config);

/** svg dropdown library */
function svgDropDown(options) {
    if (typeof options !== 'object' || options === null || !options.container) {
        console.error(new Error("Container not provided"));
        return;
    }
    const defaultOptions = {
        width: 200,
        members: [],
        fontSize: 12,
        color: "#333",
        fontFamily: "Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",
        x: 0,
        y: 0,
        changeHandler: function(){}
    };

    options = { ...defaultOptions, ...options };

    options.optionHeight = options.fontSize * 2;
    options.height = options.fontSize + 8;
    options.padding = 5;
    options.hoverColor = "#0c56f5";
    options.hoverTextColor = "#fff";
    options.bgColor = "#fff";
    options.width = options.width - 2;

    const g = options.container
        .append("svg")
        .attr("x", options.x)
        .attr("y", options.y)
        .attr("shape-rendering", "crispEdges")
        .append("g")
        .attr("transform", "translate(1,1)")
        .attr("font-family", options.fontFamily);

    let selectedOption =
        options.members.length === 0
            ? { label: "", value: "" }
            : options.members[0];

    /** Rendering Select Field */
    const selectField = g.append("g");

    // background
    selectField
        .append("rect")
        .attr("width", options.width)
        .attr("height", options.height)
        .attr("class", "option select-field")
        .attr("fill", options.bgColor)
        .style("stroke", "#a0a0a0")
        .style("stroke-width", "1");

    // text
    const activeText = selectField
        .append("text")
        .text(selectedOption.label)
        .attr("x", options.padding)
        .attr("y", options.height / 2 + options.fontSize / 3)
        .attr("font-size", options.fontSize)
        .attr("fill", options.color);

    // arrow symbol at the end of the select box
    selectField
        .append("text")
        .text("▼")
        .attr("x", options.width - options.fontSize - options.padding)
        .attr("y", options.height / 2 + (options.fontSize - 2) / 3)
        .attr("font-size", options.fontSize - 2)
        .attr("fill", options.color);

    // transparent surface to capture actions
    selectField
        .append("rect")
        .attr("width", options.width)
        .attr("height", options.height)
        .style("fill", "transparent")
        .on("click", handleSelectClick);

    /** rendering options */
    const optionGroup = g
        .append("g")
        .attr("transform", `translate(0, ${options.height})`)
        .attr("opacity", 0); //.attr("display", "none"); Issue in IE/Firefox: Unable to calculate textLength when display is none.

    // Rendering options group
    const optionEnter = optionGroup
        .selectAll("g")
        .data(options.members)
        .enter()
        .append("g")
        .on("click", handleOptionClick);

    // Rendering background
    optionEnter
        .append("rect")
        .attr("width", options.width)
        .attr("height", options.optionHeight)
        .attr("y", function (d, i) {
            return i * options.optionHeight;
        })
        .attr("class", "option")
        .style("stroke", options.hoverColor)
        .style("stroke-dasharray", (d, i) => {
            let stroke = [
                0,
                options.width,
                options.optionHeight,
                options.width,
                options.optionHeight
            ];
            if (i === 0) {
                stroke = [
                    options.width + options.optionHeight,
                    options.width,
                    options.optionHeight
                ];
            } else if (i === options.members.length - 1) {
                stroke = [0, options.width, options.optionHeight * 2 + options.width];
            }
            return stroke.join(" ");
        })
        .style("stroke-width", 1)
        .style("fill", options.bgColor);

    // Rendering option text
    optionEnter
        .append("text")
        .attr("x", options.padding)
        .attr("y", function (d, i) {
            return (
                i * options.optionHeight +
                options.optionHeight / 2 +
                options.fontSize / 3
            );
        })
        .text(function (d) {
            return d.label;
        })
        .attr("font-size", options.fontSize)
        .attr("fill", options.color)
        .each(wrap);

    // Rendering option surface to take care of events
    optionEnter
        .append("rect")
        .attr("width", options.width)
        .attr("height", options.optionHeight)
        .attr("y", function (d, i) {
            return i * options.optionHeight;
        })
        .style("fill", "transparent")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    //once the textLength gets calculated, change opacity to 1 and display to none
    optionGroup.attr("display", "none").attr("opacity", 1);

    d3.select("body").on("click", function () {
        optionGroup.attr("display", "none");
    });

    // Utility Methods
    function handleMouseOver() {
        d3.select(d3.event.target.parentNode)
            .select(".option")
            .style("fill", options.hoverColor);

        d3.select(d3.event.target.parentNode)
            .select("text")
            .style("fill", options.hoverTextColor);
    }

    function handleMouseOut() {
        d3.select(d3.event.target.parentNode)
            .select(".option")
            .style("fill", options.bgColor);

        d3.select(d3.event.target.parentNode)
            .select("text")
            .style("fill", options.color);
    }

    function handleOptionClick(d) {
        d3.event.stopPropagation();
        selectedOption = d;
        activeText.text(selectedOption.label).each(wrap);
        typeof options.changeHandler === 'function' && options.changeHandler.call(this, d);
        optionGroup.attr("display", "none");
    }

    function handleSelectClick() {
        d3.event.stopPropagation();
        const visibility = optionGroup.attr("display") === "block" ? "none" : "block";
        optionGroup.attr("display", visibility);
    }

    // wraps words
    function wrap() {
        const width = options.width;
        const padding = options.padding;
        const self = d3.select(this);
        let textLength = self.node().getComputedTextLength();
        let text = self.text();
        const textArr = text.split(/\s+/);
        let lastWord = "";
        while (textLength > width - 2 * padding && text.length > 0) {
            lastWord = textArr.pop();
            text = textArr.join(" ");
            self.text(text);
            textLength = self.node().getComputedTextLength();
        }
        self.text(text + " " + lastWord);

        // providing ellipsis to last word in the text
        if (lastWord) {
            textLength = self.node().getComputedTextLength();
            text = self.text();
            while (textLength > width - 2 * padding && text.length > 0) {
                text = text.slice(0, -1);
                self.text(text + "...");
                textLength = self.node().getComputedTextLength();
            }
        }
    }
}
// d3.select("h1").style("color", "red");

let mainObj = {};

// Read in JSON file to mainObj
// Also creates buttons
fetch("./data/family_members.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    mainObj = data[0];
    createButtons(mainObj);
    positionButtons(mainObj);
  });

function createButtons(jsonFile) {
  for (let key in jsonFile) {
    console.log(key);
    console.log(jsonFile[key]);

    var tag = document.createElement("button");
    var buttName = document.createTextNode(`${key}`);
    tag.appendChild(buttName);
    var att = document.createAttribute("class"); // Create a "class" attribute
    att.value = key; // sets key name to class
    tag.setAttributeNode(att); //
    // <button  class = Grandpa
    document.body.appendChild(tag);
  }

  // "grandpa" and "grandma" are visible from beginning
  var grandpa = document.getElementsByClassName("Grandpa")[0];
  var grandma = document.getElementsByClassName("Grandma")[0];
  var husband = document.getElementsByClassName("Husband")[0];
  var wife = document.getElementsByClassName("Wife")[0];

  grandpa.style.backgroundImage = "url('data/Grandpa.jpg')"; // setting background images for buttons
  grandma.style.backgroundImage = "url('data/Grandma.jpg')";
  husband.style.backgroundImage = "url('data/Husband.jpg')";
  wife.style.backgroundImage = "url('data/Wife.jpg')";

  grandpa.onclick = function () {
    wife.style.visibility = "visible"; // hard coded in rn, change later.
  };
  grandma.onclick = function () {
    wife.style.visibility = "visible";
  };
  wife.onclick = function () {
    husband.style.visibility = "visible";
  };

  wife.style.visibility = "hidden";
  husband.style.visibility = "hidden";
}

/* Function to add style element */

function addStyle(styles) {
  /* Create style document */

  var css = document.createElement("style");
  css.type = "text/css";

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  /* Append style to the tag name */

  document.getElementsByTagName("head")[0].appendChild(css);
}

function positionButtons(jsonFile) {
  let num_gen_1 = 0;
  let num_gen_2 = 0;

  for (let key in jsonFile) {
    let gen = jsonFile[key]["Generation"];

    if (gen == 1) {
      let ycoord = 0;
      num_gen_1 += 1;
    } else if (gen == 2) {
      let ycoord = 200;
      num_gen_2 += 1;
    }
    d3.select("body").append("g").attr("transform", translateY(200));

    // i x = 200i

    // for each member of gen
    // if gen ===1:
    // set member.ycoord = 0
  }

  //idea is to create a loop for each member of generation x in json file. For each member, the leftmargin
  // will be increased by 200px.
  // another loop for each subsequent generation will move the topmargin down by 200px.
  //issue is to be able to adust leftmargin and topmargin of buttons using javascript.
}

/* Set the style */

var styles = "button { color: white }";
styles += " button { text-align: center }";
styles += " button {width: 200px}";
styles += " button {height: 300px}";

/* Function call */

window.onload = function () {
  addStyle(styles);
  positionButtons(jsonFile);
};

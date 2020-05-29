// d3.select("h1").style("color", "red");
let mainObj = {};
fetch("./data/family_members.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //console.log(data[0].Grandpa1.Name);
    mainObj = data[0];
    // var output = mainObj.Grandpa1.Name;
    // document.getElementById("output").innerHTML = output;
    createButtons(mainObj);
  });

function createButtons(jsonFile) {
  let output = "";
  for (let key in jsonFile) {
    // var output = mainObj.Grandpa1.Name;
    // document.getElementById("output").innerHTML = output;

    console.log(key);
    console.log(jsonFile[key]);

    var tag = document.createElement("button");
    var buttName = document.createTextNode(`${key}`);
    tag.appendChild(buttName);
    var att = document.createAttribute("class"); // Create a "class" attribute
    //tag.setAttributeNode(att);
    document.body.appendChild(tag);
  }
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

/* Set the style */

var styles = "button { color: black }";
styles += " button { text-align: center }";
styles += " button {background-color: rgb(200, 4, 99)}";
styles += " button {width: 500px}";
styles += " button {height: 500px}";
styles += " button {border: 33 px blue}";
styles += " button {background: url(data/test.png)}";

/* Function call */

window.onload = function () {
  addStyle(styles);
};

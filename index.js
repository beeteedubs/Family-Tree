// d3.select("h1").style("color", "red");

let mainObj = {};

// Read in JSON file to mainObj
// Also creates buttons
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
    att.value = key;
    tag.setAttributeNode(att);
    document.body.appendChild(tag);
  }

  // "grandpa" and "grandma" are visible from beginning
  var grandpa = document.getElementsByClassName("Grandpa")[0];
  var grandma = document.getElementsByClassName("Grandma")[0];
  var husband = document.getElementsByClassName("Husband")[0];
  var wife = document.getElementsByClassName("Wife")[0];

  grandpa.style.backgroundImage = "url('data/Grandpa.jpg')";
  grandma.style.backgroundImage = "url('data/Grandma.jpg')";
  husband.style.backgroundImage = "url('data/Husband.jpg')";
  wife.style.backgroundImage = "url('data/Wife.jpg')";

  // grandpa.onclick = 'wife.style.visibility = "visible"';
  // grandma.onclick = wife.style.visibility = "visible";
  var grandpa_attribute = document.createAttribute("onclick");
  granpda.onclick = function () {
    wife.style.visibility = "visible";
  };
  // grandpa_attribute = 'wife.style.visibility = "visible";'
  // grandpa.setAttribute(grandpa_attribute);

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

/* Set the style */

var styles = "button { color: black }";
styles += " button { text-align: center }";
styles += " button {width: 500px}";
styles += " button {height: 500px}";
styles += " button {border: 33 px blue}";

/* Function call */

window.onload = function () {
  addStyle(styles);
};

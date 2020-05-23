// d3.select("h1").style("color", "red");
window.onload = function () {
  let mainObj = {};
  let theThing = function () {
    for (let prop in mainObj) {
      // var output = mainObj.Grandpa1.Name;
      // document.getElementById("output").innerHTML = output;
      console.log(prop);
      console.log(mainObj[prop]);
    }
  };

  fetch("./data/family_members.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data[0].Grandpa1.Name);
      mainObj = data[0];
      theThing();
      var output = mainObj.Grandpa1.Name;
      document.getElementById("output").innerHTML = output;
    });
};

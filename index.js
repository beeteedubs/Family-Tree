// d3.select("h1").style("color", "red");

fetch("./data/family_members.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data[0].Husband);
  });

function importData() {
  d3.json("data/family_members.json", function (data) {
    console.log(data);
  });
}

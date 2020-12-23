function arrayUnique(array) {
  //
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
}

var index;
family_tree_data.push({
  name: orphans[0].name,
  parent: "",
  image: orphans[0].image,
  spouse: orphans[0].spouse,
  id: orphans[0].id,
}); // only push first orphan given

while (dummy.length != family_tree_data.length) {
  // for loop which'll keep going until family_tree_Data has no more changes.
  // dummy holds prev instance of family_tree_data
  dummy = arrayUnique(family_tree_data.concat(dummy)); // At the start of each loop, we set family_tree_data = dummy_list
  to_be_added = [];
  entries_js.forEach((entry) => {
    family_tree_data.forEach((data) => {
      // look for son in entries_js AND not already in FTD
      if (data.name == entry.father && !family_tree_data.includes(entry)) {
        // if father is in family_tree_data, add entry with father set as parent
        entry_obj = {
          name: entry.name,
          parent: entry.father,
          image: entry.image,
          spouse: entry.spouse,
          id: entry.id,
        };
        family_tree_data.push(entry_obj);
        index = entries_js.indexOf(entry);
        if (index > -1) {
          entries_js.splice(index, 1);
        }
        // to_be_added.push(entry); // not "entry_js" since then won't splice since index will  be <1
      } else if (
        data.name == entry.mother &&
        !family_tree_data.includes(entry)
      ) {
        // if mother is in family_tree_data, add entry with mother set as parent
        entry_obj = {
          name: entry.name,
          parent: entry.mother,
          image: entry.image,
          spouse: entry.spouse,
          id: entry.id
        };
        family_tree_data.push(entry_obj);
        index = entries_js.indexOf(entry);
        if (index > -1) {
          entries_js.splice(index, 1);
        }
        // to_be_added.push(entry); // not "entry_js" since then won't splice since index will  be <1
      }
      console.log("innermost loop");
    });
  });
}
//---------------------------------------------------------------------------------------------------------------------------------

var spouse_parent;
family_tree_data.forEach((data) => {
  //adds spouses of ppl in family_tree_data to spouse_data
  if (data.spouse == "") {
    //spousless
    if (data.parent != "") {
      //non-root node only
      for (i = 0; i < family_tree_data.length; i++) {
        if (family_tree_data[i].name == data.parent) {
          //if found parent of current spouseless data
          if (family_tree_data[i].spouse == "") {
            // if parent has no spouse
            spouse_parent = family_tree_data[i].name; // set imaginary spouse's parent to imaginary parent.name_spouse
            entry_obj = {
              name: data.name + "_spouse",
              parent: spouse_parent + "_spouse",
              image: "",
            };
            spouse_data.push(entry_obj);
          } else {
            //found spouseFUL father, reassign father to be your spouse's father's spouse
            spouse_parent = family_tree_data[i].spouse; // set imagianry spouse's parent to parent.spouse
            entry_obj = {
              name: data.name + "_spouse",
              parent: spouse_parent,
              image: "",
            }; //
            spouse_data.push(entry_obj);
            break;
          }
        }
      }
    } else {
      //for root node
      entry_obj = { name: data.name + "_spouse", parent: "", image: "" };
      spouse_data.push(entry_obj);
    }
  } else {
    //gots a spouse, so look through spouse list
    for (j = 0; j < entries_js.length; j++) {
      if (entries_js[j].name == data.spouse) {
        //found spouse
        if (data.parent != "") {
          //for non-root nodes
          for (i = 0; i < family_tree_data.length; i++) {
            //look through family tree data again to get the parent's spouse
            if (family_tree_data[i].name == data.parent) {
              if (family_tree_data[i].spouse != "") {
                // if data's parent has a spouse
                spouse_parent = family_tree_data[i].spouse;
                entry_obj = {
                  name: data.spouse,
                  parent: spouse_parent,
                  image: entries_js[j].image,
                };
              } else {
                spouse_parent = family_tree_data[i].name;
                entry_obj = {
                  name: data.spouse,
                  parent: spouse_parent + "_spouse",
                  image: entries_js[j].image,
                };
              }
            } else {
              continue;
            }
            entries_js.splice(entries_js.indexOf(entries_js[j]), 1);
            spouse_data.push(entry_obj);
            break;
            console.log("innermost spouse data loo");
          }

          //   spouse_data.push(entry_obj); //pushing spouse
        } else {
          entry_obj = {
            name: data.spouse,
            parent: "",
            image: entries_js[j].image,
          };
          spouse_data.push(entry_obj); //pushing spouse
          entries_js.splice(entries_js.indexOf(entries_js[j]), 1);
        }
        break;
      }
    }
  }
});

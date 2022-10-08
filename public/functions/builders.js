// give string array of button text and returns the query path
function findPath(selected) {
  let path = "";

  for (let i = 0; i < selected.length; i++) {
    switch (selected[i]) {
      case "-0-":
        path += "&level=0";
        break;
      case "1ST":
        path += "&level=1";
        break;
      case "2ND":
        path += "&level=2";
        break;
      case "3RD":
        path += "&level=3";
        break;
      case "4TH":
        path += "&level=4";
        break;
      case "5TH":
        path += "&level=5";
        break;
      case "6TH":
        path += "&level=6";
        break;
      case "7TH":
        path += "&level=7";
        break;
      case "8TH":
        path += "&level=8";
        break;
      case "9TH":
        path += "&level=9";
        break;
      case "ABJ":
        path += "&school=abjuration";
        break;
      case "CONJ":
        path += "&school=conjuration";
        break;
      case "DIV":
        path += "&school=divination";
        break;
      case "ENCH":
        path += "&school=enchantment";
        break;
      case "EVO":
        path += "&school=evocation";
        break;
      case "ILLU":
        path += "&school=illusion";
        break;
      case "NECRO":
        path += "&school=necromancy";
        break;
      case "TRANS":
        path += "&school=transmutation";
        break;
    }
  }

  path = path.replace("&", "?");

  return path;
}

//create query for R, Conc & All btns (Book Spells)
function bookQuery(btnText, test, flag) {
  let query = "";

  if (
    btnText.some((btn) => {
      return btn == test;
    })
  ) {
    query += `&${flag}=true`;
  } else {
    query += `&${flag}=false`;
  }

  return query;
}

//creates HTML element
function createHtml(htmlType, value, parent, class_) {
  const elem = document.createElement(htmlType);
  if (value != null) elem.textContent = value;
  if (class_ != null) classAdd(elem, class_);
  parent.appendChild(elem);
}

//adds multiple classes to HTML element
function classAdd(elem, class_) {
  if (typeof class_ === "object") {
    class_.forEach((e) => {
      elem.classList.add(e);
    });
  } else {
    elem.classList.add(class_);
  }
}

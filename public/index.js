const allBtns = document.querySelectorAll(".all");
const allSpellsBox = document.querySelector("#all-spells-holder");
const spellBookBox = document.querySelector("#spell-book-holder");
const allConcBtn = document.querySelector(".all-conc");
const allRituBtn = document.querySelector(".all-ritu");
const allAllBtn = document.querySelector(".all-all");
const bookBtns = document.querySelectorAll(".book");
const bookAllBtn = document.querySelector(".book-all");

WIZ_SCHOOL = "Necromancy";
WIZ_LEVEL = 5;

concFlag = false;
rituFlag = false;
allFlag = false;

console.log("connected to index.js");

for (let i = 0; i < allBtns.length; i++) {
  allBtns[i].addEventListener("click", clickAllSpells);
}

allConcBtn.addEventListener("click", clickAllSpells);
allRituBtn.addEventListener("click", clickAllSpells);
allAllBtn.addEventListener("click", clickAllSpells);

for (let i = 0; i < bookBtns.length; i++) {
  bookBtns[i].addEventListener("click", clickBookSpells);
}

addHbBtn.addEventListener("click", showHomebrew);
submitHbBtn.addEventListener("click", submitHomebrew);
clearHbBtn.addEventListener("click", clearHb);
hbDamage.addEventListener("click", toggleDmg);

//get ALL SPELLS
function clickAllSpells(e) {
  //toggle clicked button for ALL SPELLS
  if (e.target.classList.contains("all")) {
    e.target.classList.toggle("selected-all-btn");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL RITUAL is selected
  if (e.target.classList.contains("all-ritu")) {
    e.target.classList.toggle("selected-rc");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL CONC is selected
  if (e.target.classList.contains("all-conc")) {
    e.target.classList.toggle("selected-rc");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL ALL btn is selected
  if (e.target.classList.contains("all-all")) {
    e.target.classList.toggle("selected-all");
    allRituBtn.classList.remove("selected-rc");
    allConcBtn.classList.remove("selected-rc");

    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove("selected-all-btn");
    }
  }

  pullAllSpells();
}

function pullAllSpells() {
  //collect all selected buttons from same category
  const selected = document.querySelectorAll(".selected-all-btn");
  const selectText = [];

  const book = false;

  //check if ritu or conc are selected
  concFlag = allConcBtn.classList.contains("selected-rc");
  rituFlag = allRituBtn.classList.contains("selected-rc");
  allFlag = allAllBtn.classList.contains("selected-all");

  //turn selected buttons into a string array
  selected.forEach((btn, i) => {
    selectText[i] = btn.innerText;
  });

  //find query from selected buttons
  const query = findPath(selectText);
  allSpellsBox.innerHTML = "";

  if (
    query != "" ||
    concFlag === true ||
    rituFlag === true ||
    allFlag === true
  ) {
    axios
      .post(`/api/spells/`, { query, concFlag, rituFlag })
      .then((res) => {
        for (let b = 0; b <= 9; b++) {
          createLvlLabels(selectText, book, b);
          for (let i = 0; i < res.data.length; i++) {
            createSpell(res.data[i], book, b);
          }
        }

        cleanNodes(allSpellsBox);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

//get BOOK SPELLS
function clickBookSpells(e) {
  if (e.target.classList.contains("book")) {
    //if the button is the All Button
    if (e.target.classList.contains("book-all")) {
      if (e.target.classList.contains("selected-book-btn")) {
        //if the all button is being UNSELECTED
        e.target.classList.remove("selected-book-btn");
      } else {
        //if the all button is being SELECTED
        const select = document.querySelectorAll(".selected-book-btn");
        select.forEach((elem) => {
          elem.classList.remove("selected-book-btn");
        });

        e.target.classList.add("selected-book-btn");
      }
    } else {
      //every other button selection
      e.target.classList.toggle("selected-book-btn");
      bookAllBtn.classList.remove("selected-book-btn");
    }
  }

  pullBookSpells();
}

function pullBookSpells() {
  const book = true;
  spellBookBox.innerHTML = "";
  //collect all selected btns for books
  const selected = document.querySelectorAll(".selected-book-btn");
  const selectText = [];

  //turn selected btns into a string array
  selected.forEach((btn, i) => {
    selectText[i] = btn.innerText;
  });

  //exit the function if nothing is selected
  if (selectText.length == 0) return;

  //create query for spellbook
  let query = findPath(selectText);

  //adding extra to the query
  query += bookQuery(selectText, "CON", "conc");
  query += bookQuery(selectText, "-R-", "ritu");
  query += bookQuery(selectText, "ALL", "all");

  if (query.startsWith("&")) {
    query = query.replace("&", "?");
  }

  axios
    .get(`/api/book/${query}`)
    .then((res) => {
      for (let b = 0; b <= 9; b++) {
        createLvlLabels(selectText, book, b);
        for (let i = 0; i < res.data.length; i++) {
          createSpell(res.data[i], book, b);
        }
      }

      cleanNodes(spellBookBox);
    })
    .catch((err) => {
      console.log(err);
    });
}

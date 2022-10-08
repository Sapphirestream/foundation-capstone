//expands indiv spell
function expandSpell(e) {
  const spellName = e.target.classList[1];
  const expand = document.querySelectorAll(`.${spellName}`);

  expand.forEach((elem) => {
    elem.classList.toggle("hidden");
  });

  if (e.target.textContent == "+") {
    e.target.textContent = "-";
  } else {
    e.target.textContent = "+";
  }

  e.target.classList.remove("hidden");
}

//delete spell from spellbook
function removeSpell(e) {
  const spell = e.target.classList[1];

  axios
    .delete(`/api/book/${spell}`)
    .then((res) => {
      console.log(`deleted ${spell}`);
      e.target.parentNode.parentNode.parentNode.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

//add spell to spell book from all spells
function addSpelltoBook(e) {
  const spell = e.target.classList[1];

  axios
    .post(`/api/spells/${spell}`)
    .then((res) => {
      console.log(`${spell} added!`);
      e.target.parentNode.parentNode.parentNode.remove();
      if (res.status === 200) pullBookSpells();
    })
    .catch((err) => {
      console.log(`${spell} error`, err);
    });
}

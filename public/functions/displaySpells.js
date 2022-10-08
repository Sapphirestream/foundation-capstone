const allBox = document.querySelector("#all-spells-holder");
const bookBox = document.querySelector("#spell-book-holder");

//creates each spell display
function createSpell(spell, book, lvl) {
  if (spell.level != lvl) return;

  //creates the overall holder for the spell
  const spellHolder = document.createElement("section");
  spellHolder.classList.add("spell-hold");

  book ? bookBox.appendChild(spellHolder) : allBox.appendChild(spellHolder);

  //creates the holder for the spell quick details
  const spellSumm = document.createElement("div");
  spellSumm.classList.add("spell-min");
  spellHolder.appendChild(spellSumm);

  // create Spell Icon
  createHtml("img", null, spellSumm, ["spell-icon", spell.school.name]);

  //name of spell
  const nameHold = document.createElement("div");
  spellSumm.appendChild(nameHold);

  // create Spell Name
  createHtml("h4", spell.name, nameHold, null);

  //create spell school
  createHtml("p", spell.school.name, nameHold, "grey");

  //concentration & ritual
  const concHolder = document.createElement("div");
  concHolder.classList.add("w50");
  spellSumm.appendChild(concHolder);

  if (spell.concentration == true) createHtml("p", "Conc", concHolder, "green");
  if (spell.ritual == true) createHtml("p", "Ritual", concHolder, "red");

  //create range
  createHtml("p", spell.range, spellSumm, "w50");

  //damage + cost
  const damageHold = document.createElement("div");
  damageHold.classList.add("w50");
  spellSumm.appendChild(damageHold);

  //damage
  let dmg = null;

  if (spell.homebrew) if (spell.damage != null) dmg = spell.damage;

  if (spell.damage) {
    if (spell.damage.damage_at_character_level)
      dmg = spell.damage.damage_at_character_level[WIZ_LEVEL];
    if (spell.damage.damage_at_slot_level)
      dmg = spell.damage.damage_at_slot_level[spell.level];
  }

  dmg != null
    ? createHtml("p", dmg, damageHold, "text-center")
    : createHtml("p", "—", damageHold, "text-center");

  //cost
  let gold = spell.level * 50;

  if (spell.school.name == WIZ_SCHOOL) gold = gold / 2;
  if (gold > 0 && book == false)
    createHtml("p", `${gold}g`, damageHold, ["grey", "text-center"]);

  //create save
  const saveHold = document.createElement("div");
  saveHold.classList.add("w120");
  spellSumm.appendChild(saveHold);

  if (spell.dc && spell.dc.dc_type.name != null) {
    createHtml("p", `${spell.dc.dc_type.name} SAVE`, saveHold, "text-center");
  } else {
    createHtml("p", `—`, saveHold, "text-center");
  }

  // create Time
  let time = spell.level * 2;
  if (spell.school.name == WIZ_SCHOOL) time = time / 2;

  if (time > 0 && book == false)
    createHtml("p", `${time} hours`, saveHold, ["grey", "text-center"]);

  //PLUS BUTTON
  const plus = document.createElement("p");
  plus.textContent = "+";
  spellSumm.appendChild(plus);
  plus.addEventListener("click", expandSpell);
  classAdd(plus, "plus", `${spell.index}`);

  // EXTENDED SPELL DISPLAY
  const extendedSpell = document.createElement("div");
  extendedSpell.classList.add("spell-expand");
  spellHolder.appendChild(extendedSpell);
  plus.classList.add(`${spell.index}`);

  //create spell description
  spell.desc.forEach((elem) => {
    createHtml("p", elem, extendedSpell, ["desc", "hidden", `${spell.index}`]);
  });

  //create higher level
  if (spell.higher_level && spell.higher_level != null) {
    createHtml("p", spell.higher_level, extendedSpell, [
      "desc",
      "hidden",
      `${spell.index}`,
    ]);
  }

  const btnHolder = document.createElement("div");
  extendedSpell.appendChild(btnHolder);
  classAdd(btnHolder, ["flex", "right"]);

  if (spell.homebrew) {
    createHtml("button", "Homebrew Spell", btnHolder, [
      "remove-btn",
      "hidden",
      `${spell.index}`,
      "no-hover",
    ]);
    btnHolder.classList.remove("right");
    btnHolder.classList.add("space-btwn");
  }

  const spellBtn = document.createElement("button");
  btnHolder.appendChild(spellBtn);
  classAdd(spellBtn, ["remove-btn", "hidden", `${spell.index}`]);

  if (book) {
    spellBtn.textContent = "Remove from Spellbook";
    spellBtn.addEventListener("click", removeSpell);
  } else {
    spellBtn.textContent = "Add to Spellbook";
    spellBtn.addEventListener("click", addSpelltoBook);
  }
}

//creates each level display
function createLvlLabels(selectText, book, b) {
  const label = document.createElement("h3");
  label.classList.add("label");
  let numFlag = false;

  if (book) {
    bookBox.appendChild(label);
  } else {
    allBox.appendChild(label);
  }

  if (selectText.includes("-0-")) {
    numFlag = true;
  } else if (selectText.includes("1ST")) {
    numFlag = true;
  } else if (selectText.includes("2ND")) {
    numFlag = true;
  } else if (selectText.includes("3RD")) {
    numFlag = true;
  } else if (selectText.includes("4TH")) {
    numFlag = true;
  } else if (selectText.includes("5TH")) {
    numFlag = true;
  } else if (selectText.includes("6TH")) {
    numFlag = true;
  } else if (selectText.includes("7TH")) {
    numFlag = true;
  } else if (selectText.includes("8TH")) {
    numFlag = true;
  } else if (selectText.includes("9TH")) {
    numFlag = true;
  }

  if (numFlag) {
    switch (b) {
      case 0:
        if (selectText.includes("-0-")) {
          label.textContent = "Cantrips";
        }
        break;
      case 1:
        if (selectText.includes("1ST")) {
          label.textContent = "1st Levels";
        }
        break;
      case 2:
        if (selectText.includes("2ND")) {
          label.textContent = "2nd Levels";
        }
        break;
      case 3:
        if (selectText.includes("3RD")) {
          label.textContent = "3rd Levels";
        }
        break;
      case 4:
        if (selectText.includes("4TH")) {
          label.textContent = "4th Levels";
        }
        break;
      case 5:
        if (selectText.includes("5TH")) {
          label.textContent = "5th Levels";
        }
        break;
      case 6:
        if (selectText.includes("6TH")) {
          label.textContent = "6th Levels";
        }
        break;
      case 7:
        if (selectText.includes("7TH")) {
          label.textContent = "7th Levels";
        }
        break;
      case 8:
        if (selectText.includes("8TH")) {
          label.textContent = "8th Levels";
        }
        break;
      case 9:
        if (selectText.includes("9TH")) {
          label.textContent = "9th Levels";
        }
        break;
    }
  } else {
    switch (b) {
      case 0:
        label.textContent = "Cantrips";
        break;
      case 1:
        label.textContent = "1st Levels";
        break;
      case 2:
        label.textContent = "2nd Levels";
        break;
      case 3:
        label.textContent = "3rd Levels";
        break;
      case 4:
        label.textContent = "4th Levels";
        break;
      case 5:
        label.textContent = "5th Levels";
        break;
      case 6:
        label.textContent = "6th Levels";
        break;
      case 7:
        label.textContent = "7th Levels";
        break;
      case 8:
        label.textContent = "8th Levels";
        break;
      case 9:
        label.textContent = "9th Levels";
        break;
    }
  }
}

//deletes extra level labels on display
function cleanNodes(box) {
  nodes = box.childNodes;

  for (let i = 0; i < nodes.length - 1; i++) {
    if (
      nodes[i].classList.contains("label") &&
      nodes[i].nextSibling.classList.contains("label")
    ) {
      nodes[i].remove();
      i--;
    }
  }

  if (nodes[nodes.length - 1].classList.contains("label")) {
    nodes[nodes.length - 1].remove();
  }

  if (nodes.length == 0) {
    const noSpellsHolder = document.createElement("div");
    classAdd(noSpellsHolder, ["flex", "center"]);
    box.appendChild(noSpellsHolder);

    const noSpells = document.createElement("h3");
    noSpells.textContent = "No Spells Selected!";
    noSpellsHolder.appendChild(noSpells);
  }
}

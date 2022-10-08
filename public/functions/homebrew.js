const addHbBtn = document.querySelector("#add-hb");
const hbBox = document.querySelector("#hb-hold");
const submitHbBtn = document.querySelector("#submit-hb");
const clearHbBtn = document.querySelector("#clear-hb");
const hbNotif = document.querySelector("#hb-notif");
const hbDamage = document.getElementById("dmg");
const spellSuccess = document.getElementById("spell-success");

//shows the Homebrew creation section
function showHomebrew() {
  hbBox.classList.contains("hidden")
    ? (addHbBtn.textContent = "Hide Homebrew..")
    : (addHbBtn.textContent = "Add Homebrew Spell");

  hbBox.classList.toggle("hidden");
}

//submit Homebrew and create Spell
function submitHomebrew() {
  const spellNameInput = document.getElementById("name-input");
  const levelInput = document.getElementById("level-input");
  const schoolInput = document.getElementById("school-input");
  const rangeInput = document.getElementById("range-input");
  const damageInput = document.getElementById("dmg-input");
  const dcInput = document.getElementById("dc-input");
  const descInput = document.getElementById("desc-input");
  const upcastInput = document.getElementById("upcast-input");

  //which boxes are checked
  const damageCheck = document.getElementById("dmg").checked;
  const concCheck = document.getElementById("conc").checked;
  const rituCheck = document.getElementById("ritu").checked;

  //check all inputs are valid
  let error = "";
  hbNotif.textContent = "";

  error = checkInput(spellNameInput.value, 50, error, "Spell Name");
  error = checkInput(rangeInput.value, 20, error, "Range");
  error = checkInput(descInput.value, 3000, error, "Description");
  error = checkInput(upcastInput.value, 1000, error, "Upcast");
  error = checkInput(damageInput.value, 20, error, "Damage");

  if (error != "") {
    hbNotif.textContent = `ERROR: ${error}`;
    return;
  } else {
    hbNotif.textContent = "";
  }

  //assign input values
  const newName = spellNameInput.value.trim();
  const newIndex = createIndex(newName);
  const newLevel = levelInput.value;
  const newSchool = schoolInput.value;
  const newRange = rangeInput.value.trim();
  const newDesc = descInput.value.trim();

  damageCheck && damageInput.value != ""
    ? (newDamage = damageInput.value.trim())
    : (newDamage = null);

  let newDc = null;
  if (dcInput.value != "noSave") newDc = dcInput.value;

  let newUpcast = null;
  if (upcastInput.value != "") newUpcast = upcastInput.value.trim();

  //create object to send to server
  const newSpell = {
    level: newLevel,
    school: newSchool,
    name: newName,
    concentration: concCheck,
    ritual: rituCheck,
    range: newRange,
    damage: newDamage,
    dc: newDc,
    index: newIndex,
    description: newDesc,
    higher_level: newUpcast,
    homebrew: true,
  };

  //send newSpell to the server
  axios
    .post("/api/book/homebrew/", newSpell)
    .then((res) => {
      if (res.status === 200) pullBookSpells();
      clearHb();
      spellSuccess.textContent = res.data;
      const spellTO = setTimeout(succussTimeout, 5000);
    })
    .catch((error) => {
      console.log(error);
    });
}

//check that User Input is correct
function checkInput(input, length, error, value) {
  //check length of input
  if (input.length >= length) {
    error += `${value} is too long // `;
  }

  if (
    input.length <= 0 &&
    (value == "Range" || value == "Spell Name" || value == "Description")
  ) {
    error += `${value} must exist // `;
  } else {
    //check that it starts with an alphebetic character
    if (input.length > 0) {
      if (!/^[A-Za-z0-9]/.test(input)) {
        error += `${value} does not start with an alphanumeric character // `;
      }
    }
  }

  //check that it doesnt include ' which will break sql
  if (input.includes("'")) {
    error += `${value} includes the value ' // `;
  }

  //checks that it doesn't include " which messes with display
  if (input.includes('"')) {
    error += `${value} includes the value " // `;
  }

  return error;
}

//create Spell Index from Spell Name
function createIndex(name) {
  const regex = /[$&+,:"`;=?@#|<>.^*()%!]/g;

  let index = name.toLowerCase().trim();
  index = index.replaceAll(" ", "-");
  index = index.replaceAll(regex, "-");

  return index;
}

//clear the homebrew inputs
function clearHb() {
  document.getElementById("name-input").value = "";
  document.getElementById("level-input").value = "0";
  document.getElementById("school-input").value = "illusion";
  document.getElementById("range-input").value = "";
  document.getElementById("dmg-input").value = "";
  document.getElementById("dc-input").value = "noSave";
  document.getElementById("desc-input").value = "";
  document.getElementById("upcast-input").value = "";

  //which boxes are checked
  document.getElementById("dmg").checked = false;
  document.getElementById("conc").checked = false;
  document.getElementById("ritu").checked = false;

  //disable damage input
  document.getElementById("dmg-input").setAttribute("disabled", "");

  //clear notification
  hbNotif.textContent = "";
}

//toggles damage input in homebrew
function toggleDmg() {
  if (hbDamage.checked == true) {
    document.getElementById("dmg-input").removeAttribute("disabled");
  } else {
    document.getElementById("dmg-input").setAttribute("disabled", "");
  }
}

// times the success text out
function succussTimeout() {
  spellSuccess.textContent = "";
}

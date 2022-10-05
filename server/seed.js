require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  seed: (req, res) => {
    console.log("seeding...");
    sequelize
      .query(
        `DROP TABLE IF EXISTS homebrew; 
        DROP TABLE IF EXISTS spellbook;
        
         
                CREATE TABLE spellbook(
                spellbook_id SERIAL PRIMARY KEY,
                index VARCHAR(50) NOT NULL UNIQUE,
                level INTEGER NOT NULL,
                school VARCHAR(20) NOT NULL,
                concentration BOOLEAN NOT NULL,
                ritual BOOLEAN NOT NULL,
                homebrew BOOLEAN
              );
        
        CREATE TABLE homebrew(
                    homebrew_id SERIAL PRIMARY KEY,
                    spellbook_id INTEGER NOT NULL REFERENCES spellbook(spellbook_id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    range VARCHAR(255) NOT NULL,
                    damage VARCHAR(255),
                    dc VARCHAR(20),
                    description TEXT,
                    higher_level TEXT
                );
        
              INSERT INTO spellbook(index, level, school, concentration, ritual, homebrew)
              VALUES ('prestidigitation', 0, 'transmutation', false, false, false),
              ('shield', 1, 'abjuration', false, false, false),
              ('mage-armor', 1, 'abjuration', false, false, false),
              ('detect-magic', 1, 'divination', true, true, false),
              ('gentle-repose', 2, 'necromancy', false, true, false),
              ('blur', 2, 'illusion', true, false, false),
              ('gleamsilver-s-ward-of-warming', 2, 'abjuration', false, true, true),
              ('fear', 3, 'illusion', true, false, false),
              ('kora-s-necromantic-blast', 3, 'evocation', false, false, true);
        
        INSERT INTO homebrew(spellbook_id, name, range, damage, dc, description, higher_level)
                      VALUES (7, 'Gleamsilvers Ward of Warming', 'Touch', null, null, 'You draw a sigil on a flat surface that radiates comforting warmth. The warmth surrounds the sigil in a 30 foot radius sphere, melting any nonmagical ice and snow inside of it.
On a short rest, a creature may add +1 to every hit die they roll if they spend the full hour within the radius. On a long rest, a creature may heal 2 levels of exhaustion instead of 1 level if they spend all 8 hours within the radius.', null),
                      (9, 'Koras Necromantic Blast', '150 feet', '8d6', 'DEX', 'A dark mote streaks from your pointing finger to a point you choose within range and then blossoms into a black fog of bitter, deadly coldness, twisting all those inside into dark ghoulish figures and echoing with unnatural screams. The fog is then consumed by an eerie green flame, cleansing the area behind it.
Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 cold damage on a failed save, or half as much damage on a successful one.
The fog spreads around corners. It leaves a thin layer of frost on everything it touches.', 'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.');
        `
      )
      .then(() => {
        console.log("DB seeded!");
        res.sendStatus(200);
      })
      .catch((err) => console.log("error seeding DB", err));
  },
};

/**
 * Allows to compact/convert raw cards from HearstoneJSON into more usable JSONs 
 * https://api.hearthstonejson.com/v1/18336/enUS/cards.collectible.json
 * https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json
 * https://api.hearthstonejson.com/v1/18336/enUS/cards.json
 * https://api.hearthstonejson.com/v1/latest/enUS/cards.json
 */
const fs = require("fs");

let _example  = {
        //"artist": "Dany Orizio",
        "attack": 8,
        "cardClass": "NEUTRAL",
        //"collectible": true,
        "cost": 9,
        "dbfId": 363,
        //"elite": true,
        //"flavor": "Onyxia long manipulated the Stormwind Court by disguising herself as Lady Katrana Prestor.   You would have thought that the giant wings and scales would have been a giveaway.",
        "health": 8,
        "id": "EX1_562",
        "mechanics": [
            "BATTLECRY"
        ],
        "name": "Onyxia",
        "playerClass": "NEUTRAL",
        "race": "DRAGON",
        "rarity": "LEGENDARY",
        "set": "EXPERT1",
        "text": "<b>Battlecry:</b> Summon 1/1 Whelps until your side of the battlefield is full.",
        "type": "MINION"
    };

fs.readFile('cards.json', function (err, data) {
  if (err) {
    console.log(err);
    throw err;
  } 
  let unwanted_props = [  
    //'collectible', // cards.json is ONLY collectible
    'elite', // duplicates rarity:LEGENDARY
    'cardClass', // duplicate of playerClass
    'artist', // text
    'flavor', // text
    'howToEarn', // text help
    'howToEarnGolden', // text help
    'referencedTags', // ?
    'mechanics', // incomplete and useless
    'playRequirements', // need to read doc for this ..
    //'rarity', //
    'set', //
    'dbfId' //
  ];   
  let jmin = JSON.parse(data, (k,v) => {
    return unwanted_props.indexOf(k) === -1 ? v : undefined;
  });
  console.log(`Found ${jmin.length} cards, compacting ..`);
  let jnano = jmin.map((card) => {
    let {
      id, type, cost, name, attack, health, durability, text, race, playerClass, collectible,
      rarity
    } = card;
    return {
      id,
      //dfId,
      _info: ({
          'MINION':`(${cost}) ${attack}/${health}`,
          'HERO':`${attack||0}/${health} ${type}`,
          'WEAPON':`(${cost}) ${attack}/${durability} ${type}`,
          'SPELL':`(${cost}) ${type}`,
          'HERO_POWER':`(${cost}) ${type}`,
          'ENCHANTMENT': `${type}`
        }[type]||`${type}`) + ` [${collectible ? '' : '*'}${playerClass}]: ${name}${race?` |${race}`:''}`,
      text,
      type,
      name,
      //targetingArrowText,
      playerClass,
      //.multiclass
      rarity,
      collectible,
      cost,
      attack,
      health,
      durability,
      race
    };
  });
  
  let min = JSON.stringify(jmin, null, "  ");
  let min2 = JSON.stringify(jnano, null, "  ");

  //fs.writeFile('cards.min.json', min2, (err) => {
  fs.writeFile('data/cards.generated.json', min2, (err) => {
    if (err) throw err;
  });
});
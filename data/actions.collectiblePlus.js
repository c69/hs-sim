'use strict';

const {
  TAGS,
  EVENTS,
  ZONES
} = require('./constants.js');

const actions = [
  {
    "id": "AT_001",
    "_info": "(5) SPELL [MAGE]: Flame Lance",
    "text": "Deal $8 damage to a minion.",
    target: 'minion',
    play ({target}) {
      target.dealDamageSpell(8);
    }
  },
  {
    "id": "AT_002",
    "_info": "(3) SPELL [MAGE]: Effigy",
    "text": "<b>Secret:</b> When a friendly minion dies, summon a random minion with the same Cost."
  },
  {
    "id": "AT_003",
    "_info": "(2) 3/2 [MAGE]: Fallen Hero",
    "text": "Your Hero Power deals 1 extra damage."
  },
  {
    "id": "AT_004",
    "_info": "(1) SPELL [MAGE]: Arcane Blast",
    "text": "Deal $2 damage to a minion. This spell gets double bonus from <b>Spell Damage</b>."
  },
  {
    "id": "AT_005",
    "_info": "(3) SPELL [MAGE]: Polymorph: Boar",
    "text": "Transform a minion into a 4/2 Boar with <b>Charge</b>."
  },
  {
    "id": "AT_005t",
    "_info": "(3) 4/2 [*NEUTRAL]: Boar |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "AT_006",
    "_info": "(4) 3/5 [MAGE]: Dalaran Aspirant",
    "text": "<b>Inspire:</b> Gain <b>Spell Damage +1</b>."
  },
  {
    "id": "AT_006e",
    "_info": "ENCHANTMENT [*MAGE]: Power of Dalaran",
    "text": "Increased Spell Damage."
  },
  {
    "id": "AT_007",
    "_info": "(3) 3/4 [MAGE]: Spellslinger",
    "text": "<b>Battlecry:</b> Add a random spell to each player's hand."
  },
  {
    "id": "AT_008",
    "_info": "(6) 6/6 [MAGE]: Coldarra Drake |DRAGON",
    "text": "You can use your Hero Power any number of times."
  },
  {
    "id": "AT_009",
    "_info": "(8) 7/7 [MAGE]: Rhonin",
    "text": "<b>Deathrattle:</b> Add 3 copies of Arcane Missiles to your hand."
  },
  {
    "id": "AT_010",
    "_info": "(5) 3/3 [HUNTER]: Ram Wrangler",
    "text": "<b>Battlecry:</b> If you have a Beast, summon a\nrandom Beast."
  },
  {
    "id": "AT_011",
    "_info": "(4) 3/5 [PRIEST]: Holy Champion",
    "text": "Whenever a character is healed, gain +2 Attack."
  },
  {
    "id": "AT_011e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Light's Blessing",
    "text": "Increased Attack."
  },
  {
    "id": "AT_012",
    "_info": "(4) 5/4 [PRIEST]: Spawn of Shadows",
    "text": "<b>Inspire:</b> Deal 4 damage to each hero."
  },
  {
    "id": "AT_013",
    "_info": "(1) SPELL [PRIEST]: Power Word: Glory",
    "text": "Choose a minion. Whenever it attacks, restore 4 Health to\nyour hero."
  },
  {
    "id": "AT_013e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Power Word: Glory",
    "text": "When this attacks, restore 4 Health to the hero of the player who buffed it."
  },
  {
    "id": "AT_014",
    "_info": "(3) 3/3 [PRIEST]: Shadowfiend",
    "text": "Whenever you draw a card, reduce its Cost by (1)."
  },
  {
    "id": "AT_014e",
    "_info": "ENCHANTMENT [*PRIEST]: Shadowfiended",
    "text": "Costs (1) less."
  },
  {
    "id": "AT_015",
    "_info": "(2) SPELL [PRIEST]: Convert",
    "text": "Put a copy of an enemy minion into your hand."
  },
  {
    "id": "AT_016",
    "_info": "(2) SPELL [PRIEST]: Confuse",
    "text": "Swap the Attack and Health of all minions."
  },
  {
    "id": "AT_016e",
    "_info": "ENCHANTMENT [*PRIEST]: Confused",
    "text": "Swapped Attack and Health."
  },
  {
    "id": "AT_017",
    "_info": "(4) 2/6 [NEUTRAL]: Twilight Guardian |DRAGON",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, gain +1 Attack and <b>Taunt</b>."
  },
  {
    "id": "AT_017e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Twilight's Embrace",
    "text": "+1 Attack and <b>Taunt</b>."
  },
  {
    "id": "AT_018",
    "_info": "(7) 5/4 [PRIEST]: Confessor Paletress",
    "text": "<b>Inspire:</b> Summon a random <b>Legendary</b> minion."
  },
  {
    "id": "AT_019",
    "_info": "(4) 1/1 [WARLOCK]: Dreadsteed |DEMON",
    "text": "<b>Deathrattle:</b> Summon a Dreadsteed.",
    death ({summon}) {
      summon('AT_019');
    }
  },
  {
    "id": "AT_020",
    "_info": "(7) 6/8 [WARLOCK]: Fearsome Doomguard |DEMON"
  },
  {
    "id": "AT_021",
    "_info": "(2) 3/2 [WARLOCK]: Tiny Knight of Evil |DEMON",
    "text": "Whenever you discard a card, gain +1/+1."
  },
  {
    "id": "AT_021e",
    "_info": "ENCHANTMENT [*WARLOCK]: Felrage",
    "text": "Increased stats."
  },
  {
    "id": "AT_022",
    "_info": "(4) SPELL [WARLOCK]: Fist of Jaraxxus",
    "text": "When you play or discard this, deal $4 damage to a random enemy."
  },
  {
    "id": "AT_023",
    "_info": "(6) 5/4 [WARLOCK]: Void Crusher |DEMON",
    "text": "<b>Inspire:</b> Destroy a random minion for each player."
  },
  {
    "id": "AT_024",
    "_info": "(2) SPELL [WARLOCK]: Demonfuse",
    "text": "Give a Demon +3/+3. Give your opponent a Mana Crystal."
  },
  {
    "id": "AT_024e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dark Fusion",
    "text": "+3/+3."
  },
  {
    "id": "AT_025",
    "_info": "(6) SPELL [WARLOCK]: Dark Bargain",
    "text": "Destroy 2 random enemy minions. Discard 2 random cards."
  },
  {
    "id": "AT_026",
    "_info": "(2) 4/3 [WARLOCK]: Wrathguard |DEMON",
    "text": "Whenever this minion takes damage, also deal that amount to your hero."
  },
  {
    "id": "AT_027",
    "_info": "(6) 4/4 [WARLOCK]: Wilfred Fizzlebang",
    "text": "Cards you draw from your Hero Power cost (0)."
  },
  {
    "id": "AT_027e",
    "_info": "ENCHANTMENT [*WARLOCK]: Master Summoner",
    "text": "Costs (0)."
  },
  {
    "id": "AT_028",
    "_info": "(5) 3/7 [ROGUE]: Shado-Pan Rider",
    "text": "<b>Combo:</b> Gain +3 Attack."
  },
  {
    "id": "AT_028e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Chi Lance",
    "text": "+3 Attack."
  },
  {
    "id": "AT_029",
    "_info": "(1) 2/1 [ROGUE]: Buccaneer |PIRATE",
    "text": "Whenever you equip a weapon, give it +1 Attack."
  },
  {
    "id": "AT_029e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Extra Stabby",
    "text": "+1 Attack"
  },
  {
    "id": "AT_030",
    "_info": "(2) 3/2 [ROGUE]: Undercity Valiant",
    "text": "<b>Combo:</b> Deal 1 damage."
  },
  {
    "id": "AT_031",
    "_info": "(2) 2/2 [ROGUE]: Cutpurse",
    "text": "Whenever this minion attacks a hero, add the Coin to your hand."
  },
  {
    "id": "AT_032",
    "_info": "(3) 4/3 [ROGUE]: Shady Dealer",
    "text": "<b>Battlecry:</b> If you have a Pirate, gain +1/+1."
  },
  {
    "id": "AT_032e",
    "_info": "ENCHANTMENT [*ROGUE]: Shady Deals",
    "text": "+1/+1."
  },
  {
    "id": "AT_033",
    "_info": "(3) SPELL [ROGUE]: Burgle",
    "text": "Add 2 random class cards to your hand <i>(from your opponent's class)</i>."
  },
  {
    "id": "AT_034",
    "_info": "(4) 1/3 WEAPON [ROGUE]: Poisoned Blade",
    "text": "Your Hero Power gives this weapon +1 Attack instead of replacing it."
  },
  {
    "id": "AT_034e",
    "_info": "ENCHANTMENT [*ROGUE]: Laced",
    "text": "Increased Attack."
  },
  {
    "id": "AT_035",
    "_info": "(3) SPELL [ROGUE]: Beneath the Grounds",
    "text": "Shuffle 3 Ambushes into your opponent's deck. When drawn, you summon a 4/4 Nerubian."
  },
  {
    "id": "AT_035t",
    "_info": "(0) SPELL [*ROGUE]: Ambush!",
    "text": "When you draw this, summon a 4/4 Nerubian for your opponent. Draw a card."
  },
  {
    "id": "AT_036",
    "_info": "(9) 8/4 [ROGUE]: Anub'arak",
    "text": "<b>Deathrattle:</b> Return this to your hand and summon a 4/4 Nerubian."
  },
  {
    "id": "AT_036t",
    "_info": "(4) 4/4 [*ROGUE]: Nerubian"
  },
  {
    "id": "AT_037",
    "_info": "(1) SPELL [DRUID]: Living Roots",
    "text": "<b>Choose One -</b> Deal $2 damage; or Summon two 1/1 Saplings."
  },
  {
    "id": "AT_037a",
    "_info": "(0) SPELL [*DRUID]: Living Roots",
    "text": "Deal $2 damage.",
    play ({$}) {
      $('character').dealDamageSpell(2);
    }
  },
  {
    "id": "AT_037b",
    "_info": "(0) SPELL [*DRUID]: Living Roots",
    "text": "Summon two 1/1 Saplings."
  },
  {
    "id": "AT_037t",
    "_info": "(1) 1/1 [*DRUID]: Sapling"
  },
  {
    "id": "AT_038",
    "_info": "(2) 2/3 [DRUID]: Darnassus Aspirant",
    "text": "<b>Battlecry:</b> Gain an empty Mana Crystal.\n<b>Deathrattle:</b> Lose a Mana Crystal."
  },
  {
    "id": "AT_039",
    "_info": "(4) 5/4 [DRUID]: Savage Combatant |BEAST",
    "text": "<b>Inspire:</b> Give your hero\n+2 Attack this turn."
  },
  {
    "id": "AT_039e",
    "_info": "ENCHANTMENT [*DRUID]: Savage",
    "text": "+2 Attack this turn."
  },
  {
    "id": "AT_040",
    "_info": "(4) 4/4 [DRUID]: Wildwalker",
    "text": "<b>Battlecry:</b> Give a friendly Beast +3 Health."
  },
  {
    "id": "AT_040e",
    "_info": "ENCHANTMENT [*DRUID]: Kindred Spirit",
    "text": "+3 Health."
  },
  {
    "id": "AT_041",
    "_info": "(7) 6/6 [DRUID]: Knight of the Wild",
    "text": "Whenever you summon a Beast, reduce the Cost of this card by (1)."
  },
  {
    "id": "AT_041e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Call of the Wild",
    "text": "Cost reduced."
  },
  {
    "id": "AT_042",
    "_info": "(2) 2/1 [DRUID]: Druid of the Saber",
    "text": "[x]<b>Choose One -</b> Transform\ninto a 2/1 with <b>Charge</b>;\nor a 3/2 with <b>Stealth</b>."
  },
  {
    "id": "AT_042a",
    "_info": "(0) SPELL [*DRUID]: Lion Form",
    "text": "<b>Charge</b>"
  },
  {
    "id": "AT_042b",
    "_info": "(0) SPELL [*DRUID]: Panther Form",
    "text": "+1/+1 and <b>Stealth</b>"
  },
  {
    "id": "AT_042t",
    "_info": "(2) 2/1 [*DRUID]: Sabertooth Lion |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "AT_042t2",
    "_info": "(2) 3/2 [*DRUID]: Sabertooth Panther |BEAST",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "AT_043",
    "_info": "(4) SPELL [DRUID]: Astral Communion",
    "text": "Gain 10 Mana Crystals. Discard your hand."
  },
  {
    "id": "AT_044",
    "_info": "(3) SPELL [DRUID]: Mulch",
    "text": "Destroy a minion.\nAdd a random minion to your opponent's hand."
  },
  {
    "id": "AT_045",
    "_info": "(9) 5/5 [DRUID]: Aviana",
    "text": "Your minions cost (1)."
  },
  {
    "id": "AT_045e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Empowering Mist",
    "text": "+1/+1."
  },
  {
    "id": "AT_045ee",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mistcaller Deck Ench"
  },
  {
    "id": "AT_046",
    "_info": "(3) 3/2 [SHAMAN]: Tuskarr Totemic",
    "text": "<b>Battlecry:</b> Summon a random basic Totem."
  },
  {
    "id": "AT_047",
    "_info": "(4) 4/4 [SHAMAN]: Draenei Totemcarver",
    "text": "<b>Battlecry:</b> Gain +1/+1 for each friendly Totem."
  },
  {
    "id": "AT_047e",
    "_info": "ENCHANTMENT [*SHAMAN]: Experienced",
    "text": "Increased stats."
  },
  {
    "id": "AT_048",
    "_info": "(3) SPELL [SHAMAN]: Healing Wave",
    "text": "Restore #7 Health. Reveal a minion in each deck. If yours costs more, Restore #14 instead."
  },
  {
    "id": "AT_049",
    "_info": "(5) 3/6 [SHAMAN]: Thunder Bluff Valiant",
    "text": "<b>Inspire:</b> Give your Totems +2 Attack."
  },
  {
    "id": "AT_049e",
    "_info": "ENCHANTMENT [*SHAMAN]: Power of the Bluff",
    "text": "Increased Attack."
  },
  {
    "id": "AT_050",
    "_info": "(4) 2/4 WEAPON [SHAMAN]: Charged Hammer",
    "text": "<b>Deathrattle:</b> Your Hero Power becomes 'Deal 2 damage.'"
  },
  {
    "id": "AT_050t",
    "_info": "(2) HERO_POWER [*SHAMAN]: Lightning Jolt",
    "text": "<b>Hero Power</b>\nDeal $2 damage."
  },
  {
    "id": "AT_051",
    "_info": "(3) SPELL [SHAMAN]: Elemental Destruction",
    "text": "Deal $4-$5 damage to all minions. <b>Overload:</b> (5)."
  },
  {
    "id": "AT_052",
    "_info": "(2) 3/4 [SHAMAN]: Totem Golem |TOTEM",
    "text": "<b>Overload:</b> (1)"
  },
  {
    "id": "AT_053",
    "_info": "(2) SPELL [SHAMAN]: Ancestral Knowledge",
    "text": "Draw 2 cards. <b>Overload:</b> (2)"
  },
  {
    "id": "AT_054",
    "_info": "(6) 4/4 [SHAMAN]: The Mistcaller",
    "text": "<b>Battlecry:</b> Give all minions in your hand and deck +1/+1."
  },
  {
    "id": "AT_055",
    "_info": "(1) SPELL [PRIEST]: Flash Heal",
    "text": "Restore #5 Health."
  },
  {
    "id": "AT_056",
    "_info": "(3) SPELL [HUNTER]: Powershot",
    "text": "Deal $2 damage to a minion and the minions next to it."
  },
  {
    "id": "AT_057",
    "_info": "(3) 4/2 [HUNTER]: Stablemaster",
    "text": "<b>Battlecry:</b> Give a friendly Beast <b>Immune</b> this turn."
  },
  {
    "id": "AT_057o",
    "_info": "ENCHANTMENT [*HUNTER]: Groomed",
    "text": "<b>Immune</b> this turn."
  },
  {
    "id": "AT_058",
    "_info": "(2) 3/2 [HUNTER]: King's Elekk |BEAST",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, draw it."
  },
  {
    "id": "AT_059",
    "_info": "(1) 2/1 [HUNTER]: Brave Archer",
    "text": "<b>Inspire:</b> If your hand is empty, deal 2 damage to the enemy hero."
  },
  {
    "id": "AT_060",
    "_info": "(2) SPELL [HUNTER]: Bear Trap",
    "text": "<b>Secret:</b> After your hero is attacked, summon a 3/3 Bear with <b>Taunt</b>."
  },
  {
    "id": "AT_061",
    "_info": "(2) SPELL [HUNTER]: Lock and Load",
    "text": "Each time you cast a spell this turn, add a random Hunter card to your hand."
  },
  {
    "id": "AT_061e",
    "_info": "ENCHANTMENT [*HUNTER]: Lock and Load"
  },
  {
    "id": "AT_062",
    "_info": "(6) SPELL [HUNTER]: Ball of Spiders",
    "text": "Summon three 1/1 Webspinners."
  },
  {
    "id": "AT_063",
    "_info": "(7) 4/2 [HUNTER]: Acidmaw |BEAST",
    "text": "Whenever another minion takes damage, destroy it."
  },
  {
    "id": "AT_063t",
    "_info": "(3) 4/2 [HUNTER]: Dreadscale |BEAST",
    "text": "At the end of your turn, deal 1 damage to all other minions."
  },
  {
    "id": "AT_064",
    "_info": "(3) SPELL [WARRIOR]: Bash",
    "text": "Deal $3 damage.\nGain 3 Armor."
  },
  {
    "id": "AT_065",
    "_info": "(3) 3/2 WEAPON [WARRIOR]: King's Defender",
    "text": "<b>Battlecry:</b> If you have a minion with <b>Taunt</b>,  gain +1 Durability."
  },
  {
    "id": "AT_065e",
    "_info": "ENCHANTMENT [*NEUTRAL]: King's Defender",
    "text": "+1 Durability."
  },
  {
    "id": "AT_066",
    "_info": "(3) 3/3 [WARRIOR]: Orgrimmar Aspirant",
    "text": "<b>Inspire:</b> Give your weapon +1 Attack."
  },
  {
    "id": "AT_066e",
    "_info": "ENCHANTMENT [*WARRIOR]: Forges of Orgrimmar",
    "text": "Increased Attack."
  },
  {
    "id": "AT_067",
    "_info": "(4) 5/3 [WARRIOR]: Magnataur Alpha",
    "text": "Also damages the minions next to whomever\nhe attacks."
  },
  {
    "id": "AT_068",
    "_info": "(2) SPELL [WARRIOR]: Bolster",
    "text": "Give your <b>Taunt</b> minions +2/+2."
  },
  {
    "id": "AT_068e",
    "_info": "ENCHANTMENT [*WARRIOR]: Bolstered",
    "text": "+2/+2."
  },
  {
    "id": "AT_069",
    "_info": "(2) 3/2 [WARRIOR]: Sparring Partner",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Give a\nminion <b>Taunt</b>."
  },
  {
    "id": "AT_069e",
    "_info": "ENCHANTMENT [*WARRIOR]: Training Complete",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "AT_070",
    "_info": "(7) 4/6 [NEUTRAL]: Skycap'n Kragg |PIRATE",
    "text": "<b>Charrrrrge</b>\nCosts (1) less for each friendly Pirate."
  },
  {
    "id": "AT_071",
    "_info": "(2) 2/3 [WARRIOR]: Alexstrasza's Champion",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, gain +1 Attack and <b>Charge</b>."
  },
  {
    "id": "AT_071e",
    "_info": "ENCHANTMENT [*WARRIOR]: Alexstrasza's Boon",
    "text": "+1 Attack and <b>Charge</b>."
  },
  {
    "id": "AT_072",
    "_info": "(10) 7/7 [WARRIOR]: Varian Wrynn",
    "text": "<b>Battlecry:</b> Draw 3 cards.\nPut any minions you drew directly into the battlefield."
  },
  {
    "id": "AT_073",
    "_info": "(1) SPELL [PALADIN]: Competitive Spirit",
    "text": "<b>Secret:</b> When your turn starts, give your minions +1/+1."
  },
  {
    "id": "AT_073e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Competitive Spirit",
    "text": "+1/+1."
  },
  {
    "id": "AT_074",
    "_info": "(3) SPELL [PALADIN]: Seal of Champions",
    "text": "Give a minion\n+3 Attack and <b>Divine Shield</b>."
  },
  {
    "id": "AT_074e2",
    "_info": "ENCHANTMENT [*PALADIN]: Seal of Champions",
    "text": "+3 Attack and <b>Divine Shield</b>."
  },
  {
    "id": "AT_075",
    "_info": "(3) 2/4 [PALADIN]: Warhorse Trainer",
    "text": "Your Silver Hand Recruits have +1 Attack."
  },
  {
    "id": "AT_075e",
    "_info": "ENCHANTMENT [*PALADIN]: Might of the Hostler",
    "text": "Warhorse Trainer is granting this minion +1 Attack."
  },
  {
    "id": "AT_076",
    "_info": "(4) 3/4 [PALADIN]: Murloc Knight |MURLOC",
    "text": "<b>Inspire:</b> Summon a random Murloc."
  },
  {
    "id": "AT_077",
    "_info": "(2) 2/2 WEAPON [PALADIN]: Argent Lance",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, +1 Durability."
  },
  {
    "id": "AT_077e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Extra Poke",
    "text": "+1 Durability."
  },
  {
    "id": "AT_078",
    "_info": "(6) SPELL [PALADIN]: Enter the Coliseum",
    "text": "Destroy all minions except each player's highest Attack minion.",
    xxx: 'test this',
    play ({$}) {
      [
        $('enemy minion'),
        $('own minion')
      ].forEach(minions => {
        if (minions.length < 2) return;
        let strongest = minions.reduce((a,v,i) => v.attack > a.attack ? {i, attack: v.attack} : a);
        minions.splice(strongest.i, 1).destroy();
      });
    }
  },
  {
    "id": "AT_079",
    "_info": "(6) 6/6 [PALADIN]: Mysterious Challenger",
    "text": "<b>Battlecry:</b> Put one of each <b>Secret</b> from your deck into the battlefield."
  },
  {
    "id": "AT_080",
    "_info": "(2) 2/3 [NEUTRAL]: Garrison Commander",
    "text": "You can use your Hero Power twice a turn."
  },
  {
    "id": "AT_081",
    "_info": "(7) 3/7 [PALADIN]: Eadric the Pure",
    "text": "<b>Battlecry:</b> Change all enemy minions'\nAttack to 1."
  },
  {
    "id": "AT_081e",
    "_info": "ENCHANTMENT [*PALADIN]: Purified",
    "text": "Attack changed to 1."
  },
  {
    "id": "AT_082",
    "_info": "(1) 1/2 [NEUTRAL]: Lowly Squire",
    "text": "<b>Inspire:</b> Gain +1 Attack."
  },
  {
    "id": "AT_082e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Training",
    "text": "Increased Attack."
  },
  {
    "id": "AT_083",
    "_info": "(3) 3/3 [NEUTRAL]: Dragonhawk Rider",
    "text": "<b>Inspire:</b> Gain <b>Windfury</b>\nthis turn."
  },
  {
    "id": "AT_083e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dragonhawkery",
    "text": "<b>Windfury</b> this turn."
  },
  {
    "id": "AT_084",
    "_info": "(2) 1/2 [NEUTRAL]: Lance Carrier",
    "text": "<b>Battlecry:</b> Give a friendly minion +2 Attack."
  },
  {
    "id": "AT_084e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Equipped",
    "text": "+2 Attack."
  },
  {
    "id": "AT_085",
    "_info": "(4) 2/6 [NEUTRAL]: Maiden of the Lake",
    "text": "Your Hero Power costs (1)."
  },
  {
    "id": "AT_086",
    "_info": "(3) 4/3 [NEUTRAL]: Saboteur",
    "text": "<b>Battlecry:</b> Your opponent's Hero Power costs (5) more next turn."
  },
  {
    "id": "AT_086e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Villainy",
    "text": "Your Hero Power costs (5) more this turn."
  },
  {
    "id": "AT_087",
    "_info": "(3) 2/1 [NEUTRAL]: Argent Horserider",
    "text": "<b>Charge</b>\n<b>Divine Shield</b>",
    tags: [TAGS.charge, TAGS.divineShield]
  },
  {
    "id": "AT_088",
    "_info": "(6) 8/5 [NEUTRAL]: Mogor's Champion",
    "text": "50% chance to attack the wrong enemy."
  },
  {
    "id": "AT_089",
    "_info": "(2) 3/2 [NEUTRAL]: Boneguard Lieutenant",
    "text": "<b>Inspire:</b> Gain +1 Health."
  },
  {
    "id": "AT_089e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Boneguarded",
    "text": "Increased Health."
  },
  {
    "id": "AT_090",
    "_info": "(5) 4/3 [NEUTRAL]: Mukla's Champion |BEAST",
    "text": "<b>Inspire:</b> Give your other minions +1/+1."
  },
  {
    "id": "AT_090e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Might of the Monkey",
    "text": "+1/+1."
  },
  {
    "id": "AT_091",
    "_info": "(4) 1/8 [NEUTRAL]: Tournament Medic",
    "text": "<b>Inspire:</b> Restore 2 Health to your hero."
  },
  {
    "id": "AT_092",
    "_info": "(3) 5/2 [NEUTRAL]: Ice Rager |ELEMENTAL"
  },
  {
    "id": "AT_093",
    "_info": "(4) 2/6 [NEUTRAL]: Frigid Snobold",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "AT_094",
    "_info": "(2) 2/3 [NEUTRAL]: Flame Juggler",
    "text": "<b>Battlecry:</b> Deal 1 damage to a random enemy.",
    play ({$}) {
      $('enemy character').getRandom().dealDamage(1);
    }
  },
  {
    "id": "AT_095",
    "_info": "(3) 2/2 [NEUTRAL]: Silent Knight",
    "text": "<b>Stealth</b>\n<b>Divine Shield</b>",
    tags: [TAGS.stealth, TAGS.divineShield]
  },
  {
    "id": "AT_096",
    "_info": "(5) 5/5 [NEUTRAL]: Clockwork Knight |MECHANICAL",
    "text": "<b>Battlecry:</b> Give a friendly Mech +1/+1."
  },
  {
    "id": "AT_096e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Wound Up",
    "text": "+1/+1."
  },
  {
    "id": "AT_097",
    "_info": "(1) 2/1 [NEUTRAL]: Tournament Attendee",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "AT_098",
    "_info": "(6) 6/5 [NEUTRAL]: Sideshow Spelleater",
    "text": "<b>Battlecry:</b> Copy your opponent's Hero Power."
  },
  {
    "id": "AT_099",
    "_info": "(6) 3/5 [NEUTRAL]: Kodorider",
    "text": "<b>Inspire:</b> Summon a 3/5 War Kodo."
  },
  {
    "id": "AT_099t",
    "_info": "(5) 3/5 [*NEUTRAL]: War Kodo |BEAST"
  },
  {
    "id": "AT_100",
    "_info": "(3) 3/3 [NEUTRAL]: Silver Hand Regent",
    "text": "<b>Inspire:</b> Summon a 1/1 Silver Hand Recruit."
  },
  {
    "id": "AT_101",
    "_info": "(5) 5/6 [NEUTRAL]: Pit Fighter"
  },
  {
    "id": "AT_102",
    "_info": "(7) 5/9 [NEUTRAL]: Captured Jormungar |BEAST"
  },
  {
    "id": "AT_103",
    "_info": "(9) 9/7 [NEUTRAL]: North Sea Kraken",
    "text": "<b>Battlecry:</b> Deal 4 damage.",
    target: 'character',
    play ({$}) {
      target.dealDamage(4);
    }
  },
  {
    "id": "AT_104",
    "_info": "(5) 5/5 [PALADIN]: Tuskarr Jouster",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, restore 7 Health to your hero."
  },
  {
    "id": "AT_105",
    "_info": "(1) 2/4 [NEUTRAL]: Injured Kvaldir",
    "text": "<b>Battlecry:</b> Deal 3 damage to this minion.",
    play ({self}) {
      self.dealDamage(3);
    }
  },
  {
    "id": "AT_106",
    "_info": "(3) 4/3 [NEUTRAL]: Light's Champion",
    "text": "<b>Battlecry:</b> <b>Silence</b> a Demon."
  },
  {
    "id": "AT_108",
    "_info": "(4) 5/3 [NEUTRAL]: Armored Warhorse |BEAST",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, gain <b>Charge</b>."
  },
  {
    "id": "AT_109",
    "_info": "(2) 2/4 [NEUTRAL]: Argent Watchman",
    "text": "Can't attack.\n<b>Inspire:</b> Can attack as normal this turn."
  },
  {
    "id": "AT_109e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Inspired",
    "text": "Can attack this turn."
  },
  {
    "id": "AT_110",
    "_info": "(3) 2/5 [NEUTRAL]: Coliseum Manager",
    "text": "<b>Inspire:</b> Return this minion to your hand."
  },
  {
    "id": "AT_111",
    "_info": "(4) 3/5 [NEUTRAL]: Refreshment Vendor",
    "text": "<b>Battlecry:</b> Restore 4 Health to each hero."
  },
  {
    "id": "AT_112",
    "_info": "(6) 5/6 [NEUTRAL]: Master Jouster",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, gain <b>Taunt</b> and <b>Divine Shield</b>."
  },
  {
    "id": "AT_113",
    "_info": "(5) 5/4 [NEUTRAL]: Recruiter",
    "text": "<b>Inspire:</b> Add a 2/2 Squire to your hand."
  },
  {
    "id": "AT_114",
    "_info": "(4) 5/4 [NEUTRAL]: Evil Heckler",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "AT_115",
    "_info": "(3) 2/2 [NEUTRAL]: Fencing Coach",
    "text": "<b>Battlecry:</b> The next time you use your Hero Power, it costs (2) less."
  },
  {
    "id": "AT_115e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Fencing Practice",
    "text": "Your Hero Power costs (2) less."
  },
  {
    "id": "AT_116",
    "_info": "(2) 1/4 [PRIEST]: Wyrmrest Agent",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, gain +1 Attack and <b>Taunt</b>."
  },
  {
    "id": "AT_116e",
    "_info": "ENCHANTMENT [*PRIEST]: Bring it on!",
    "text": "+1 Attack and <b>Taunt</b>."
  },
  {
    "id": "AT_117",
    "_info": "(3) 4/2 [NEUTRAL]: Master of Ceremonies",
    "text": "<b>Battlecry:</b> If you have a minion with <b>Spell Damage</b>, gain +2/+2."
  },
  {
    "id": "AT_117e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Ceremony",
    "text": "+2/+2."
  },
  {
    "id": "AT_118",
    "_info": "(6) 5/5 [NEUTRAL]: Grand Crusader",
    "text": "<b>Battlecry:</b> Add a random Paladin card to your hand."
  },
  {
    "id": "AT_119",
    "_info": "(5) 4/4 [NEUTRAL]: Kvaldir Raider",
    "text": "<b>Inspire:</b> Gain +2/+2."
  },
  {
    "id": "AT_119e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Inspired",
    "text": "Increased stats."
  },
  {
    "id": "AT_120",
    "_info": "(10) 8/8 [NEUTRAL]: Frost Giant",
    "text": "Costs (1) less for each time you used your Hero Power this game."
  },
  {
    "id": "AT_121",
    "_info": "(4) 4/4 [NEUTRAL]: Crowd Favorite",
    "text": "Whenever you play a card with <b>Battlecry</b>, gain +1/+1."
  },
  {
    "id": "AT_121e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Huge Ego",
    "text": "Increased stats."
  },
  {
    "id": "AT_122",
    "_info": "(4) 4/4 [NEUTRAL]: Gormok the Impaler",
    "text": "<b>Battlecry:</b> If you have at least 4 other minions, deal 4 damage."
  },
  {
    "id": "AT_123",
    "_info": "(7) 6/6 [NEUTRAL]: Chillmaw |DRAGON",
    "text": "[x]<b>Taunt</b>\n<b>Deathrattle:</b> If you're holding\na Dragon, deal 3 damage\nto all minions."
  },
  {
    "id": "AT_124",
    "_info": "(6) 3/9 [NEUTRAL]: Bolf Ramshield",
    "text": "Whenever your hero takes damage, this minion takes it instead."
  },
  {
    "id": "AT_125",
    "_info": "(9) 10/10 [NEUTRAL]: Icehowl",
    "text": "<b>Charge</b>\nCan't attack heroes."
  },
  {
    "id": "AT_127",
    "_info": "(5) 4/5 [NEUTRAL]: Nexus-Champion Saraad",
    "text": "<b>Inspire:</b> Add a random spell to your hand."
  },
  {
    "id": "AT_128",
    "_info": "(6) 7/4 [NEUTRAL]: The Skeleton Knight",
    "text": "<b>Deathrattle:</b> Reveal a minion in each deck. If yours costs more, return this to your hand."
  },
  {
    "id": "AT_129",
    "_info": "(3) 3/4 [NEUTRAL]: Fjola Lightbane",
    "text": "Whenever <b>you</b> target this minion with a spell, gain <b>Divine Shield.</b>"
  },
  {
    "id": "AT_130",
    "_info": "(6) 6/7 [WARRIOR]: Sea Reaver",
    "text": "When you draw this, deal 1 damage to your minions."
  },
  {
    "id": "AT_131",
    "_info": "(3) 3/4 [NEUTRAL]: Eydis Darkbane",
    "text": "Whenever <b>you</b> target this minion with a spell, deal 3 damage to a random enemy."
  },
  {
    "id": "AT_132",
    "_info": "(6) 6/3 [NEUTRAL]: Justicar Trueheart",
    "text": "<b>Battlecry:</b> Replace your starting Hero Power with a better one."
  },
  {
    "id": "AT_132_DRUID",
    "_info": "(2) HERO_POWER [*DRUID]: Dire Shapeshift",
    "text": "<b>Hero Power</b>\nGain 2 Armor and +2 Attack this turn."
  },
  {
    "id": "AT_132_DRUIDe",
    "_info": "ENCHANTMENT [*DRUID]: Dire Claws",
    "text": "+2 Attack this turn."
  },
  {
    "id": "AT_132_HUNTER",
    "_info": "(2) HERO_POWER [*HUNTER]: Ballista Shot",
    "text": "<b>Hero Power</b>\nDeal $3 damage to the enemy hero."
  },
  {
    "id": "AT_132_MAGE",
    "_info": "(2) HERO_POWER [*MAGE]: Fireblast Rank 2",
    "text": "<b>Hero Power</b>\nDeal $2 damage."
  },
  {
    "id": "AT_132_PALADIN",
    "_info": "(2) HERO_POWER [*PALADIN]: The Silver Hand",
    "text": "<b>Hero Power</b>\nSummon two 1/1 Recruits."
  },
  {
    "id": "AT_132_PRIEST",
    "_info": "(2) HERO_POWER [*PRIEST]: Heal",
    "text": "<b>Hero Power</b>\nRestore #4 Health."
  },
  {
    "id": "AT_132_ROGUE",
    "_info": "(2) HERO_POWER [*ROGUE]: Poisoned Daggers",
    "text": "<b>Hero Power</b>\nEquip a 2/2 Weapon."
  },
  {
    "id": "AT_132_ROGUE_H1",
    "_info": "(2) HERO_POWER [*ROGUE]: Poisoned Daggers",
    "text": "<b>Hero Power</b>\nEquip a 2/2 Weapon."
  },
  {
    "id": "AT_132_ROGUEt",
    "_info": "(1) 2/2 WEAPON [*ROGUE]: Poisoned Dagger"
  },
  {
    "id": "AT_132_ROGUEt_H1",
    "_info": "(1) 2/2 WEAPON [*ROGUE]: Poisoned Dagger"
  },
  {
    "id": "AT_132_SHAMAN",
    "_info": "(2) HERO_POWER [*SHAMAN]: Totemic Slam",
    "text": "<b>Hero Power</b>\nSummon a Totem of your choice."
  },
  {
    "id": "AT_132_SHAMANa",
    "_info": "(0) 0/2 [*SHAMAN]: Healing Totem",
    "text": "At the end of your turn, restore 1 Health to all friendly minions."
  },
  {
    "id": "AT_132_SHAMANb",
    "_info": "(0) 1/1 [*SHAMAN]: Searing Totem"
  },
  {
    "id": "AT_132_SHAMANc",
    "_info": "(0) 0/2 [*SHAMAN]: Stoneclaw Totem",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "AT_132_SHAMANd",
    "_info": "(0) 0/2 [*SHAMAN]: Wrath of Air Totem",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "AT_132_WARLOCK",
    "_info": "(2) HERO_POWER [*WARLOCK]: Soul Tap",
    "text": "<b>Hero Power</b>\nDraw a card."
  },
  {
    "id": "AT_132_WARRIOR",
    "_info": "(2) HERO_POWER [*WARRIOR]: Tank Up!",
    "text": "<b>Hero Power</b>\nGain 4 Armor."
  },
  {
    "id": "AT_133",
    "_info": "(1) 1/2 [NEUTRAL]: Gadgetzan Jouster",
    "text": "<b>Battlecry:</b> Reveal a minion in each deck. If yours costs more, gain +1/+1."
  },
  {
    "id": "AT_133e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Victory!",
    "text": "+1/+1."
  },
  {
    "id": "BRM_001",
    "_info": "(5) SPELL [PALADIN]: Solemn Vigil",
    "text": "Draw 2 cards. Costs (1) less for each minion that died this turn."
  },
  {
    "id": "BRM_001e",
    "_info": "ENCHANTMENT [*PRIEST]: Melt",
    "text": "Attack changed to 0 this turn."
  },
  {
    "id": "BRM_002",
    "_info": "(3) 2/4 [MAGE]: Flamewaker",
    "text": "After you cast a spell, deal 2 damage randomly split among all enemies."
  },
  {
    "id": "BRM_003",
    "_info": "(5) SPELL [MAGE]: Dragon's Breath",
    "text": "Deal $4 damage. Costs (1) less for each minion that died this turn."
  },
  {
    "id": "BRM_003e",
    "_info": "ENCHANTMENT [*MAGE]: Dragon's Might",
    "text": "Costs (3) less this turn."
  },
  {
    "id": "BRM_004",
    "_info": "(1) 2/1 [PRIEST]: Twilight Whelp |DRAGON",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, gain +2 Health."
  },
  {
    "id": "BRM_004e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Twilight Endurance",
    "text": "Increased Health."
  },
  {
    "id": "BRM_004t",
    "_info": "(1) 1/1 [*NEUTRAL]: Whelp"
  },
  {
    "id": "BRM_005",
    "_info": "(3) SPELL [WARLOCK]: Demonwrath",
    "text": "[x]Deal $2 damage to all\nminions except Demons."
  },
  {
    "id": "BRM_006",
    "_info": "(3) 2/4 [WARLOCK]: Imp Gang Boss |DEMON",
    "text": "Whenever this minion takes damage, summon a 1/1 Imp.",
    xxx: 'summon ..',
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.character_damaged,
        condition: 'self',
        action: ({summon}) => summon('BRM_006t')         
      }
    ]
  },
  {
    "id": "BRM_006t",
    "_info": "(1) 1/1 [*WARLOCK]: Imp |DEMON"
  },
  {
    "id": "BRM_007",
    "_info": "(2) SPELL [ROGUE]: Gang Up",
    "text": "Choose a minion. Shuffle 3 copies of it into your deck."
  },
  {
    "id": "BRM_008",
    "_info": "(5) 4/3 [ROGUE]: Dark Iron Skulker",
    "text": "<b>Battlecry:</b> Deal 2 damage to all undamaged enemy minions."
  },
  {
    "id": "BRM_009",
    "_info": "(9) 7/8 [DRUID]: Volcanic Lumberer",
    "text": "<b>Taunt</b>\nCosts (1) less for each minion that died this turn."
  },
  {
    "id": "BRM_010",
    "_info": "(3) 2/2 [DRUID]: Druid of the Flame",
    "text": "<b>Choose One -</b> Transform into a 5/2 minion; or a 2/5 minion."
  },
  {
    "id": "BRM_010a",
    "_info": "(0) SPELL [*DRUID]: Firecat Form",
    "text": "Transform into a 5/2 minion."
  },
  {
    "id": "BRM_010b",
    "_info": "(0) SPELL [*DRUID]: Fire Hawk Form",
    "text": "Transform into a 2/5 minion."
  },
  {
    "id": "BRM_010t",
    "_info": "(3) 5/2 [*DRUID]: Druid of the Flame |BEAST"
  },
  {
    "id": "BRM_010t2",
    "_info": "(3) 2/5 [*DRUID]: Druid of the Flame |BEAST"
  },
  {
    "id": "BRM_011",
    "_info": "(2) SPELL [SHAMAN]: Lava Shock",
    "text": "Deal $2 damage.\nUnlock your <b>Overloaded</b> Mana Crystals."
  },
  {
    "id": "BRM_011t",
    "_info": "ENCHANTMENT [*SHAMAN]: Lava Shock",
    "text": "Cards you play this turn don't cause <b>Overload</b>."
  },
  {
    "id": "BRM_012",
    "_info": "(4) 3/6 [SHAMAN]: Fireguard Destroyer |ELEMENTAL",
    "text": "<b>Battlecry:</b> Gain 1-4 Attack. <b>Overload:</b> (1)"
  },
  {
    "id": "BRM_012e",
    "_info": "ENCHANTMENT [*NEUTRAL]: On Fire!",
    "text": "Increased Attack."
  },
  {
    "id": "BRM_013",
    "_info": "(2) SPELL [HUNTER]: Quick Shot",
    "text": "Deal $3 damage.\nIf your hand is empty, draw a card."
  },
  {
    "id": "BRM_014",
    "_info": "(4) 4/4 [HUNTER]: Core Rager |BEAST",
    "text": "<b>Battlecry:</b> If your hand is empty, gain +3/+3."
  },
  {
    "id": "BRM_014e",
    "_info": "ENCHANTMENT [*HUNTER]: Power Rager",
    "text": "+3/+3"
  },
  {
    "id": "BRM_015",
    "_info": "(2) SPELL [WARRIOR]: Revenge",
    "text": "Deal $1 damage to all minions. If you have 12 or less Health, deal $3 damage instead."
  },
  {
    "id": "BRM_016",
    "_info": "(4) 2/5 [WARRIOR]: Axe Flinger",
    "text": "Whenever this minion takes damage, deal 2 damage to the enemy hero."
  },
  {
    "id": "BRM_017",
    "_info": "(2) SPELL [PRIEST]: Resurrect",
    "text": "Summon a random friendly minion that died this game."
  },
  {
    "id": "BRM_018",
    "_info": "(5) 5/5 [PALADIN]: Dragon Consort |DRAGON",
    "text": "<b>Battlecry:</b> The next Dragon you play costs (2) less."
  },
  {
    "id": "BRM_018e",
    "_info": "ENCHANTMENT [*PALADIN]: Unchained!",
    "text": "Your next Dragon costs (2) less."
  },
  {
    "id": "BRM_019",
    "_info": "(5) 3/3 [NEUTRAL]: Grim Patron",
    "text": "Whenever this minion survives damage, summon another Grim Patron.",
    xxx: 'just a SKECH',
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.character_damaged,
        //condition: ({target, self}) => target === self && !self.isMortallyWounded,
        condition: ({target, self}) => target === self && self.health > 0,
        action: ({summon}) => summon('BRM_019') // ~another self         
      }
    ]
  },
  {
    "id": "BRM_020",
    "_info": "(4) 3/5 [NEUTRAL]: Dragonkin Sorcerer |DRAGON",
    "text": "Whenever <b>you</b> target this minion with a spell, gain +1/+1."
  },
  {
    "id": "BRM_020e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Draconic Power",
    "text": "Increased stats."
  },
  {
    "id": "BRM_022",
    "_info": "(1) 0/2 [NEUTRAL]: Dragon Egg",
    "text": "Whenever this minion takes damage, summon a 2/1 Whelp."
  },
  {
    "id": "BRM_022t",
    "_info": "(1) 2/1 [*NEUTRAL]: Black Whelp |DRAGON"
  },
  {
    "id": "BRM_024",
    "_info": "(6) 6/6 [NEUTRAL]: Drakonid Crusher |DRAGON",
    "text": "<b>Battlecry:</b> If your opponent has 15 or less Health, gain +3/+3."
  },
  {
    "id": "BRM_024e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Large Talons",
    "text": "+3/+3."
  },
  {
    "id": "BRM_025",
    "_info": "(6) 6/4 [NEUTRAL]: Volcanic Drake |DRAGON",
    "text": "Costs (1) less for each minion that died this turn."
  },
  {
    "id": "BRM_026",
    "_info": "(4) 5/6 [NEUTRAL]: Hungry Dragon |DRAGON",
    "text": "<b>Battlecry:</b> Summon a random 1-Cost minion for your opponent."
  },
  {
    "id": "BRM_027",
    "_info": "(9) 9/7 [NEUTRAL]: Majordomo Executus",
    "text": "<b>Deathrattle:</b> Replace your hero with Ragnaros, the Firelord."
  },
  {
    "id": "BRM_027h",
    "_info": "0/8 HERO [*NEUTRAL]: Ragnaros the Firelord"
  },
  {
    "id": "BRM_027p",
    "_info": "(2) HERO_POWER [*NEUTRAL]: DIE, INSECT!",
    "text": "<b>Hero Power</b>\nDeal $8 damage to a random enemy."
  },
  {
    "id": "BRM_027pH",
    "_info": "(2) HERO_POWER [*NEUTRAL]: DIE, INSECTS!",
    "text": "<b>Hero Power</b>\nDeal $8 damage to a random enemy. TWICE."
  },
  {
    "id": "BRM_028",
    "_info": "(6) 5/5 [NEUTRAL]: Emperor Thaurissan",
    "text": "At the end of your turn, reduce the Cost of cards in your hand by (1)."
  },
  {
    "id": "BRM_028e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Imperial Favor",
    "text": "Costs (1) less."
  },
  {
    "id": "BRM_029",
    "_info": "(7) 8/4 [NEUTRAL]: Rend Blackhand",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, destroy a <b>Legendary</b> minion."
  },
  {
    "id": "BRM_030",
    "_info": "(9) 8/8 [NEUTRAL]: Nefarian |DRAGON",
    "text": "<b>Battlecry:</b> Add 2 random spells to your hand <i>(from your opponent's class)</i>."
  },
  {
    "id": "BRM_030t",
    "_info": "(4) SPELL [*NEUTRAL]: Tail Swipe",
    "text": "Deal $4 damage."
  },
  {
    "id": "BRM_031",
    "_info": "(8) 6/8 [NEUTRAL]: Chromaggus |DRAGON",
    "text": "Whenever you draw a card, put another copy into your hand."
  },
  {
    "id": "BRM_033",
    "_info": "(3) 2/4 [NEUTRAL]: Blackwing Technician",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, gain +1/+1."
  },
  {
    "id": "BRM_033e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dragon Blood",
    "text": "+1/+1"
  },
  {
    "id": "BRM_034",
    "_info": "(5) 5/4 [NEUTRAL]: Blackwing Corruptor",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, deal 3 damage."
  },
  {
    "id": "CFM_020",
    "_info": "(5) 5/5 [PRIEST]: Raza the Chained",
    "text": "[x]  <b>Battlecry:</b> If your deck has  \nno duplicates, your Hero\n Power costs (0) this game."
  },
  {
    "id": "CFM_020e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Raza Enchant",
    "text": "Your <b>Hero Power</b> costs (0)."
  },
  {
    "id": "CFM_021",
    "_info": "(0) SPELL [MAGE]: Freezing Potion",
    "text": "<b>Freeze</b> an enemy."
  },
  {
    "id": "CFM_025",
    "_info": "(6) 5/5 [NEUTRAL]: Wind-up Burglebot |MECHANICAL",
    "text": "Whenever this attacks a minion and survives, draw a card."
  },
  {
    "id": "CFM_026",
    "_info": "(2) SPELL [HUNTER]: Hidden Cache",
    "text": "<b>Secret:</b> After your opponent plays a minion, give a random minion in your hand +2/+2."
  },
  {
    "id": "CFM_026e",
    "_info": "ENCHANTMENT [*HUNTER]: Smuggling",
    "text": "+2/+2 from Hidden Cache."
  },
  {
    "id": "CFM_039",
    "_info": "(3) 0/7 [NEUTRAL]: Street Trickster |DEMON",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "CFM_060",
    "_info": "(5) 2/6 [NEUTRAL]: Red Mana Wyrm",
    "text": "Whenever  you cast a spell, gain +2 Attack."
  },
  {
    "id": "CFM_060e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mana Heist",
    "text": "Increased Attack."
  },
  {
    "id": "CFM_061",
    "_info": "(4) 3/6 [SHAMAN]: Jinyu Waterspeaker",
    "text": "[x]<b>Battlecry:</b> Restore 6 Health.\n<b>Overload:</b> (1)"
  },
  {
    "id": "CFM_062",
    "_info": "(7) 6/6 [PALADIN]: Grimestreet Protector",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Give adjacent\n minions <b>Divine Shield</b>."
  },
  {
    "id": "CFM_063",
    "_info": "(4) 4/4 [NEUTRAL]: Kooky Chemist",
    "text": "<b>Battlecry:</b> Swap the Attack and Health of a minion."
  },
  {
    "id": "CFM_063e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Kooky Chemistry",
    "text": "Attack and Health have been swapped by Kooky Chemist."
  },
  {
    "id": "CFM_064",
    "_info": "(3) 1/1 [NEUTRAL]: Blubber Baron",
    "text": "Whenever you summon a <b>Battlecry</b> minion while this is in your hand, gain +1/+1."
  },
  {
    "id": "CFM_064e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Size Increase",
    "text": "Increased stats."
  },
  {
    "id": "CFM_065",
    "_info": "(3) SPELL [MAGE]: Volcanic Potion",
    "text": "Deal $2 damage to all minions."
  },
  {
    "id": "CFM_066",
    "_info": "(1) 2/1 [MAGE]: Kabal Lackey",
    "text": "[x]<b>Battlecry:</b> The next <b>Secret</b>\nyou play this turn costs (0)."
  },
  {
    "id": "CFM_067",
    "_info": "(4) 2/6 [NEUTRAL]: Hozen Healer",
    "text": "<b>Battlecry</b>: Restore a minion to full Health."
  },
  {
    "id": "CFM_094",
    "_info": "(6) SPELL [WARLOCK]: Felfire Potion",
    "text": "Deal $5 damage to all characters."
  },
  {
    "id": "CFM_095",
    "_info": "(1) 1/1 [NEUTRAL]: Weasel Tunneler |BEAST",
    "text": "<b>Deathrattle:</b> Shuffle this minion into your opponent's deck."
  },
  {
    "id": "CFM_120",
    "_info": "(1) 2/2 [NEUTRAL]: Mistress of Mixtures",
    "text": "<b>Deathrattle:</b> Restore 4 Health to each hero."
  },
  {
    "id": "CFM_300",
    "_info": "(2) 0/7 [WARRIOR]: Public Defender",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "CFM_305",
    "_info": "(1) SPELL [PALADIN]: Smuggler's Run",
    "text": "Give all minions in your hand +1/+1."
  },
  {
    "id": "CFM_305e",
    "_info": "ENCHANTMENT [*PALADIN]: Smuggling",
    "text": "+1/+1 from Smuggler's Run."
  },
  {
    "id": "CFM_308",
    "_info": "(10) 7/7 [DRUID]: Kun the Forgotten King",
    "text": "<b>Choose One -</b> Gain 10 Armor; or Refresh your Mana Crystals."
  },
  {
    "id": "CFM_308a",
    "_info": "(0) SPELL [*DRUID]: Forgotten Armor",
    "text": "Gain 10 Armor."
  },
  {
    "id": "CFM_308b",
    "_info": "(0) SPELL [*DRUID]: Forgotten Mana",
    "text": "Refresh your Mana Crystals."
  },
  {
    "id": "CFM_310",
    "_info": "(4) SPELL [SHAMAN]: Call in the Finishers",
    "text": "Summon four 1/1 Murlocs."
  },
  {
    "id": "CFM_310t",
    "_info": "(1) 1/1 [*SHAMAN]: Murloc Razorgill |MURLOC"
  },
  {
    "id": "CFM_312",
    "_info": "(7) 5/5 [SHAMAN]: Jade Chieftain",
    "text": "<b>Battlecry:</b> Summon a{1} {0} <b>Jade Golem</b>. Give it <b>Taunt</b>."
  },
  {
    "id": "CFM_313",
    "_info": "(1) SPELL [SHAMAN]: Finders Keepers",
    "text": "<b>Discover</b> a card with <b>Overload</b>. <b>Overload:</b> (1)"
  },
  {
    "id": "CFM_315",
    "_info": "(1) 1/1 [HUNTER]: Alleycat |BEAST",
    "text": "<b>Battlecry:</b> Summon a 1/1 Cat."
  },
  {
    "id": "CFM_315t",
    "_info": "(1) 1/1 [*HUNTER]: Tabbycat |BEAST"
  },
  {
    "id": "CFM_316",
    "_info": "(3) 2/2 [HUNTER]: Rat Pack |BEAST",
    "text": "[x]<b>Deathrattle:</b> Summon a\nnumber of 1/1 Rats equal\n to this minion's Attack."
  },
  {
    "id": "CFM_316t",
    "_info": "(1) 1/1 [*HUNTER]: Rat |BEAST"
  },
  {
    "id": "CFM_321",
    "_info": "(2) 1/1 [NEUTRAL]: Grimestreet Informant",
    "text": "[x]<b>Battlecry:</b> <b>Discover</b> a\nHunter, Paladin, or Warrior\ncard."
  },
  {
    "id": "CFM_324",
    "_info": "(5) 5/5 [SHAMAN]: White Eyes",
    "text": "<b>Taunt</b>\n<b>Deathrattle:</b> Shuffle\n'The Storm Guardian' into your deck."
  },
  {
    "id": "CFM_324t",
    "_info": "(5) 10/10 [*SHAMAN]: The Storm Guardian",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "CFM_325",
    "_info": "(1) 1/1 [NEUTRAL]: Small-Time Buccaneer |PIRATE",
    "text": "Has +2 Attack while you have a weapon equipped."
  },
  {
    "id": "CFM_325e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Equipped",
    "text": "+2 Attack."
  },
  {
    "id": "CFM_328",
    "_info": "(6) 4/4 [NEUTRAL]: Fight Promoter",
    "text": "[x]<b>Battlecry:</b> If you control\na minion with 6 or more\n Health, draw two cards."
  },
  {
    "id": "CFM_333",
    "_info": "(5) 3/7 [HUNTER]: Knuckles |BEAST",
    "text": "After this attacks a\nminion, it also hits the enemy hero."
  },
  {
    "id": "CFM_334",
    "_info": "(1) SPELL [HUNTER]: Smuggler's Crate",
    "text": "Give a random Beast in your hand +2/+2."
  },
  {
    "id": "CFM_334e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+2/+2 from Smuggler's Crate."
  },
  {
    "id": "CFM_335",
    "_info": "(4) 2/4 [HUNTER]: Dispatch Kodo |BEAST",
    "text": "<b>Battlecry:</b> Deal damage equal to this minion's Attack."
  },
  {
    "id": "CFM_336",
    "_info": "(3) 3/3 [HUNTER]: Shaky Zipgunner",
    "text": "[x]<b>Deathrattle:</b> Give a random\nminion in your hand +2/+2."
  },
  {
    "id": "CFM_336e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+2/+2 from Shaky Zipgunner."
  },
  {
    "id": "CFM_337",
    "_info": "(5) 2/4 WEAPON [HUNTER]: Piranha Launcher",
    "text": "[x]After your hero attacks,\nsummon a 1/1 Piranha."
  },
  {
    "id": "CFM_337t",
    "_info": "(1) 1/1 [*HUNTER]: Piranha |BEAST"
  },
  {
    "id": "CFM_338",
    "_info": "(2) 3/2 [HUNTER]: Trogg Beastrager",
    "text": "<b>Battlecry:</b> Give a random Beast in your hand +1/+1."
  },
  {
    "id": "CFM_338e",
    "_info": "ENCHANTMENT [*HUNTER]: Smuggling",
    "text": "+1/+1 from Trogg Beastrager."
  },
  {
    "id": "CFM_341",
    "_info": "(3) 1/1 [NEUTRAL]: Sergeant Sally",
    "text": "<b>Deathrattle:</b> Deal damage equal to this minion's Attack to all enemy minions."
  },
  {
    "id": "CFM_342",
    "_info": "(6) 5/5 [ROGUE]: Luckydo Buccaneer |PIRATE",
    "text": "<b>Battlecry:</b> If your weapon has at least 3 Attack, gain +4/+4."
  },
  {
    "id": "CFM_342e",
    "_info": "ENCHANTMENT [*ROGUE]: Looted Blade",
    "text": "+4/+4."
  },
  {
    "id": "CFM_343",
    "_info": "(6) 3/6 [DRUID]: Jade Behemoth",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Summon a{1}\n{0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_344",
    "_info": "(5) 2/4 [NEUTRAL]: Finja, the Flying Star |MURLOC",
    "text": "[x]<b>Stealth</b>\n   Whenever this attacks and   \nkills a minion, summon 2\n Murlocs from your deck."
  },
  {
    "id": "CFM_602",
    "_info": "(1) SPELL [DRUID]: Jade Idol",
    "text": "<b>Choose One -</b> Summon a{1} {0} <b>Jade Golem</b>; or Shuffle 3 copies of this card into your deck."
  },
  {
    "id": "CFM_602a",
    "_info": "(0) SPELL [*DRUID]: Jade Idol",
    "text": "Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_602b",
    "_info": "(0) SPELL [*DRUID]: Jade Idol",
    "text": "Shuffle 3 Jade Idols into your deck."
  },
  {
    "id": "CFM_603",
    "_info": "(1) SPELL [PRIEST]: Potion of Madness",
    "text": "Gain control of an enemy minion with 2 or less Attack until end of turn."
  },
  {
    "id": "CFM_603e",
    "_info": "ENCHANTMENT [*PRIEST]: Madness Potion",
    "text": "This minion has switched controllers this turn."
  },
  {
    "id": "CFM_604",
    "_info": "(4) SPELL [PRIEST]: Greater Healing Potion",
    "text": "Restore #12 Health to a friendly character."
  },
  {
    "id": "CFM_605",
    "_info": "(5) 5/6 [PRIEST]: Drakonid Operative |DRAGON",
    "text": "[x]<b>Battlecry:</b> If you're holding a\nDragon, <b>Discover</b> a card in\n your opponent's deck."
  },
  {
    "id": "CFM_606",
    "_info": "(2) 2/3 [PRIEST]: Mana Geode",
    "text": "Whenever this minion is healed, summon a 2/2 Crystal."
  },
  {
    "id": "CFM_606t",
    "_info": "(2) 2/2 [*PRIEST]: Crystal"
  },
  {
    "id": "CFM_608",
    "_info": "(4) SPELL [WARLOCK]: Blastcrystal Potion",
    "text": "Destroy a minion and one of your Mana Crystals."
  },
  {
    "id": "CFM_609",
    "_info": "(3) 3/7 [NEUTRAL]: Fel Orc Soulfiend",
    "text": "At the start of your turn, deal 2 damage to this minion."
  },
  {
    "id": "CFM_610",
    "_info": "(4) 5/4 [WARLOCK]: Crystalweaver",
    "text": "<b>Battlecry:</b> Give your Demons +1/+1."
  },
  {
    "id": "CFM_610e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Serrated Shadows",
    "text": "+1/+1."
  },
  {
    "id": "CFM_611",
    "_info": "(3) SPELL [WARLOCK]: Bloodfury Potion",
    "text": "[x]Give a minion +3 Attack.\nIf it's a Demon, also\ngive it +3 Health."
  },
  {
    "id": "CFM_611e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Demonic Draught",
    "text": "+3 Attack."
  },
  {
    "id": "CFM_611e2",
    "_info": "ENCHANTMENT [*NEUTRAL]: Demonic Draught",
    "text": "+3/+3."
  },
  {
    "id": "CFM_614",
    "_info": "(1) SPELL [DRUID]: Mark of the Lotus",
    "text": "Give your minions +1/+1."
  },
  {
    "id": "CFM_614e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Savage Mark",
    "text": "+1/+1."
  },
  {
    "id": "CFM_616",
    "_info": "(3) SPELL [DRUID]: Pilfered Power",
    "text": "Gain an empty Mana Crystal for each friendly minion."
  },
  {
    "id": "CFM_617",
    "_info": "(3) 3/3 [DRUID]: Celestial Dreamer",
    "text": "[x]<b>Battlecry:</b> If you control a\nminion with 5 or more\nAttack, gain +2/+2."
  },
  {
    "id": "CFM_617e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Visions of Hypnos",
    "text": "+2/+2."
  },
  {
    "id": "CFM_619",
    "_info": "(4) 3/3 [NEUTRAL]: Kabal Chemist",
    "text": "<b>Battlecry:</b> Add a random Potion to your hand."
  },
  {
    "id": "CFM_620",
    "_info": "(3) SPELL [MAGE]: Potion of Polymorph",
    "text": "<b>Secret:</b> After your opponent plays a minion, transform it into a\n1/1 Sheep."
  },
  {
    "id": "CFM_621",
    "_info": "(4) 3/3 [NEUTRAL]: Kazakus",
    "text": "[x]<b>Battlecry:</b> If your deck\nhas no duplicates,\n create a custom spell."
  },
  {
    "id": "CFM_621_m2",
    "_info": "(5) 5/5 [*NEUTRAL]: Kabal Demon |DEMON"
  },
  {
    "id": "CFM_621_m3",
    "_info": "(8) 8/8 [*NEUTRAL]: Kabal Demon |DEMON"
  },
  {
    "id": "CFM_621_m4",
    "_info": "(2) 2/2 [*NEUTRAL]: Kabal Demon |DEMON"
  },
  {
    "id": "CFM_621_m5",
    "_info": "(1) 1/1 [*NEUTRAL]: Sheep |BEAST"
  },
  {
    "id": "CFM_621e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Goldthorn",
    "text": "+2 Health."
  },
  {
    "id": "CFM_621e2",
    "_info": "ENCHANTMENT [*NEUTRAL]: Goldthorn",
    "text": "+4 Health."
  },
  {
    "id": "CFM_621e3",
    "_info": "ENCHANTMENT [*NEUTRAL]: Goldthorn",
    "text": "+6 Health."
  },
  {
    "id": "CFM_621t",
    "_info": "(1) SPELL [*NEUTRAL]: Kazakus Potion",
    "text": "{0}\n{1}"
  },
  {
    "id": "CFM_621t10",
    "_info": "(1) SPELL [*NEUTRAL]: Netherbloom",
    "text": "Summon a 2/2 Demon."
  },
  {
    "id": "CFM_621t11",
    "_info": "(1) SPELL [*NEUTRAL]: Lesser Potion",
    "text": "Create a 1-Cost spell."
  },
  {
    "id": "CFM_621t12",
    "_info": "(5) SPELL [*NEUTRAL]: Greater Potion",
    "text": "Create a 5-Cost spell."
  },
  {
    "id": "CFM_621t13",
    "_info": "(10) SPELL [*NEUTRAL]: Superior Potion",
    "text": "Create a 10-Cost spell."
  },
  {
    "id": "CFM_621t14",
    "_info": "(5) SPELL [*NEUTRAL]: Kazakus Potion",
    "text": "{0}\n{1}"
  },
  {
    "id": "CFM_621t15",
    "_info": "(10) SPELL [*NEUTRAL]: Kazakus Potion",
    "text": "{0}\n{1}"
  },
  {
    "id": "CFM_621t16",
    "_info": "(5) SPELL [*NEUTRAL]: Heart of Fire",
    "text": "Deal $5 damage."
  },
  {
    "id": "CFM_621t17",
    "_info": "(5) SPELL [*NEUTRAL]: Stonescale Oil",
    "text": "Gain 7 Armor."
  },
  {
    "id": "CFM_621t18",
    "_info": "(5) SPELL [*NEUTRAL]: Felbloom",
    "text": "Deal $4 damage to all minions."
  },
  {
    "id": "CFM_621t19",
    "_info": "(5) SPELL [*NEUTRAL]: Icecap",
    "text": "<b>Freeze</b> 2 random enemy minions."
  },
  {
    "id": "CFM_621t2",
    "_info": "(1) SPELL [*NEUTRAL]: Heart of Fire",
    "text": "Deal $3 damage."
  },
  {
    "id": "CFM_621t20",
    "_info": "(5) SPELL [*NEUTRAL]: Netherbloom",
    "text": "Summon a 5/5 Demon."
  },
  {
    "id": "CFM_621t21",
    "_info": "(5) SPELL [*NEUTRAL]: Mystic Wool",
    "text": "Transform a random enemy minion into a 1/1 Sheep."
  },
  {
    "id": "CFM_621t22",
    "_info": "(5) SPELL [*NEUTRAL]: Kingsblood",
    "text": "Draw 2 cards."
  },
  {
    "id": "CFM_621t23",
    "_info": "(5) SPELL [*NEUTRAL]: Shadow Oil",
    "text": "Add 2 random Demons to your hand."
  },
  {
    "id": "CFM_621t24",
    "_info": "(5) SPELL [*NEUTRAL]: Goldthorn",
    "text": "Give your minions +4 Health."
  },
  {
    "id": "CFM_621t25",
    "_info": "(10) SPELL [*NEUTRAL]: Heart of Fire",
    "text": "Deal $8 damage."
  },
  {
    "id": "CFM_621t26",
    "_info": "(10) SPELL [*NEUTRAL]: Stonescale Oil",
    "text": "Gain 10 Armor."
  },
  {
    "id": "CFM_621t27",
    "_info": "(10) SPELL [*NEUTRAL]: Icecap",
    "text": "<b>Freeze</b> 3 random enemy minions."
  },
  {
    "id": "CFM_621t28",
    "_info": "(10) SPELL [*NEUTRAL]: Netherbloom",
    "text": "Summon an 8/8 Demon."
  },
  {
    "id": "CFM_621t29",
    "_info": "(10) SPELL [*NEUTRAL]: Mystic Wool",
    "text": "Transform all minions into 1/1 Sheep."
  },
  {
    "id": "CFM_621t3",
    "_info": "(1) SPELL [*NEUTRAL]: Stonescale Oil",
    "text": "Gain 4 Armor."
  },
  {
    "id": "CFM_621t30",
    "_info": "(10) SPELL [*NEUTRAL]: Kingsblood",
    "text": "Draw 3 cards."
  },
  {
    "id": "CFM_621t31",
    "_info": "(10) SPELL [*NEUTRAL]: Shadow Oil",
    "text": "Add 3 random Demons to your hand."
  },
  {
    "id": "CFM_621t32",
    "_info": "(10) SPELL [*NEUTRAL]: Goldthorn",
    "text": "Give your minions +6 Health."
  },
  {
    "id": "CFM_621t33",
    "_info": "(10) SPELL [*NEUTRAL]: Felbloom",
    "text": "Deal $6 damage to all minions."
  },
  {
    "id": "CFM_621t37",
    "_info": "(1) SPELL [*NEUTRAL]: Ichor of Undeath",
    "text": "Summon a friendly minion that died this game."
  },
  {
    "id": "CFM_621t38",
    "_info": "(5) SPELL [*NEUTRAL]: Ichor of Undeath",
    "text": "Summon 2 friendly minions that died this game."
  },
  {
    "id": "CFM_621t39",
    "_info": "(10) SPELL [*NEUTRAL]: Ichor of Undeath",
    "text": "Summon 3 friendly minions that died this game."
  },
  {
    "id": "CFM_621t4",
    "_info": "(1) SPELL [*NEUTRAL]: Felbloom",
    "text": "Deal $2 damage to all minions."
  },
  {
    "id": "CFM_621t5",
    "_info": "(1) SPELL [*NEUTRAL]: Icecap",
    "text": "<b>Freeze</b> a random enemy minion."
  },
  {
    "id": "CFM_621t6",
    "_info": "(1) SPELL [*NEUTRAL]: Goldthorn",
    "text": "Give your minions +2 Health."
  },
  {
    "id": "CFM_621t8",
    "_info": "(1) SPELL [*NEUTRAL]: Kingsblood",
    "text": "Draw a card."
  },
  {
    "id": "CFM_621t9",
    "_info": "(1) SPELL [*NEUTRAL]: Shadow Oil",
    "text": "Add a random Demon to your hand."
  },
  {
    "id": "CFM_623",
    "_info": "(7) SPELL [MAGE]: Greater Arcane Missiles",
    "text": "Shoot three missiles at random enemies that deal $3 damage each."
  },
  {
    "id": "CFM_626",
    "_info": "(3) 3/4 [PRIEST]: Kabal Talonpriest",
    "text": "<b>Battlecry:</b> Give a friendly minion +3 Health."
  },
  {
    "id": "CFM_626e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Fortitude",
    "text": "+3 Health."
  },
  {
    "id": "CFM_630",
    "_info": "(0) SPELL [ROGUE]: Counterfeit Coin",
    "text": "Gain 1 Mana Crystal this turn only."
  },
  {
    "id": "CFM_631",
    "_info": "(4) 2/3 WEAPON [WARRIOR]: Brass Knuckles",
    "text": "[x]After your hero attacks,\ngive a random minion in\nyour hand +1/+1."
  },
  {
    "id": "CFM_631e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "Increased stats from Brass Knuckles."
  },
  {
    "id": "CFM_634",
    "_info": "(5) 5/5 [ROGUE]: Lotus Assassin",
    "text": "<b>Stealth</b>. Whenever this attacks and kills a minion, gain <b>Stealth</b>."
  },
  {
    "id": "CFM_636",
    "_info": "(3) 5/1 [ROGUE]: Shadow Rager",
    "text": "<b>Stealth</b>"
  },
  {
    "id": "CFM_637",
    "_info": "(1) 1/1 [NEUTRAL]: Patches the Pirate |PIRATE",
    "text": "[x]<b>Charge</b>\nAfter you play a Pirate,\nsummon this minion\nfrom your deck.",
    xxx: 1,
    tags: [TAGS.charge],
    _triggers_v1: [
      {
        activeZone: 'deck',
        eventName: EVENTS.minion_summoned,
        condition: 'own minion .race=pirate',
        action: ({summon, self}) => summon(self)         
      }
    ]
  },
  {
    "id": "CFM_639",
    "_info": "(5) 4/4 [PALADIN]: Grimestreet Enforcer",
    "text": "At the end of your turn, give all minions in your hand +1/+1."
  },
  {
    "id": "CFM_639e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "Increased stats from Grimestreet Enforcer."
  },
  {
    "id": "CFM_643",
    "_info": "(2) 2/2 [WARRIOR]: Hobart Grapplehammer",
    "text": "<b>Battlecry:</b> Give all weapons in your hand and deck +1 Attack."
  },
  {
    "id": "CFM_643e",
    "_info": "ENCHANTMENT [*WARRIOR]: Smuggling",
    "text": "+1 Attack from Hobart Grapplehammer."
  },
  {
    "id": "CFM_643e2",
    "_info": "ENCHANTMENT [*WARRIOR]: Smuggling",
    "text": "+1 Attack from Hobart Grapplehammer."
  },
  {
    "id": "CFM_646",
    "_info": "(3) 3/1 [NEUTRAL]: Backstreet Leper",
    "text": "[x]<b>Deathrattle:</b> Deal 2 damage\nto the enemy hero.",
    death ({$}) {
      $('enemy hero').dealDamage(2);
    }
  },
  {
    "id": "CFM_647",
    "_info": "(2) 2/1 [NEUTRAL]: Blowgill Sniper |MURLOC",
    "text": "<b>Battlecry:</b> Deal 1 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamage(1);
    }
  },
  {
    "id": "CFM_648",
    "_info": "(6) 1/1 [NEUTRAL]: Big-Time Racketeer",
    "text": "<b>Battlecry:</b> Summon a 6/6 Ogre."
  },
  {
    "id": "CFM_648t",
    "_info": "(6) 6/6 [*NEUTRAL]: \"Little Friend\""
  },
  {
    "id": "CFM_649",
    "_info": "(3) 2/2 [NEUTRAL]: Kabal Courier",
    "text": "<b>Battlecry:</b> <b>Discover</b> a Mage, Priest, or Warlock card."
  },
  {
    "id": "CFM_650",
    "_info": "(1) 2/1 [PALADIN]: Grimscale Chum |MURLOC",
    "text": "[x]<b>Battlecry:</b> Give a random\nMurloc in your hand +1/+1."
  },
  {
    "id": "CFM_650e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+1/+1 from Grimscale Chum."
  },
  {
    "id": "CFM_651",
    "_info": "(4) 5/4 [NEUTRAL]: Naga Corsair |PIRATE",
    "text": "<b>Battlecry:</b> Give your weapon +1 Attack."
  },
  {
    "id": "CFM_651e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Extra Sharp",
    "text": "+1 Attack."
  },
  {
    "id": "CFM_652",
    "_info": "(5) 4/5 [NEUTRAL]: Second-Rate Bruiser",
    "text": "[x]<b>Taunt</b>\nCosts (2) less if your\nopponent has at least\nthree minions."
  },
  {
    "id": "CFM_653",
    "_info": "(3) 4/3 [NEUTRAL]: Hired Gun",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "CFM_654",
    "_info": "(2) 2/3 [NEUTRAL]: Friendly Bartender",
    "text": "At the end of your turn, restore 1 Health to your hero."
  },
  {
    "id": "CFM_655",
    "_info": "(3) 4/3 [NEUTRAL]: Toxic Sewer Ooze",
    "text": "<b>Battlecry:</b> Remove 1 Durability from your opponent's weapon."
  },
  {
    "id": "CFM_656",
    "_info": "(5) 4/6 [NEUTRAL]: Streetwise Investigator",
    "text": "<b>Battlecry:</b> Enemy minions lose <b>Stealth</b>."
  },
  {
    "id": "CFM_657",
    "_info": "(5) 5/5 [PRIEST]: Kabal Songstealer",
    "text": "[x]<b>Battlecry:</b> <b>Silence</b> a minion."
  },
  {
    "id": "CFM_658",
    "_info": "(4) 4/4 [NEUTRAL]: Backroom Bouncer",
    "text": "Whenever a friendly minion dies, gain +1 Attack."
  },
  {
    "id": "CFM_658e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Cut Off",
    "text": "Increased Attack."
  },
  {
    "id": "CFM_659",
    "_info": "(2) 2/2 [NEUTRAL]: Gadgetzan Socialite",
    "text": "<b>Battlecry:</b> Restore 2 Health."
  },
  {
    "id": "CFM_660",
    "_info": "(3) 3/4 [MAGE]: Manic Soulcaster",
    "text": "<b>Battlecry:</b> Choose a friendly minion. Shuffle a copy into your deck."
  },
  {
    "id": "CFM_661",
    "_info": "(1) SPELL [PRIEST]: Pint-Size Potion",
    "text": "[x]Give all enemy minions\n-3 Attack this turn only."
  },
  {
    "id": "CFM_661e",
    "_info": "ENCHANTMENT [*PRIEST]: Shrunk",
    "text": "-3 Attack this turn."
  },
  {
    "id": "CFM_662",
    "_info": "(6) SPELL [PRIEST]: Dragonfire Potion",
    "text": "[x]Deal $5 damage to all\nminions except Dragons."
  },
  {
    "id": "CFM_663",
    "_info": "(6) 6/6 [WARLOCK]: Kabal Trafficker",
    "text": "[x]At the end of your turn,\nadd a random Demon\nto your hand."
  },
  {
    "id": "CFM_665",
    "_info": "(4) 6/3 [NEUTRAL]: Worgen Greaser"
  },
  {
    "id": "CFM_666",
    "_info": "(5) 3/5 [NEUTRAL]: Grook Fu Master",
    "text": "<b>Windfury</b>"
  },
  {
    "id": "CFM_667",
    "_info": "(5) 2/2 [NEUTRAL]: Bomb Squad",
    "text": "[x]<b>Battlecry:</b> Deal 5 damage\nto an enemy minion.\n<b>Deathrattle:</b> Deal 5 damage\nto your hero."
  },
  {
    "id": "CFM_668",
    "_info": "(5) 2/2 [NEUTRAL]: Doppelgangster",
    "text": "<b>Battlecry:</b> Summon 2 copies of this minion."
  },
  {
    "id": "CFM_668t",
    "_info": "(5) 2/2 [*NEUTRAL]: Doppelgangster",
    "text": "<b>Battlecry:</b> Summon 2 copies of this minion."
  },
  {
    "id": "CFM_668t2",
    "_info": "(5) 2/2 [*NEUTRAL]: Doppelgangster",
    "text": "<b>Battlecry:</b> Summon 2 copies of this minion."
  },
  {
    "id": "CFM_669",
    "_info": "(5) 4/6 [NEUTRAL]: Burgly Bully",
    "text": "Whenever your opponent casts a spell, add a Coin to your hand."
  },
  {
    "id": "CFM_670",
    "_info": "(9) 5/4 [NEUTRAL]: Mayor Noggenfogger",
    "text": "All targets are chosen randomly."
  },
  {
    "id": "CFM_671",
    "_info": "(5) 5/5 [MAGE]: Cryomancer",
    "text": "<b>Battlecry:</b> Gain +2/+2\nif an enemy is <b>Frozen</b>."
  },
  {
    "id": "CFM_671e",
    "_info": "ENCHANTMENT [*NEUTRAL]: We All Scream",
    "text": "+2/+2."
  },
  {
    "id": "CFM_672",
    "_info": "(6) 4/3 [NEUTRAL]: Madam Goya",
    "text": "<b>Battlecry:</b> Choose a friendly minion. Swap it with a minion in your deck."
  },
  {
    "id": "CFM_685",
    "_info": "(7) 5/6 [NEUTRAL]: Don Han'Cho",
    "text": "<b>Battlecry:</b> Give a random minion in your hand +5/+5."
  },
  {
    "id": "CFM_685e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+5/+5 from Don Han'Cho."
  },
  {
    "id": "CFM_687",
    "_info": "(7) 5/5 [MAGE]: Inkmaster Solia",
    "text": "[x]<b>Battlecry:</b> If your deck has\nno duplicates, the next\nspell you cast this turn\ncosts (0)."
  },
  {
    "id": "CFM_687e",
    "_info": "ENCHANTMENT [*MAGE]: Free Spell",
    "text": "The next spell you cast this turn costs (0)."
  },
  {
    "id": "CFM_688",
    "_info": "(5) 5/5 [NEUTRAL]: Spiked Hogrider",
    "text": "<b>Battlecry:</b> If an enemy minion has <b>Taunt</b>, gain <b>Charge</b>."
  },
  {
    "id": "CFM_690",
    "_info": "(2) SPELL [ROGUE]: Jade Shuriken",
    "text": "Deal $2 damage.\n<b>Combo:</b> Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_691",
    "_info": "(2) 1/1 [ROGUE]: Jade Swarmer",
    "text": "<b>Stealth</b>\n<b>Deathrattle:</b> Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_693",
    "_info": "(2) 2/3 [ROGUE]: Gadgetzan Ferryman",
    "text": "<b>Combo:</b> Return a friendly minion to your hand."
  },
  {
    "id": "CFM_694",
    "_info": "(4) 4/4 [ROGUE]: Shadow Sensei",
    "text": "<b>Battlecry:</b> Give a <b>Stealthed</b> minion +2/+2."
  },
  {
    "id": "CFM_694e",
    "_info": "ENCHANTMENT [*ROGUE]: Trained",
    "text": "+2/+2."
  },
  {
    "id": "CFM_696",
    "_info": "(2) SPELL [SHAMAN]: Devolve",
    "text": "Transform all enemy minions into random ones that cost (1) less."
  },
  {
    "id": "CFM_697",
    "_info": "(4) 3/5 [SHAMAN]: Lotus Illusionist",
    "text": "[x]After this minion attacks\na hero, transform it into a\n random 6-Cost minion."
  },
  {
    "id": "CFM_699",
    "_info": "(4) 4/2 [WARLOCK]: Seadevil Stinger |MURLOC",
    "text": "[x]<b>Battlecry:</b> The next Murloc\nyou play this turn costs\n Health instead of Mana."
  },
  {
    "id": "CFM_699e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Seadevil Enchant"
  },
  {
    "id": "CFM_707",
    "_info": "(4) SPELL [SHAMAN]: Jade Lightning",
    "text": "Deal $4 damage. Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_713",
    "_info": "(3) SPELL [DRUID]: Jade Blossom",
    "text": "Summon a{1} {0} <b>Jade Golem</b>. Gain an empty Mana Crystal."
  },
  {
    "id": "CFM_715",
    "_info": "(4) 2/3 [NEUTRAL]: Jade Spirit",
    "text": "<b>Battlecry:</b> Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_716",
    "_info": "(2) SPELL [WARRIOR]: Sleep with the Fishes",
    "text": "Deal $3 damage to all damaged minions."
  },
  {
    "id": "CFM_717",
    "_info": "(2) 2/2 WEAPON [SHAMAN]: Jade Claws",
    "text": "<b>Battlecry:</b> Summon a{1} {0} <b>Jade Golem</b>.\n<b><b>Overload</b>:</b> (1)"
  },
  {
    "id": "CFM_750",
    "_info": "(9) 7/9 [WARLOCK]: Krul the Unshackled |DEMON",
    "text": "[x]<b>Battlecry:</b> If your deck has\nno duplicates, summon all\n Demons from your hand. "
  },
  {
    "id": "CFM_751",
    "_info": "(7) 6/6 [WARLOCK]: Abyssal Enforcer |DEMON",
    "text": "<b>Battlecry:</b> Deal 3 damage to all other characters."
  },
  {
    "id": "CFM_752",
    "_info": "(2) SPELL [WARRIOR]: Stolen Goods",
    "text": "Give a random <b>Taunt</b> minion in your hand +3/+3."
  },
  {
    "id": "CFM_752e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+3/+3 from Stolen Goods."
  },
  {
    "id": "CFM_753",
    "_info": "(2) 1/1 [PALADIN]: Grimestreet Outfitter",
    "text": "<b>Battlecry:</b> Give all minions in your hand +1/+1."
  },
  {
    "id": "CFM_753e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+1/+1 from Grimestreet Outfitter."
  },
  {
    "id": "CFM_754",
    "_info": "(4) 4/3 [WARRIOR]: Grimy Gadgeteer",
    "text": "At the end of your turn, give a random minion in your hand +2/+2."
  },
  {
    "id": "CFM_754e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "Increased stats from Grimy Gadgeteer."
  },
  {
    "id": "CFM_755",
    "_info": "(3) 3/3 [WARRIOR]: Grimestreet Pawnbroker",
    "text": "<b>Battlecry:</b> Give a random weapon in your hand +1/+1."
  },
  {
    "id": "CFM_755e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+1/+1 from Grimestreet Pawnbroker."
  },
  {
    "id": "CFM_756",
    "_info": "(5) 2/7 [WARRIOR]: Alley Armorsmith",
    "text": "[x]<b>Taunt</b>\nWhenever this minion\ndeals damage, gain\nthat much Armor."
  },
  {
    "id": "CFM_759",
    "_info": "(1) 1/2 [PALADIN]: Meanstreet Marshal",
    "text": "<b>Deathrattle:</b> If this minion has 2 or more Attack, draw a card."
  },
  {
    "id": "CFM_760",
    "_info": "(6) 5/5 [MAGE]: Kabal Crystal Runner",
    "text": "Costs (2) less for each <b>Secret</b> you've played this game."
  },
  {
    "id": "CFM_781",
    "_info": "(3) 2/3 [ROGUE]: Shaku, the Collector",
    "text": "[x]<b>Stealth</b>. Whenever this\nattacks, add a random card\nto your hand <i>(from your\nopponent's class).</i>"
  },
  {
    "id": "CFM_790",
    "_info": "(2) 2/6 [NEUTRAL]: Dirty Rat",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Your opponent\nsummons a random minion\nfrom their hand."
  },
  {
    "id": "CFM_800",
    "_info": "(1) SPELL [PALADIN]: Getaway Kodo",
    "text": "<b>Secret:</b> When a friendly minion dies, return it to your hand."
  },
  {
    "id": "CFM_806",
    "_info": "(6) 4/5 [NEUTRAL]: Wrathion",
    "text": "<b>Taunt</b>. <b>Battlecry:</b> Draw cards until you draw one that isn't a Dragon."
  },
  {
    "id": "CFM_807",
    "_info": "(3) 3/4 [NEUTRAL]: Auctionmaster Beardo",
    "text": "After you cast a spell, refresh your Hero Power."
  },
  {
    "id": "CFM_808",
    "_info": "(4) 5/4 [NEUTRAL]: Genzo, the Shark",
    "text": "Whenever this attacks, both players draw until they have 3 cards."
  },
  {
    "id": "CFM_809",
    "_info": "(4) 4/4 [NEUTRAL]: Tanaris Hogchopper",
    "text": "[x]<b>Battlecry:</b> If your opponent's\nhand is empty, gain <b>Charge</b>."
  },
  {
    "id": "CFM_810",
    "_info": "(6) 6/6 [NEUTRAL]: Leatherclad Hogleader",
    "text": "<b>Battlecry:</b> If your opponent has 6 or more cards in hand, gain <b>Charge</b>."
  },
  {
    "id": "CFM_811",
    "_info": "(5) SPELL [DRUID]: Lunar Visions",
    "text": "Draw 2 cards. Minions drawn cost (2) less."
  },
  {
    "id": "CFM_815",
    "_info": "(3) 2/2 [PALADIN]: Wickerflame Burnbristle",
    "text": "[x]<b>Divine Shield</b>. <b>Taunt</b>.\nDamage dealt by this minion\nalso heals your hero."
  },
  {
    "id": "CFM_816",
    "_info": "(5) 4/5 [DRUID]: Virmen Sensei",
    "text": "<b>Battlecry:</b> Give a friendly Beast +2/+2."
  },
  {
    "id": "CFM_816e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Get Big",
    "text": "+2/+2."
  },
  {
    "id": "CFM_851",
    "_info": "(4) 3/3 [NEUTRAL]: Daring Reporter",
    "text": "Whenever your opponent draws a card, gain +1/+1."
  },
  {
    "id": "CFM_851e",
    "_info": "ENCHANTMENT [*NEUTRAL]: The Scoop",
    "text": "Increased stats."
  },
  {
    "id": "CFM_852",
    "_info": "(5) 5/3 [NEUTRAL]: Lotus Agents",
    "text": "<b>Battlecry:</b> <b>Discover</b> a Druid, Rogue, or Shaman card."
  },
  {
    "id": "CFM_853",
    "_info": "(3) 2/4 [NEUTRAL]: Grimestreet Smuggler",
    "text": "<b>Battlecry:</b> Give a random minion in your hand +1/+1."
  },
  {
    "id": "CFM_853e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Smuggling",
    "text": "+1/+1 from Grimestreet Smuggler."
  },
  {
    "id": "CFM_854",
    "_info": "(6) 3/8 [NEUTRAL]: Ancient of Blossoms",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CFM_855",
    "_info": "(6) 5/7 [NEUTRAL]: Defias Cleaner",
    "text": "<b>Battlecry:</b> <b>Silence</b> a minion with <b>Deathrattle</b>."
  },
  {
    "id": "CFM_900",
    "_info": "(3) 5/5 [WARLOCK]: Unlicensed Apothecary |DEMON",
    "text": "Whenever you summon a minion, deal 5 damage to your hero."
  },
  {
    "id": "CFM_902",
    "_info": "(6) 5/3 [NEUTRAL]: Aya Blackpaw",
    "text": "<b>Battlecry and Deathrattle:</b> Summon a{1} {0} <b>Jade Golem</b>."
  },
  {
    "id": "CFM_905",
    "_info": "(3) SPELL [PALADIN]: Small-Time Recruits",
    "text": "[x]Draw three 1-Cost\nminions from your deck."
  },
  {
    "id": "CFM_940",
    "_info": "(1) SPELL [WARRIOR]: I Know a Guy",
    "text": "<b>Discover</b> a <b>Taunt</b> minion."
  },
  {
    "id": "CS1_042",
    "_info": "(1) 1/2 [NEUTRAL]: Goldshire Footman",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS1_069",
    "_info": "(5) 3/6 [NEUTRAL]: Fen Creeper",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS1_112",
    "_info": "(5) SPELL [PRIEST]: Holy Nova",
    "text": "Deal $2 damage to all enemies. Restore #2 Health to all friendly characters."
  },
  {
    "id": "CS1_113",
    "_info": "(10) SPELL [PRIEST]: Mind Control",
    "text": "Take control of an enemy minion."
  },
  {
    "id": "CS1_129",
    "_info": "(1) SPELL [PRIEST]: Inner Fire",
    "text": "Change a minion's Attack to be equal to its Health."
  },
  {
    "id": "CS1_129e",
    "_info": "ENCHANTMENT [*PRIEST]: Inner Fire",
    "text": "This minion's Attack is equal to its Health."
  },
  {
    "id": "CS1_130",
    "_info": "(1) SPELL [PRIEST]: Holy Smite",
    "text": "Deal $2 damage."
  },
  {
    "id": "CS2_003",
    "_info": "(1) SPELL [PRIEST]: Mind Vision",
    "text": "Put a copy of a random card in your opponent's hand into your hand."
  },
  {
    "id": "CS2_004",
    "_info": "(1) SPELL [PRIEST]: Power Word: Shield",
    "text": "Give a minion +2 Health.\nDraw a card."
  },
  {
    "id": "CS2_004e",
    "_info": "ENCHANTMENT [*PRIEST]: Power Word: Shield",
    "text": "+2 Health."
  },
  {
    "id": "CS2_005",
    "_info": "(1) SPELL [DRUID]: Claw",
    "text": "Give your hero +2 Attack this turn. Gain 2 Armor."
  },
  {
    "id": "CS2_005o",
    "_info": "ENCHANTMENT [*DRUID]: Claw",
    "text": "+2 Attack this turn."
  },
  {
    "id": "CS2_007",
    "_info": "(3) SPELL [DRUID]: Healing Touch",
    "text": "Restore #8 Health."
  },
  {
    "id": "CS2_008",
    "_info": "(0) SPELL [DRUID]: Moonfire",
    "text": "Deal $1 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamageSpell(1);
    }
  },
  {
    "id": "CS2_009",
    "_info": "(2) SPELL [DRUID]: Mark of the Wild",
    "text": "Give a minion <b>Taunt</b> and +2/+2.<i>\n(+2 Attack/+2 Health)</i>"
  },
  {
    "id": "CS2_009e",
    "_info": "ENCHANTMENT [*DRUID]: Mark of the Wild",
    "text": "+2/+2 and <b>Taunt</b>."
  },
  {
    "id": "CS2_011",
    "_info": "(3) SPELL [DRUID]: Savage Roar",
    "text": "Give your characters +2 Attack this turn."
  },
  {
    "id": "CS2_011o",
    "_info": "ENCHANTMENT [*DRUID]: Savage Roar",
    "text": "+2 Attack this turn."
  },
  {
    "id": "CS2_012",
    "_info": "(4) SPELL [DRUID]: Swipe",
    "text": "Deal $4 damage to an enemy and $1 damage to all other enemies.",
    target: 'enemy character',
    play ({target, $}) {
      target.dealDamageSpell(4);
      $('enemy character').exclude(target).dealDamageSpell(1);
    }
  },
  {
    "id": "CS2_013",
    "_info": "(2) SPELL [DRUID]: Wild Growth",
    "text": "Gain an empty Mana Crystal."
  },
  {
    "id": "CS2_013t",
    "_info": "(0) SPELL [*DRUID]: Excess Mana",
    "text": "Draw a card. <i>(You can only have 10 Mana in your tray.)</i>"
  },
  {
    "id": "CS2_022",
    "_info": "(4) SPELL [MAGE]: Polymorph",
    "text": "Transform a minion\ninto a 1/1 Sheep."
  },
  {
    "id": "CS2_022e",
    "_info": "ENCHANTMENT [*MAGE]: Polymorph",
    "text": "This minion has been transformed into a 1/1 Sheep."
  },
  {
    "id": "CS2_023",
    "_info": "(3) SPELL [MAGE]: Arcane Intellect",
    "text": "Draw 2 cards."
  },
  {
    "id": "CS2_024",
    "_info": "(2) SPELL [MAGE]: Frostbolt",
    "text": "Deal $3 damage to a character and <b>Freeze</b> it."
  },
  {
    "id": "CS2_025",
    "_info": "(2) SPELL [MAGE]: Arcane Explosion",
    "text": "Deal $1 damage to all enemy minions.",
    play ({$}) {
      $('enemy minion').dealDamageSpell(1);
    }
  },
  {
    "id": "CS2_026",
    "_info": "(3) SPELL [MAGE]: Frost Nova",
    "text": "<b>Freeze</b> all enemy minions."
  },
  {
    "id": "CS2_027",
    "_info": "(1) SPELL [MAGE]: Mirror Image",
    "text": "Summon two 0/2 minions with <b>Taunt</b>.",
    play ({summon}) {
      summon('CS2_mirror');
      summon('CS2_mirror');
    }
  },
  {
    // CS_mirror token was added manually
    // because of the irregular ID ..
    "id": "CS2_mirror", 
    "_info": "(0) 0/2 [*MAGE]: Mirror Image",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_028",
    "_info": "(6) SPELL [MAGE]: Blizzard",
    "text": "Deal $2 damage to all enemy minions and <b>Freeze</b> them."
  },
  {
    "id": "CS2_029",
    "_info": "(4) SPELL [MAGE]: Fireball",
    "text": "Deal $6 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamageSpell(6);
    }
  },
  {
    "id": "CS2_031",
    "_info": "(1) SPELL [MAGE]: Ice Lance",
    "text": "<b>Freeze</b> a character. If it was already <b>Frozen</b>, deal $4 damage instead."
  },
  {
    "id": "CS2_032",
    "_info": "(7) SPELL [MAGE]: Flamestrike",
    "text": "Deal $4 damage to all enemy minions.",
    play ({$}) {
      $('enemy minion').dealDamageSpell(4);
    }
  },
  {
    "id": "CS2_033",
    "_info": "(4) 3/6 [MAGE]: Water Elemental |ELEMENTAL",
    "text": "<b>Freeze</b> any character damaged by this minion."
  },
  {
    "id": "CS2_037",
    "_info": "(1) SPELL [SHAMAN]: Frost Shock",
    "text": "Deal $1 damage to an enemy character and <b>Freeze</b> it."
  },
  {
    "id": "CS2_038",
    "_info": "(2) SPELL [SHAMAN]: Ancestral Spirit",
    "text": "Give a minion \"<b>Deathrattle:</b> Resummon this minion.\""
  },
  {
    "id": "CS2_038e",
    "_info": "ENCHANTMENT [*SHAMAN]: Ancestral Spirit",
    "text": "<b>Deathrattle:</b> Resummon this minion."
  },
  {
    "id": "CS2_039",
    "_info": "(2) SPELL [SHAMAN]: Windfury",
    "text": "Give a minion <b>Windfury</b>.",
    xxx: 1,
    target: 'minion',
    play ({target, buff}) {
      console.log(`WINDFURY: trying to BUFF ${target.name}`);
      buff(target, TAGS.windfury);
      console.log(`WINDFURY: done ? buffs: ${target.buffs}`);
    }
  },
  {
    "id": "CS2_041",
    "_info": "(0) SPELL [SHAMAN]: Ancestral Healing",
    "text": "Restore a minion\nto full Health and\ngive it <b>Taunt</b>."
  },
  {
    "id": "CS2_041e",
    "_info": "ENCHANTMENT [*SHAMAN]: Ancestral Infusion",
    "text": "Taunt."
  },
  {
    "id": "CS2_042",
    "_info": "(6) 6/5 [SHAMAN]: Fire Elemental |ELEMENTAL",
    "text": "<b>Battlecry:</b> Deal 3 damage."
  },
  {
    "id": "CS2_045",
    "_info": "(2) SPELL [SHAMAN]: Rockbiter Weapon",
    "text": "Give a friendly character +3 Attack this turn."
  },
  {
    "id": "CS2_045e",
    "_info": "ENCHANTMENT [*SHAMAN]: Rockbiter Weapon",
    "text": "This character has +3 Attack this turn."
  },
  {
    "id": "CS2_046",
    "_info": "(5) SPELL [SHAMAN]: Bloodlust",
    "text": "Give your minions +3 Attack this turn.",
    xxx: 'buff',
    // this clearly shows the need for $().buff method
    play ({$, buff}) {
      $('own minion').forEach(v => buff(v, 'CS2_046e'));
    }
  },
  {
    "id": "CS2_046e",
    "_info": "ENCHANTMENT [*SHAMAN]: Bloodlust",
    "text": "+3 Attack this turn.",
    xxx: 1,
    attack: 3,
    expires: 'turn'
  },
  {
    "id": "CS2_053",
    "_info": "(3) SPELL [SHAMAN]: Far Sight",
    "text": "Draw a card. That card costs (3) less."
  },
  {
    "id": "CS2_053e",
    "_info": "ENCHANTMENT [*SHAMAN]: Far Sight",
    "text": "One of your cards costs (3) less."
  },
  {
    "id": "CS2_057",
    "_info": "(3) SPELL [WARLOCK]: Shadow Bolt",
    "text": "Deal $4 damage\nto a minion.",
    target: 'minion',
    play ({target}) {
      target.dealDamageSpell(4);
    }
  },
  {
    "id": "CS2_059",
    "_info": "(1) 0/1 [WARLOCK]: Blood Imp |DEMON",
    "text": "[x]  <b>Stealth</b>. At the end of your  \nturn, give another random\n friendly minion +1 Health."
  },
  {
    "id": "CS2_059o",
    "_info": "ENCHANTMENT [*WARLOCK]: Blood Pact",
    "text": "Increased Health."
  },
  {
    "id": "CS2_061",
    "_info": "(3) SPELL [WARLOCK]: Drain Life",
    "text": "Deal $2 damage. Restore #2 Health to your hero."
  },
  {
    "id": "CS2_062",
    "_info": "(4) SPELL [WARLOCK]: Hellfire",
    "text": "Deal $3 damage to ALL characters.",
    play ({$}) {
      $('character').dealDamageSpell(3);
    }
  },
  {
    "id": "CS2_063",
    "_info": "(1) SPELL [WARLOCK]: Corruption",
    "text": "Choose an enemy minion. At the start of your turn, destroy it."
  },
  {
    "id": "CS2_063e",
    "_info": "ENCHANTMENT [*WARLOCK]: Corruption",
    "text": "At the start of the corrupting player's turn, destroy this minion."
  },
  {
    "id": "CS2_064",
    "_info": "(6) 6/6 [WARLOCK]: Dread Infernal |DEMON",
    "text": "<b>Battlecry:</b> Deal 1 damage to ALL other characters.",
    play ({$, self}) {
      $('character').exclude(self).dealDamage(1);
    }
  },
  {
    "id": "CS2_065",
    "_info": "(1) 1/3 [WARLOCK]: Voidwalker |DEMON",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_072",
    "_info": "(0) SPELL [ROGUE]: Backstab",
    "text": "Deal $2 damage to an undamaged minion."
  },
  {
    "id": "CS2_073",
    "_info": "(1) SPELL [ROGUE]: Cold Blood",
    "text": "Give a minion +2 Attack. <b>Combo:</b> +4 Attack instead."
  },
  {
    "id": "CS2_073e",
    "_info": "ENCHANTMENT [*ROGUE]: Cold Blood",
    "text": "+2 Attack."
  },
  {
    "id": "CS2_073e2",
    "_info": "ENCHANTMENT [*ROGUE]: Cold Blood",
    "text": "+4 Attack."
  },
  {
    "id": "CS2_074",
    "_info": "(1) SPELL [ROGUE]: Deadly Poison",
    "text": "Give your weapon +2 Attack."
  },
  {
    "id": "CS2_074e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Deadly Poison",
    "text": "+2 Attack."
  },
  {
    "id": "CS2_075",
    "_info": "(1) SPELL [ROGUE]: Sinister Strike",
    "text": "Deal $3 damage to the enemy hero.",
    play ({$}) {
      $('enemy hero').dealDamageSpell(3);
    }
  },
  {
    "id": "CS2_076",
    "_info": "(5) SPELL [ROGUE]: Assassinate",
    "text": "Destroy an enemy minion.",
    target: 'enemy minion',
    play ({target}) {
      target.destroy();
    }
  },
  {
    "id": "CS2_077",
    "_info": "(7) SPELL [ROGUE]: Sprint",
    "text": "Draw 4 cards."
  },
  {
    "id": "CS2_080",
    "_info": "(5) 3/4 WEAPON [ROGUE]: Assassin's Blade"
  },
  {
    "id": "CS2_084",
    "_info": "(1) SPELL [HUNTER]: Hunter's Mark",
    "text": "Change a minion's Health to 1."
  },
  {
    "id": "CS2_084e",
    "_info": "ENCHANTMENT [*HUNTER]: Hunter's Mark",
    "text": "This minion has 1 Health."
  },
  {
    "id": "CS2_087",
    "_info": "(1) SPELL [PALADIN]: Blessing of Might",
    "text": "Give a minion +3 Attack."
  },
  {
    "id": "CS2_087e",
    "_info": "ENCHANTMENT [*PALADIN]: Blessing of Might",
    "text": "+3 Attack."
  },
  {
    "id": "CS2_088",
    "_info": "(7) 5/6 [PALADIN]: Guardian of Kings",
    "text": "<b>Battlecry:</b> Restore 6 Health to your hero."
  },
  {
    "id": "CS2_089",
    "_info": "(2) SPELL [PALADIN]: Holy Light",
    "text": "Restore #6 Health."
  },
  {
    "id": "CS2_091",
    "_info": "(1) 1/4 WEAPON [PALADIN]: Light's Justice"
  },
  {
    "id": "CS2_092",
    "_info": "(4) SPELL [PALADIN]: Blessing of Kings",
    "text": "Give a minion +4/+4. <i>(+4 Attack/+4 Health)</i>"
  },
  {
    "id": "CS2_092e",
    "_info": "ENCHANTMENT [*PALADIN]: Blessing of Kings",
    "text": "+4/+4."
  },
  {
    "id": "CS2_093",
    "_info": "(4) SPELL [PALADIN]: Consecration",
    "text": "Deal $2 damage to all enemies.",
    play ({$}) {
      $('enemy character').dealDamageSpell(2);
    }
  },
  {
    "id": "CS2_094",
    "_info": "(4) SPELL [PALADIN]: Hammer of Wrath",
    "text": "Deal $3 damage.\nDraw a card."
  },
  {
    "id": "CS2_097",
    "_info": "(4) 4/2 WEAPON [PALADIN]: Truesilver Champion",
    "text": "Whenever your hero attacks, restore 2 Health to it."
  },
  {
    "id": "CS2_103",
    "_info": "(1) SPELL [WARRIOR]: Charge",
    "text": "Give a friendly minion <b>Charge</b>. It can't attack heroes this turn."
  },
  {
    "id": "CS2_103e2",
    "_info": "ENCHANTMENT [*WARRIOR]: Charge",
    "text": "Has <b>Charge</b>."
  },
  {
    "id": "CS2_104",
    "_info": "(2) SPELL [WARRIOR]: Rampage",
    "text": "Give a damaged minion +3/+3."
  },
  {
    "id": "CS2_104e",
    "_info": "ENCHANTMENT [*WARRIOR]: Rampage",
    "text": "+3/+3."
  },
  {
    "id": "CS2_105",
    "_info": "(2) SPELL [WARRIOR]: Heroic Strike",
    "text": "Give your hero +4 Attack this turn."
  },
  {
    "id": "CS2_105e",
    "_info": "ENCHANTMENT [*WARRIOR]: Heroic Strike",
    "text": "+4 Attack this turn."
  },
  {
    "id": "CS2_106",
    "_info": "(2) 3/2 WEAPON [WARRIOR]: Fiery War Axe"
  },
  {
    "id": "CS2_108",
    "_info": "(2) SPELL [WARRIOR]: Execute",
    "text": "Destroy a damaged enemy minion."
  },
  {
    "id": "CS2_112",
    "_info": "(5) 5/2 WEAPON [WARRIOR]: Arcanite Reaper"
  },
  {
    "id": "CS2_114",
    "_info": "(2) SPELL [WARRIOR]: Cleave",
    "text": "[x]Deal $2 damage to\ntwo random enemy\nminions."
  },
  {
    "id": "CS2_117",
    "_info": "(3) 3/3 [NEUTRAL]: Earthen Ring Farseer",
    "text": "<b>Battlecry:</b> Restore 3 Health."
  },
  {
    "id": "CS2_118",
    "_info": "(3) 5/1 [NEUTRAL]: Magma Rager |ELEMENTAL"
  },
  {
    "id": "CS2_119",
    "_info": "(4) 2/7 [NEUTRAL]: Oasis Snapjaw |BEAST"
  },
  {
    "id": "CS2_120",
    "_info": "(2) 2/3 [NEUTRAL]: River Crocolisk |BEAST"
  },
  {
    "id": "CS2_121",
    "_info": "(2) 2/2 [NEUTRAL]: Frostwolf Grunt",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_122",
    "_info": "(3) 2/2 [NEUTRAL]: Raid Leader",
    "text": "Your other minions have +1 Attack."
  },
  {
    "id": "CS2_122e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enhanced",
    "text": "Raid Leader is granting this minion +1 Attack."
  },
  {
    "id": "CS2_124",
    "_info": "(3) 3/1 [NEUTRAL]: Wolfrider",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "CS2_125",
    "_info": "(3) 3/3 [NEUTRAL]: Ironfur Grizzly |BEAST",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_127",
    "_info": "(3) 1/4 [NEUTRAL]: Silverback Patriarch |BEAST",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_131",
    "_info": "(4) 2/5 [NEUTRAL]: Stormwind Knight",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "CS2_141",
    "_info": "(3) 2/2 [NEUTRAL]: Ironforge Rifleman",
    "text": "<b>Battlecry:</b> Deal 1 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamage(1);
    }
  },
  {
    "id": "CS2_142",
    "_info": "(2) 2/2 [NEUTRAL]: Kobold Geomancer",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "CS2_146",
    "_info": "(1) 2/1 [NEUTRAL]: Southsea Deckhand |PIRATE",
    "text": "Has <b>Charge</b> while you have a weapon equipped."
  },
  {
    "id": "CS2_147",
    "_info": "(4) 2/4 [NEUTRAL]: Gnomish Inventor",
    "text": "<b>Battlecry:</b> Draw a card."
  },
  {
    "id": "CS2_150",
    "_info": "(5) 4/2 [NEUTRAL]: Stormpike Commando",
    "text": "<b>Battlecry:</b> Deal 2 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamage(2);
    }
  },
  {
    "id": "CS2_151",
    "_info": "(5) 4/4 [NEUTRAL]: Silver Hand Knight",
    "text": "<b>Battlecry:</b> Summon a 2/2 Squire.",
    play ({summon}) {
      summon('CS2_152');
    }
  },
  {
    // added manually
    "id": "CS2_152",
    "_info": "(1) 2/2 [*NEUTRAL]: Squire"
  },
  {
    "id": "CS2_155",
    "_info": "(6) 4/7 [NEUTRAL]: Archmage",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "CS2_161",
    "_info": "(7) 7/5 [NEUTRAL]: Ravenholdt Assassin",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "CS2_162",
    "_info": "(6) 6/5 [NEUTRAL]: Lord of the Arena",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_168",
    "_info": "(1) 2/1 [NEUTRAL]: Murloc Raider |MURLOC"
  },
  {
    "id": "CS2_169",
    "_info": "(1) 1/1 [NEUTRAL]: Young Dragonhawk |BEAST",
    "text": "<b>Windfury</b>",
    tags: [TAGS.windfury]
  },
  {
    "id": "CS2_171",
    "_info": "(1) 1/1 [NEUTRAL]: Stonetusk Boar |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "CS2_172",
    "_info": "(2) 3/2 [NEUTRAL]: Bloodfen Raptor |BEAST"
  },
  {
    "id": "CS2_173",
    "_info": "(2) 2/1 [NEUTRAL]: Bluegill Warrior |MURLOC",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "CS2_179",
    "_info": "(4) 3/5 [NEUTRAL]: Sen'jin Shieldmasta",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_181",
    "_info": "(3) 4/7 [NEUTRAL]: Injured Blademaster",
    "text": "<b>Battlecry:</b> Deal 4 damage to HIMSELF.",
    play ({self}) {
      self.dealDamage(4);
    }
  },
  {
    //unused ?
    "id": "CS2_181e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Full Strength",
    "text": "This minion has +2 Attack."
  },
  {
    "id": "CS2_182",
    "_info": "(4) 4/5 [NEUTRAL]: Chillwind Yeti"
  },
  {
    "id": "CS2_186",
    "_info": "(7) 7/7 [NEUTRAL]: War Golem"
  },
  {
    "id": "CS2_187",
    "_info": "(5) 5/4 [NEUTRAL]: Booty Bay Bodyguard",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_188",
    "_info": "(1) 1/1 [NEUTRAL]: Abusive Sergeant",
    "text": "<b>Battlecry:</b> Give a minion +2 Attack this turn.",
    xxx: 'test buff',
    target: 'minion',
    play ({target, buff}) {
      buff(target, 'CS2_188o');
    }
  },
  {
    "id": "CS2_188o",
    "_info": "ENCHANTMENT [*NEUTRAL]: 'Inspired'",
    "text": "This minion has +2 Attack this turn.",
    xxx: 1,
    attack: 2,
    expires: 'turn'
  },
  {
    "id": "CS2_189",
    "_info": "(1) 1/1 [NEUTRAL]: Elven Archer",
    "text": "<b>Battlecry:</b> Deal 1 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamage(1);
    }
  },
  {
    "id": "CS2_196",
    "_info": "(3) 2/3 [NEUTRAL]: Razorfen Hunter",
    "text": "<b>Battlecry:</b> Summon a 1/1 Boar.",
    play ({summon}) {
      summon('CS2_boar');
    }
  },
  {
    //added manually
    "id": "CS2_boar",
    "_info": "(1) 1/1 [*NEUTRAL]: Boar |BEAST"
  },
  {
    "id": "CS2_197",
    "_info": "(4) 4/4 [NEUTRAL]: Ogre Magi",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "CS2_200",
    "_info": "(6) 6/7 [NEUTRAL]: Boulderfist Ogre"
  },
  {
    "id": "CS2_201",
    "_info": "(7) 9/5 [NEUTRAL]: Core Hound |BEAST"
  },
  {
    "id": "CS2_203",
    "_info": "(3) 2/1 [NEUTRAL]: Ironbeak Owl |BEAST",
    "text": "<b>Battlecry:</b> <b>Silence</b> a minion.",
    target: 'minion',
    play ({target}) {
      target.silence();   
    }
  },
  {
    "id": "CS2_213",
    "_info": "(6) 5/2 [NEUTRAL]: Reckless Rocketeer",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "CS2_221",
    "_info": "(5) 4/6 [NEUTRAL]: Spiteful Smith",
    "text": "<b>Enrage:</b> Your weapon has +2 Attack."
  },
  {
    "id": "CS2_221e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Sharp!",
    "text": "+2 Attack from Spiteful Smith."
  },
  {
    "id": "CS2_222",
    "_info": "(7) 6/6 [NEUTRAL]: Stormwind Champion",
    "text": "Your other minions have +1/+1.",
    xxx: 'aura + other',
    aura: {
      target: 'other own minion',
      buff: 'CS2_222o'
    }
  },
  {
    "id": "CS2_222o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Might of Stormwind",
    "text": "Has +1/+1.",
    xxx: 0,
    attack: 1,
    health: 1
  },
  {
    "id": "CS2_226",
    "_info": "(5) 4/4 [NEUTRAL]: Frostwolf Warlord",
    "text": "<b>Battlecry:</b> Gain +1/+1 for each other friendly minion on the battlefield."
  },
  {
    "id": "CS2_226e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Frostwolf Banner",
    "text": "Increased stats."
  },
  {
    "id": "CS2_227",
    "_info": "(5) 7/6 [NEUTRAL]: Venture Co. Mercenary",
    "text": "Your minions cost (3) more."
  },
  {
    "id": "CS2_231",
    "_info": "(0) 1/1 [NEUTRAL]: Wisp"
  },
  {
    "id": "CS2_232",
    "_info": "(8) 8/8 [DRUID]: Ironbark Protector",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "CS2_233",
    "_info": "(4) SPELL [ROGUE]: Blade Flurry",
    "text": "Destroy your weapon and deal its damage to all enemy minions."
  },
  {
    "id": "CS2_234",
    "_info": "(2) SPELL [PRIEST]: Shadow Word: Pain",
    "text": "Destroy a minion with 3 or less Attack."
  },
  {
    "id": "CS2_235",
    "_info": "(1) 1/3 [PRIEST]: Northshire Cleric",
    "text": "Whenever a minion is healed, draw a card."
  },
  {
    "id": "CS2_236",
    "_info": "(2) SPELL [PRIEST]: Divine Spirit",
    "text": "Double a minion's Health."
  },
  {
    "id": "CS2_236e",
    "_info": "ENCHANTMENT [*PRIEST]: Divine Spirit",
    "text": "This minion has double Health."
  },
  {
    "id": "CS2_237",
    "_info": "(5) 3/2 [HUNTER]: Starving Buzzard |BEAST",
    "text": "Whenever you summon a Beast, draw a card.",
    xxx: 1,
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.minion_summoned,
        condition: 'own minion .race=beast',
        action: ({draw}) => draw(1) // sketch is sketch, lala lalala         
      }
    ]
  },
  {
    "id": "DS1_055",
    "_info": "(5) 4/5 [NEUTRAL]: Darkscale Healer",
    "text": "<b>Battlecry:</b> Restore 2 Health to all friendly characters."
  },
  {
    "id": "DS1_070",
    "_info": "(4) 4/3 [HUNTER]: Houndmaster",
    "text": "<b>Battlecry:</b> Give a friendly Beast +2/+2 and <b>Taunt</b>.",
    xxx: 1,
    target: 'own minion .race=beast',
    play ({target, buff}) {
      buff(target, 'DS1_070o');
    }
  },
  {
    "id": "DS1_070o",
    "_info": "ENCHANTMENT [*HUNTER]: Master's Presence",
    "text": "+2/+2 and <b>Taunt</b>.",
    xxx: 1,
    attack: 2,
    health: 2,
    tags: [TAGS.taunt]
  },
  {
    "id": "DS1_175",
    "_info": "(1) 1/1 [HUNTER]: Timber Wolf |BEAST",
    "text": "Your other Beasts have +1 Attack.",
    xxx: 'aura',
    aura: {
      target: 'other own minion .race=beast',
      buff: 'DS1_175o'
    }
  },
  {
    "id": "DS1_175o",
    "_info": "ENCHANTMENT [*HUNTER]: Furious Howl",
    "text": "+1 Attack from Timber Wolf.",
    xxx: 'aura',
    attack: 1
  },
  {
    "id": "DS1_178",
    "_info": "(5) 2/5 [HUNTER]: Tundra Rhino |BEAST",
    "text": "Your Beasts have <b>Charge</b>.",
    xxx: 'aura',
    aura: {
      target: 'own minion .race=beast',
      buff: 'DS1_178e'
    }
  },
  {
    "id": "DS1_178e",
    "_info": "ENCHANTMENT [*HUNTER]: Charge",
    "text": "Tundra Rhino grants <b>Charge</b>.",
    xxx: 'aura',
    tags: [TAGS.charge]
  },
  {
    "id": "DS1_183",
    "_info": "(4) SPELL [HUNTER]: Multi-Shot",
    "text": "Deal $3 damage to two random enemy minions.",
    xxx: 'target can only have 1 value :( this one should have other property.. like ~ playcondition'
  },
  {
    "id": "DS1_184",
    "_info": "(1) SPELL [HUNTER]: Tracking",
    "text": "Look at the top 3 cards of your deck. Draw one and discard the others."
  },
  {
    "id": "DS1_185",
    "_info": "(1) SPELL [HUNTER]: Arcane Shot",
    "text": "Deal $2 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamageSpell(2);
    }
  },
  {
    "id": "DS1_188",
    "_info": "(7) 5/2 WEAPON [HUNTER]: Gladiator's Longbow",
    "text": "Your hero is <b>Immune</b> while attacking."
  },
  {
    "id": "DS1_188e",
    "_info": "ENCHANTMENT [*HUNTER]: Gladiator's Longbow enchantment"
  },
  {
    "id": "DS1_233",
    "_info": "(2) SPELL [PRIEST]: Mind Blast",
    "text": "Deal $5 damage to the enemy hero.",
    play ({$}) { 
      $('enemy hero').dealDamageSpell(5)
    }
  },
  {
    "id": "EX1_001",
    "_info": "(1) 1/2 [NEUTRAL]: Lightwarden",
    "text": "Whenever a character is healed, gain +2 Attack."
  },
  {
    "id": "EX1_001e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Warded",
    "text": "Increased Attack."
  },
  {
    "id": "EX1_002",
    "_info": "(6) 4/5 [NEUTRAL]: The Black Knight",
    "text": "<b>Battlecry:</b> Destroy an enemy minion with <b>Taunt</b>.",
    target: 'enemy minion #taunt',
    play ({target}) {
      target.destroy()
    }
  },
  {
    "id": "EX1_004",
    "_info": "(1) 2/1 [NEUTRAL]: Young Priestess",
    "text": "At the end of your turn, give another random friendly minion +1 Health."
  },
  {
    "id": "EX1_004e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Elune's Grace",
    "text": "Increased Health."
  },
  {
    "id": "EX1_005",
    "_info": "(5) 4/2 [NEUTRAL]: Big Game Hunter",
    "text": "<b>Battlecry:</b> Destroy a minion with 7 or more Attack.",
    target: 'minion .attack>=7',
    play ({target}) {
      target.destroy()
    }
  },
  {
    "id": "EX1_006",
    "_info": "(3) 0/3 [NEUTRAL]: Alarm-o-Bot |MECHANICAL",
    "text": "[x]At the start of your turn,\nswap this minion with a\n   random one in your hand."
  },
  {
    "id": "EX1_007",
    "_info": "(3) 1/3 [NEUTRAL]: Acolyte of Pain",
    "text": "Whenever this minion takes damage, draw a card.",
    xxx: 0,
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.character_damaged,
        condition: ({self, target}) => target === self, // 'self'
        action: ({draw}) => draw(1) //should be :alive (aka hp>0 and NOT pending destroy)         
      }
    ] 
  },
  {
    "id": "EX1_008",
    "_info": "(1) 1/1 [NEUTRAL]: Argent Squire",
    "text": "<b>Divine Shield</b>",
    tags: [TAGS.divineShield]
  },
  {
    "id": "EX1_009",
    "_info": "(1) 1/1 [NEUTRAL]: Angry Chicken |BEAST",
    "text": "<b>Enrage:</b> +5 Attack.",
    xxx: 'enrage',
    enrage: 'EX1_009e'
  },
  {
    "id": "EX1_009e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+5 Attack.",
    xxx: 'enrage',
    attack: 5,
    expires: 'enrage' // aura ?
  },
  {
    "id": "EX1_010",
    "_info": "(1) 2/1 [NEUTRAL]: Worgen Infiltrator",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "EX1_011",
    "_info": "(1) 2/1 [NEUTRAL]: Voodoo Doctor",
    "text": "<b>Battlecry:</b> Restore 2 Health."
  },
  {
    "id": "EX1_012",
    "_info": "(2) 1/1 [NEUTRAL]: Bloodmage Thalnos",
    "text": "<b>Spell Damage +1</b>. <b>Deathrattle:</b> Draw a card."
  },
  {
    "id": "EX1_014",
    "_info": "(3) 5/5 [NEUTRAL]: King Mukla |BEAST",
    "text": "<b>Battlecry:</b> Give your opponent 2 Bananas."
  },
  {
    "id": "EX1_014t",
    "_info": "(1) SPELL [*NEUTRAL]: Bananas",
    "text": "Give a minion +1/+1."
  },
  {
    "id": "EX1_014te",
    "_info": "ENCHANTMENT [*NEUTRAL]: Bananas",
    "text": "Has +1/+1."
  },
  {
    "id": "EX1_015",
    "_info": "(2) 1/1 [NEUTRAL]: Novice Engineer",
    "text": "<b>Battlecry:</b> Draw a card."
  },
  {
    "id": "EX1_016",
    "_info": "(6) 5/5 [NEUTRAL]: Sylvanas Windrunner",
    "text": "<b>Deathrattle:</b> Take\ncontrol of a random\nenemy minion."
  },
  {
    "id": "EX1_017",
    "_info": "(3) 4/2 [NEUTRAL]: Jungle Panther |BEAST",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "EX1_019",
    "_info": "(3) 3/2 [NEUTRAL]: Shattered Sun Cleric",
    "text": "<b>Battlecry:</b> Give a friendly minion +1/+1.",
    target: 'own minion',
    play ({target, buff}) {
      buff(target, 'EX1_019e');
    }
  },
  {
    "id": "EX1_019e",
    "_info": "ENCHANTMENT [*PRIEST]: Cleric's Blessing",
    "text": "+1/+1.",
    xxx: 1,
    attack: 1,
    health: 1
  },
  {
    "id": "EX1_020",
    "_info": "(3) 3/1 [NEUTRAL]: Scarlet Crusader",
    "text": "<b>Divine Shield</b>",
    tags: [TAGS.divineShield]
  },
  {
    "id": "EX1_021",
    "_info": "(3) 2/3 [NEUTRAL]: Thrallmar Farseer",
    "text": "<b>Windfury</b>",
    tags: [TAGS.windfury]
  },
  {
    "id": "EX1_023",
    "_info": "(4) 3/3 [NEUTRAL]: Silvermoon Guardian",
    "text": "<b>Divine Shield</b>",
    tags: [TAGS.divineShield]
  },
  {
    "id": "EX1_025",
    "_info": "(4) 2/4 [NEUTRAL]: Dragonling Mechanic",
    "text": "<b>Battlecry:</b> Summon a 2/1 Mechanical Dragonling.",
    play ({summon}) {
      summon('EX1_025t');
    }
  },
  {
    "id": "EX1_025t",
    "_info": "(1) 2/1 [*NEUTRAL]: Mechanical Dragonling |MECHANICAL"
  },
  {
    "id": "EX1_028",
    "_info": "(5) 5/5 [NEUTRAL]: Stranglethorn Tiger |BEAST",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "EX1_029",
    "_info": "(1) 1/1 [NEUTRAL]: Leper Gnome",
    "text": "<b>Deathrattle:</b> Deal 2 damage to the enemy hero.",
    death ({$}) {
      $('enemy hero').dealDamage(2);
    }
  },
  {
    "id": "EX1_032",
    "_info": "(6) 4/5 [NEUTRAL]: Sunwalker",
    "text": "<b>Taunt</b>\n<b>Divine Shield</b>",
    tags: [TAGS.taunt, TAGS.divineShield]
  },
  {
    "id": "EX1_033",
    "_info": "(6) 4/5 [NEUTRAL]: Windfury Harpy",
    "text": "<b>Windfury</b>",
    tags: [TAGS.windfury]
  },
  {
    "id": "EX1_043",
    "_info": "(4) 4/1 [NEUTRAL]: Twilight Drake |DRAGON",
    "text": "<b>Battlecry:</b> Gain +1 Health for each card in your hand."
  },
  {
    "id": "EX1_043e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Hour of Twilight",
    "text": "Increased Health."
  },
  {
    "id": "EX1_044",
    "_info": "(3) 2/2 [NEUTRAL]: Questing Adventurer",
    "text": "Whenever you play a card, gain +1/+1."
  },
  {
    "id": "EX1_044e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Level Up!",
    "text": "Increased Attack and Health."
  },
  {
    "id": "EX1_045",
    "_info": "(2) 4/5 [NEUTRAL]: Ancient Watcher",
    "text": "Can't attack."
  },
  {
    "id": "EX1_046",
    "_info": "(4) 4/4 [NEUTRAL]: Dark Iron Dwarf",
    "text": "<b>Battlecry:</b> Give a minion +2 Attack this turn."
  },
  {
    "id": "EX1_046e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Tempered",
    "text": "+2 Attack this turn."
  },
  {
    "id": "EX1_048",
    "_info": "(4) 4/3 [NEUTRAL]: Spellbreaker",
    "text": "<b>Battlecry:</b> <b>Silence</b> a minion.",
    target: 'minion',
    play ({target}) {
      target.silence();
    }
  },
  {
    "id": "EX1_049",
    "_info": "(2) 3/2 [NEUTRAL]: Youthful Brewmaster",
    "text": "<b>Battlecry:</b> Return a friendly minion from the battlefield to your hand.",
    xxx: 'sketch',
    target: 'own minion',
    play ({target}) {
      target.returnToHand()
    }
  },
  {
    "id": "EX1_050",
    "_info": "(3) 2/2 [NEUTRAL]: Coldlight Oracle |MURLOC",
    "text": "<b>Battlecry:</b> Each player draws 2 cards."
  },
  {
    "id": "EX1_055",
    "_info": "(2) 1/3 [NEUTRAL]: Mana Addict",
    "text": "Whenever you cast a spell, gain +2 Attack this turn."
  },
  {
    "id": "EX1_055o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Empowered",
    "text": "Mana Addict has increased Attack."
  },
  {
    "id": "EX1_057",
    "_info": "(4) 5/4 [NEUTRAL]: Ancient Brewmaster",
    "text": "<b>Battlecry:</b> Return a friendly minion from the battlefield to your hand."
  },
  {
    "id": "EX1_058",
    "_info": "(2) 2/3 [NEUTRAL]: Sunfury Protector",
    "text": "<b>Battlecry:</b> Give adjacent minions <b>Taunt</b>.",
    play ({buff, $, self}) {
      let pals = $('minion').adjacent(self);
      buff(pals, TAGS.taunt)
    }
  },
  {
    "id": "EX1_059",
    "_info": "(2) 2/2 [NEUTRAL]: Crazed Alchemist",
    "text": "<b>Battlecry:</b> Swap the Attack and Health of a minion."
  },
  {
    "id": "EX1_059e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Experiments!",
    "text": "Attack and Health have been swapped by Crazed Alchemist."
  },
  {
    "id": "EX1_062",
    "_info": "(4) 2/4 [NEUTRAL]: Old Murk-Eye |MURLOC",
    "text": "<b>Charge</b>. Has +1 Attack for each other Murloc on the battlefield.",
    xxx: 'reverse? aura',
    tags: [TAGS.charge],
    // small time buccaneer has his enchantment :( but not murk eye
  },
  {
    "id": "EX1_066",
    "_info": "(2) 3/2 [NEUTRAL]: Acidic Swamp Ooze",
    "text": "<b>Battlecry:</b> Destroy your opponent's weapon."
  },
  {
    "id": "EX1_067",
    "_info": "(6) 4/2 [NEUTRAL]: Argent Commander",
    "text": "<b>Charge</b>\n<b>Divine Shield</b>",
    tags: [TAGS.charge, TAGS.divineShield]
  },
  {
    "id": "EX1_076",
    "_info": "(2) 2/2 [NEUTRAL]: Pint-Sized Summoner",
    "text": "The first minion you play each turn costs (1) less."
  },
  {
    "id": "EX1_080",
    "_info": "(1) 1/2 [NEUTRAL]: Secretkeeper",
    "text": "Whenever a <b>Secret</b> is played, gain +1/+1."
  },
  {
    "id": "EX1_080o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Keeping Secrets",
    "text": "Increased stats."
  },
  {
    "id": "EX1_082",
    "_info": "(2) 3/2 [NEUTRAL]: Mad Bomber",
    "text": "<b>Battlecry:</b> Deal 3 damage randomly split between all other characters.",
    play ({$, self}) {
      for(let i = 0; i < 3; i++) {
        $('character .health>0').exclude(self).getRandom().dealDamage(1);
      }
    }
  },
  {
    "id": "EX1_083",
    "_info": "(3) 3/3 [NEUTRAL]: Tinkmaster Overspark",
    "text": "[x]<b>Battlecry:</b> Transform\nanother random minion\ninto a 5/5 Devilsaur\n or a 1/1 Squirrel."
  },
  {
    "id": "EX1_084",
    "_info": "(3) 2/3 [WARRIOR]: Warsong Commander",
    "text": "Your <b>Charge</b> minions have +1 Attack.",
    xxx: 'aura',
    aura: {
      target: 'own minion #charge',
      buff: 'EX1_084e'
    }
  },
  {
    "id": "EX1_084e",
    "_info": "ENCHANTMENT [*WARRIOR]: Charge",
    "text": "Warsong Commander is granting this minion +1 Attack.",
    xxx: 'aura',
    attack: 1,
    expires: 'aura'
  },
  {
    "id": "EX1_085",
    "_info": "(3) 3/3 [NEUTRAL]: Mind Control Tech",
    "text": "[x]<b>Battlecry:</b> If your opponent\nhas 4 or more minions, take\n control of one at random."
  },
  {
    "id": "EX1_089",
    "_info": "(3) 4/4 [NEUTRAL]: Arcane Golem",
    "text": "<b>Battlecry:</b> Give your opponent a Mana Crystal."
  },
  {
    "id": "EX1_091",
    "_info": "(6) 4/5 [PRIEST]: Cabal Shadow Priest",
    "text": "<b>Battlecry:</b> Take control of an enemy minion that has 2 or less Attack."
  },
  {
    "id": "EX1_093",
    "_info": "(4) 2/3 [NEUTRAL]: Defender of Argus",
    "text": "<b>Battlecry:</b> Give adjacent minions +1/+1 and <b>Taunt</b>.",
    xxx: 'adjacent',
    play ({buff, $, self}) {
      let dudes = $('minion').adjacent(self);
      buff(dudes, 'EX1_093e')
    }
  },
  {
    "id": "EX1_093e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Hand of Argus",
    "text": "+1/+1 and <b>Taunt</b>.",
    xxx: 'adjacent',
    attack: 1,
    health: 1,
    tags: [TAGS.taunt] 
  },
  {
    "id": "EX1_095",
    "_info": "(6) 4/4 [NEUTRAL]: Gadgetzan Auctioneer",
    "text": "Whenever you cast a spell, draw a card."
  },
  {
    "id": "EX1_096",
    "_info": "(2) 2/1 [NEUTRAL]: Loot Hoarder",
    "text": "<b>Deathrattle:</b> Draw a card."
  },
  {
    "id": "EX1_097",
    "_info": "(5) 4/4 [NEUTRAL]: Abomination",
    "text": "<b>Taunt</b>. <b>Deathrattle:</b> Deal 2\ndamage to ALL characters.",
    tags: [TAGS.taunt],
    death ({$}) {
      $('character').dealDamage(2);
    }
  },
  {
    "id": "EX1_100",
    "_info": "(2) 0/4 [NEUTRAL]: Lorewalker Cho",
    "text": "Whenever a player casts a spell, put a copy into the other player’s hand."
  },
  {
    "id": "EX1_102",
    "_info": "(3) 1/4 [NEUTRAL]: Demolisher |MECHANICAL",
    "text": "At the start of your turn, deal 2 damage to a random enemy."
  },
  {
    "id": "EX1_103",
    "_info": "(3) 2/3 [NEUTRAL]: Coldlight Seer |MURLOC",
    "text": "<b>Battlecry:</b> Give your other Murlocs +2 Health."
  },
  {
    "id": "EX1_103e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mrghlglhal",
    "text": "+2 Health."
  },
  {
    "id": "EX1_105",
    "_info": "(12) 8/8 [NEUTRAL]: Mountain Giant",
    "text": "Costs (1) less for each other card in your hand."
  },
  {
    "id": "EX1_110",
    "_info": "(6) 4/5 [NEUTRAL]: Cairne Bloodhoof",
    "text": "<b>Deathrattle:</b> Summon a 4/5 Baine Bloodhoof.",
    death ({summon}) {
      summon('EX1_110t');
    }
  },
  {
    "id": "EX1_110t",
    "_info": "(4) 4/5 [*NEUTRAL]: Baine Bloodhoof"
  },
  {
    "id": "EX1_112",
    "_info": "(6) 6/6 [NEUTRAL]: Gelbin Mekkatorque",
    "text": "<b>Battlecry:</b> Summon an AWESOME invention."
  },
  {
    "id": "EX1_116",
    "_info": "(5) 6/2 [NEUTRAL]: Leeroy Jenkins",
    "text": "<b>Charge</b>. <b>Battlecry:</b> Summon two 1/1 Whelps for your opponent.",
    xxx: 1,
    tags: [TAGS.charge],
    play ({summonEnemy}) {
      console.log('leeeeeeeroy!!!!!!!');
      summonEnemy('LOEA10_3'); //murloc tinyfin
      summonEnemy('LOEA10_3'); //murloc tinyfin
    }
  },
  {
    "id": "EX1_116t",
    "_info": "(1) 1/1 [*NEUTRAL]: Whelp |DRAGON"
  },
  {
    "id": "EX1_124",
    "_info": "(2) SPELL [ROGUE]: Eviscerate",
    "text": "Deal $2 damage. <b>Combo:</b> Deal $4 damage instead."
  },
  {
    "id": "EX1_126",
    "_info": "(2) SPELL [ROGUE]: Betrayal",
    "text": "Force an enemy minion to deal its damage to the minions next to it."
  },
  {
    "id": "EX1_128",
    "_info": "(1) SPELL [ROGUE]: Conceal",
    "text": "Give your minions <b>Stealth</b> until your next turn."
  },
  {
    "id": "EX1_128e",
    "_info": "ENCHANTMENT [*ROGUE]: Concealed",
    "text": "Stealthed until your next turn."
  },
  {
    "id": "EX1_129",
    "_info": "(3) SPELL [ROGUE]: Fan of Knives",
    "text": "Deal $1 damage to all enemy minions. Draw a card."
  },
  {
    "id": "EX1_130",
    "_info": "(1) SPELL [PALADIN]: Noble Sacrifice",
    "text": "<b>Secret:</b> When an enemy attacks, summon a 2/1 Defender as the new target."
  },
  {
    "id": "EX1_130a",
    "_info": "(1) 2/1 [*PALADIN]: Defender"
  },
  {
    "id": "EX1_131",
    "_info": "(2) 2/2 [ROGUE]: Defias Ringleader",
    "text": "<b>Combo:</b> Summon a 2/1 Defias Bandit."
  },
  {
    "id": "EX1_131t",
    "_info": "(1) 2/1 [*ROGUE]: Defias Bandit"
  },
  {
    "id": "EX1_132",
    "_info": "(1) SPELL [PALADIN]: Eye for an Eye",
    "text": "<b>Secret:</b> When your hero takes damage, deal that much damage to the enemy hero."
  },
  {
    "id": "EX1_133",
    "_info": "(3) 2/2 WEAPON [ROGUE]: Perdition's Blade",
    "text": "<b>Battlecry:</b> Deal 1 damage. <b>Combo:</b> Deal 2 instead."
  },
  {
    "id": "EX1_134",
    "_info": "(3) 3/3 [ROGUE]: SI:7 Agent",
    "text": "<b>Combo:</b> Deal 2 damage."
  },
  {
    "id": "EX1_136",
    "_info": "(1) SPELL [PALADIN]: Redemption",
    "text": "<b>Secret:</b> When a friendly minion dies, return it to life with 1 Health."
  },
  {
    "id": "EX1_137",
    "_info": "(3) SPELL [ROGUE]: Headcrack",
    "text": "Deal $2 damage to the enemy hero. <b>Combo:</b> Return this to your hand next turn."
  },
  {
    "id": "EX1_144",
    "_info": "(0) SPELL [ROGUE]: Shadowstep",
    "text": "Return a friendly minion to your hand. It costs (2) less."
  },
  {
    "id": "EX1_145",
    "_info": "(0) SPELL [ROGUE]: Preparation",
    "text": "The next spell you cast this turn costs (3) less."
  },
  {
    "id": "EX1_145o",
    "_info": "ENCHANTMENT [*ROGUE]: Preparation",
    "text": "The next spell you cast this turn costs (3) less."
  },
  {
    "id": "EX1_154",
    "_info": "(2) SPELL [DRUID]: Wrath",
    "text": "<b>Choose One -</b> Deal $3 damage to a minion; or $1 damage and draw a card."
  },
  {
    "id": "EX1_154a",
    "_info": "(0) SPELL [*DRUID]: Wrath",
    "text": "Deal $3 damage to a minion."
  },
  {
    "id": "EX1_154b",
    "_info": "(0) SPELL [*DRUID]: Wrath",
    "text": "Deal $1 damage to a minion. Draw a card."
  },
  {
    "id": "EX1_155",
    "_info": "(3) SPELL [DRUID]: Mark of Nature",
    "text": "<b>Choose One -</b> Give a minion +4 Attack; or +4 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_155a",
    "_info": "(0) SPELL [*DRUID]: Mark of Nature",
    "text": "+4 Attack."
  },
  {
    "id": "EX1_155ae",
    "_info": "ENCHANTMENT [*DRUID]: Mark of Nature",
    "text": "This minion has +4 Attack."
  },
  {
    "id": "EX1_155b",
    "_info": "(0) SPELL [*DRUID]: Mark of Nature",
    "text": "+4 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_155be",
    "_info": "ENCHANTMENT [*DRUID]: Mark of Nature",
    "text": "This minion has +4 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_158",
    "_info": "(4) SPELL [DRUID]: Soul of the Forest",
    "text": "Give your minions \"<b>Deathrattle:</b> Summon a 2/2 Treant.\""
  },
  {
    "id": "EX1_158e",
    "_info": "ENCHANTMENT [*DRUID]: Soul of the Forest",
    "text": "Deathrattle: Summon a 2/2 Treant.",
    death ({summon}) {
      summon('EX1_158t');
    }
  },
  {
    "id": "EX1_158t",
    "_info": "(2) 2/2 [*DRUID]: Treant"
  },
  {
    "id": "EX1_160",
    "_info": "(2) SPELL [DRUID]: Power of the Wild",
    "text": "<b>Choose One -</b> Give your minions +1/+1; or Summon a 3/2 Panther."
  },
  {
    "id": "EX1_160a",
    "_info": "(0) SPELL [*DRUID]: Summon a Panther",
    "text": "Summon a 3/2 Panther.",
    play ({summon}) {
      summon('EX1_160t');
    }
  },
  {
    "id": "EX1_160b",
    "_info": "(0) SPELL [*DRUID]: Leader of the Pack",
    "text": "Give your minions +1/+1."
  },
  {
    "id": "EX1_160be",
    "_info": "ENCHANTMENT [*DRUID]: Leader of the Pack",
    "text": "+1/+1."
  },
  {
    "id": "EX1_160t",
    "_info": "(2) 3/2 [*DRUID]: Panther |BEAST"
  },
  {
    "id": "EX1_161",
    "_info": "(1) SPELL [DRUID]: Naturalize",
    "text": "Destroy a minion.\nYour opponent draws 2 cards."
  },
  {
    "id": "EX1_162",
    "_info": "(2) 2/2 [NEUTRAL]: Dire Wolf Alpha |BEAST",
    "text": "Adjacent minions have +1 Attack."
  },
  {
    "id": "EX1_162o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Strength of the Pack",
    "text": "+1 Attack from Dire Wolf Alpha."
  },
  {
    "id": "EX1_164",
    "_info": "(5) SPELL [DRUID]: Nourish",
    "text": "<b>Choose One -</b> Gain 2 Mana Crystals; or Draw 3 cards."
  },
  {
    "id": "EX1_164a",
    "_info": "(0) SPELL [*DRUID]: Nourish",
    "text": "Gain 2 Mana Crystals."
  },
  {
    "id": "EX1_164b",
    "_info": "(0) SPELL [*DRUID]: Nourish",
    "text": "Draw 3 cards."
  },
  {
    "id": "EX1_165",
    "_info": "(5) 4/4 [DRUID]: Druid of the Claw",
    "text": "[x]<b>Choose One -</b> Transform\ninto a 4/4 with <b>Charge</b>;\nor a 4/6 with <b>Taunt</b>.",
    xxx: 'test',
    chooseOne: ['EX1_165a', 'EX1_165b']
  },
  {
    "id": "EX1_165a",
    "_info": "(0) SPELL [*DRUID]: Cat Form",
    "text": "<b>Charge</b>",
    xxx: 'test',
    play ({self}) {
      self.tranform('EX1_165t1');
    }
  },
  {
    "id": "EX1_165b",
    "_info": "(0) SPELL [*DRUID]: Bear Form",
    "text": "+2 Health and <b>Taunt</b>.",
    xxx: 'test',
    play ({self}) {
      self.tranform('EX1_165t2');
    }
  },
  {
    "id": "EX1_165t1",
    "_info": "(5) 4/4 [*DRUID]: Druid of the Claw |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "EX1_165t2",
    "_info": "(5) 4/6 [*DRUID]: Druid of the Claw |BEAST",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "EX1_166",
    "_info": "(4) 2/2 [DRUID]: Keeper of the Grove",
    "text": "<b>Choose One -</b> Deal 2 damage; or <b>Silence</b> a minion.",
    xxx: 'test',
    chooseOne: ['EX1_166a', 'EX1_166b']
  },
  {
    "id": "EX1_166a",
    "_info": "(0) SPELL [*DRUID]: Moonfire",
    "text": "Deal 2 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamageSpell(2);
    }
  },
  {
    "id": "EX1_166b",
    "_info": "(0) SPELL [*DRUID]: Dispel",
    "text": "<b>Silence</b> a minion.",
    target: 'minion',
    play ({target}) {
      target.silence();
    }
  },
  {
    "id": "EX1_169",
    "_info": "(0) SPELL [DRUID]: Innervate",
    "text": "Gain 2 Mana Crystals this turn only."
  },
  {
    "id": "EX1_170",
    "_info": "(3) 2/3 [NEUTRAL]: Emperor Cobra |BEAST",
    "text": "<b>Poisonous</b>"
  },
  {
    "id": "EX1_173",
    "_info": "(6) SPELL [DRUID]: Starfire",
    "text": "Deal $5 damage.\nDraw a card."
  },
  {
    "id": "EX1_178",
    "_info": "(7) 5/5 [DRUID]: Ancient of War",
    "text": "<b>Choose One -</b>\n+5 Attack; or +5 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_178a",
    "_info": "(0) SPELL [*DRUID]: Rooted",
    "text": "+5 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_178ae",
    "_info": "ENCHANTMENT [*DRUID]: Rooted",
    "text": "+5 Health and <b>Taunt</b>."
  },
  {
    "id": "EX1_178b",
    "_info": "(0) SPELL [*DRUID]: Uproot",
    "text": "+5 Attack."
  },
  {
    "id": "EX1_178be",
    "_info": "ENCHANTMENT [*DRUID]: Uprooted",
    "text": "+5 Attack."
  },
  {
    "id": "EX1_238",
    "_info": "(1) SPELL [SHAMAN]: Lightning Bolt",
    "text": "Deal $3 damage. <b>Overload:</b> (1)"
  },
  {
    "id": "EX1_241",
    "_info": "(3) SPELL [SHAMAN]: Lava Burst",
    "text": "Deal $5 damage. <b>Overload:</b> (2)"
  },
  {
    "id": "EX1_243",
    "_info": "(1) 3/1 [SHAMAN]: Dust Devil |ELEMENTAL",
    "text": "<b>Windfury</b>. <b>Overload:</b> (2)"
  },
  {
    "id": "EX1_244",
    "_info": "(0) SPELL [SHAMAN]: Totemic Might",
    "text": "Give your Totems +2 Health."
  },
  {
    "id": "EX1_244e",
    "_info": "ENCHANTMENT [*SHAMAN]: Totemic Might",
    "text": "+2 Health."
  },
  {
    "id": "EX1_245",
    "_info": "(1) SPELL [SHAMAN]: Earth Shock",
    "text": "<b>Silence</b> a minion, then deal $1 damage to it.",
    target: 'minion',
    play ({target}) {
      target.silence();
      target.dealDamageSpell(1);
    }
  },
  {
    "id": "EX1_246",
    "_info": "(3) SPELL [SHAMAN]: Hex",
    "text": "Transform a minion into a 0/1 Frog with <b>Taunt</b>."
  },
  {
    "id": "EX1_246e",
    "_info": "ENCHANTMENT [*SHAMAN]: Hexxed",
    "text": "This minion has been transformed!"
  },
  {
    "id": "EX1_247",
    "_info": "(2) 2/3 WEAPON [SHAMAN]: Stormforged Axe",
    "text": "<b>Overload:</b> (1)"
  },
  {
    "id": "EX1_248",
    "_info": "(3) SPELL [SHAMAN]: Feral Spirit",
    "text": "Summon two 2/3 Spirit Wolves with <b>Taunt</b>. <b>Overload:</b> (2)",
    xxx: 0,
    overload: 2,
    play ({summon}) {
      summon('EX1_tk11');
      summon('EX1_tk11');
    }
  },
  {
    // added manually
    "id": "EX1_tk11",
    "_info": "(2) 2/3 [*SHAMAN]: Spirit Wolf",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "EX1_249",
    "_info": "(7) 7/5 [NEUTRAL]: Baron Geddon |ELEMENTAL",
    "text": "At the end of your turn, deal 2 damage to ALL other characters."
  },
  {
    "id": "EX1_250",
    "_info": "(5) 7/8 [SHAMAN]: Earth Elemental |ELEMENTAL",
    "text": "<b>Taunt</b>. <b>Overload:</b> (3)"
  },
  {
    "id": "EX1_251",
    "_info": "(1) SPELL [SHAMAN]: Forked Lightning",
    "text": "Deal $2 damage to 2 random enemy minions. <b>Overload:</b> (2)"
  },
  {
    "id": "EX1_258",
    "_info": "(3) 2/4 [SHAMAN]: Unbound Elemental |ELEMENTAL",
    "text": "Whenever you play a card with <b>Overload</b>, gain +1/+1."
  },
  {
    "id": "EX1_258e",
    "_info": "ENCHANTMENT [*SHAMAN]: Overloading",
    "text": "Increased stats."
  },
  {
    "id": "EX1_259",
    "_info": "(3) SPELL [SHAMAN]: Lightning Storm",
    "text": "Deal $2-$3 damage to all enemy minions. <b>Overload:</b> (2)"
  },
  {
    "id": "EX1_274",
    "_info": "(4) 3/3 [MAGE]: Ethereal Arcanist",
    "text": "If you control a <b>Secret</b> at the end of your turn, gain +2/+2."
  },
  {
    "id": "EX1_274e",
    "_info": "ENCHANTMENT [*MAGE]: Raw Power!",
    "text": "Increased stats."
  },
  {
    "id": "EX1_275",
    "_info": "(4) SPELL [MAGE]: Cone of Cold",
    "text": "<b>Freeze</b> a minion and the minions next to it, and deal $1 damage to them."
  },
  {
    "id": "EX1_277",
    "_info": "(1) SPELL [MAGE]: Arcane Missiles",
    "text": "Deal $3 damage randomly split among all enemies.",
    xxx: 1,
    play ({$}) {
      for(let i = 0; i < 3; i++) {
        //must be :alive i.e not-mortally-wounded
        $('enemy character .health>0').getRandom().dealDamageSpell(1);
      }
    }
  },
  {
    "id": "EX1_278",
    "_info": "(2) SPELL [ROGUE]: Shiv",
    "text": "Deal $1 damage.\nDraw a card."
  },
  {
    "id": "EX1_279",
    "_info": "(10) SPELL [MAGE]: Pyroblast",
    "text": "Deal $10 damage."
  },
  {
    "id": "EX1_283",
    "_info": "(6) 5/5 [NEUTRAL]: Frost Elemental |ELEMENTAL",
    "text": "<b>Battlecry:</b> <b>Freeze</b> a character."
  },
  {
    "id": "EX1_284",
    "_info": "(5) 4/4 [NEUTRAL]: Azure Drake |DRAGON",
    "text": "<b>Spell Damage +1</b>. <b>Battlecry:</b> Draw a card."
  },
  {
    "id": "EX1_287",
    "_info": "(3) SPELL [MAGE]: Counterspell",
    "text": "<b>Secret:</b> When your opponent casts a spell, <b>Counter</b> it."
  },
  {
    "id": "EX1_289",
    "_info": "(3) SPELL [MAGE]: Ice Barrier",
    "text": "<b>Secret:</b> When your\nhero is attacked,\ngain 8 Armor."
  },
  {
    "id": "EX1_294",
    "_info": "(3) SPELL [MAGE]: Mirror Entity",
    "text": "<b>Secret:</b> After your opponent plays a minion, summon a copy of it."
  },
  {
    "id": "EX1_295",
    "_info": "(3) SPELL [MAGE]: Ice Block",
    "text": "<b>Secret:</b> When your hero takes fatal damage, prevent it and become <b>Immune</b> this turn."
  },
  {
    "id": "EX1_295o",
    "_info": "ENCHANTMENT [*MAGE]: Ice Block",
    "text": "Your hero is <b>Immune</b> this turn."
  },
  {
    "id": "EX1_298",
    "_info": "(8) 8/8 [NEUTRAL]: Ragnaros the Firelord |ELEMENTAL",
    "text": "Can't attack. At the end of your turn, deal 8 damage to a random enemy."
  },
  {
    "id": "EX1_301",
    "_info": "(3) 3/5 [WARLOCK]: Felguard |DEMON",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Destroy one of your Mana Crystals."
  },
  {
    "id": "EX1_302",
    "_info": "(1) SPELL [WARLOCK]: Mortal Coil",
    "text": "Deal $1 damage to a minion. If that kills it, draw a card."
  },
  {
    "id": "EX1_303",
    "_info": "(4) SPELL [WARLOCK]: Shadowflame",
    "text": "Destroy a friendly minion and deal its Attack damage to all enemy minions."
  },
  {
    "id": "EX1_304",
    "_info": "(3) 3/3 [WARLOCK]: Void Terror |DEMON",
    "text": "[x]<b>Battlecry:</b> Destroy both\nadjacent minions and gain\n their Attack and Health."
  },
  {
    "id": "EX1_304e",
    "_info": "ENCHANTMENT [*WARLOCK]: Consume",
    "text": "Increased stats."
  },
  {
    "id": "EX1_306",
    "_info": "(2) 4/3 [WARLOCK]: Succubus |DEMON",
    "text": "<b>Battlecry:</b> Discard a random card."
  },
  {
    "id": "EX1_308",
    "_info": "(1) SPELL [WARLOCK]: Soulfire",
    "text": "[x]Deal $4 damage.\nDiscard a random card."
  },
  {
    "id": "EX1_309",
    "_info": "(6) SPELL [WARLOCK]: Siphon Soul",
    "text": "Destroy a minion. Restore #3 Health to your hero."
  },
  {
    "id": "EX1_310",
    "_info": "(5) 5/7 [WARLOCK]: Doomguard |DEMON",
    "text": "<b>Charge</b>. <b>Battlecry:</b> Discard two random cards."
  },
  {
    "id": "EX1_312",
    "_info": "(8) SPELL [WARLOCK]: Twisting Nether",
    "text": "Destroy all minions.",
    play ({$}) {
      $('minion').destroy();
    }
  },
  {
    "id": "EX1_313",
    "_info": "(4) 5/6 [WARLOCK]: Pit Lord |DEMON",
    "text": "<b>Battlecry:</b> Deal 5 damage to your hero.",
    play ({$}) {
      $('own hero').dealDamage(5);
    }
  },
  {
    "id": "EX1_315",
    "_info": "(4) 0/4 [WARLOCK]: Summoning Portal",
    "text": "Your minions cost (2) less, but not less than (1).",
    xxx: 'aura mana',
    aura: {
      target: 'own minion @hand', // maybe @anywhere ??
      buff: { effects :{
        cost (v, {target}) {
          let c = v - 2;
          return  c < 1 ? 1 : c;
        }
      }}
    }
  },
  {
    "id": "EX1_316",
    "_info": "(1) SPELL [WARLOCK]: Power Overwhelming",
    "text": "Give a friendly minion +4/+4 until end of turn. Then, it dies. Horribly."
  },
  {
    "id": "EX1_316e",
    "_info": "ENCHANTMENT [*WARLOCK]: Power Overwhelming",
    "text": "This minion has +4/+4, but will die a horrible death at the end of the turn."
  },
  {
    "id": "EX1_317",
    "_info": "(3) SPELL [WARLOCK]: Sense Demons",
    "text": "Draw 2 Demons\nfrom your deck."
  },
  {
    "id": "EX1_317t",
    "_info": "(1) 1/1 [*WARLOCK]: Worthless Imp |DEMON",
    "text": "<i>You are out of demons! At least there are always imps...</i>"
  },
  {
    "id": "EX1_319",
    "_info": "(1) 3/2 [WARLOCK]: Flame Imp |DEMON",
    "text": "<b>Battlecry:</b> Deal 3 damage to your hero.",
    play ({$}) {
      $('own hero').dealDamage(3);
    }
  },
  {
    "id": "EX1_320",
    "_info": "(5) SPELL [WARLOCK]: Bane of Doom",
    "text": "Deal $2 damage to a character. If that kills it, summon a random Demon."
  },
  {
    "id": "EX1_323",
    "_info": "(9) 3/15 [WARLOCK]: Lord Jaraxxus |DEMON",
    "text": "<b>Battlecry:</b> Destroy your hero and replace it with Lord Jaraxxus."
  },
  {
    "id": "EX1_323h",
    "_info": "0/15 HERO [*WARLOCK]: Lord Jaraxxus |DEMON"
  },
  {
    "id": "EX1_323w",
    "_info": "(3) 3/8 WEAPON [*WARLOCK]: Blood Fury"
  },
  {
    "id": "EX1_332",
    "_info": "(0) SPELL [PRIEST]: Silence",
    "text": "<b>Silence</b> a minion."
  },
  {
    "id": "EX1_334",
    "_info": "(4) SPELL [PRIEST]: Shadow Madness",
    "text": "Gain control of an enemy minion with 3 or less Attack until end of turn."
  },
  {
    "id": "EX1_334e",
    "_info": "ENCHANTMENT [*PRIEST]: Shadow Madness",
    "text": "This minion has switched controllers this turn."
  },
  {
    "id": "EX1_335",
    "_info": "(4) 0/5 [PRIEST]: Lightspawn |ELEMENTAL",
    "text": "This minion's Attack is always equal to its Health."
  },
  {
    "id": "EX1_339",
    "_info": "(3) SPELL [PRIEST]: Thoughtsteal",
    "text": "Copy 2 cards in your opponent's deck and add them to your hand."
  },
  {
    "id": "EX1_341",
    "_info": "(2) 0/5 [PRIEST]: Lightwell",
    "text": "At the start of your turn, restore 3 Health to a damaged friendly character."
  },
  {
    "id": "EX1_345",
    "_info": "(4) SPELL [PRIEST]: Mindgames",
    "text": "Put a copy of\na random minion from\nyour opponent's deck into the battlefield."
  },
  {
    "id": "EX1_345t",
    "_info": "(0) 0/1 [*PRIEST]: Shadow of Nothing",
    "text": "Mindgames whiffed! Your opponent had no minions!"
  },
  {
    "id": "EX1_349",
    "_info": "(3) SPELL [PALADIN]: Divine Favor",
    "text": "Draw cards until you have as many in hand as your opponent."
  },
  {
    "id": "EX1_350",
    "_info": "(7) 7/7 [PRIEST]: Prophet Velen",
    "text": "Double the damage and healing of your spells and Hero Power."
  },
  {
    "id": "EX1_354",
    "_info": "(8) SPELL [PALADIN]: Lay on Hands",
    "text": "Restore #8 Health. Draw 3 cards."
  },
  {
    "id": "EX1_355",
    "_info": "(5) SPELL [PALADIN]: Blessed Champion",
    "text": "Double a minion's Attack."
  },
  {
    "id": "EX1_355e",
    "_info": "ENCHANTMENT [*PALADIN]: Blessed Champion",
    "text": "This minion's Attack has been doubled."
  },
  {
    "id": "EX1_360",
    "_info": "(1) SPELL [PALADIN]: Humility",
    "text": "Change a minion's Attack to 1."
  },
  {
    "id": "EX1_360e",
    "_info": "ENCHANTMENT [*PALADIN]: Humility",
    "text": "Attack has been changed to 1."
  },
  {
    "id": "EX1_362",
    "_info": "(2) 2/2 [PALADIN]: Argent Protector",
    "text": "<b>Battlecry:</b> Give a friendly minion <b>Divine Shield</b>.",
    xxx: 'test',
    target: 'minion',
    play ({target, buff}) {
      buff(target, TAGS.divineShield);
    }
  },
  {
    "id": "EX1_363",
    "_info": "(1) SPELL [PALADIN]: Blessing of Wisdom",
    "text": "Choose a minion. Whenever it attacks, draw a card.",
    xxx: 'test',
    target: 'minion',
    play ({target, buff}) {
      buff(target, 'EX1_363e');
    }
  },
  {
    "id": "EX1_363e",
    "_info": "ENCHANTMENT [*PALADIN]: Blessing of Wisdom",
    "text": "When this minion attacks, the player who blessed it draws a card.",
    xxx: 'implement'
    //trigger:FN ?
  },
  {
    //this looks like crazy brawl version ?
    "id": "EX1_363e2",
    "_info": "ENCHANTMENT [*PALADIN]: Blessing of Wisdom",
    "text": "When this minion attacks, the enemy player draws a card."
  },
  {
    "id": "EX1_365",
    "_info": "(5) SPELL [PALADIN]: Holy Wrath",
    "text": "Draw a card and deal damage equal to its Cost."
  },
  {
    "id": "EX1_366",
    "_info": "(3) 1/5 WEAPON [PALADIN]: Sword of Justice",
    "text": "After you summon a minion, give it +1/+1 and this loses 1 Durability."
  },
  {
    "id": "EX1_366e",
    "_info": "ENCHANTMENT [*PALADIN]: Justice Served",
    "text": "Has +1/+1."
  },
  {
    "id": "EX1_371",
    "_info": "(1) SPELL [PALADIN]: Hand of Protection",
    "text": "Give a minion <b>Divine Shield</b>.",
    xxx: 1,
    target: 'minion',
    play ({buff, target}) {
      buff(target, TAGS.divineShield);
    }
  },
  {
    "id": "EX1_379",
    "_info": "(1) SPELL [PALADIN]: Repentance",
    "text": "<b>Secret:</b> After your opponent plays a minion, reduce its Health to 1."
  },
  {
    "id": "EX1_379e",
    "_info": "ENCHANTMENT [*PALADIN]: Repentance",
    "text": "Health reduced to 1."
  },
  {
    "id": "EX1_382",
    "_info": "(3) 3/3 [PALADIN]: Aldor Peacekeeper",
    "text": "<b>Battlecry:</b> Change an enemy minion's Attack to 1.",
    xxx: 'buff',
    target: 'enemy minion',
    play ({target, buff}) {
      buff(target, 'EX1_382e');
    }
  },
  {
    "id": "EX1_382e",
    "_info": "ENCHANTMENT [*PALADIN]: Stand Down!",
    "text": "Attack changed to 1.",
    xxx: 'buff set atk to 1',
    attack () {
      return 1;
    }
  },
  {
    "id": "EX1_383",
    "_info": "(8) 6/6 [PALADIN]: Tirion Fordring",
    "text": "<b>Divine Shield</b>. <b>Taunt</b>. <b>Deathrattle:</b> Equip a 5/3 Ashbringer."
  },
  {
    "id": "EX1_383t",
    "_info": "(5) 5/3 WEAPON [*PALADIN]: Ashbringer"
  },
  {
    "id": "EX1_384",
    "_info": "(6) SPELL [PALADIN]: Avenging Wrath",
    "text": "Deal $8 damage randomly split among all enemies."
  },
  {
    "id": "EX1_390",
    "_info": "(3) 2/3 [NEUTRAL]: Tauren Warrior",
    "text": "<b>Taunt</b>\n<b>Enrage:</b> +3 Attack."
  },
  {
    "id": "EX1_390e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+3 Attack."
  },
  {
    "id": "EX1_391",
    "_info": "(2) SPELL [WARRIOR]: Slam",
    "text": "Deal $2 damage to a minion. If it survives, draw a card."
  },
  {
    "id": "EX1_392",
    "_info": "(2) SPELL [WARRIOR]: Battle Rage",
    "text": "Draw a card for each damaged friendly character."
  },
  {
    "id": "EX1_393",
    "_info": "(2) 2/3 [NEUTRAL]: Amani Berserker",
    "text": "<b>Enrage:</b> +3 Attack"
  },
  {
    "id": "EX1_393e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+3 Attack."
  },
  {
    "id": "EX1_396",
    "_info": "(4) 1/7 [NEUTRAL]: Mogu'shan Warden",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "EX1_398",
    "_info": "(4) 3/3 [WARRIOR]: Arathi Weaponsmith",
    "text": "<b>Battlecry:</b> Equip a 2/2 weapon."
  },
  {
    "id": "EX1_398t",
    "_info": "(1) 2/2 WEAPON [*WARRIOR]: Battle Axe"
  },
  {
    "id": "EX1_399",
    "_info": "(5) 2/7 [NEUTRAL]: Gurubashi Berserker",
    "text": "Whenever this minion takes damage, gain +3 Attack."
  },
  {
    "id": "EX1_399e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Berserking",
    "text": "This minion has increased Attack."
  },
  {
    "id": "EX1_400",
    "_info": "(1) SPELL [WARRIOR]: Whirlwind",
    "text": "Deal $1 damage to ALL minions."
  },
  {
    "id": "EX1_402",
    "_info": "(2) 1/4 [WARRIOR]: Armorsmith",
    "text": "Whenever a friendly minion takes damage, gain 1 Armor."
  },
  {
    "id": "EX1_405",
    "_info": "(1) 0/4 [NEUTRAL]: Shieldbearer",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "EX1_407",
    "_info": "(5) SPELL [WARRIOR]: Brawl",
    "text": "Destroy all minions except one. <i>(chosen randomly)</i>"
  },
  {
    "id": "EX1_408",
    "_info": "(4) SPELL [WARRIOR]: Mortal Strike",
    "text": "Deal $4 damage. If you have 12 or less Health, deal $6 instead."
  },
  {
    "id": "EX1_409",
    "_info": "(1) SPELL [WARRIOR]: Upgrade!",
    "text": "If you have a weapon, give it +1/+1. Otherwise equip a 1/3 weapon."
  },
  {
    "id": "EX1_409e",
    "_info": "ENCHANTMENT [*WARRIOR]: Upgraded",
    "text": "+1 Attack and +1 Durability."
  },
  {
    "id": "EX1_409t",
    "_info": "(1) 1/3 WEAPON [*WARRIOR]: Heavy Axe"
  },
  {
    "id": "EX1_410",
    "_info": "(1) SPELL [WARRIOR]: Shield Slam",
    "text": "Deal 1 damage to a minion for each Armor you have."
  },
  {
    "id": "EX1_411",
    "_info": "(7) 7/1 WEAPON [WARRIOR]: Gorehowl",
    "text": "Attacking a minion costs 1 Attack instead of 1 Durability."
  },
  {
    "id": "EX1_411e",
    "_info": "ENCHANTMENT [*WARRIOR]: Bloodrage",
    "text": "No durability loss."
  },
  {
    "id": "EX1_411e2",
    "_info": "ENCHANTMENT [*WARRIOR]: Needs Sharpening",
    "text": "Decreased Attack."
  },
  {
    "id": "EX1_412",
    "_info": "(3) 3/3 [NEUTRAL]: Raging Worgen",
    "text": "<b>Enrage:</b> <b>Windfury</b> and +1 Attack.",
    xxx: 1,
    enrage: 'EX1_412e'
  },
  {
    "id": "EX1_412e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+1 Attack and <b>Windfury</b>.",
    xxx: 'enrage',
    attack: 1,
    tags: [TAGS.windfury]
  },
  {
    "id": "EX1_414",
    "_info": "(8) 4/9 [WARRIOR]: Grommash Hellscream",
    "text": "<b>Charge</b>\n<b>Enrage:</b> +6 Attack"
  },
  {
    "id": "EX1_414e",
    "_info": "ENCHANTMENT [*WARRIOR]: Enraged",
    "text": "+6 Attack"
  },
  {
    "id": "EX1_506",
    "_info": "(2) 2/1 [NEUTRAL]: Murloc Tidehunter |MURLOC",
    "text": "<b>Battlecry:</b> Summon a 1/1 Murloc Scout.",
    play ({summon}) {
      summon('EX1_506a');
    }
  },
  {
    "id": "EX1_506a",
    "_info": "(1) 1/1 [*NEUTRAL]: Murloc Scout |MURLOC"
  },
  {
    "id": "EX1_507",
    "_info": "(3) 3/3 [NEUTRAL]: Murloc Warleader |MURLOC",
    "text": "Your other Murlocs have +2/+1."
  },
  {
    "id": "EX1_507e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mrgglaargl!",
    "text": "+2/+1 from Murloc Warleader."
  },
  {
    "id": "EX1_508",
    "_info": "(1) 1/1 [NEUTRAL]: Grimscale Oracle |MURLOC",
    "text": "Your other Murlocs have +1 Attack."
  },
  {
    "id": "EX1_508o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mlarggragllabl!",
    "text": "This Murloc has +1 Attack."
  },
  {
    "id": "EX1_509",
    "_info": "(1) 1/2 [NEUTRAL]: Murloc Tidecaller |MURLOC",
    "text": "Whenever you summon a Murloc, gain +1 Attack."
  },
  {
    "id": "EX1_509e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Blarghghl",
    "text": "Increased Attack."
  },
  {
    "id": "EX1_522",
    "_info": "(2) 1/1 [ROGUE]: Patient Assassin",
    "text": "<b>Stealth</b>\n <b>Poisonous</b>"
  },
  {
    "id": "EX1_531",
    "_info": "(2) 2/2 [HUNTER]: Scavenging Hyena |BEAST",
    "text": "Whenever a friendly Beast dies, gain +2/+1."
  },
  {
    "id": "EX1_531e",
    "_info": "ENCHANTMENT [*HUNTER]: Well Fed",
    "text": "Increased Attack and Health."
  },
  {
    "id": "EX1_533",
    "_info": "(2) SPELL [HUNTER]: Misdirection",
    "text": "<b>Secret:</b> When an enemy attacks your hero, instead it attacks another random character."
  },
  {
    "id": "EX1_534",
    "_info": "(6) 6/5 [HUNTER]: Savannah Highmane |BEAST",
    "text": "<b>Deathrattle:</b> Summon two 2/2 Hyenas.",
    death ({summon}) {
      summon('EX1_534t');
      summon('EX1_534t');
    }
  },
  {
    "id": "EX1_534t",
    "_info": "(2) 2/2 [*HUNTER]: Hyena |BEAST"
  },
  {
    "id": "EX1_536",
    "_info": "(3) 3/2 WEAPON [HUNTER]: Eaglehorn Bow",
    "text": "[x]Whenever a friendly\n<b>Secret</b> is revealed,\ngain +1 Durability."
  },
  {
    "id": "EX1_536e",
    "_info": "ENCHANTMENT [*HUNTER]: Upgraded",
    "text": "Increased Durability."
  },
  {
    "id": "EX1_537",
    "_info": "(5) SPELL [HUNTER]: Explosive Shot",
    "text": "Deal $5 damage to a minion and $2 damage to adjacent ones."
  },
  {
    "id": "EX1_538",
    "_info": "(3) SPELL [HUNTER]: Unleash the Hounds",
    "text": "For each enemy minion, summon a 1/1 Hound with <b>Charge</b>.",
    play ({$, summon}) {
      $('enemy minion').forEach(v => summon('EX1_538t'));
    }
  },
  {
    "id": "EX1_538t",
    "_info": "(1) 1/1 [*HUNTER]: Hound |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "EX1_539",
    "_info": "(3) SPELL [HUNTER]: Kill Command",
    "text": "Deal $3 damage. If you control a Beast, deal\n$5 damage instead."
  },
  {
    "id": "EX1_543",
    "_info": "(9) 8/8 [HUNTER]: King Krush |BEAST",
    "text": "<b>Charge</b>",
    tags: [TAGS.charge]
  },
  {
    "id": "EX1_544",
    "_info": "(2) SPELL [HUNTER]: Flare",
    "text": "All minions lose <b>Stealth</b>. Destroy all enemy <b>Secrets</b>. Draw a card."
  },
  {
    "id": "EX1_549",
    "_info": "(1) SPELL [HUNTER]: Bestial Wrath",
    "text": "Give a friendly Beast +2 Attack and <b>Immune</b> this turn."
  },
  {
    "id": "EX1_549o",
    "_info": "ENCHANTMENT [*HUNTER]: Bestial Wrath",
    "text": "+2 Attack and <b>Immune</b> this turn."
  },
  {
    "id": "EX1_554",
    "_info": "(2) SPELL [HUNTER]: Snake Trap",
    "text": "<b>Secret:</b> When one of your minions is attacked, summon three 1/1 Snakes."
  },
  {
    "id": "EX1_554t",
    "_info": "(1) 1/1 [*HUNTER]: Snake |BEAST"
  },
  {
    "id": "EX1_556",
    "_info": "(3) 2/3 [NEUTRAL]: Harvest Golem |MECHANICAL",
    "text": "<b>Deathrattle:</b> Summon a 2/1 Damaged Golem.",
    death ({summon}) {
      summon('skele21');
    }
  },
  {
    // added manually
    "id": "skele21",
    "_info": "(1) 2/1 [*NEUTRAL]: Damaged Golem |MECHANICAL"
  },
  {
    "id": "EX1_557",
    "_info": "(2) 0/4 [NEUTRAL]: Nat Pagle",
    "text": "At the start of your turn, you have a 50% chance to draw an extra card."
  },
  {
    "id": "EX1_558",
    "_info": "(5) 5/4 [NEUTRAL]: Harrison Jones",
    "text": "<b>Battlecry:</b> Destroy your opponent's weapon and draw cards equal to its Durability."
  },
  {
    "id": "EX1_559",
    "_info": "(7) 5/7 [MAGE]: Archmage Antonidas",
    "text": "Whenever you cast a spell, add a 'Fireball' spell to your hand."
  },
  {
    "id": "EX1_560",
    "_info": "(9) 8/8 [NEUTRAL]: Nozdormu |DRAGON",
    "text": "Players only have 15 seconds to take their turns."
  },
  {
    "id": "EX1_561",
    "_info": "(9) 8/8 [NEUTRAL]: Alexstrasza |DRAGON",
    "text": "<b>Battlecry:</b> Set a hero's remaining Health to 15."
  },
  {
    "id": "EX1_561e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Alexstrasza's Fire",
    "text": "Health set to 15."
  },
  {
    "id": "EX1_562",
    "_info": "(9) 8/8 [NEUTRAL]: Onyxia |DRAGON",
    "text": "<b>Battlecry:</b> Summon 1/1 Whelps until your side of the battlefield is full.",
    play ({summon}) {
      for(let i = 0; i < 7; i++) {
        //if the board is full - minion will just not summon
        summon('ds1_whelptoken');
      }
    }
  },
  {
    "id": "EX1_563",
    "_info": "(9) 4/12 [NEUTRAL]: Malygos |DRAGON",
    "text": "<b>Spell Damage +5</b>"
  },
  {
    "id": "EX1_564",
    "_info": "(5) 3/3 [NEUTRAL]: Faceless Manipulator",
    "text": "<b>Battlecry:</b> Choose a minion and become a copy of it."
  },
  {
    "id": "EX1_565",
    "_info": "(2) 0/3 [SHAMAN]: Flametongue Totem |TOTEM",
    "text": "Adjacent minions have +2 Attack.",
    xxx: 'aura AND declarative adjacent ...',
    aura: {
      buff: 'EX1_565o',
      target: 'adjacent'  
    }
  },
  {
    "id": "EX1_565o",
    "_info": "ENCHANTMENT [*SHAMAN]: Flametongue",
    "text": "+2 Attack from Flametongue Totem.",
    xxx: 'aura',
    attack: 2,
    //expires: 'turn|aura|fn',
    expires: 'aura' 
  },
  {
    "id": "EX1_567",
    "_info": "(5) 2/8 WEAPON [SHAMAN]: Doomhammer",
    "text": "<b>Windfury, Overload:</b> (2)"
  },
  {
    "id": "EX1_570",
    "_info": "(4) SPELL [DRUID]: Bite",
    "text": "Give your hero +4 Attack this turn and 4 Armor."
  },
  {
    "id": "EX1_570e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Bite",
    "text": "+4 Attack this turn."
  },
  {
    "id": "EX1_571",
    "_info": "(5) SPELL [DRUID]: Force of Nature",
    "text": "Summon three 2/2 Treants.",
    xxx: ' maybe i use incorrect treant ID, as there are several of them',
    play ({summon}) {
      summon('EX1_tk9');
      summon('EX1_tk9');
      summon('EX1_tk9');
    }
  },
  {
    // added manually
    "id": "EX1_tk9",
    "_info": "(2) 2/2 [*DRUID]: Treant"
  },
  {
    "id": "EX1_572",
    "_info": "(9) 4/12 [NEUTRAL]: Ysera |DRAGON",
    "text": "At the end of your turn, add a Dream Card to your hand."
  },
  {
    "id": "EX1_573",
    "_info": "(9) 5/8 [DRUID]: Cenarius",
    "text": "<b>Choose One -</b> Give your other minions +2/+2; or Summon two 2/2 Treants with <b>Taunt</b>."
  },
  {
    "id": "EX1_573a",
    "_info": "(0) SPELL [*DRUID]: Demigod's Favor",
    "text": "Give your other minions +2/+2."
  },
  {
    "id": "EX1_573ae",
    "_info": "ENCHANTMENT [*DRUID]: Demigod's Favor",
    "text": "+2/+2."
  },
  {
    "id": "EX1_573b",
    "_info": "(0) SPELL [*DRUID]: Shan'do's Lesson",
    "text": "Summon two 2/2 Treants with <b>Taunt</b>.",
    play ({summon}) {
      summon('EX1_573t');
      summon('EX1_573t');
    }
  },
  {
    "id": "EX1_573t",
    "_info": "(2) 2/2 [*DRUID]: Treant",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "EX1_575",
    "_info": "(3) 0/3 [SHAMAN]: Mana Tide Totem |TOTEM",
    "text": "At the end of your turn, draw a card."
  },
  {
    "id": "EX1_577",
    "_info": "(6) 9/7 [NEUTRAL]: The Beast |BEAST",
    "text": "<b>Deathrattle:</b> Summon a 3/3 Finkle Einhorn for your opponent."
  },
  {
    "id": "EX1_578",
    "_info": "(1) SPELL [DRUID]: Savagery",
    "text": "Deal damage equal to your hero's Attack to a minion.",
    target: 'minion',
    play ({target, $}) {
      let damage = $('own hero')[0].attack;
      target.dealDamageSpell(damage);
    }
  },
  {
    "id": "EX1_581",
    "_info": "(2) SPELL [ROGUE]: Sap",
    "text": "Return an enemy minion to your opponent's hand."
  },
  {
    "id": "EX1_582",
    "_info": "(3) 1/4 [NEUTRAL]: Dalaran Mage",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "EX1_583",
    "_info": "(6) 5/4 [NEUTRAL]: Priestess of Elune",
    "text": "<b>Battlecry:</b> Restore 4 Health to your hero."
  },
  {
    "id": "EX1_584",
    "_info": "(4) 2/5 [NEUTRAL]: Ancient Mage",
    "text": "<b>Battlecry:</b> Give adjacent minions <b>Spell Damage +1</b>."
  },
  {
    "id": "EX1_584e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Teachings of the Kirin Tor",
    "text": "<b>Spell Damage +1</b>."
  },
  {
    "id": "EX1_586",
    "_info": "(10) 8/8 [NEUTRAL]: Sea Giant",
    "text": "Costs (1) less for each other minion on the battlefield."
  },
  {
    "id": "EX1_587",
    "_info": "(4) 3/3 [SHAMAN]: Windspeaker",
    "text": "<b>Battlecry:</b> Give a friendly minion <b>Windfury</b>.",
    xxx: 'test buff()',
    target: 'own minion',
    play ({target, buff}) {
      buff(target, TAGS.windfury);
    }
  },
  {
    "id": "EX1_590",
    "_info": "(3) 3/3 [NEUTRAL]: Blood Knight",
    "text": "<b>Battlecry:</b> All minions lose <b>Divine Shield</b>. Gain +3/+3 for each Shield lost."
  },
  {
    "id": "EX1_590e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Shadows of M'uru",
    "text": "This minion has consumed Divine Shields and has increased Attack and Health."
  },
  {
    "id": "EX1_591",
    "_info": "(4) 3/5 [PRIEST]: Auchenai Soulpriest",
    "text": "Your cards and powers that restore Health now deal damage instead."
  },
  {
    "id": "EX1_593",
    "_info": "(5) 4/4 [NEUTRAL]: Nightblade",
    "text": "<b>Battlecry: </b>Deal 3 damage to the enemy hero."
  },
  {
    "id": "EX1_594",
    "_info": "(3) SPELL [MAGE]: Vaporize",
    "text": "<b>Secret:</b> When a minion attacks your hero, destroy it."
  },
  {
    "id": "EX1_595",
    "_info": "(4) 4/2 [NEUTRAL]: Cult Master",
    "text": "Whenever one of your other minions dies, draw a card."
  },
  {
    "id": "EX1_596",
    "_info": "(2) SPELL [WARLOCK]: Demonfire",
    "text": "Deal $2 damage to a minion. If it’s a friendly Demon, give it +2/+2 instead."
  },
  {
    "id": "EX1_596e",
    "_info": "ENCHANTMENT [*WARLOCK]: Demonfire",
    "text": "This Demon has +2/+2."
  },
  {
    "id": "EX1_597",
    "_info": "(3) 1/5 [NEUTRAL]: Imp Master",
    "text": "[x]At the end of your turn, deal\n1 damage to this minion\n and summon a 1/1 Imp."
  },
  {
    "id": "EX1_603",
    "_info": "(2) 2/2 [WARRIOR]: Cruel Taskmaster",
    "text": "<b>Battlecry:</b> Deal 1 damage to a minion and give it +2 Attack."
  },
  {
    "id": "EX1_603e",
    "_info": "ENCHANTMENT [*WARRIOR]: Whipped Into Shape",
    "text": "+2 Attack."
  },
  {
    "id": "EX1_604",
    "_info": "(3) 2/4 [WARRIOR]: Frothing Berserker",
    "text": "Whenever a minion takes damage, gain +1 Attack."
  },
  {
    "id": "EX1_604o",
    "_info": "ENCHANTMENT [*WARRIOR]: Berserk",
    "text": "Increased Attack."
  },
  {
    "id": "EX1_606",
    "_info": "(3) SPELL [WARRIOR]: Shield Block",
    "text": "Gain 5 Armor.\nDraw a card."
  },
  {
    "id": "EX1_607",
    "_info": "(0) SPELL [WARRIOR]: Inner Rage",
    "text": "Deal $1 damage to a minion and give it +2 Attack."
  },
  {
    "id": "EX1_607e",
    "_info": "ENCHANTMENT [*WARRIOR]: Inner Rage",
    "text": "+2 Attack."
  },
  {
    "id": "EX1_608",
    "_info": "(2) 3/2 [MAGE]: Sorcerer's Apprentice",
    "text": "Your spells cost (1) less."
  },
  {
    "id": "EX1_609",
    "_info": "(2) SPELL [HUNTER]: Snipe",
    "text": "<b>Secret:</b> After your opponent plays a minion, deal $4 damage to it."
  },
  {
    "id": "EX1_610",
    "_info": "(2) SPELL [HUNTER]: Explosive Trap",
    "text": "<b>Secret:</b> When your hero is attacked, deal $2 damage to all enemies."
  },
  {
    "id": "EX1_611",
    "_info": "(2) SPELL [HUNTER]: Freezing Trap",
    "text": "<b>Secret:</b> When an enemy minion attacks, return it to its owner's hand. It costs (2) more."
  },
  {
    "id": "EX1_611e",
    "_info": "ENCHANTMENT [*HUNTER]: Trapped",
    "text": "Will be <b>Frozen</b> again at the start of the next turn."
  },
  {
    "id": "EX1_612",
    "_info": "(3) 4/3 [MAGE]: Kirin Tor Mage",
    "text": "[x]<b>Battlecry:</b> The next <b>Secret</b>\nyou play this turn costs (0)."
  },
  {
    "id": "EX1_612o",
    "_info": "ENCHANTMENT [*MAGE]: Power of the Kirin Tor",
    "text": "Your next Secret costs (0)."
  },
  {
    "id": "EX1_613",
    "_info": "(3) 2/2 [ROGUE]: Edwin VanCleef",
    "text": "<b>Combo:</b> Gain +2/+2 for each other card you've played this turn."
  },
  {
    "id": "EX1_613e",
    "_info": "ENCHANTMENT [*ROGUE]: VanCleef's Vengeance",
    "text": "Increased stats."
  },
  {
    "id": "EX1_614",
    "_info": "(6) 7/5 [NEUTRAL]: Illidan Stormrage |DEMON",
    "text": "Whenever you play a card, summon a 2/1 Flame of Azzinoth."
  },
  {
    "id": "EX1_614t",
    "_info": "(1) 2/1 [*NEUTRAL]: Flame of Azzinoth"
  },
  {
    "id": "EX1_616",
    "_info": "(2) 2/2 [NEUTRAL]: Mana Wraith",
    "text": "ALL minions cost (1) more."
  },
  {
    "id": "EX1_617",
    "_info": "(3) SPELL [HUNTER]: Deadly Shot",
    "text": "Destroy a random enemy minion."
  },
  {
    "id": "EX1_619",
    "_info": "(2) SPELL [PALADIN]: Equality",
    "text": "Change the Health of ALL minions to 1."
  },
  {
    "id": "EX1_619e",
    "_info": "ENCHANTMENT [*PALADIN]: Equality",
    "text": "Health changed to 1."
  },
  {
    "id": "EX1_620",
    "_info": "(25) 8/8 [NEUTRAL]: Molten Giant",
    "text": "Costs (1) less for each damage your hero has taken.",
    xxx: 'aura self cost',
    aura: {
      zone: ZONES.hand,
      target: 'self',
      buff: { 
        effects: {
          cost (v, {$}) {
            let h = $('own hero')[0].health;
            let c = v - (30 - h);
            return c > 0 ? c : 0;
          }
        }
      }
    }
  },
  {
    "id": "EX1_621",
    "_info": "(0) SPELL [PRIEST]: Circle of Healing",
    "text": "Restore #4 Health to ALL minions."
  },
  {
    "id": "EX1_622",
    "_info": "(3) SPELL [PRIEST]: Shadow Word: Death",
    "text": "Destroy a minion with 5 or more Attack."
  },
  {
    "id": "EX1_623",
    "_info": "(6) 6/6 [PRIEST]: Temple Enforcer",
    "text": "<b>Battlecry:</b> Give a friendly minion +3 Health."
  },
  {
    "id": "EX1_623e",
    "_info": "ENCHANTMENT [*PRIEST]: Infusion",
    "text": "+3 Health."
  },
  {
    "id": "EX1_624",
    "_info": "(6) SPELL [PRIEST]: Holy Fire",
    "text": "Deal $5 damage. Restore #5 Health to your hero."
  },
  {
    "id": "EX1_625",
    "_info": "(3) SPELL [PRIEST]: Shadowform",
    "text": "Your Hero Power becomes 'Deal 2 damage'. If already in Shadowform: 3 damage."
  },
  {
    "id": "EX1_625t",
    "_info": "(2) HERO_POWER [*PRIEST]: Mind Spike",
    "text": "<b>Hero Power</b>\nDeal $2 damage."
  },
  {
    "id": "EX1_625t2",
    "_info": "(2) HERO_POWER [*PRIEST]: Mind Shatter",
    "text": "<b>Hero Power</b>\nDeal $3 damage."
  },
  {
    "id": "EX1_626",
    "_info": "(4) SPELL [PRIEST]: Mass Dispel",
    "text": "<b>Silence</b> all enemy minions. Draw a card.",
    play ({$, draw}) {
      $('enemy minion').silence();
      draw(1);
    }
  },
  {
    "id": "FP1_001",
    "_info": "(1) 2/3 [NEUTRAL]: Zombie Chow",
    "text": "<b>Deathrattle:</b> Restore 5 Health to the enemy hero."
  },
  {
    "id": "FP1_002",
    "_info": "(2) 1/2 [NEUTRAL]: Haunted Creeper |BEAST",
    "text": "<b>Deathrattle:</b> Summon two 1/1 Spectral Spiders.",
    death ({summon}) {
      summon('FP1_002t');
      summon('FP1_002t');
    }
  },
  {
    "id": "FP1_002t",
    "_info": "(1) 1/1 [*NEUTRAL]: Spectral Spider"
  },
  {
    "id": "FP1_003",
    "_info": "(2) 1/2 [NEUTRAL]: Echoing Ooze",
    "text": "<b>Battlecry:</b> Summon an exact copy of this minion at the end of the turn."
  },
  {
    "id": "FP1_004",
    "_info": "(2) 2/2 [NEUTRAL]: Mad Scientist",
    "text": "<b>Deathrattle:</b> Put a <b>Secret</b> from your deck into the battlefield."
  },
  {
    "id": "FP1_005",
    "_info": "(3) 2/2 [NEUTRAL]: Shade of Naxxramas",
    "text": "<b>Stealth.</b> At the start of your turn, gain +1/+1."
  },
  {
    "id": "FP1_005e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Consume",
    "text": "Increased stats."
  },
  {
    "id": "FP1_007",
    "_info": "(2) 0/2 [NEUTRAL]: Nerubian Egg",
    "text": "<b>Deathrattle:</b> Summon a 4/4 Nerubian.",
    death ({summon}) {
      summon('FP1_007t');
    }
  },
  {
    "id": "FP1_007t",
    "_info": "(4) 4/4 [*NEUTRAL]: Nerubian"
  },
  {
    "id": "FP1_008",
    "_info": "(5) 4/6 [NEUTRAL]: Spectral Knight",
    "text": "Can't be targeted by spells or Hero Powers."
  },
  {
    "id": "FP1_009",
    "_info": "(3) 2/8 [NEUTRAL]: Deathlord",
    "text": "<b>Taunt. Deathrattle:</b> Your opponent puts a minion from their deck into the battlefield."
  },
  {
    "id": "FP1_010",
    "_info": "(6) 2/8 [NEUTRAL]: Maexxna |BEAST",
    "text": "<b>Poisonous</b>"
  },
  {
    "id": "FP1_011",
    "_info": "(1) 1/1 [HUNTER]: Webspinner |BEAST",
    "text": "<b>Deathrattle:</b> Add a random Beast card to your hand."
  },
  {
    "id": "FP1_012",
    "_info": "(5) 3/5 [NEUTRAL]: Sludge Belcher",
    "text": "<b>Taunt\nDeathrattle:</b> Summon a 1/2 Slime with <b>Taunt</b>.",
    death ({summon}) {
      summon('FP1_012t');
    }
  },
  {
    "id": "FP1_012t",
    "_info": "(1) 1/2 [*NEUTRAL]: Slime",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "FP1_013",
    "_info": "(8) 6/8 [NEUTRAL]: Kel'Thuzad",
    "text": "At the end of each turn, summon all friendly minions that died this turn."
  },
  {
    "id": "FP1_014",
    "_info": "(5) 7/4 [NEUTRAL]: Stalagg",
    "text": "<b>Deathrattle:</b> If Feugen also died this game, summon Thaddius."
  },
  {
    "id": "FP1_014t",
    "_info": "(10) 11/11 [*NEUTRAL]: Thaddius"
  },
  {
    "id": "FP1_015",
    "_info": "(5) 4/7 [NEUTRAL]: Feugen",
    "text": "<b>Deathrattle:</b> If Stalagg also died this game, summon Thaddius."
  },
  {
    "id": "FP1_016",
    "_info": "(4) 3/5 [NEUTRAL]: Wailing Soul",
    "text": "<b>Battlecry: Silence</b> your other minions."
  },
  {
    "id": "FP1_017",
    "_info": "(2) 1/4 [NEUTRAL]: Nerub'ar Weblord",
    "text": "Minions with <b>Battlecry</b> cost (2) more."
  },
  {
    "id": "FP1_018",
    "_info": "(3) SPELL [MAGE]: Duplicate",
    "text": "<b>Secret:</b> When a friendly minion dies, put 2 copies of it into your hand."
  },
  {
    "id": "FP1_019",
    "_info": "(4) SPELL [DRUID]: Poison Seeds",
    "text": "Destroy all minions and summon 2/2 Treants to replace them."
  },
  {
    "id": "FP1_019t",
    "_info": "(1) 2/2 [*DRUID]: Treant"
  },
  {
    "id": "FP1_020",
    "_info": "(1) SPELL [PALADIN]: Avenge",
    "text": "<b>Secret:</b> When one of your minions dies, give a random friendly minion +3/+2."
  },
  {
    "id": "FP1_020e",
    "_info": "ENCHANTMENT [*PALADIN]: Vengeance",
    "text": "+3/+2."
  },
  {
    "id": "FP1_021",
    "_info": "(4) 4/2 WEAPON [WARRIOR]: Death's Bite",
    "text": "<b>Deathrattle:</b> Deal 1 damage to all minions."
  },
  {
    "id": "FP1_022",
    "_info": "(4) 3/4 [WARLOCK]: Voidcaller |DEMON",
    "text": "<b>Deathrattle:</b> Put a random Demon from your hand into the battlefield."
  },
  {
    "id": "FP1_023",
    "_info": "(3) 3/4 [PRIEST]: Dark Cultist",
    "text": "<b>Deathrattle:</b> Give a random friendly minion +3 Health."
  },
  {
    "id": "FP1_023e",
    "_info": "ENCHANTMENT [*PRIEST]: Power of the Ziggurat",
    "text": "+3 Health."
  },
  {
    "id": "FP1_024",
    "_info": "(2) 1/3 [NEUTRAL]: Unstable Ghoul",
    "text": "<b>Taunt</b>. <b>Deathrattle:</b> Deal 1 damage to all minions.",
    tags: [TAGS.taunt],
    death ({$}) {
      $('minion').dealDamage(1);
    }
  },
  {
    "id": "FP1_025",
    "_info": "(2) SPELL [SHAMAN]: Reincarnate",
    "text": "Destroy a minion, then return it to life with full Health."
  },
  {
    "id": "FP1_026",
    "_info": "(4) 5/5 [ROGUE]: Anub'ar Ambusher",
    "text": "<b>Deathrattle:</b> Return a random friendly minion to your hand."
  },
  {
    "id": "FP1_027",
    "_info": "(3) 1/4 [NEUTRAL]: Stoneskin Gargoyle",
    "text": "At the start of your turn, restore this minion to full Health."
  },
  {
    "id": "FP1_028",
    "_info": "(1) 1/2 [NEUTRAL]: Undertaker",
    "text": "Whenever you summon a minion with <b>Deathrattle</b>, gain +1 Attack."
  },
  {
    "id": "FP1_028e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Darkness Calls",
    "text": "Increased stats."
  },
  {
    "id": "FP1_029",
    "_info": "(3) 4/4 [NEUTRAL]: Dancing Swords",
    "text": "<b>Deathrattle:</b> Your opponent draws a card."
  },
  {
    "id": "FP1_030",
    "_info": "(5) 5/5 [NEUTRAL]: Loatheb",
    "text": "<b>Battlecry:</b> Enemy spells cost (5) more next turn."
  },
  {
    "id": "FP1_030e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Necrotic Aura",
    "text": "Your spells cost (5) more this turn."
  },
  {
    "id": "FP1_031",
    "_info": "(4) 1/7 [NEUTRAL]: Baron Rivendare",
    "text": "Your minions trigger their <b>Deathrattles</b> twice."
  },
  {
    "id": "GVG_001",
    "_info": "(2) SPELL [MAGE]: Flamecannon",
    "text": "Deal $4 damage to a random enemy minion."
  },
  {
    "id": "GVG_002",
    "_info": "(2) 2/3 [MAGE]: Snowchugger |MECHANICAL",
    "text": "<b>Freeze</b> any character damaged by this minion."
  },
  {
    "id": "GVG_003",
    "_info": "(2) SPELL [MAGE]: Unstable Portal",
    "text": "Add a random minion to your hand. It costs (3) less."
  },
  {
    "id": "GVG_004",
    "_info": "(4) 5/4 [MAGE]: Goblin Blastmage",
    "text": "<b>Battlecry:</b> If you have a Mech, deal 4 damage randomly split among all enemies."
  },
  {
    "id": "GVG_005",
    "_info": "(4) SPELL [MAGE]: Echo of Medivh",
    "text": "Put a copy of each friendly minion into your hand."
  },
  {
    "id": "GVG_006",
    "_info": "(2) 2/3 [NEUTRAL]: Mechwarper |MECHANICAL",
    "text": "Your Mechs cost (1) less."
  },
  {
    "id": "GVG_007",
    "_info": "(7) 7/7 [MAGE]: Flame Leviathan |MECHANICAL",
    "text": "When you draw this, deal 2 damage to all characters."
  },
  {
    "id": "GVG_008",
    "_info": "(6) SPELL [PRIEST]: Lightbomb",
    "text": "Deal damage to each minion equal to its Attack.",
    play ({$}) {
      $('minion').forEach(v => v.dealDamageSpell(v.attack));
    }
  },
  {
    "id": "GVG_009",
    "_info": "(1) 2/1 [PRIEST]: Shadowbomber",
    "text": "<b>Battlecry:</b> Deal 3 damage to each hero.",
    play ({$}) {
      $('hero').dealDamage(3);
    }
  },
  {
    "id": "GVG_010",
    "_info": "(3) SPELL [PRIEST]: Velen's Chosen",
    "text": "Give a minion +2/+4 and <b>Spell Damage +1</b>."
  },
  {
    "id": "GVG_010b",
    "_info": "ENCHANTMENT [*NEUTRAL]: Velen's Chosen",
    "text": "+2/+4 and <b>Spell Damage +1</b>."
  },
  {
    "id": "GVG_011",
    "_info": "(2) 3/2 [PRIEST]: Shrinkmeister",
    "text": "<b>Battlecry:</b> Give a minion -2 Attack this turn."
  },
  {
    "id": "GVG_011a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Shrink Ray",
    "text": "-2 Attack this turn."
  },
  {
    "id": "GVG_012",
    "_info": "(1) SPELL [PRIEST]: Light of the Naaru",
    "text": "Restore #3 Health. If the target is still damaged, summon a Lightwarden."
  },
  {
    "id": "GVG_013",
    "_info": "(1) 1/2 [NEUTRAL]: Cogmaster",
    "text": "Has +2 Attack while you have a Mech."
  },
  {
    "id": "GVG_014",
    "_info": "(5) 6/2 [PRIEST]: Vol'jin",
    "text": "<b>Battlecry:</b> Swap Health with another minion."
  },
  {
    "id": "GVG_014a",
    "_info": "ENCHANTMENT [*PRIEST]: Shadowed",
    "text": "Health was swapped."
  },
  {
    "id": "GVG_015",
    "_info": "(2) SPELL [WARLOCK]: Darkbomb",
    "text": "Deal $3 damage."
  },
  {
    "id": "GVG_016",
    "_info": "(5) 8/8 [NEUTRAL]: Fel Reaver |MECHANICAL",
    "text": "Whenever your opponent plays a card, remove the top 3 cards of your deck."
  },
  {
    "id": "GVG_017",
    "_info": "(2) SPELL [HUNTER]: Call Pet",
    "text": "Draw a card.\nIf it's a Beast, it costs (4) less."
  },
  {
    "id": "GVG_018",
    "_info": "(2) 1/4 [WARLOCK]: Mistress of Pain |DEMON",
    "text": "Damage dealt by this minion also heals your hero."
  },
  {
    "id": "GVG_019",
    "_info": "(5) SPELL [WARLOCK]: Demonheart",
    "text": "Deal $5 damage to a minion.  If it's a friendly Demon, give it +5/+5 instead."
  },
  {
    "id": "GVG_019e",
    "_info": "ENCHANTMENT [*WARLOCK]: Demonheart",
    "text": "+5/+5."
  },
  {
    "id": "GVG_020",
    "_info": "(4) 3/5 [WARLOCK]: Fel Cannon |MECHANICAL",
    "text": "At the end of your turn, deal 2 damage to a non-Mech minion."
  },
  {
    "id": "GVG_021",
    "_info": "(9) 9/7 [WARLOCK]: Mal'Ganis |DEMON",
    "text": "Your other Demons have +2/+2.\nYour hero is <b>Immune</b>."
  },
  {
    "id": "GVG_021e",
    "_info": "ENCHANTMENT [*WARLOCK]: Grasp of Mal'Ganis",
    "text": "Mal'Ganis is granting +2/+2."
  },
  {
    "id": "GVG_022",
    "_info": "(4) SPELL [ROGUE]: Tinker's Sharpsword Oil",
    "text": "Give your weapon +3 Attack. <b>Combo:</b> Give a random friendly minion +3 Attack."
  },
  {
    "id": "GVG_022a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Tinker's Sharpsword Oil",
    "text": "+3 Attack."
  },
  {
    "id": "GVG_022b",
    "_info": "ENCHANTMENT [*NEUTRAL]: Tinker's Sharpsword Oil",
    "text": "+3 Attack."
  },
  {
    "id": "GVG_023",
    "_info": "(2) 3/2 [ROGUE]: Goblin Auto-Barber |MECHANICAL",
    "text": "<b>Battlecry:</b> Give your weapon +1 Attack."
  },
  {
    "id": "GVG_023a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Extra Sharp",
    "text": "+1 Attack."
  },
  {
    "id": "GVG_024",
    "_info": "(3) 1/3 WEAPON [ROGUE]: Cogmaster's Wrench",
    "text": "Has +2 Attack while you have a Mech."
  },
  {
    "id": "GVG_025",
    "_info": "(2) 4/1 [ROGUE]: One-eyed Cheat |PIRATE",
    "text": "Whenever you summon a Pirate, gain <b>Stealth</b>."
  },
  {
    "id": "GVG_026",
    "_info": "(2) SPELL [HUNTER]: Feign Death",
    "text": "Trigger all <b>Deathrattles</b> on your minions."
  },
  {
    "id": "GVG_027",
    "_info": "(3) 2/2 [ROGUE]: Iron Sensei |MECHANICAL",
    "text": "At the end of your turn, give another friendly Mech +2/+2."
  },
  {
    "id": "GVG_027e",
    "_info": "ENCHANTMENT [*ROGUE]: Ironed Out",
    "text": "Increased stats."
  },
  {
    "id": "GVG_028",
    "_info": "(6) 5/8 [ROGUE]: Trade Prince Gallywix",
    "text": "Whenever your opponent casts a spell, gain a copy of it and give them a Coin."
  },
  {
    "id": "GVG_028t",
    "_info": "(0) SPELL [*NEUTRAL]: Gallywix's Coin",
    "text": "Gain 1 Mana Crystal this turn only.\n<i>(Won't trigger Gallywix.)</i>"
  },
  {
    "id": "GVG_029",
    "_info": "(4) SPELL [SHAMAN]: Ancestor's Call",
    "text": "Put a random minion from each player's hand into the battlefield."
  },
  {
    "id": "GVG_030",
    "_info": "(2) 2/2 [DRUID]: Anodized Robo Cub |MECHANICAL",
    "text": "<b>Taunt</b>. <b>Choose One -</b>\n+1 Attack; or +1 Health."
  },
  {
    "id": "GVG_030a",
    "_info": "(0) SPELL [*DRUID]: Attack Mode",
    "text": "+1 Attack."
  },
  {
    "id": "GVG_030ae",
    "_info": "ENCHANTMENT [*DRUID]: Attack Mode",
    "text": "+1 Attack."
  },
  {
    "id": "GVG_030b",
    "_info": "(0) SPELL [*DRUID]: Tank Mode",
    "text": "+1 Health."
  },
  {
    "id": "GVG_030be",
    "_info": "ENCHANTMENT [*DRUID]: Tank Mode",
    "text": "+1 Health."
  },
  {
    "id": "GVG_031",
    "_info": "(6) SPELL [DRUID]: Recycle",
    "text": "Shuffle an enemy minion into your opponent's deck."
  },
  {
    "id": "GVG_032",
    "_info": "(3) 2/4 [DRUID]: Grove Tender",
    "text": "<b>Choose One -</b> Give each player a Mana Crystal; or Each player draws a card."
  },
  {
    "id": "GVG_032a",
    "_info": "(0) SPELL [*DRUID]: Gift of Mana",
    "text": "Give each player a Mana Crystal."
  },
  {
    "id": "GVG_032b",
    "_info": "(0) SPELL [*DRUID]: Gift of Cards",
    "text": "Each player draws a card."
  },
  {
    "id": "GVG_033",
    "_info": "(9) SPELL [DRUID]: Tree of Life",
    "text": "Restore all characters to full Health."
  },
  {
    "id": "GVG_034",
    "_info": "(6) 7/6 [DRUID]: Mech-Bear-Cat |MECHANICAL",
    "text": "Whenever this minion takes damage, add a <b>Spare Part</b> card to your hand."
  },
  {
    "id": "GVG_035",
    "_info": "(7) 9/7 [DRUID]: Malorne |BEAST",
    "text": "<b>Deathrattle:</b> Shuffle this minion into your deck."
  },
  {
    "id": "GVG_036",
    "_info": "(3) 3/2 WEAPON [SHAMAN]: Powermace",
    "text": "<b>Deathrattle:</b> Give a random friendly Mech +2/+2."
  },
  {
    "id": "GVG_036e",
    "_info": "ENCHANTMENT [*SHAMAN]: Powered",
    "text": "+2/+2."
  },
  {
    "id": "GVG_037",
    "_info": "(2) 3/2 [SHAMAN]: Whirling Zap-o-matic |MECHANICAL",
    "text": "<b>Windfury</b>"
  },
  {
    "id": "GVG_038",
    "_info": "(2) SPELL [SHAMAN]: Crackle",
    "text": "Deal $3-$6 damage. <b>Overload:</b> (1)"
  },
  {
    "id": "GVG_039",
    "_info": "(2) 0/3 [SHAMAN]: Vitality Totem |TOTEM",
    "text": "At the end of your turn, restore 4 Health to your hero."
  },
  {
    "id": "GVG_040",
    "_info": "(4) 2/5 [SHAMAN]: Siltfin Spiritwalker |MURLOC",
    "text": "Whenever another friendly Murloc dies, draw a card. <b><b>Overload</b>:</b> (1)"
  },
  {
    "id": "GVG_041",
    "_info": "(6) SPELL [DRUID]: Dark Wispers",
    "text": "<b>Choose One -</b> Summon 5 Wisps; or Give a minion +5/+5 and <b>Taunt</b>."
  },
  {
    "id": "GVG_041a",
    "_info": "(0) SPELL [*DRUID]: Dark Wispers",
    "text": "+5/+5 and <b>Taunt</b>."
  },
  {
    "id": "GVG_041b",
    "_info": "(0) SPELL [*DRUID]: Dark Wispers",
    "text": "Summon 5 Wisps."
  },
  {
    "id": "GVG_041c",
    "_info": "ENCHANTMENT [*DRUID]: Dark Wispers",
    "text": "+5/+5 and <b>Taunt</b>."
  },
  {
    "id": "GVG_042",
    "_info": "(7) 7/7 [SHAMAN]: Neptulon |ELEMENTAL",
    "text": "<b>Battlecry:</b> Add 4 random Murlocs to your hand. <b>Overload:</b> (3)"
  },
  {
    "id": "GVG_043",
    "_info": "(2) 2/2 WEAPON [HUNTER]: Glaivezooka",
    "text": "<b>Battlecry:</b> Give a random friendly minion +1 Attack."
  },
  {
    "id": "GVG_043e",
    "_info": "ENCHANTMENT [*HUNTER]: Glaivezooka",
    "text": "+1 Attack."
  },
  {
    "id": "GVG_044",
    "_info": "(3) 3/4 [NEUTRAL]: Spider Tank |MECHANICAL"
  },
  {
    "id": "GVG_045",
    "_info": "(4) SPELL [WARLOCK]: Imp-losion",
    "text": "Deal $2-$4 damage to a minion. Summon a 1/1 Imp for each damage dealt."
  },
  {
    "id": "GVG_045t",
    "_info": "(1) 1/1 [*WARLOCK]: Imp |DEMON"
  },
  {
    "id": "GVG_046",
    "_info": "(5) 2/6 [HUNTER]: King of Beasts |BEAST",
    "text": "<b>Taunt</b>. <b>Battlecry:</b> Gain +1 Attack for each other Beast you have."
  },
  {
    "id": "GVG_046e",
    "_info": "ENCHANTMENT [*HUNTER]: The King",
    "text": "Increased Attack."
  },
  {
    "id": "GVG_047",
    "_info": "(4) SPELL [ROGUE]: Sabotage",
    "text": "Destroy a random enemy minion. <b>Combo:</b> And your opponent's weapon."
  },
  {
    "id": "GVG_048",
    "_info": "(3) 3/3 [HUNTER]: Metaltooth Leaper |MECHANICAL",
    "text": "<b>Battlecry:</b> Give your other Mechs +2 Attack."
  },
  {
    "id": "GVG_048e",
    "_info": "ENCHANTMENT [*HUNTER]: Metal Teeth",
    "text": "+2 Attack."
  },
  {
    "id": "GVG_049",
    "_info": "(7) 6/9 [HUNTER]: Gahz'rilla |BEAST",
    "text": "Whenever this minion takes damage, double its Attack."
  },
  {
    "id": "GVG_049e",
    "_info": "ENCHANTMENT [*HUNTER]: Might of Zul'Farrak",
    "text": "Multiplying Attack."
  },
  {
    "id": "GVG_050",
    "_info": "(3) SPELL [WARRIOR]: Bouncing Blade",
    "text": "Deal $1 damage to a random minion. Repeat until a minion dies."
  },
  {
    "id": "GVG_051",
    "_info": "(1) 1/3 [WARRIOR]: Warbot |MECHANICAL",
    "text": "<b>Enrage:</b> +1 Attack."
  },
  {
    "id": "GVG_051e",
    "_info": "ENCHANTMENT [*WARRIOR]: Enraged",
    "text": "+1 Attack"
  },
  {
    "id": "GVG_052",
    "_info": "(7) SPELL [WARRIOR]: Crush",
    "text": "Destroy a minion. If you have a damaged minion, this costs (4) less."
  },
  {
    "id": "GVG_053",
    "_info": "(6) 5/5 [WARRIOR]: Shieldmaiden",
    "text": "<b>Battlecry:</b> Gain 5 Armor."
  },
  {
    "id": "GVG_054",
    "_info": "(3) 4/2 WEAPON [WARRIOR]: Ogre Warmaul",
    "text": "50% chance to attack the wrong enemy."
  },
  {
    "id": "GVG_055",
    "_info": "(4) 2/5 [WARRIOR]: Screwjank Clunker |MECHANICAL",
    "text": "<b>Battlecry:</b> Give a friendly Mech +2/+2."
  },
  {
    "id": "GVG_055e",
    "_info": "ENCHANTMENT [*WARRIOR]: Screwy Jank",
    "text": "+2/+2."
  },
  {
    "id": "GVG_056",
    "_info": "(6) 6/5 [WARRIOR]: Iron Juggernaut |MECHANICAL",
    "text": "<b>Battlecry:</b> Shuffle a Mine into your opponent's deck. When drawn, it explodes for 10 damage."
  },
  {
    "id": "GVG_056t",
    "_info": "(0) SPELL [*WARRIOR]: Burrowing Mine",
    "text": "When you draw this, it explodes. You take 10 damage and draw a card."
  },
  {
    "id": "GVG_057",
    "_info": "(2) SPELL [PALADIN]: Seal of Light",
    "text": "Restore #4 Health to your hero and gain +2 Attack this turn."
  },
  {
    "id": "GVG_057a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Seal of Light",
    "text": "+2 Attack this turn."
  },
  {
    "id": "GVG_058",
    "_info": "(2) 2/2 [PALADIN]: Shielded Minibot |MECHANICAL",
    "text": "<b>Divine Shield</b>",
    tags: [TAGS.divineShield]
  },
  {
    "id": "GVG_059",
    "_info": "(3) 2/3 WEAPON [PALADIN]: Coghammer",
    "text": "<b>Battlecry:</b> Give a random friendly minion <b>Divine Shield</b> and <b>Taunt</b>."
  },
  {
    "id": "GVG_060",
    "_info": "(5) 2/5 [PALADIN]: Quartermaster",
    "text": "<b>Battlecry:</b> Give your Silver Hand Recruits +2/+2."
  },
  {
    "id": "GVG_060e",
    "_info": "ENCHANTMENT [*PALADIN]: Well Equipped",
    "text": "+2/+2."
  },
  {
    "id": "GVG_061",
    "_info": "(3) SPELL [PALADIN]: Muster for Battle",
    "text": "Summon three 1/1 Silver Hand Recruits. Equip a 1/4 Weapon."
  },
  {
    "id": "GVG_062",
    "_info": "(5) 6/3 [PALADIN]: Cobalt Guardian |MECHANICAL",
    "text": "Whenever you summon a Mech, gain <b>Divine Shield</b>."
  },
  {
    "id": "GVG_063",
    "_info": "(5) 1/7 [PALADIN]: Bolvar Fordragon",
    "text": "Whenever a friendly minion dies while this is in your hand, gain +1 Attack."
  },
  {
    "id": "GVG_063a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Retribution",
    "text": "Increased Attack"
  },
  {
    "id": "GVG_064",
    "_info": "(2) 3/2 [NEUTRAL]: Puddlestomper |MURLOC"
  },
  {
    "id": "GVG_065",
    "_info": "(3) 4/4 [NEUTRAL]: Ogre Brute",
    "text": "50% chance to attack the wrong enemy."
  },
  {
    "id": "GVG_066",
    "_info": "(4) 5/4 [SHAMAN]: Dunemaul Shaman",
    "text": "<b>Windfury, Overload:</b> (1)\n50% chance to attack the wrong enemy."
  },
  {
    "id": "GVG_067",
    "_info": "(2) 2/3 [NEUTRAL]: Stonesplinter Trogg",
    "text": "Whenever your opponent casts a spell, gain +1 Attack."
  },
  {
    "id": "GVG_067a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Metabolized Magic",
    "text": "Increased Attack."
  },
  {
    "id": "GVG_068",
    "_info": "(4) 3/5 [NEUTRAL]: Burly Rockjaw Trogg",
    "text": "Whenever your opponent casts a spell, gain +2 Attack."
  },
  {
    "id": "GVG_068a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Metabolized Magic",
    "text": "Increased Attack."
  },
  {
    "id": "GVG_069",
    "_info": "(5) 3/3 [NEUTRAL]: Antique Healbot |MECHANICAL",
    "text": "<b>Battlecry:</b> Restore 8 Health to your hero.",
    xxx: 'wtf BUFF ? o_O',
    play ({$}) {
      $('own hero').heal(8);
    }
  },
  {
    "id": "GVG_069a",
    "_info": "ENCHANTMENT [*PRIEST]: Repairs!",
    "text": "+4 Health.",
    xxx: 'this does not seem to be in the game ?'
  },
  {
    "id": "GVG_070",
    "_info": "(5) 7/4 [NEUTRAL]: Salty Dog |PIRATE"
  },
  {
    "id": "GVG_071",
    "_info": "(4) 5/4 [NEUTRAL]: Lost Tallstrider |BEAST"
  },
  {
    "id": "GVG_072",
    "_info": "(2) 2/3 [PRIEST]: Shadowboxer |MECHANICAL",
    "text": "Whenever a character is healed, deal 1 damage to a random enemy."
  },
  {
    "id": "GVG_073",
    "_info": "(5) SPELL [HUNTER]: Cobra Shot",
    "text": "Deal $3 damage to a minion and the enemy hero."
  },
  {
    "id": "GVG_074",
    "_info": "(4) 4/3 [NEUTRAL]: Kezan Mystic",
    "text": "<b>Battlecry:</b> Take control of a random enemy <b>Secret</b>."
  },
  {
    "id": "GVG_075",
    "_info": "(2) 2/3 [NEUTRAL]: Ship's Cannon",
    "text": "After you summon a Pirate, deal 2 damage to a random enemy."
  },
  {
    "id": "GVG_076",
    "_info": "(2) 1/1 [NEUTRAL]: Explosive Sheep |MECHANICAL",
    "text": "<b>Deathrattle:</b> Deal 2 damage to all minions."
  },
  {
    "id": "GVG_076a",
    "_info": "ENCHANTMENT [*NEUTRAL]: Pistons",
    "text": "Increased Attack."
  },
  {
    "id": "GVG_077",
    "_info": "(6) 9/9 [WARLOCK]: Anima Golem |MECHANICAL",
    "text": "At the end of each turn, destroy this minion if it's your only one."
  },
  {
    "id": "GVG_078",
    "_info": "(4) 4/5 [NEUTRAL]: Mechanical Yeti |MECHANICAL",
    "text": "<b>Deathrattle:</b> Give each player a <b>Spare Part.</b>"
  },
  {
    "id": "GVG_079",
    "_info": "(8) 7/7 [NEUTRAL]: Force-Tank MAX |MECHANICAL",
    "text": "<b>Divine Shield</b>"
  },
  {
    "id": "GVG_080",
    "_info": "(5) 4/4 [DRUID]: Druid of the Fang",
    "text": "<b>Battlecry:</b> If you have a Beast, transform this minion into a 7/7."
  },
  {
    "id": "GVG_080t",
    "_info": "(5) 7/7 [*DRUID]: Druid of the Fang |BEAST"
  },
  {
    "id": "GVG_081",
    "_info": "(2) 2/3 [NEUTRAL]: Gilblin Stalker",
    "text": "<b>Stealth</b>"
  },
  {
    "id": "GVG_082",
    "_info": "(1) 2/1 [NEUTRAL]: Clockwork Gnome |MECHANICAL",
    "text": "<b>Deathrattle:</b> Add a <b>Spare Part</b> card to your hand."
  },
  {
    "id": "GVG_083",
    "_info": "(5) 5/5 [PRIEST]: Upgraded Repair Bot |MECHANICAL",
    "text": "<b>Battlecry:</b> Give a friendly Mech +4 Health."
  },
  {
    "id": "GVG_084",
    "_info": "(3) 1/4 [NEUTRAL]: Flying Machine |MECHANICAL",
    "text": "<b>Windfury</b>",
    tags: [TAGS.windfury]
  },
  {
    "id": "GVG_085",
    "_info": "(2) 1/2 [NEUTRAL]: Annoy-o-Tron |MECHANICAL",
    "text": "<b>Taunt</b>\n<b>Divine Shield</b>",
    tags: [TAGS.taunt, TAGS.divineShield]
  },
  {
    "id": "GVG_086",
    "_info": "(5) 5/5 [WARRIOR]: Siege Engine |MECHANICAL",
    "text": "Whenever you gain Armor, give this minion +1 Attack."
  },
  {
    "id": "GVG_086e",
    "_info": "ENCHANTMENT [*WARRIOR]: Armor Plated",
    "text": "Increased Attack."
  },
  {
    "id": "GVG_087",
    "_info": "(2) 2/3 [HUNTER]: Steamwheedle Sniper",
    "text": "Your Hero Power can target minions."
  },
  {
    "id": "GVG_088",
    "_info": "(5) 6/6 [ROGUE]: Ogre Ninja",
    "text": "<b>Stealth</b>\n50% chance to attack the wrong enemy."
  },
  {
    "id": "GVG_089",
    "_info": "(3) 2/4 [NEUTRAL]: Illuminator",
    "text": "If you control a <b>Secret</b> at the end of your turn, restore 4 Health to your hero."
  },
  {
    "id": "GVG_090",
    "_info": "(5) 5/4 [NEUTRAL]: Madder Bomber",
    "text": "<b>Battlecry:</b> Deal 6 damage randomly split between all other characters."
  },
  {
    "id": "GVG_091",
    "_info": "(4) 2/5 [NEUTRAL]: Arcane Nullifier X-21 |MECHANICAL",
    "text": "<b>Taunt</b>\nCan't be targeted by spells or Hero Powers."
  },
  {
    "id": "GVG_092",
    "_info": "(3) 3/2 [NEUTRAL]: Gnomish Experimenter",
    "text": "<b>Battlecry:</b> Draw a card. If it's a minion, transform it into a Chicken."
  },
  {
    "id": "GVG_092t",
    "_info": "(1) 1/1 [*NEUTRAL]: Chicken |BEAST"
  },
  {
    "id": "GVG_093",
    "_info": "(0) 0/2 [NEUTRAL]: Target Dummy |MECHANICAL",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "GVG_094",
    "_info": "(4) 1/4 [NEUTRAL]: Jeeves |MECHANICAL",
    "text": "At the end of each player's turn, that player draws until they have 3 cards."
  },
  {
    "id": "GVG_095",
    "_info": "(3) 2/4 [NEUTRAL]: Goblin Sapper",
    "text": "Has +4 Attack while your opponent has 6 or more cards in hand."
  },
  {
    "id": "GVG_096",
    "_info": "(4) 4/3 [NEUTRAL]: Piloted Shredder |MECHANICAL",
    "text": "<b>Deathrattle:</b> Summon a random 2-Cost minion."
  },
  {
    "id": "GVG_097",
    "_info": "(3) 2/3 [NEUTRAL]: Lil' Exorcist",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Gain +1/+1 for each enemy <b>Deathrattle</b> minion."
  },
  {
    "id": "GVG_098",
    "_info": "(3) 1/4 [NEUTRAL]: Gnomeregan Infantry",
    "text": "<b>Charge</b>\n<b>Taunt</b>",
    tags: [TAGS.charge, TAGS.taunt]
  },
  {
    "id": "GVG_099",
    "_info": "(5) 3/3 [NEUTRAL]: Bomb Lobber",
    "text": "<b>Battlecry:</b> Deal 4 damage to a random enemy minion."
  },
  {
    "id": "GVG_100",
    "_info": "(5) 4/4 [WARLOCK]: Floating Watcher |DEMON",
    "text": "Whenever your hero takes damage on your turn, gain +2/+2."
  },
  {
    "id": "GVG_100e",
    "_info": "ENCHANTMENT [*WARLOCK]: Brow Furrow",
    "text": "Increased stats."
  },
  {
    "id": "GVG_101",
    "_info": "(3) 4/3 [PALADIN]: Scarlet Purifier",
    "text": "<b>Battlecry:</b> Deal 2 damage to all minions with <b>Deathrattle</b>."
  },
  {
    "id": "GVG_101e",
    "_info": "ENCHANTMENT [*PALADIN]: Pure",
    "text": "Increased Stats."
  },
  {
    "id": "GVG_102",
    "_info": "(3) 3/3 [NEUTRAL]: Tinkertown Technician",
    "text": "<b>Battlecry:</b> If you have a Mech, gain +1/+1 and add a <b>Spare Part</b> to your hand."
  },
  {
    "id": "GVG_102e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Might of Tinkertown",
    "text": "+1/+1."
  },
  {
    "id": "GVG_103",
    "_info": "(2) 1/2 [NEUTRAL]: Micro Machine |MECHANICAL",
    "text": "At the start of each turn, gain +1 Attack."
  },
  {
    "id": "GVG_104",
    "_info": "(3) 2/3 [NEUTRAL]: Hobgoblin",
    "text": "Whenever you play a 1-Attack minion, give it +2/+2."
  },
  {
    "id": "GVG_104a",
    "_info": "ENCHANTMENT [*NEUTRAL]: HERE, TAKE BUFF.",
    "text": "+2/+2."
  },
  {
    "id": "GVG_105",
    "_info": "(6) 6/4 [NEUTRAL]: Piloted Sky Golem |MECHANICAL",
    "text": "<b>Deathrattle:</b> Summon a random 4-Cost minion."
  },
  {
    "id": "GVG_106",
    "_info": "(5) 1/5 [NEUTRAL]: Junkbot |MECHANICAL",
    "text": "Whenever a friendly Mech dies, gain +2/+2."
  },
  {
    "id": "GVG_106e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Junked Up",
    "text": "Increased stats."
  },
  {
    "id": "GVG_107",
    "_info": "(4) 3/2 [NEUTRAL]: Enhance-o Mechano |MECHANICAL",
    "text": "<b>Battlecry:</b> Give your other minions <b>Windfury</b>, <b>Taunt</b>, or <b>Divine Shield</b>\n<i>(at random)</i>."
  },
  {
    "id": "GVG_108",
    "_info": "(2) 3/2 [NEUTRAL]: Recombobulator",
    "text": "<b>Battlecry:</b> Transform a friendly minion into a random minion with the same Cost."
  },
  {
    "id": "GVG_109",
    "_info": "(4) 4/1 [NEUTRAL]: Mini-Mage",
    "text": "<b>Stealth</b>\n<b>Spell Damage +1</b>"
  },
  {
    "id": "GVG_110",
    "_info": "(7) 7/7 [NEUTRAL]: Dr. Boom",
    "text": "<b>Battlecry:</b> Summon two 1/1 Boom Bots. <i>WARNING: Bots may explode.</i>",
    xxx: 'i think Dr.Boom summons bots to the SIDES of himself ?',
    play ({summon}) {
      summon('GVG_110t');
      summon('GVG_110t');
    }
  },
  {
    "id": "GVG_110t",
    "_info": "(1) 1/1 [*NEUTRAL]: Boom Bot |MECHANICAL",
    "text": "<b>Deathrattle:</b> Deal 1-4 damage to a random enemy.",
    xxx: 'needs PRNG',
    death ({$}) {
      let damage = 3; // PRNG.random(1 to 4);
      $('enemy character').getRandom().dealDamage(damage);
    }
  },
  {
    "id": "GVG_111",
    "_info": "(5) 4/5 [NEUTRAL]: Mimiron's Head |MECHANICAL",
    "text": "At the start of your turn, if you have at least 3 Mechs, destroy them all and form V-07-TR-0N."
  },
  {
    "id": "GVG_111t",
    "_info": "(8) 4/8 [*NEUTRAL]: V-07-TR-0N |MECHANICAL",
    "text": "<b>Charge</b>\n<b>Mega-Windfury</b> <i>(Can attack four times a turn.)</i>"
  },
  {
    "id": "GVG_112",
    "_info": "(6) 7/6 [NEUTRAL]: Mogor the Ogre",
    "text": "All minions have a 50% chance to attack the wrong enemy."
  },
  {
    "id": "GVG_113",
    "_info": "(8) 6/9 [NEUTRAL]: Foe Reaper 4000 |MECHANICAL",
    "text": "Also damages the minions next to whomever it attacks."
  },
  {
    "id": "GVG_114",
    "_info": "(8) 5/7 [NEUTRAL]: Sneed's Old Shredder |MECHANICAL",
    "text": "<b>Deathrattle:</b> Summon a random <b>Legendary</b> minion."
  },
  {
    "id": "GVG_115",
    "_info": "(6) 5/7 [NEUTRAL]: Toshley",
    "text": "<b>Battlecry and Deathrattle:</b> Add a <b>Spare Part</b> card to your hand."
  },
  {
    "id": "GVG_116",
    "_info": "(9) 9/7 [NEUTRAL]: Mekgineer Thermaplugg |MECHANICAL",
    "text": "Whenever an enemy minion dies, summon a Leper Gnome."
  },
  {
    "id": "GVG_117",
    "_info": "(6) 3/6 [NEUTRAL]: Gazlowe",
    "text": "Whenever you cast a 1-mana spell, add a random Mech to your hand."
  },
  {
    "id": "GVG_118",
    "_info": "(7) 6/6 [NEUTRAL]: Troggzor the Earthinator",
    "text": "Whenever your opponent casts a spell, summon a Burly Rockjaw Trogg."
  },
  {
    "id": "GVG_119",
    "_info": "(5) 3/4 [NEUTRAL]: Blingtron 3000 |MECHANICAL",
    "text": "<b>Battlecry:</b> Equip a random weapon for each player."
  },
  {
    "id": "GVG_120",
    "_info": "(5) 6/3 [NEUTRAL]: Hemet Nesingwary",
    "text": "<b>Battlecry:</b> Destroy a Beast.",
    target: 'character .race=beast',
    play ({target}) {
      target.destroy();
    }
  },
  {
    "id": "GVG_121",
    "_info": "(12) 8/8 [NEUTRAL]: Clockwork Giant |MECHANICAL",
    "text": "Costs (1) less for each card in your opponent's hand."
  },
  {
    "id": "GVG_122",
    "_info": "(4) 2/5 [MAGE]: Wee Spellstopper",
    "text": "Adjacent minions can't be targeted by spells or Hero Powers."
  },
  {
    "id": "GVG_123",
    "_info": "(3) 3/3 [MAGE]: Soot Spewer |MECHANICAL",
    "text": "<b>Spell Damage +1</b>"
  },
  {
    "id": "GVG_123e",
    "_info": "ENCHANTMENT [*MAGE]: Overclocked",
    "text": "Spell Damage +2."
  },
  {
    "id": "HERO_01",
    "_info": "0/30 HERO [WARRIOR]: Garrosh Hellscream"
  },
  {
    "id": "HERO_01a",
    "_info": "0/30 HERO [WARRIOR]: Magni Bronzebeard"
  },
  {
    "id": "HERO_02",
    "_info": "0/30 HERO [SHAMAN]: Thrall"
  },
  {
    "id": "HERO_02a",
    "_info": "0/30 HERO [SHAMAN]: Morgl the Oracle"
  },
  {
    "id": "HERO_03",
    "_info": "0/30 HERO [ROGUE]: Valeera Sanguinar"
  },
  {
    "id": "HERO_03a",
    "_info": "0/30 HERO [ROGUE]: Maiev Shadowsong"
  },
  {
    "id": "HERO_04",
    "_info": "0/30 HERO [PALADIN]: Uther Lightbringer"
  },
  {
    "id": "HERO_04a",
    "_info": "0/30 HERO [PALADIN]: Lady Liadrin"
  },
  {
    "id": "HERO_05",
    "_info": "0/30 HERO [HUNTER]: Rexxar"
  },
  {
    "id": "HERO_05a",
    "_info": "0/30 HERO [HUNTER]: Alleria Windrunner"
  },
  {
    "id": "HERO_06",
    "_info": "0/30 HERO [DRUID]: Malfurion Stormrage"
  },
  {
    "id": "HERO_07",
    "_info": "0/30 HERO [WARLOCK]: Gul'dan"
  },
  {
    "id": "HERO_08",
    "_info": "0/30 HERO [MAGE]: Jaina Proudmoore"
  },
  {
    "id": "HERO_08a",
    "_info": "0/30 HERO [MAGE]: Medivh"
  },
  {
    "id": "HERO_08b",
    "_info": "0/30 HERO [MAGE]: Khadgar"
  },
  {
    "id": "HERO_09",
    "_info": "0/30 HERO [PRIEST]: Anduin Wrynn"
  },
  {
    "id": "HERO_09a",
    "_info": "0/30 HERO [PRIEST]: Tyrande Whisperwind"
  },
  {
    "id": "KAR_004",
    "_info": "(2) SPELL [HUNTER]: Cat Trick",
    "text": "<b>Secret:</b> After your opponent casts a spell, summon a 4/2 Panther with <b>Stealth</b>."
  },
  {
    "id": "KAR_004a",
    "_info": "(3) 4/2 [*HUNTER]: Cat in a Hat |BEAST",
    "text": "<b>Stealth</b>"
  },
  {
    "id": "KAR_005",
    "_info": "(2) 1/1 [HUNTER]: Kindly Grandmother |BEAST",
    "text": "<b>Deathrattle:</b> Summon a 3/2 Big Bad Wolf.",
    death ({summon}) {
      summon('KAR_005a');
    }
  },
  {
    "id": "KAR_005a",
    "_info": "(2) 3/2 [*HUNTER]: Big Bad Wolf |BEAST"
  },
  {
    "id": "KAR_006",
    "_info": "(3) 3/4 [HUNTER]: Cloaked Huntress",
    "text": "Your <b>Secrets</b> cost (0)."
  },
  {
    "id": "KAR_009",
    "_info": "(1) 1/1 [MAGE]: Babbling Book",
    "text": "<b>Battlecry:</b> Add a random Mage spell to your hand."
  },
  {
    "id": "KAR_010",
    "_info": "(3) 2/3 [PALADIN]: Nightbane Templar",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, summon two 1/1 Whelps.",
    xxx: 'powered-up yellow outline is not designed yet',
    play ({$, summon}) {
      let holding_dragon = $('@hand character .race=dragon').length > 0;
      if (holding_dragon) {
        summon('KAR_010a');
        summon('KAR_010a');
       }
    }
  },
  {
    "id": "KAR_010a",
    "_info": "(1) 1/1 [*PALADIN]: Whelp |DRAGON"
  },
  {
    "id": "KAR_011",
    "_info": "(2) 3/2 [NEUTRAL]: Pompous Thespian",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "KAR_013",
    "_info": "(2) SPELL [PRIEST]: Purify",
    "text": "<b>Silence</b> a friendly minion. Draw a card.",
    target: 'own minion',
    play ({target, draw}) {
      target.silence();
      draw(1);
    }
  },
  {
    "id": "KAR_021",
    "_info": "(4) 3/4 [SHAMAN]: Wicked Witchdoctor",
    "text": "Whenever you cast a spell, summon a random basic Totem."
  },
  {
    "id": "KAR_025",
    "_info": "(5) SPELL [WARLOCK]: Kara Kazham!",
    "text": "Summon a 1/1 Candle, 2/2 Broom, and 3/3 Teapot.",
    play ({summon}) {
      summon('KAR_025a');
      summon('KAR_025b');
      summon('KAR_025c');
    }
  },
  {
    "id": "KAR_025a",
    "_info": "(1) 1/1 [*WARLOCK]: Candle"
  },
  {
    "id": "KAR_025b",
    "_info": "(2) 2/2 [*WARLOCK]: Broom"
  },
  {
    "id": "KAR_025c",
    "_info": "(3) 3/3 [*WARLOCK]: Teapot"
  },
  {
    "id": "KAR_026",
    "_info": "(3) SPELL [WARRIOR]: Protect the King!",
    "text": "For each enemy minion, summon a 1/1 Pawn with <b>Taunt</b>.",
    play ({summon, $}) {
      $('enemy minion').forEach(v => summon('KAR_026t'));
    }
  },
  {
    "id": "KAR_026t",
    "_info": "(1) 1/1 [*WARRIOR]: Pawn",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "KAR_028",
    "_info": "(5) 3/4 WEAPON [WARRIOR]: Fool's Bane",
    "text": "Unlimited attacks each turn. Can't attack heroes."
  },
  {
    "id": "KAR_029",
    "_info": "(1) 0/2 [NEUTRAL]: Runic Egg",
    "text": "<b>Deathrattle:</b> Draw a card.",
    death ({draw}) {
      draw(1);
    }
  },
  {
    "id": "KAR_030",
    "_info": "(3) 1/3 [*NEUTRAL]: Cellar Spider |BEAST"
  },
  {
    "id": "KAR_030a",
    "_info": "(3) 1/3 [NEUTRAL]: Pantry Spider |BEAST",
    "text": "<b>Battlecry:</b> Summon a\n1/3 Spider.",
    play ({summon}) {
      summon('KAR_030');
    }
  },
  {
    "id": "KAR_033",
    "_info": "(6) 3/6 [NEUTRAL]: Book Wyrm |DRAGON",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, destroy an enemy minion with 3 or less Attack.",
    xxx: 'powered-up not implemented',
    play ({$}) {
      let holding_dragon = $('own @hand character .race=dragon').length > 0;
      if (holding_dragon) {
        $('enemy minion .attack<=3').destroy();
      }
    }
  },
  {
    "id": "KAR_035",
    "_info": "(4) 3/6 [PRIEST]: Priest of the Feast",
    "text": "Whenever you cast a spell, restore 3 Health to\nyour hero."
  },
  {
    "id": "KAR_036",
    "_info": "(1) 2/1 [NEUTRAL]: Arcane Anomaly |ELEMENTAL",
    "text": "Whenever you cast a spell, give this minion\n+1 Health."
  },
  {
    "id": "KAR_036e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Eating",
    "text": "Increased Health."
  },
  {
    "id": "KAR_037",
    "_info": "(5) 3/6 [NEUTRAL]: Avian Watcher",
    "text": "<b>Battlecry:</b> If you control a <b>Secret</b>, gain +1/+1\nand <b>Taunt</b>."
  },
  {
    "id": "KAR_037t",
    "_info": "ENCHANTMENT [*NEUTRAL]: Secrets of Karazhan",
    "text": "+1/+1 and <b>Taunt</b>."
  },
  {
    "id": "KAR_041",
    "_info": "(6) 3/3 [NEUTRAL]: Moat Lurker",
    "text": "<b>Battlecry:</b> Destroy a minion. <b>Deathrattle:</b> Resummon it."
  },
  {
    "id": "KAR_044",
    "_info": "(3) 1/1 [NEUTRAL]: Moroes",
    "text": "<b>Stealth</b>\nAt the end of your turn, summon a 1/1 Steward."
  },
  {
    "id": "KAR_044a",
    "_info": "(1) 1/1 [*NEUTRAL]: Steward"
  },
  {
    "id": "KAR_057",
    "_info": "(6) 4/4 [PALADIN]: Ivory Knight",
    "text": "[x]<b>Battlecry:</b> <b>Discover</b> a spell.\nRestore Health to your hero\nequal to its Cost."
  },
  {
    "id": "KAR_061",
    "_info": "(7) 4/6 [NEUTRAL]: The Curator |MECHANICAL",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Draw a Beast, Dragon, and Murloc from your deck."
  },
  {
    "id": "KAR_062",
    "_info": "(2) 1/3 [NEUTRAL]: Netherspite Historian",
    "text": "<b>Battlecry:</b> If you're holding a Dragon, <b>Discover</b>\na Dragon."
  },
  {
    "id": "KAR_063",
    "_info": "(2) 1/3 WEAPON [SHAMAN]: Spirit Claws",
    "text": "[x]Has +2 Attack while you\nhave <b>Spell Damage</b>."
  },
  {
    "id": "KAR_065",
    "_info": "(6) 5/5 [DRUID]: Menagerie Warden",
    "text": "<b>Battlecry:</b> Choose a friendly Beast. Summon a copy of it."
  },
  {
    "id": "KAR_069",
    "_info": "(1) 1/1 [ROGUE]: Swashburglar |PIRATE",
    "text": "<b>Battlecry:</b> Add a random class card to your hand <i>(from your opponent's class).</i>"
  },
  {
    "id": "KAR_070",
    "_info": "(5) 5/6 [ROGUE]: Ethereal Peddler",
    "text": "[x]<b>Battlecry:</b> If you're holding\nany non-Rogue class cards,\n reduce their Cost by (2)."
  },
  {
    "id": "KAR_073",
    "_info": "(2) SPELL [SHAMAN]: Maelstrom Portal",
    "text": "Deal $1 damage to all enemy minions. Summon a random\n1-Cost minion."
  },
  {
    "id": "KAR_075",
    "_info": "(6) SPELL [DRUID]: Moonglade Portal",
    "text": "Restore #6 Health. Summon a random\n6-Cost minion."
  },
  {
    "id": "KAR_076",
    "_info": "(7) SPELL [MAGE]: Firelands Portal",
    "text": "Deal $5 damage. Summon a random\n5-Cost minion."
  },
  {
    "id": "KAR_077",
    "_info": "(4) SPELL [PALADIN]: Silvermoon Portal",
    "text": "Give a minion +2/+2. Summon a random\n2-Cost minion."
  },
  {
    "id": "KAR_077e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Silver Might",
    "text": "+2/+2."
  },
  {
    "id": "KAR_089",
    "_info": "(1) 1/3 [WARLOCK]: Malchezaar's Imp |DEMON",
    "text": "Whenever you discard a card, draw a card."
  },
  {
    "id": "KAR_091",
    "_info": "(5) SPELL [WARRIOR]: Ironforge Portal",
    "text": "Gain 4 Armor.\nSummon a random\n4-Cost minion."
  },
  {
    "id": "KAR_092",
    "_info": "(2) 2/3 [MAGE]: Medivh's Valet",
    "text": "<b>Battlecry:</b> If you control a <b>Secret</b>, deal 3 damage."
  },
  {
    "id": "KAR_094",
    "_info": "(3) 3/2 [ROGUE]: Deadly Fork",
    "text": "<b>Deathrattle:</b> Add a 3/2 weapon to your hand."
  },
  {
    "id": "KAR_094a",
    "_info": "(3) 3/2 WEAPON [*ROGUE]: Sharp Fork"
  },
  {
    "id": "KAR_095",
    "_info": "(3) 3/3 [NEUTRAL]: Zoobot |MECHANICAL",
    "text": "<b>Battlecry:</b> Give a random friendly Beast, Dragon, and Murloc +1/+1."
  },
  {
    "id": "KAR_095e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Well Fed",
    "text": "+1/+1."
  },
  {
    "id": "KAR_096",
    "_info": "(5) 5/6 [NEUTRAL]: Prince Malchezaar |DEMON",
    "text": "[x]When the game starts,\nadd 5 extra <b>Legendary</b>\nminions to your deck."
  },
  {
    "id": "KAR_097",
    "_info": "(8) 7/7 [NEUTRAL]: Medivh, the Guardian",
    "text": "<b>Battlecry:</b> Equip Atiesh, Greatstaff of the Guardian."
  },
  {
    "id": "KAR_097t",
    "_info": "(3) 1/3 WEAPON [*NEUTRAL]: Atiesh",
    "text": "[x]After you cast a spell,\nsummon a random\nminion of that Cost.\nLose 1 Durability."
  },
  {
    "id": "KAR_114",
    "_info": "(4) 3/4 [NEUTRAL]: Barnes",
    "text": "<b>Battlecry:</b> Summon a 1/1 copy of a random minion in your deck."
  },
  {
    "id": "KAR_114e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Incredible Impression",
    "text": "Attack and Health set to 1."
  },
  {
    "id": "KAR_204",
    "_info": "(5) 3/4 [PRIEST]: Onyx Bishop",
    "text": "<b>Battlecry:</b> Summon a friendly minion that died this game."
  },
  {
    "id": "KAR_205",
    "_info": "(3) 3/3 [WARLOCK]: Silverware Golem",
    "text": "If you discard this minion, summon it."
  },
  {
    "id": "KAR_300",
    "_info": "(1) 2/2 [DRUID]: Enchanted Raven |BEAST"
  },
  {
    "id": "KAR_702",
    "_info": "(5) 4/4 [NEUTRAL]: Menagerie Magician",
    "text": "<b>Battlecry:</b> Give a random friendly Beast, Dragon, and Murloc +2/+2."
  },
  {
    "id": "KAR_702e",
    "_info": "ENCHANTMENT [*NEUTRAL]: A Simple Trick",
    "text": "+2/+2."
  },
  {
    "id": "KAR_710",
    "_info": "(4) 3/2 [NEUTRAL]: Arcanosmith",
    "text": "<b>Battlecry:</b> Summon a 0/5 minion with <b>Taunt</b>.",
    play ({summon}) {
      summon('KAR_710m');
    }
  },
  {
    "id": "KAR_710m",
    "_info": "(2) 0/5 [*NEUTRAL]: Animated Shield",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "KAR_711",
    "_info": "(12) 8/8 [NEUTRAL]: Arcane Giant",
    "text": "[x]Costs (1) less for each spell\nyou've cast this game."
  },
  {
    "id": "KAR_712",
    "_info": "(3) 4/3 [NEUTRAL]: Violet Illusionist",
    "text": "During your turn, your hero is <b>Immune</b>."
  },
  {
    "id": "LOEA10_3",
    "_info": "(0) 1/1 [NEUTRAL]: Murloc Tinyfin |MURLOC"
  },
  {
    "id": "LOE_002",
    "_info": "(3) SPELL [MAGE]: Forgotten Torch",
    "text": "Deal $3 damage. Shuffle a 'Roaring Torch' into your deck that deals 6 damage."
  },
  {
    "id": "LOE_002t",
    "_info": "(3) SPELL [*MAGE]: Roaring Torch",
    "text": "Deal $6 damage."
  },
  {
    "id": "LOE_003",
    "_info": "(5) 6/3 [MAGE]: Ethereal Conjurer",
    "text": "<b>Battlecry: Discover</b> a spell."
  },
  {
    "id": "LOE_006",
    "_info": "(2) 1/2 [PRIEST]: Museum Curator",
    "text": "<b>Battlecry: Discover</b> a <b>Deathrattle</b> card."
  },
  {
    "id": "LOE_007",
    "_info": "(2) SPELL [WARLOCK]: Curse of Rafaam",
    "text": "Give your opponent a 'Cursed!' card.\nWhile they hold it, they take 2 damage on their turn."
  },
  {
    "id": "LOE_007t",
    "_info": "(2) SPELL [*WARLOCK]: Cursed!",
    "text": "While this is in your hand, take 2 damage at the start of your turn."
  },
  {
    "id": "LOE_009",
    "_info": "(7) 7/7 [WARRIOR]: Obsidian Destroyer",
    "text": "At the end of your turn, summon a 1/1 Scarab with <b>Taunt</b>."
  },
  {
    "id": "LOE_009e",
    "_info": "ENCHANTMENT [*WARLOCK]: Sinister Power",
    "text": "+4/+4."
  },
  {
    "id": "LOE_009t",
    "_info": "(1) 1/1 [*WARRIOR]: Scarab |BEAST",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "LOE_010",
    "_info": "(1) 2/1 [ROGUE]: Pit Snake |BEAST",
    "text": "<b>Poisonous</b>"
  },
  {
    "id": "LOE_011",
    "_info": "(6) 4/6 [NEUTRAL]: Reno Jackson",
    "text": "<b>Battlecry:</b> If your deck has no duplicates, fully heal your hero."
  },
  {
    "id": "LOE_012",
    "_info": "(4) 5/4 [ROGUE]: Tomb Pillager",
    "text": "<b>Deathrattle:</b> Add a Coin to your hand."
  },
  {
    "id": "LOE_016",
    "_info": "(4) 2/6 [SHAMAN]: Rumbling Elemental |ELEMENTAL",
    "text": "After you play a <b>Battlecry</b> minion, deal 2 damage to a random enemy."
  },
  {
    "id": "LOE_016t",
    "_info": "(1) 0/6 [*NEUTRAL]: Rock",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "LOE_017",
    "_info": "(4) 3/4 [PALADIN]: Keeper of Uldaman",
    "text": "<b>Battlecry:</b> Set a minion's Attack and Health to 3."
  },
  {
    "id": "LOE_017e",
    "_info": "ENCHANTMENT [*PALADIN]: Watched",
    "text": "Stats changed to 3/3."
  },
  {
    "id": "LOE_018",
    "_info": "(1) 1/3 [SHAMAN]: Tunnel Trogg",
    "text": "Whenever you <b>Overload</b>, gain +1 Attack per locked Mana Crystal."
  },
  {
    "id": "LOE_018e",
    "_info": "ENCHANTMENT [*SHAMAN]: Trogg No Stupid",
    "text": "Increased Attack."
  },
  {
    "id": "LOE_019",
    "_info": "(3) 3/4 [ROGUE]: Unearthed Raptor",
    "text": "<b>Battlecry:</b> Choose a friendly minion. Gain a copy of its <b>Deathrattle</b>."
  },
  {
    "id": "LOE_019e",
    "_info": "ENCHANTMENT [*ROGUE]: Unearthed Raptor"
  },
  {
    "id": "LOE_019t",
    "_info": "(2) SPELL [*NEUTRAL]: Map to the Golden Monkey",
    "text": "Shuffle the Golden Monkey into your deck. Draw a card."
  },
  {
    "id": "LOE_019t2",
    "_info": "(4) 6/6 [*NEUTRAL]: Golden Monkey",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Replace your hand and deck with <b>Legendary</b> minions."
  },
  {
    "id": "LOE_020",
    "_info": "(3) 2/4 [HUNTER]: Desert Camel |BEAST",
    "text": "<b>Battlecry:</b> Put a 1-Cost minion from each deck into the battlefield."
  },
  {
    "id": "LOE_021",
    "_info": "(2) SPELL [HUNTER]: Dart Trap",
    "text": "<b>Secret:</b> After an opposing <b>Hero Power</b> is used, deal $5 damage to a random enemy."
  },
  {
    "id": "LOE_022",
    "_info": "(3) 3/4 [WARRIOR]: Fierce Monkey |BEAST",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "LOE_023",
    "_info": "(2) 2/2 [WARLOCK]: Dark Peddler",
    "text": "<b>Battlecry: Discover</b> a\n1-Cost card."
  },
  {
    "id": "LOE_026",
    "_info": "(10) SPELL [PALADIN]: Anyfin Can Happen",
    "text": "Summon 7 Murlocs that died this game."
  },
  {
    "id": "LOE_027",
    "_info": "(1) SPELL [PALADIN]: Sacred Trial",
    "text": "<b>Secret:</b> After your opponent has at least 3 minions and plays another, destroy it."
  },
  {
    "id": "LOE_029",
    "_info": "(2) 1/1 [NEUTRAL]: Jeweled Scarab |BEAST",
    "text": "<b>Battlecry: Discover</b> a\n3-Cost card."
  },
  {
    "id": "LOE_038",
    "_info": "(5) 5/5 [NEUTRAL]: Naga Sea Witch",
    "text": "Your cards cost (5)."
  },
  {
    "id": "LOE_039",
    "_info": "(4) 3/4 [NEUTRAL]: Gorillabot A-3 |MECHANICAL",
    "text": "<b>Battlecry:</b> If you control another Mech, <b>Discover</b> a Mech."
  },
  {
    "id": "LOE_046",
    "_info": "(2) 3/2 [NEUTRAL]: Huge Toad |BEAST",
    "text": "<b>Deathrattle:</b> Deal 1 damage to a random enemy."
  },
  {
    "id": "LOE_047",
    "_info": "(4) 3/3 [NEUTRAL]: Tomb Spider |BEAST",
    "text": "<b>Battlecry: Discover</b> a Beast."
  },
  {
    "id": "LOE_050",
    "_info": "(3) 3/2 [DRUID]: Mounted Raptor |BEAST",
    "text": "<b>Deathrattle:</b> Summon a random 1-Cost minion."
  },
  {
    "id": "LOE_051",
    "_info": "(4) 4/4 [DRUID]: Jungle Moonkin |BEAST",
    "text": "Both players have\n<b>Spell Damage +2</b>."
  },
  {
    "id": "LOE_053",
    "_info": "(5) 4/6 [NEUTRAL]: Djinni of Zephyrs",
    "text": "After you cast a spell on another friendly minion, cast a copy of it on this one."
  },
  {
    "id": "LOE_061",
    "_info": "(5) 4/4 [NEUTRAL]: Anubisath Sentinel",
    "text": "<b>Deathrattle:</b> Give a random friendly minion +3/+3."
  },
  {
    "id": "LOE_061e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Power of the Titans",
    "text": "+3/+3."
  },
  {
    "id": "LOE_073",
    "_info": "(8) 8/8 [NEUTRAL]: Fossilized Devilsaur",
    "text": "<b>Battlecry:</b> If you control a Beast, gain <b>Taunt</b>."
  },
  {
    "id": "LOE_073e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Fossilized",
    "text": "Has <b>Taunt</b>."
  },
  {
    "id": "LOE_076",
    "_info": "(1) 1/3 [NEUTRAL]: Sir Finley Mrrgglton |MURLOC",
    "text": "<b>Battlecry: Discover</b> a new basic Hero Power."
  },
  {
    "id": "LOE_077",
    "_info": "(3) 2/4 [NEUTRAL]: Brann Bronzebeard",
    "text": "Your <b>Battlecries</b> trigger twice."
  },
  {
    "id": "LOE_079",
    "_info": "(4) 3/5 [NEUTRAL]: Elise Starseeker",
    "text": "<b>Battlecry:</b> Shuffle the 'Map to the Golden Monkey'   into your deck."
  },
  {
    "id": "LOE_086",
    "_info": "(5) 0/6 [NEUTRAL]: Summoning Stone",
    "text": "Whenever you cast a spell, summon a random minion of the same Cost."
  },
  {
    "id": "LOE_089",
    "_info": "(6) 2/6 [NEUTRAL]: Wobbling Runts",
    "text": "<b>Deathrattle:</b> Summon three 2/2 Runts.",
    death ({summon}) {
      summon('LOE_089t');
      summon('LOE_089t2');
      summon('LOE_089t3');
    }
  },
  {
    "id": "LOE_089t",
    "_info": "(2) 2/2 [*NEUTRAL]: Rascally Runt"
  },
  {
    "id": "LOE_089t2",
    "_info": "(2) 2/2 [*NEUTRAL]: Wily Runt"
  },
  {
    "id": "LOE_089t3",
    "_info": "(2) 2/2 [*NEUTRAL]: Grumbly Runt"
  },
  {
    "id": "LOE_092",
    "_info": "(9) 7/8 [NEUTRAL]: Arch-Thief Rafaam",
    "text": "<b>Battlecry: Discover</b> a powerful Artifact."
  },
  {
    "id": "LOE_104",
    "_info": "(6) SPELL [PRIEST]: Entomb",
    "text": "Choose an enemy minion.\nShuffle it into your deck."
  },
  {
    "id": "LOE_105",
    "_info": "(2) SPELL [HUNTER]: Explorer's Hat",
    "text": "Give a minion +1/+1 and \"<b>Deathrattle:</b> Add an Explorer's Hat to your hand.\""
  },
  {
    "id": "LOE_105e",
    "_info": "ENCHANTMENT [*HUNTER]: Explorer's Hat",
    "text": "+1/+1. <b>Deathrattle:</b> Add an Explorer's Hat to your hand."
  },
  {
    "id": "LOE_107",
    "_info": "(4) 7/7 [NEUTRAL]: Eerie Statue",
    "text": "Can’t attack unless it’s the only minion in the battlefield."
  },
  {
    "id": "LOE_110",
    "_info": "(4) 7/4 [NEUTRAL]: Ancient Shade",
    "text": "<b>Battlecry:</b> Shuffle an 'Ancient Curse' into your deck that deals 7 damage to you when drawn."
  },
  {
    "id": "LOE_110t",
    "_info": "(0) SPELL [*NEUTRAL]: Ancient Curse",
    "text": "When you draw this, take 7 damage and draw a card."
  },
  {
    "id": "LOE_111",
    "_info": "(5) SPELL [PRIEST]: Excavated Evil",
    "text": "Deal $3 damage to all minions.\nShuffle this card into your opponent's deck."
  },
  {
    "id": "LOE_113",
    "_info": "(7) SPELL [SHAMAN]: Everyfin is Awesome",
    "text": "Give your minions +2/+2.\nCosts (1) less for each Murloc you control."
  },
  {
    "id": "LOE_113e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Mrglllraawrrrglrur!",
    "text": "+2/+2."
  },
  {
    "id": "LOE_115",
    "_info": "(1) SPELL [DRUID]: Raven Idol",
    "text": "<b>Choose One -</b>\n<b>Discover</b> a minion; or <b>Discover</b> a spell."
  },
  {
    "id": "LOE_115a",
    "_info": "(0) SPELL [*DRUID]: Raven Idol",
    "text": "<b>Discover</b> a minion."
  },
  {
    "id": "LOE_115b",
    "_info": "(0) SPELL [*DRUID]: Raven Idol",
    "text": "<b>Discover</b> a spell."
  },
  {
    "id": "LOE_116",
    "_info": "(1) 1/1 [WARLOCK]: Reliquary Seeker",
    "text": "<b>Battlecry:</b> If you have 6 other minions, gain +4/+4."
  },
  {
    "id": "LOE_118",
    "_info": "(1) 2/3 WEAPON [WARRIOR]: Cursed Blade",
    "text": "Double all damage dealt to your hero."
  },
  {
    "id": "LOE_118e",
    "_info": "ENCHANTMENT [*WARRIOR]: Cursed Blade",
    "text": "Double all damage dealt to your hero."
  },
  {
    "id": "LOE_119",
    "_info": "(4) 4/4 [MAGE]: Animated Armor",
    "text": "Your hero can only take 1 damage at a time."
  },
  {
    "id": "NEW1_003",
    "_info": "(0) SPELL [WARLOCK]: Sacrificial Pact",
    "text": "Destroy a Demon. Restore #5 Health to your hero."
  },
  {
    "id": "NEW1_004",
    "_info": "(6) SPELL [ROGUE]: Vanish",
    "text": "Return all minions to their owner's hand."
  },
  {
    "id": "NEW1_005",
    "_info": "(6) 5/3 [ROGUE]: Kidnapper",
    "text": "<b>Combo:</b> Return a minion to its owner's hand."
  },
  {
    "id": "NEW1_007",
    "_info": "(5) SPELL [DRUID]: Starfall",
    "text": "<b>Choose One -</b> Deal $5 damage to a minion; or $2 damage to all enemy minions."
  },
  {
    "id": "NEW1_007a",
    "_info": "(0) SPELL [*DRUID]: Starfall",
    "text": "Deal $2 damage to all enemy minions."
  },
  {
    "id": "NEW1_007b",
    "_info": "(0) SPELL [*DRUID]: Starfall",
    "text": "Deal $5 damage to a minion."
  },
  {
    "id": "NEW1_008",
    "_info": "(7) 5/5 [DRUID]: Ancient of Lore",
    "text": "<b>Choose One -</b> Draw a card; or Restore 5 Health."
  },
  {
    "id": "NEW1_008a",
    "_info": "(0) SPELL [*DRUID]: Ancient Teachings",
    "text": "Draw a card."
  },
  {
    "id": "NEW1_008b",
    "_info": "(0) SPELL [*DRUID]: Ancient Secrets",
    "text": "Restore 5 Health."
  },
  {
    "id": "NEW1_010",
    "_info": "(8) 3/5 [SHAMAN]: Al'Akir the Windlord |ELEMENTAL",
    "text": "<b>Windfury, Charge, Divine Shield, Taunt</b>"
  },
  {
    "id": "NEW1_011",
    "_info": "(4) 4/3 [WARRIOR]: Kor'kron Elite",
    "text": "<b>Charge</b>"
  },
  {
    "id": "NEW1_012",
    "_info": "(1) 1/3 [MAGE]: Mana Wyrm",
    "text": "Whenever you cast a spell, gain +1 Attack."
  },
  {
    "id": "NEW1_012o",
    "_info": "ENCHANTMENT [*MAGE]: Mana Gorged",
    "text": "Increased attack."
  },
  {
    "id": "NEW1_014",
    "_info": "(4) 4/4 [ROGUE]: Master of Disguise",
    "text": "<b>Battlecry:</b> Give a friendly minion <b>Stealth</b> until your next turn."
  },
  {
    "id": "NEW1_014e",
    "_info": "ENCHANTMENT [*ROGUE]: Disguised",
    "text": "Stealthed until your next turn."
  },
  {
    "id": "NEW1_016",
    "_info": "(2) 1/1 [NEUTRAL]: Captain's Parrot |BEAST",
    "text": "<b>Battlecry:</b> Draw a Pirate from your deck."
  },
  {
    "id": "NEW1_017",
    "_info": "(1) 1/2 [NEUTRAL]: Hungry Crab |BEAST",
    "text": "<b>Battlecry:</b> Destroy a Murloc and gain +2/+2."
  },
  {
    "id": "NEW1_017e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Full Belly",
    "text": "+2/+2.  Full of Murloc."
  },
  {
    "id": "NEW1_018",
    "_info": "(2) 2/3 [NEUTRAL]: Bloodsail Raider |PIRATE",
    "text": "<b>Battlecry:</b> Gain Attack equal to the Attack\nof your weapon.",
    xxx: 'clean this up',
    play ({self, buff}) {
      //self.buff('NEW1_018e');
      //self.buff(_$_card('NEW1_018e'));
      buff(self, 'NEW1_018e');
      // console.log(self.buffs);
      // console.log(self.tags);
      // console.log('a', self.attack);
    }
  },
  {
    "id": "NEW1_018e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Treasure Crazed",
    "text": "Increased Attack.",
    xxx: 'weapons are not in game yet',
    attack ({target, $}) {
      return 3;
      // let myWeapon = $('own weapon')[0];
      // return myWeapon ? myWeapon.attack : 0;  
    }
    
    //attack: ({target, $}) => target.attack + 3 // + $('own weapon')[0].attack
    
    
    // attack_$add: -1,
    // health_$multiply: 2,
    // health ({target}) => target.health * 2,
    // cost_$set: 5, 

    // mutate: [1, 3, -2, TAGS.taunt],
    // effect: [null, 2, null, TAGS.divineShield],

    // effect ({target, $}) {
    //   return {
    //     attack: target.attack + $('own weapon')[0].attack,
    //     health,
    //     durability,
    //     cost,
    //     tags,
    //     death,
    //     trigger,
    //     owner ~~ controller
    //   }
    // }
  },
  {
    "id": "NEW1_019",
    "_info": "(2) 2/2 [NEUTRAL]: Knife Juggler",
    "text": "[x]After you summon a\nminion, deal 1 damage\nto a random enemy.",
    xxx: 0,
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.minion_summoned,
        condition: 'own minion',
        action: ({$, self}) => {
          console.log(`${self.owner.name}'s KNIFE JUGGLER: Hey, catch !`);
          $('enemy character .health>0').getRandom().dealDamage(1) //should be :alive (aka hp>0 and NOT pending destroy)         
        } 
      }
    ]
  },
  {
    "id": "NEW1_020",
    "_info": "(2) 3/2 [NEUTRAL]: Wild Pyromancer",
    "text": "After you cast a spell, deal 1 damage to ALL minions."
  },
  {
    "id": "NEW1_021",
    "_info": "(2) 0/7 [NEUTRAL]: Doomsayer",
    "text": "At the start of your turn, destroy ALL minions.",
    xxx: 'untested',
    _triggers_v1: [
      {
        activeZone: 'play',
        eventName: EVENTS.turn_started,
        condition: ({target, self}) => target === self.owner,
        //shorthand
        //action: ({$}) => $('minion').destroy() 
        action: ({$}) => {
        //   console.log('[Doomsayer]: EVERYBODY DIES !!')
            $('minion').destroy();
        //   console.log($('minion').map(v => v.tags));
        }         
      }
    ] 
  },
  {
    "id": "NEW1_022",
    "_info": "(4) 3/3 [NEUTRAL]: Dread Corsair |PIRATE",
    "text": "<b>Taunt</b>\nCosts (1) less per Attack of your weapon."
  },
  {
    "id": "NEW1_023",
    "_info": "(2) 3/2 [NEUTRAL]: Faerie Dragon |DRAGON",
    "text": "Can't be targeted by spells or Hero Powers."
  },
  {
    "id": "NEW1_024",
    "_info": "(5) 5/4 [NEUTRAL]: Captain Greenskin |PIRATE",
    "text": "<b>Battlecry:</b> Give your weapon +1/+1."
  },
  {
    "id": "NEW1_024o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Greenskin's Command",
    "text": "+1/+1."
  },
  {
    "id": "NEW1_025",
    "_info": "(1) 1/2 [NEUTRAL]: Bloodsail Corsair |PIRATE",
    "text": "[x]<b>Battlecry:</b> Remove\n1 Durability from your\nopponent's weapon."
  },
  {
    "id": "NEW1_025e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Bolstered",
    "text": "Increased Health."
  },
  {
    "id": "NEW1_026",
    "_info": "(4) 3/5 [NEUTRAL]: Violet Teacher",
    "text": "Whenever you cast a spell, summon a 1/1 Violet Apprentice."
  },
  {
    "id": "NEW1_026t",
    "_info": "(1) 1/1 [*NEUTRAL]: Violet Apprentice"
  },
  {
    "id": "NEW1_027",
    "_info": "(3) 3/3 [NEUTRAL]: Southsea Captain |PIRATE",
    "text": "Your other Pirates have +1/+1."
  },
  {
    "id": "NEW1_027e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Yarrr!",
    "text": "Southsea Captain is granting +1/+1."
  },
  {
    "id": "NEW1_029",
    "_info": "(2) 4/4 [NEUTRAL]: Millhouse Manastorm",
    "text": "<b>Battlecry:</b> Enemy spells cost (0) next turn."
  },
  {
    "id": "NEW1_029t",
    "_info": "ENCHANTMENT [*NEUTRAL]: Kill Millhouse!",
    "text": "Spells cost (0) this turn!"
  },
  {
    "id": "NEW1_030",
    "_info": "(10) 12/12 [NEUTRAL]: Deathwing |DRAGON",
    "text": "<b>Battlecry:</b> Destroy all other minions and discard your hand."
  },
  {
    "id": "NEW1_031",
    "_info": "(3) SPELL [HUNTER]: Animal Companion",
    "text": "Summon a random Beast Companion.",
    xxx: 'need PRGN and 3 token IDs'
  },
  {
    "id": "NEW1_036",
    "_info": "(2) SPELL [WARRIOR]: Commanding Shout",
    "text": "Your minions can't be reduced below 1 Health this turn. Draw a card."
  },
  {
    "id": "NEW1_036e",
    "_info": "ENCHANTMENT [*WARRIOR]: Commanding Shout",
    "text": "Can't be reduced below 1 Health this turn."
  },
  {
    "id": "NEW1_036e2",
    "_info": "ENCHANTMENT [*WARRIOR]: Commanding Shout",
    "text": "Your minions can't be reduced below 1 Health this turn."
  },
  {
    "id": "NEW1_037",
    "_info": "(2) 1/3 [NEUTRAL]: Master Swordsmith",
    "text": "At the end of your turn, give another random friendly minion +1 Attack."
  },
  {
    "id": "NEW1_037e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Equipped",
    "text": "Increased Attack."
  },
  {
    "id": "NEW1_038",
    "_info": "(8) 7/7 [NEUTRAL]: Gruul",
    "text": "At the end of each turn, gain +1/+1 ."
  },
  {
    "id": "NEW1_038o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Growth",
    "text": "Gruul is growing..."
  },
  {
    "id": "NEW1_040",
    "_info": "(6) 4/4 [NEUTRAL]: Hogger",
    "text": "At the end of your turn, summon a 2/2 Gnoll with <b>Taunt</b>."
  },
  {
    "id": "NEW1_040t",
    "_info": "(2) 2/2 [*NEUTRAL]: Gnoll",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "NEW1_041",
    "_info": "(5) 3/5 [NEUTRAL]: Stampeding Kodo |BEAST",
    "text": "<b>Battlecry:</b> Destroy a random enemy minion with 2 or less Attack.",
    play ({$}) {
      $('enemy minion .attack<=2').getRandom().destroy();
    }
  },
  {
    "id": "OG_006",
    "_info": "(1) 1/3 [PALADIN]: Vilefin Inquisitor |MURLOC",
    "text": "<b>Battlecry:</b> Your Hero Power becomes 'Summon a   1/1 Murloc.'"
  },
  {
    "id": "OG_006a",
    "_info": "(1) 1/1 [*PALADIN]: Silver Hand Murloc |MURLOC"
  },
  {
    "id": "OG_006b",
    "_info": "(2) HERO_POWER [*PALADIN]: The Tidal Hand",
    "text": "<b>Hero Power</b>\nSummon a 1/1 Silver Hand Murloc."
  },
  {
    "id": "OG_023",
    "_info": "(1) SPELL [SHAMAN]: Primal Fusion",
    "text": "Give a minion +1/+1 for each of your Totems."
  },
  {
    "id": "OG_023t",
    "_info": "ENCHANTMENT [*NEUTRAL]: Primally Infused",
    "text": "Increased stats."
  },
  {
    "id": "OG_024",
    "_info": "(4) 7/7 [SHAMAN]: Flamewreathed Faceless",
    "text": "<b>Overload:</b> (2)"
  },
  {
    "id": "OG_026",
    "_info": "(2) 3/2 [SHAMAN]: Eternal Sentinel",
    "text": "<b>Battlecry:</b> Unlock your <b>Overloaded</b> Mana Crystals."
  },
  {
    "id": "OG_027",
    "_info": "(1) SPELL [SHAMAN]: Evolve",
    "text": "Transform your minions into random minions that cost (1) more."
  },
  {
    "id": "OG_028",
    "_info": "(6) 5/5 [SHAMAN]: Thing from Below",
    "text": "[x]<b>Taunt</b>\nCosts (1) less for each\nTotem you've summoned\nthis game."
  },
  {
    "id": "OG_031",
    "_info": "(5) 4/2 WEAPON [SHAMAN]: Hammer of Twilight",
    "text": "<b>Deathrattle:</b> Summon a 4/2 Elemental.",
    death ({summon}) {
      summon('OG_031a');
    }
  },
  {
    "id": "OG_031a",
    "_info": "(3) 4/2 [*SHAMAN]: Twilight Elemental |ELEMENTAL"
  },
  {
    "id": "OG_033",
    "_info": "(5) 2/2 WEAPON [WARRIOR]: Tentacles for Arms",
    "text": "<b>Deathrattle:</b> Return this to your hand."
  },
  {
    "id": "OG_034",
    "_info": "(3) 3/5 [NEUTRAL]: Silithid Swarmer |BEAST",
    "text": "Can only attack if your hero attacked this turn."
  },
  {
    "id": "OG_042",
    "_info": "(10) 10/10 [NEUTRAL]: Y'Shaarj, Rage Unbound",
    "text": "At the end of your turn, put a minion from your deck into the battlefield."
  },
  {
    "id": "OG_044",
    "_info": "(4) 3/5 [DRUID]: Fandral Staghelm",
    "text": "Your <b>Choose One</b> cards have both effects combined."
  },
  {
    "id": "OG_044a",
    "_info": "(5) 4/6 [*DRUID]: Druid of the Claw |BEAST",
    "text": "<b>Charge</b>\n<b>Taunt</b>"
  },
  {
    "id": "OG_044b",
    "_info": "(3) 5/5 [*DRUID]: Druid of the Flame |BEAST"
  },
  {
    "id": "OG_044c",
    "_info": "(2) 3/2 [*DRUID]: Sabertooth Tiger |BEAST",
    "text": "<b>Charge, Stealth</b>"
  },
  {
    "id": "OG_045",
    "_info": "(3) SPELL [HUNTER]: Infest",
    "text": "Give your minions \"<b>Deathrattle:</b> Add a random Beast to your hand.\""
  },
  {
    "id": "OG_045a",
    "_info": "ENCHANTMENT [*DRUID]: Nerubian Spores",
    "text": "Get a Beast when this dies."
  },
  {
    "id": "OG_047",
    "_info": "(3) SPELL [DRUID]: Feral Rage",
    "text": "<b>Choose One -</b> Give your hero +4 Attack this turn; or Gain 8 Armor."
  },
  {
    "id": "OG_047a",
    "_info": "(0) SPELL [*DRUID]: Evolve Spines",
    "text": "Give your hero +4 Attack this turn."
  },
  {
    "id": "OG_047b",
    "_info": "(0) SPELL [*DRUID]: Evolve Scales",
    "text": "Gain 8 Armor."
  },
  {
    "id": "OG_047e",
    "_info": "ENCHANTMENT [*DRUID]: Spines",
    "text": "+4 Attack this turn."
  },
  {
    "id": "OG_048",
    "_info": "(2) SPELL [DRUID]: Mark of Y'Shaarj",
    "text": "Give a minion +2/+2.\nIf it's a Beast, draw\na card."
  },
  {
    "id": "OG_048e",
    "_info": "ENCHANTMENT [*DRUID]: Mark of Y'Shaarj",
    "text": "+2/+2."
  },
  {
    "id": "OG_051",
    "_info": "(1) 1/1 [DRUID]: Forbidden Ancient",
    "text": "<b>Battlecry:</b> Spend all your Mana. Gain +1/+1 for each mana spent."
  },
  {
    "id": "OG_051e",
    "_info": "ENCHANTMENT [*DRUID]: Forbidden Power",
    "text": "Increased stats."
  },
  {
    "id": "OG_061",
    "_info": "(1) SPELL [HUNTER]: On the Hunt",
    "text": "Deal $1 damage.\nSummon a 1/1 Mastiff.",
    xxx: 'test this with empty board',
    target: 'character',
    play ({summon, target}) {
      target.dealDamageSpell(1);
      summon('OG_061t');
    }
  },
  {
    "id": "OG_061t",
    "_info": "(1) 1/1 [*HUNTER]: Mastiff |BEAST"
  },
  {
    "id": "OG_070",
    "_info": "(1) 1/2 [ROGUE]: Bladed Cultist",
    "text": "<b>Combo:</b> Gain +1/+1."
  },
  {
    "id": "OG_070e",
    "_info": "ENCHANTMENT [*ROGUE]: Thirsty Blades",
    "text": "+1/+1."
  },
  {
    "id": "OG_072",
    "_info": "(1) SPELL [ROGUE]: Journey Below",
    "text": "<b>Discover</b> a <b>Deathrattle</b> card."
  },
  {
    "id": "OG_073",
    "_info": "(6) SPELL [ROGUE]: Thistle Tea",
    "text": "Draw a card. Add 2 extra copies of it to your hand."
  },
  {
    "id": "OG_080",
    "_info": "(4) 3/2 [ROGUE]: Xaril, Poisoned Mind",
    "text": "<b>Battlecry and Deathrattle:</b> Add a random Toxin card to your hand."
  },
  {
    "id": "OG_080ae",
    "_info": "ENCHANTMENT [*NEUTRAL]: Bloodthistle",
    "text": "Costs (2) less."
  },
  {
    "id": "OG_080b",
    "_info": "(1) SPELL [*ROGUE]: Kingsblood Toxin",
    "text": "Draw a card."
  },
  {
    "id": "OG_080c",
    "_info": "(1) SPELL [*ROGUE]: Bloodthistle Toxin",
    "text": "Return a friendly minion to your hand.\nIt costs (2) less."
  },
  {
    "id": "OG_080d",
    "_info": "(1) SPELL [*ROGUE]: Briarthorn Toxin",
    "text": "Give a minion +3 Attack."
  },
  {
    "id": "OG_080de",
    "_info": "ENCHANTMENT [*NEUTRAL]: Fadeleaf",
    "text": "Stealthed until your next turn."
  },
  {
    "id": "OG_080e",
    "_info": "(1) SPELL [*ROGUE]: Fadeleaf Toxin",
    "text": "Give a friendly minion <b>Stealth</b> until your next turn."
  },
  {
    "id": "OG_080ee",
    "_info": "ENCHANTMENT [*NEUTRAL]: Briarthorn",
    "text": "+3 Attack."
  },
  {
    "id": "OG_080f",
    "_info": "(1) SPELL [*ROGUE]: Firebloom Toxin",
    "text": "Deal $2 damage."
  },
  {
    "id": "OG_081",
    "_info": "(2) SPELL [MAGE]: Shatter",
    "text": "Destroy a <b>Frozen</b> minion."
  },
  {
    "id": "OG_082",
    "_info": "(4) 2/2 [NEUTRAL]: Evolved Kobold",
    "text": "<b>Spell Damage +2</b>"
  },
  {
    "id": "OG_083",
    "_info": "(3) 2/2 [MAGE]: Twilight Flamecaller",
    "text": "<b>Battlecry:</b> Deal 1 damage to all enemy minions."
  },
  {
    "id": "OG_085",
    "_info": "(4) 2/4 [MAGE]: Demented Frostcaller",
    "text": "After you cast a spell, <b>Freeze</b> a random enemy."
  },
  {
    "id": "OG_086",
    "_info": "(0) SPELL [MAGE]: Forbidden Flame",
    "text": "Spend all your Mana. Deal that much damage to a minion."
  },
  {
    "id": "OG_087",
    "_info": "(5) 5/4 [MAGE]: Servant of Yogg-Saron",
    "text": "<b>Battlecry:</b> Cast a random spell that costs (5) or less <i>(targets chosen randomly)</i>."
  },
  {
    "id": "OG_090",
    "_info": "(5) SPELL [MAGE]: Cabalist's Tome",
    "text": "Add 3 random Mage spells to your hand."
  },
  {
    "id": "OG_094",
    "_info": "(5) SPELL [PRIEST]: Power Word: Tentacles",
    "text": "Give a minion +2/+6."
  },
  {
    "id": "OG_094e",
    "_info": "ENCHANTMENT [*PRIEST]: Tentacles",
    "text": "+2/+6"
  },
  {
    "id": "OG_096",
    "_info": "(5) 6/5 [PRIEST]: Twilight Darkmender",
    "text": "<b>Battlecry:</b> If your C'Thun  has at least 10 Attack, restore 10 Health to your hero."
  },
  {
    "id": "OG_100",
    "_info": "(4) SPELL [PRIEST]: Shadow Word: Horror",
    "text": "Destroy all minions with 2 or less Attack."
  },
  {
    "id": "OG_101",
    "_info": "(0) SPELL [PRIEST]: Forbidden Shaping",
    "text": "Spend all your Mana. Summon a random minion that costs that much."
  },
  {
    "id": "OG_102",
    "_info": "(5) 3/6 [NEUTRAL]: Darkspeaker",
    "text": "<b>Battlecry:</b> Swap stats with a friendly minion."
  },
  {
    "id": "OG_102e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Power Transfer",
    "text": "Swapped stats."
  },
  {
    "id": "OG_104",
    "_info": "(2) SPELL [PRIEST]: Embrace the Shadow",
    "text": "This turn, your healing effects deal damage instead."
  },
  {
    "id": "OG_104e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Embracing the Shadow",
    "text": "Your healing effects are dealing damage."
  },
  {
    "id": "OG_109",
    "_info": "(2) 3/2 [WARLOCK]: Darkshire Librarian",
    "text": "<b>Battlecry:</b>\nDiscard a random card. <b>Deathrattle:</b>\nDraw a card."
  },
  {
    "id": "OG_113",
    "_info": "(3) 1/5 [WARLOCK]: Darkshire Councilman",
    "text": "After you summon a minion, gain +1 Attack."
  },
  {
    "id": "OG_113e",
    "_info": "ENCHANTMENT [*WARLOCK]: Power of the People",
    "text": "Increased Attack."
  },
  {
    "id": "OG_114",
    "_info": "(0) SPELL [WARLOCK]: Forbidden Ritual",
    "text": "Spend all your Mana. Summon that many 1/1 Tentacles."
  },
  {
    "id": "OG_114a",
    "_info": "(1) 1/1 [*WARLOCK]: Icky Tentacle"
  },
  {
    "id": "OG_116",
    "_info": "(3) SPELL [WARLOCK]: Spreading Madness",
    "text": "Deal $9 damage randomly split among ALL characters."
  },
  {
    "id": "OG_118",
    "_info": "(2) SPELL [WARLOCK]: Renounce Darkness",
    "text": "Replace your Hero Power and Warlock cards with another class's. The cards cost (1) less."
  },
  {
    "id": "OG_118e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Renounce Darkness Deck Ench"
  },
  {
    "id": "OG_118f",
    "_info": "ENCHANTMENT [*NEUTRAL]: New Calling",
    "text": "Cost reduced."
  },
  {
    "id": "OG_120",
    "_info": "(8) 8/6 [MAGE]: Anomalus |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Deal 8 damage to all minions."
  },
  {
    "id": "OG_121",
    "_info": "(7) 7/7 [WARLOCK]: Cho'gall",
    "text": "<b>Battlecry:</b> The next spell you cast this turn costs Health instead of Mana."
  },
  {
    "id": "OG_121e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dark Power",
    "text": "Your next spell costs Health instead of Mana."
  },
  {
    "id": "OG_122",
    "_info": "(6) 5/5 [NEUTRAL]: Mukla, Tyrant of the Vale |BEAST",
    "text": "<b>Battlecry:</b> Add 2 Bananas to your hand."
  },
  {
    "id": "OG_123",
    "_info": "(1) 1/1 [NEUTRAL]: Shifter Zerus",
    "text": "Each turn this is in your hand, transform it into a random minion."
  },
  {
    "id": "OG_123e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Shifting",
    "text": "Transforming into random minions."
  },
  {
    "id": "OG_131",
    "_info": "(7) 4/6 [NEUTRAL]: Twin Emperor Vek'lor",
    "text": "[x]<b><b>Taunt</b>\nBattlecry:</b> If your C'Thun has\nat least 10 Attack, summon\nanother Emperor.",
    play ({$, summon}) {
      let cthun_is_strong = $('own character .id=OG_279 .attack>=10').length > 0;
      if (cthun_is_strong) {
        summon('OG_319');
      }
    }
  },
  {
    // added manually
    "id": "OG_319",
    "_info": "(7) 4/6 [*NEUTRAL]: Twin Emperor Vek'nilash",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "OG_133",
    "_info": "(10) 5/7 [NEUTRAL]: N'Zoth, the Corruptor",
    "text": "<b>Battlecry:</b> Summon your <b>Deathrattle</b> minions that died this game."
  },
  {
    "id": "OG_134",
    "_info": "(10) 7/5 [NEUTRAL]: Yogg-Saron, Hope's End",
    "text": "<b>Battlecry:</b> Cast a random spell for each spell you've cast this game <i>(targets chosen randomly)</i>."
  },
  {
    "id": "OG_138",
    "_info": "(6) 4/4 [NEUTRAL]: Nerubian Prophet",
    "text": "At the start of your turn, reduce this card's\nCost by (1)."
  },
  {
    "id": "OG_138e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Will of the Vizier",
    "text": "Reduced Cost."
  },
  {
    "id": "OG_141",
    "_info": "(10) 10/10 [NEUTRAL]: Faceless Behemoth"
  },
  {
    "id": "OG_142",
    "_info": "(8) 6/10 [NEUTRAL]: Eldritch Horror"
  },
  {
    "id": "OG_145",
    "_info": "(5) 3/4 [NEUTRAL]: Psych-o-Tron |MECHANICAL",
    "text": "<b>Taunt</b>\n<b>Divine Shield</b>",
    tags: [TAGS.taunt, TAGS.divineShield]
  },
  {
    "id": "OG_147",
    "_info": "(5) 6/6 [NEUTRAL]: Corrupted Healbot |MECHANICAL",
    "text": "<b>Deathrattle:</b> Restore 8 Health to the enemy hero."
  },
  {
    "id": "OG_149",
    "_info": "(3) 3/3 [WARRIOR]: Ravaging Ghoul",
    "text": "<b>Battlecry:</b> Deal 1 damage to all other minions.",
    play ({$, self}) {
      $('minion').exclude(self).dealDamage(1);
    }
  },
  {
    "id": "OG_150",
    "_info": "(4) 3/5 [NEUTRAL]: Aberrant Berserker",
    "text": "<b>Enrage:</b> +2 Attack."
  },
  {
    "id": "OG_150e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+2 Attack."
  },
  {
    "id": "OG_151",
    "_info": "(1) 1/1 [NEUTRAL]: Tentacle of N'Zoth",
    "text": "<b>Deathrattle:</b> Deal 1 damage to all minions.",
    death ({$}) {
      $('minion').dealDamage(1);
    }
  },
  {
    "id": "OG_152",
    "_info": "(7) 5/5 [NEUTRAL]: Grotesque Dragonhawk |BEAST",
    "text": "<b>Windfury</b>",
    TAGS: [TAGS.windfury]
  },
  {
    "id": "OG_153",
    "_info": "(7) 6/8 [NEUTRAL]: Bog Creeper",
    "text": "<b>Taunt</b>",
    TAGS: [TAGS.taunt]
  },
  {
    "id": "OG_156",
    "_info": "(2) 2/1 [NEUTRAL]: Bilefin Tidehunter |MURLOC",
    "text": "<b>Battlecry:</b> Summon a 1/1 Ooze with <b>Taunt</b>.",
    play ({summon}) {
      summon('OG_156a');
    }
  },
  {
    "id": "OG_156a",
    "_info": "(1) 1/1 [*NEUTRAL]: Ooze",
    "text": "<b>Taunt</b>",
    TAGS: [TAGS.taunt]
  },
  {
    "id": "OG_158",
    "_info": "(1) 1/1 [NEUTRAL]: Zealous Initiate",
    "text": "<b>Deathrattle:</b> Give a random friendly minion +1/+1."
  },
  {
    "id": "OG_158e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Secrets of the Cult",
    "text": "+1/+1."
  },
  {
    "id": "OG_161",
    "_info": "(6) 2/3 [NEUTRAL]: Corrupted Seer |MURLOC",
    "text": "<b>Battlecry:</b> Deal 2 damage to all non-Murloc minions.",
    play ({$}) {
      $('minion .race!=murloc').dealDamage(2);
    }
  },
  {
    "id": "OG_162",
    "_info": "(3) 2/1 [NEUTRAL]: Disciple of C'Thun",
    "text": "<b>Battlecry:</b> Deal 2 damage. Give your C'Thun +2/+2 <i>(wherever it is)</i>."
  },
  {
    "id": "OG_173",
    "_info": "(9) 9/9 [NEUTRAL]: Blood of The Ancient One",
    "text": "If you control two of these\nat the end of your turn, merge them into 'The Ancient One'."
  },
  {
    "id": "OG_173a",
    "_info": "(9) 30/30 [*NEUTRAL]: The Ancient One"
  },
  {
    "id": "OG_174",
    "_info": "(4) 1/1 [NEUTRAL]: Faceless Shambler",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Copy a friendly minion's Attack and Health."
  },
  {
    "id": "OG_174e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Faceless",
    "text": "Copying stats."
  },
  {
    "id": "OG_176",
    "_info": "(3) SPELL [ROGUE]: Shadow Strike",
    "text": "Deal $5 damage to an undamaged character."
  },
  {
    "id": "OG_179",
    "_info": "(1) 2/1 [HUNTER]: Fiery Bat |BEAST",
    "text": "<b>Deathrattle:</b> Deal 1 damage to a random enemy.",
    death ({$}) {
      $('enemy character').getRandom().dealDamage(1);
    }
  },
  {
    "id": "OG_188",
    "_info": "(4) 4/5 [DRUID]: Klaxxi Amber-Weaver",
    "text": "<b>Battlecry:</b> If your C'Thun has at least 10 Attack, gain +5 Health."
  },
  {
    "id": "OG_188e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Amber Carapace",
    "text": "+5 Health."
  },
  {
    "id": "OG_195",
    "_info": "(7) SPELL [DRUID]: Wisps of the Old Gods",
    "text": "<b>Choose One -</b> Summon seven 1/1 Wisps; or Give your minions +2/+2."
  },
  {
    "id": "OG_195a",
    "_info": "(0) SPELL [*DRUID]: Many Wisps",
    "text": "Summon seven 1/1 Wisps."
  },
  {
    "id": "OG_195b",
    "_info": "(0) SPELL [*DRUID]: Big Wisps",
    "text": "Give your minions +2/+2."
  },
  {
    "id": "OG_195c",
    "_info": "(0) 1/1 [*DRUID]: Wisp"
  },
  {
    "id": "OG_195e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enormous",
    "text": "+2/+2."
  },
  {
    "id": "OG_198",
    "_info": "(0) SPELL [PALADIN]: Forbidden Healing",
    "text": "Spend all your Mana. Restore twice that much Health."
  },
  {
    "id": "OG_200",
    "_info": "(5) 0/7 [NEUTRAL]: Validated Doomsayer",
    "text": "At the start of your turn, set this minion's Attack to 7."
  },
  {
    "id": "OG_200e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Doom Free",
    "text": "Attack set to 7."
  },
  {
    "id": "OG_202",
    "_info": "(4) 3/3 [DRUID]: Mire Keeper",
    "text": "[x]<b>Choose One -</b> Summon a\n2/2 Slime; or Gain an\nempty Mana Crystal."
  },
  {
    "id": "OG_202a",
    "_info": "(0) SPELL [*DRUID]: Y'Shaarj's Strength",
    "text": "Summon a 2/2 Slime."
  },
  {
    "id": "OG_202ae",
    "_info": "ENCHANTMENT [*DRUID]: Y'Shaarj's Strength",
    "text": "+3/+3."
  },
  {
    "id": "OG_202b",
    "_info": "(0) SPELL [*DRUID]: Yogg-Saron's Magic",
    "text": "Gain an empty Mana Crystal."
  },
  {
    "id": "OG_202c",
    "_info": "(2) 2/2 [*DRUID]: Slime"
  },
  {
    "id": "OG_206",
    "_info": "(2) SPELL [SHAMAN]: Stormcrack",
    "text": "Deal $4 damage to a minion. <b>Overload:</b> (1)"
  },
  {
    "id": "OG_207",
    "_info": "(6) 5/5 [MAGE]: Faceless Summoner",
    "text": "<b>Battlecry:</b> Summon a random 3-Cost minion."
  },
  {
    "id": "OG_209",
    "_info": "(5) 4/6 [SHAMAN]: Hallazeal the Ascended",
    "text": "Whenever your spells deal damage, restore that much Health to your hero."
  },
  {
    "id": "OG_211",
    "_info": "(9) SPELL [HUNTER]: Call of the Wild",
    "text": "Summon all three Animal Companions.",
    xxx: 'need tokens'
  },
  {
    "id": "OG_216",
    "_info": "(4) 3/3 [HUNTER]: Infested Wolf |BEAST",
    "text": "<b>Deathrattle:</b> Summon two 1/1 Spiders.",
    death({summon}) {
      summon('OG_216a');
    }
  },
  {
    "id": "OG_216a",
    "_info": "(1) 1/1 [*HUNTER]: Spider |BEAST"
  },
  {
    "id": "OG_218",
    "_info": "(4) 2/6 [WARRIOR]: Bloodhoof Brave",
    "text": "<b>Taunt</b>\n<b>Enrage:</b> +3 Attack."
  },
  {
    "id": "OG_218e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Enraged",
    "text": "+3 Attack."
  },
  {
    "id": "OG_220",
    "_info": "(7) 6/5 [WARRIOR]: Malkorok",
    "text": "<b>Battlecry:</b> Equip a random weapon."
  },
  {
    "id": "OG_221",
    "_info": "(1) 2/1 [PALADIN]: Selfless Hero",
    "text": "<b>Deathrattle:</b> Give a random friendly minion <b>Divine Shield</b>."
  },
  {
    "id": "OG_222",
    "_info": "(3) 3/2 WEAPON [PALADIN]: Rallying Blade",
    "text": "<b>Battlecry:</b> Give +1/+1 to your minions with <b>Divine Shield</b>."
  },
  {
    "id": "OG_222e",
    "_info": "ENCHANTMENT [*PALADIN]: Rally",
    "text": "+1/+1."
  },
  {
    "id": "OG_223",
    "_info": "(1) SPELL [PALADIN]: Divine Strength",
    "text": "Give a minion +1/+2."
  },
  {
    "id": "OG_223e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Optimism",
    "text": "+1/+2."
  },
  {
    "id": "OG_229",
    "_info": "(8) 8/8 [PALADIN]: Ragnaros, Lightlord |ELEMENTAL",
    "text": "At the end of your turn, restore 8 Health to a damaged friendly character."
  },
  {
    "id": "OG_234",
    "_info": "(5) 4/5 [PRIEST]: Darkshire Alchemist",
    "text": "<b>Battlecry:</b> Restore 5 Health."
  },
  {
    "id": "OG_239",
    "_info": "(10) SPELL [WARLOCK]: DOOM!",
    "text": "Destroy all minions. Draw a card for each."
  },
  {
    "id": "OG_241",
    "_info": "(1) 1/1 [WARLOCK]: Possessed Villager",
    "text": "<b>Deathrattle:</b> Summon a 1/1 Shadowbeast.",
    death ({summon}) {
      summon('OG_241a');
    }
  },
  {
    "id": "OG_241a",
    "_info": "(1) 1/1 [*WARLOCK]: Shadowbeast"
  },
  {
    "id": "OG_247",
    "_info": "(2) 3/1 [NEUTRAL]: Twisted Worgen",
    "text": "<b>Stealth</b>",
    tags: [TAGS.stealth]
  },
  {
    "id": "OG_248",
    "_info": "(3) 1/5 [NEUTRAL]: Am'gam Rager"
  },
  {
    "id": "OG_249",
    "_info": "(4) 2/3 [NEUTRAL]: Infested Tauren",
    "text": "<b>Taunt</b>\n<b>Deathrattle:</b> Summon a 2/2 Slime.",
    tags: [TAGS.taunt],
    death ({summon}) {
      summon('OG_249a');
    }
  },
  {
    "id": "OG_249a",
    "_info": "(2) 2/2 [*NEUTRAL]: Slime"
  },
  {
    "id": "OG_254",
    "_info": "(4) 2/4 [NEUTRAL]: Eater of Secrets",
    "text": "<b>Battlecry:</b> Destroy all enemy <b>Secrets</b>. Gain +1/+1 for each."
  },
  {
    "id": "OG_254e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Secretly Sated",
    "text": "Increased stats."
  },
  {
    "id": "OG_255",
    "_info": "(8) 7/9 [NEUTRAL]: Doomcaller",
    "text": "<b>Battlecry:</b> Give your C'Thun +2/+2 <i>(wherever it is).</i> If it's dead, shuffle it into your deck."
  },
  {
    "id": "OG_256",
    "_info": "(3) 2/2 [NEUTRAL]: Spawn of N'Zoth",
    "text": "<b>Deathrattle:</b> Give your minions +1/+1."
  },
  {
    "id": "OG_256e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Slimed",
    "text": "+1/+1."
  },
  {
    "id": "OG_267",
    "_info": "(4) 4/4 [ROGUE]: Southsea Squidface |PIRATE",
    "text": "<b>Deathrattle:</b> Give your weapon +2 Attack."
  },
  {
    "id": "OG_267e",
    "_info": "ENCHANTMENT [*ROGUE]: Squid Oil Sheen",
    "text": "+2 Attack"
  },
  {
    "id": "OG_271",
    "_info": "(6) 2/8 [NEUTRAL]: Scaled Nightmare |DRAGON",
    "text": "At the start of your turn, double this minion's Attack."
  },
  {
    "id": "OG_271e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Terrifying Visage",
    "text": "Attack increased."
  },
  {
    "id": "OG_272",
    "_info": "(4) 1/1 [NEUTRAL]: Twilight Summoner",
    "text": "<b>Deathrattle:</b> Summon a 5/5 Faceless Destroyer.",
    death ({summon}) {
      summon('OG_272t');
    }
  },
  {
    "id": "OG_272t",
    "_info": "(4) 5/5 [*NEUTRAL]: Faceless Destroyer"
  },
  {
    "id": "OG_273",
    "_info": "(5) SPELL [PALADIN]: Stand Against Darkness",
    "text": "Summon five 1/1 Silver Hand Recruits.",
    play ({summon}) {
      summon('CS2_101t'); // same token as ability
      summon('CS2_101t');
      summon('CS2_101t');
      summon('CS2_101t');
      summon('CS2_101t');
    }
  },
  {
    "id": "OG_276",
    "_info": "(3) SPELL [WARRIOR]: Blood Warriors",
    "text": "Add a copy of each damaged friendly minion to your hand."
  },
  {
    "id": "OG_280",
    "_info": "(10) 6/6 [NEUTRAL]: C'Thun",
    "text": "<b>Battlecry:</b> Deal damage equal to this minion's Attack randomly split among all enemies.",
    xxx: 1,
    play ({self, $}) {
      let cthun_strong = self.attack;
      for(let i = 0; i < cthun_strong; i++) {
        //must be :alive i.e not-mortally-wounded
        $('enemy character .health>0').getRandom().dealDamage(1);
      }
    }

  },
  {
    "id": "OG_281",
    "_info": "(2) 2/3 [NEUTRAL]: Beckoner of Evil",
    "text": "<b>Battlecry:</b> Give your C'Thun +2/+2 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_281e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Fanatic Devotion",
    "text": "Increased Stats."
  },
  {
    "id": "OG_282",
    "_info": "(9) 4/4 [ROGUE]: Blade of C'Thun",
    "text": "<b>Battlecry:</b> Destroy a minion. Add its Attack and Health to your C'Thun's <i>(wherever it is).</i>"
  },
  {
    "id": "OG_282e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Devotion of the Blade",
    "text": "Increased stats."
  },
  {
    "id": "OG_283",
    "_info": "(4) 4/2 [NEUTRAL]: C'Thun's Chosen",
    "text": "[x]<b>Divine Shield</b>\n<b>Battlecry:</b> Give your C'Thun\n+2/+2 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_284",
    "_info": "(2) 1/4 [NEUTRAL]: Twilight Geomancer",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Give your C'Thun\n<b>Taunt</b> <i>(wherever it is).</i>"
  },
  {
    "id": "OG_284e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Geomancy",
    "text": "Has <b>Taunt</b>."
  },
  {
    "id": "OG_286",
    "_info": "(3) 3/4 [NEUTRAL]: Twilight Elder",
    "text": "At the end of your turn, give your C'Thun +1/+1 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_290",
    "_info": "(6) 4/6 [NEUTRAL]: Ancient Harbinger",
    "text": "At the start of your turn, put a 10-Cost minion from your deck into your hand."
  },
  {
    "id": "OG_290e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Caller Devotion",
    "text": "+1/+1."
  },
  {
    "id": "OG_291",
    "_info": "(5) 4/4 [ROGUE]: Shadowcaster",
    "text": "<b>Battlecry:</b> Choose a friendly minion. Add a 1/1 copy to your hand that costs (1)."
  },
  {
    "id": "OG_291e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Flickering Darkness",
    "text": "Shadowcaster made this 1/1."
  },
  {
    "id": "OG_292",
    "_info": "(3) 4/2 [HUNTER]: Forlorn Stalker",
    "text": "<b>Battlecry:</b> Give all <b>Deathrattle</b> minions in your hand +1/+1."
  },
  {
    "id": "OG_292e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Night's Devotion",
    "text": "+1/+1."
  },
  {
    "id": "OG_293",
    "_info": "(6) 5/7 [DRUID]: Dark Arakkoa",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Give your C'Thun\n+3/+3 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_293e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Arrakoa Devotion",
    "text": "+5/+5."
  },
  {
    "id": "OG_293f",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dark Guardian",
    "text": "Increased Stats."
  },
  {
    "id": "OG_295",
    "_info": "(5) 4/4 [NEUTRAL]: Cult Apothecary",
    "text": "<b>Battlecry:</b> For each enemy minion, restore 2 Health to your hero."
  },
  {
    "id": "OG_300",
    "_info": "(8) 6/7 [NEUTRAL]: The Boogeymonster",
    "text": "Whenever this attacks and kills a minion, gain +2/+2."
  },
  {
    "id": "OG_300e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Tasty!",
    "text": "Increased stats."
  },
  {
    "id": "OG_301",
    "_info": "(7) 6/6 [WARRIOR]: Ancient Shieldbearer",
    "text": "<b>Battlecry:</b> If your C'Thun has at least 10 Attack, gain 10 Armor."
  },
  {
    "id": "OG_302",
    "_info": "(5) 5/6 [WARLOCK]: Usher of Souls",
    "text": "Whenever a friendly minion dies, give your C'Thun +1/+1\n<i>(wherever it is).</i>"
  },
  {
    "id": "OG_302e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Soul Power",
    "text": "Increased Attack."
  },
  {
    "id": "OG_303",
    "_info": "(2) 3/2 [MAGE]: Cult Sorcerer",
    "text": "[x]<b><b>Spell Damage</b> +1</b>\nAfter you cast a spell,\ngive your C'Thun +1/+1\n<i>(wherever it is).</i>"
  },
  {
    "id": "OG_303e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Sorcerous Devotion",
    "text": "+1/+1."
  },
  {
    "id": "OG_308",
    "_info": "(8) 8/8 [HUNTER]: Giant Sand Worm |BEAST",
    "text": "Whenever this attacks and kills a minion, it may attack again."
  },
  {
    "id": "OG_309",
    "_info": "(5) 6/5 [HUNTER]: Princess Huhuran |BEAST",
    "text": "<b>Battlecry:</b> Trigger a friendly minion's <b>Deathrattle</b> effect."
  },
  {
    "id": "OG_310",
    "_info": "(3) 3/3 [PALADIN]: Steward of Darkshire",
    "text": "Whenever you summon a 1-Health minion, give it <b>Divine Shield</b>."
  },
  {
    "id": "OG_311",
    "_info": "(2) SPELL [PALADIN]: A Light in the Darkness",
    "text": "<b>Discover</b> a minion.\nGive it +1/+1."
  },
  {
    "id": "OG_311e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Beacon of Hope",
    "text": "+1/+1."
  },
  {
    "id": "OG_312",
    "_info": "(1) 1/1 [WARRIOR]: N'Zoth's First Mate |PIRATE",
    "text": "<b>Battlecry:</b> Equip a 1/3 Rusty Hook."
  },
  {
    "id": "OG_312e",
    "_info": "ENCHANTMENT [*WARRIOR]: Upgraded",
    "text": "Increased Durability."
  },
  {
    "id": "OG_313",
    "_info": "(3) 2/2 [DRUID]: Addled Grizzly |BEAST",
    "text": "After you summon a minion, give it +1/+1."
  },
  {
    "id": "OG_313e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Addled",
    "text": "+1/+1."
  },
  {
    "id": "OG_314",
    "_info": "(1) SPELL [WARRIOR]: Blood To Ichor",
    "text": "Deal $1 damage to a minion. If it survives, summon a 2/2 Slime.",
    target: 'minion',
    play ({target, summon}) {
      target.dealDamage(1);
      if (target.health > 0) {
        summon('OG_314b');
      }
    }
  },
  {
    "id": "OG_314b",
    "_info": "(2) 2/2 [*WARRIOR]: Slime"
  },
  {
    "id": "OG_315",
    "_info": "(3) 3/4 [WARRIOR]: Bloodsail Cultist |PIRATE",
    "text": "<b>Battlecry:</b> If you control another Pirate, give your weapon +1/+1."
  },
  {
    "id": "OG_315e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Reforged",
    "text": "+1/+1."
  },
  {
    "id": "OG_316",
    "_info": "(6) 5/5 [PRIEST]: Herald Volazj",
    "text": "<b>Battlecry:</b> Summon a 1/1 copy of each of your other minions."
  },
  {
    "id": "OG_316k",
    "_info": "ENCHANTMENT [*NEUTRAL]: Shadowy",
    "text": "1/1."
  },
  {
    "id": "OG_317",
    "_info": "(10) 12/12 [NEUTRAL]: Deathwing, Dragonlord |DRAGON",
    "text": "<b>Deathrattle:</b> Put all Dragons from your hand into the battlefield."
  },
  {
    "id": "OG_318",
    "_info": "(7) 6/6 [NEUTRAL]: Hogger, Doom of Elwynn",
    "text": "Whenever this minion takes damage, summon a 2/2 Gnoll with <b>Taunt</b>."
  },
  {
    "id": "OG_318t",
    "_info": "(2) 2/2 [*NEUTRAL]: Gnoll",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "OG_320",
    "_info": "(4) 1/4 [NEUTRAL]: Midnight Drake |DRAGON",
    "text": "<b>Battlecry:</b> Gain +1 Attack for each other card\nin your hand."
  },
  {
    "id": "OG_320e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Hour of Corruption",
    "text": "Increased Attack."
  },
  {
    "id": "OG_321",
    "_info": "(5) 3/6 [NEUTRAL]: Crazed Worshipper",
    "text": "<b>Taunt.</b> Whenever this minion takes damage, give your C'Thun +1/+1 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_321e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Power of Faith",
    "text": "+1/+1."
  },
  {
    "id": "OG_322",
    "_info": "(4) 2/5 [NEUTRAL]: Blackwater Pirate |PIRATE",
    "text": "Your weapons cost (2) less."
  },
  {
    "id": "OG_323",
    "_info": "(4) 4/2 [NEUTRAL]: Polluted Hoarder",
    "text": "<b>Deathrattle:</b> Draw a card."
  },
  {
    "id": "OG_325",
    "_info": "(3) 2/5 [HUNTER]: Carrion Grub |BEAST"
  },
  {
    "id": "OG_326",
    "_info": "(2) 4/1 [NEUTRAL]: Duskboar |BEAST"
  },
  {
    "id": "OG_327",
    "_info": "(3) 2/4 [NEUTRAL]: Squirming Tentacle",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "OG_328",
    "_info": "(4) 4/5 [SHAMAN]: Master of Evolution",
    "text": "<b>Battlecry:</b> Transform a friendly minion into a random one that costs (1) more."
  },
  {
    "id": "OG_330",
    "_info": "(2) 2/2 [ROGUE]: Undercity Huckster",
    "text": "<b>Deathrattle:</b> Add a random class card to your hand <i>(from your opponent's class)</i>."
  },
  {
    "id": "OG_334",
    "_info": "(4) 3/6 [PRIEST]: Hooded Acolyte",
    "text": "Whenever a character is healed, give your\nC'Thun +1/+1 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_335",
    "_info": "(4) 4/3 [PRIEST]: Shifting Shade",
    "text": "[x]<b>Deathrattle:</b> Copy a card\nfrom your opponent's deck\n and add it to your hand."
  },
  {
    "id": "OG_337",
    "_info": "(4) 3/3 [NEUTRAL]: Cyclopian Horror",
    "text": "<b>Taunt</b>. <b>Battlecry:</b> Gain      +1 Health for each enemy minion."
  },
  {
    "id": "OG_337e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Eve of Destruction",
    "text": "Stats increased."
  },
  {
    "id": "OG_338",
    "_info": "(2) 2/4 [NEUTRAL]: Nat, the Darkfisher",
    "text": "At the start of your opponent's turn, they have a 50% chance to draw an extra card."
  },
  {
    "id": "OG_339",
    "_info": "(6) 7/6 [NEUTRAL]: Skeram Cultist",
    "text": "<b>Battlecry:</b> Give your C'Thun +2/+2 <i>(wherever it is).</i>"
  },
  {
    "id": "OG_339e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Vassal's Subservience",
    "text": "+2/+2."
  },
  {
    "id": "OG_340",
    "_info": "(9) 5/9 [NEUTRAL]: Soggoth the Slitherer",
    "text": "<b>Taunt</b>\nCan't be targeted by spells or Hero Powers."
  },
  {
    "id": "PRO_001",
    "_info": "(5) 5/5 [NEUTRAL]: Elite Tauren Chieftain",
    "text": "<b>Battlecry:</b> Give both players the power to ROCK! (with a Power Chord card)"
  },
  {
    "id": "PRO_001a",
    "_info": "(4) SPELL [*NEUTRAL]: I Am Murloc",
    "text": "Summon three, four, or five 1/1 Murlocs."
  },
  {
    "id": "PRO_001at",
    "_info": "(0) 1/1 [*NEUTRAL]: Murloc |MURLOC"
  },
  {
    "id": "PRO_001b",
    "_info": "(4) SPELL [*NEUTRAL]: Rogues Do It...",
    "text": "Deal $4 damage. Draw a card."
  },
  {
    "id": "PRO_001c",
    "_info": "(4) SPELL [*NEUTRAL]: Power of the Horde",
    "text": "Summon a random Horde Warrior."
  },
  {
    "id": "UNG_001",
    "_info": "(3) 2/2 [NEUTRAL]: Pterrordax Hatchling |BEAST",
    "text": "<b><b>Battlecry:</b> Adapt</b>."
  },
  {
    "id": "UNG_002",
    "_info": "(7) 5/6 [NEUTRAL]: Volcanosaur |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b>, then <b>Adapt</b>."
  },
  {
    "id": "UNG_004",
    "_info": "(8) SPELL [PALADIN]: Dinosize",
    "text": "Set a minion's Attack and Health to 10."
  },
  {
    "id": "UNG_004e",
    "_info": "ENCHANTMENT [*PALADIN]: RAAAAR!",
    "text": "Stats changed to 10/10."
  },
  {
    "id": "UNG_009",
    "_info": "(2) 2/2 [NEUTRAL]: Ravasaur Runt |BEAST",
    "text": "<b>Battlecry:</b> If you control at least 2 other minions, <b>Adapt.</b>"
  },
  {
    "id": "UNG_010",
    "_info": "(7) 5/7 [NEUTRAL]: Sated Threshadon |BEAST",
    "text": "<b>Deathrattle:</b> Summon three 1/1 Murlocs.",
    death ({$}) {
      // token ID is from ETC murlocs - can be wrong
      summon('PRO_001at');
      summon('PRO_001at');
      summon('PRO_001at');
    }
  },
  {
    "id": "UNG_011",
    "_info": "(2) 2/2 [PALADIN]: Hydrologist |MURLOC",
    "text": "<b>Battlecry:</b> <b>Discover</b> a <b>Secret</b>."
  },
  {
    "id": "UNG_015",
    "_info": "(6) 3/7 [PALADIN]: Sunkeeper Tarim",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Set all other minions' Attack and Health to 3."
  },
  {
    "id": "UNG_015e",
    "_info": "ENCHANTMENT [*PALADIN]: Watched",
    "text": "Stats changed to 3/3."
  },
  {
    "id": "UNG_018",
    "_info": "(2) SPELL [MAGE]: Flame Geyser",
    "text": "Deal $2 damage.\nAdd a 1/2 Elemental to your hand."
  },
  {
    "id": "UNG_019",
    "_info": "(1) 2/1 [SHAMAN]: Air Elemental |ELEMENTAL",
    "text": "Can't be targeted by spells or Hero Powers."
  },
  {
    "id": "UNG_020",
    "_info": "(2) 2/3 [MAGE]: Arcanologist",
    "text": "<b>Battlecry:</b> Draw a <b>Secret</b> from your deck."
  },
  {
    "id": "UNG_021",
    "_info": "(4) 5/4 [MAGE]: Steam Surger |ELEMENTAL",
    "text": "[x]<b>Battlecry:</b> If you played\nan Elemental last turn,\nadd a 'Flame Geyser'\nto your hand."
  },
  {
    "id": "UNG_022",
    "_info": "(3) 2/3 [PRIEST]: Mirage Caller",
    "text": "<b>Battlecry:</b> Choose a friendly minion. Summon a 1/1 copy of it."
  },
  {
    "id": "UNG_022e",
    "_info": "ENCHANTMENT [*PRIEST]: Mirage",
    "text": "1/1."
  },
  {
    "id": "UNG_024",
    "_info": "(3) SPELL [MAGE]: Mana Bind",
    "text": "<b>Secret:</b> When your opponent casts a spell, add a copy to your hand that costs (0)."
  },
  {
    "id": "UNG_025",
    "_info": "(5) SPELL [SHAMAN]: Volcano",
    "text": "Deal $15 damage randomly split among all minions.\n<b>Overload:</b> (2)"
  },
  {
    "id": "UNG_027",
    "_info": "(2) 2/2 [MAGE]: Pyros |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Return this to your hand as a 6/6 that costs (6)."
  },
  {
    "id": "UNG_027t2",
    "_info": "(6) 6/6 [*MAGE]: Pyros |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Return this to your hand as a 10/10 that costs (10)."
  },
  {
    "id": "UNG_027t4",
    "_info": "(10) 10/10 [*MAGE]: Pyros |ELEMENTAL"
  },
  {
    "id": "UNG_028",
    "_info": "(1) SPELL [MAGE]: Open the Waygate",
    "text": "[x]<b>Quest:</b> Cast 6 spells that\ndidn't start in your deck.\n<b>Reward:</b> Time Warp."
  },
  {
    "id": "UNG_028e",
    "_info": "ENCHANTMENT [*MAGE]: Insightful",
    "text": "Take an extra turn."
  },
  {
    "id": "UNG_028t",
    "_info": "(5) SPELL [*MAGE]: Time Warp",
    "text": "Take an extra turn."
  },
  {
    "id": "UNG_029",
    "_info": "(2) SPELL [PRIEST]: Shadow Visions",
    "text": "<b>Discover</b> a copy of a spell in your deck."
  },
  {
    "id": "UNG_030",
    "_info": "(1) SPELL [PRIEST]: Binding Heal",
    "text": "Restore #5 Health to a minion and your hero."
  },
  {
    "id": "UNG_032",
    "_info": "(1) 1/1 [PRIEST]: Crystalline Oracle |ELEMENTAL",
    "text": "[x]<b>Deathrattle:</b> Copy a card\nfrom your opponent's deck\n and add it to your hand."
  },
  {
    "id": "UNG_034",
    "_info": "(2) 2/3 [PRIEST]: Radiant Elemental |ELEMENTAL",
    "text": "Your spells cost (1) less."
  },
  {
    "id": "UNG_035",
    "_info": "(3) 3/3 [PRIEST]: Curious Glimmerroot",
    "text": "[x]<b>Battlecry:</b> Look at 3 cards.\nGuess which one started\nin your opponent's deck\nto get a copy of it."
  },
  {
    "id": "UNG_037",
    "_info": "(4) 2/6 [PRIEST]: Tortollan Shellraiser",
    "text": "[x]<b>Taunt</b>\n<b>Deathrattle:</b> Give a random\n friendly minion +1/+1."
  },
  {
    "id": "UNG_037e",
    "_info": "ENCHANTMENT [*PRIEST]: Shellshield",
    "text": "+1/+1."
  },
  {
    "id": "UNG_047",
    "_info": "(4) 4/4 [WARLOCK]: Ravenous Pterrordax |BEAST",
    "text": "<b>Battlecry:</b> Destroy a friendly minion to <b>Adapt</b> twice."
  },
  {
    "id": "UNG_049",
    "_info": "(5) 1/7 [WARLOCK]: Tar Lurker |ELEMENTAL",
    "text": "<b>Taunt</b>\nHas +3 Attack during your opponent's turn."
  },
  {
    "id": "UNG_057",
    "_info": "(2) SPELL [ROGUE]: Razorpetal Volley",
    "text": "Add two Razorpetals to your hand that deal 1 damage."
  },
  {
    "id": "UNG_057t1",
    "_info": "(1) SPELL [*ROGUE]: Razorpetal",
    "text": "Deal $1 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamageSpell(1);
    }
  },
  {
    "id": "UNG_058",
    "_info": "(2) 2/2 [ROGUE]: Razorpetal Lasher",
    "text": "[x]<b>Battlecry:</b> Add a\nRazorpetal to your hand\nthat deals 1 damage."
  },
  {
    "id": "UNG_060",
    "_info": "(3) SPELL [ROGUE]: Mimic Pod",
    "text": "Draw a card, then add a copy of it to your hand."
  },
  {
    "id": "UNG_061",
    "_info": "(4) 3/3 WEAPON [ROGUE]: Obsidian Shard",
    "text": "[x]Costs (1) less for each\ncard you've played from\nanother class."
  },
  {
    "id": "UNG_063",
    "_info": "(2) 1/1 [ROGUE]: Biteweed",
    "text": "<b>Combo:</b> Gain +1/+1 for each other card you've played this turn."
  },
  {
    "id": "UNG_063e",
    "_info": "ENCHANTMENT [*ROGUE]: Sprout",
    "text": "Increased stats."
  },
  {
    "id": "UNG_064",
    "_info": "(5) 3/4 [ROGUE]: Vilespine Slayer",
    "text": "<b>Combo:</b> Destroy a minion."
  },
  {
    "id": "UNG_065",
    "_info": "(4) 5/3 [ROGUE]: Sherazin, Corpse Flower",
    "text": "<b>Deathrattle:</b> Go dormant. Play 4 cards in a turn to revive this minion."
  },
  {
    "id": "UNG_065t",
    "_info": "(11) 0/1 [*ROGUE]: Sherazin, Seed",
    "text": "When you play 4 cards in a turn, revive this minion."
  },
  {
    "id": "UNG_067",
    "_info": "(1) SPELL [ROGUE]: The Caverns Below",
    "text": "[x]<b>Quest:</b> Play four minions\nwith the same name.\n<b>Reward:</b> Crystal Core."
  },
  {
    "id": "UNG_067t1",
    "_info": "(5) SPELL [*ROGUE]: Crystal Core",
    "text": "For the rest of the game, your minions are 5/5."
  },
  {
    "id": "UNG_067t1e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Crystallized",
    "text": "Your minions are 5/5."
  },
  {
    "id": "UNG_067t1e2",
    "_info": "ENCHANTMENT [*NEUTRAL]: Crystallized",
    "text": "5/5."
  },
  {
    "id": "UNG_070",
    "_info": "(4) 3/5 [NEUTRAL]: Tol'vir Stoneshaper",
    "text": "[x]<b>Battlecry:</b> If you played an\nElemental last turn, gain\n <b>Taunt</b> and <b>Divine Shield</b>."
  },
  {
    "id": "UNG_070e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Stonewall",
    "text": "<b>Divine Shield</b> and <b>Taunt</b>.",
    xxx: 'for test',
    tags: [TAGS.divineShield, TAGS.taunt]
  },
  {
    "id": "UNG_071",
    "_info": "(9) 6/10 [NEUTRAL]: Giant Mastodon |BEAST",
    "text": "<b>Taunt</b>",
    tags: [TAGS.taunt]
  },
  {
    "id": "UNG_072",
    "_info": "(3) 1/4 [NEUTRAL]: Stonehill Defender",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> <b>Discover</b> a <b>Taunt</b> minion."
  },
  {
    "id": "UNG_073",
    "_info": "(2) 2/3 [NEUTRAL]: Rockpool Hunter |MURLOC",
    "text": "<b>Battlecry:</b> Give a friendly Murloc +1/+1."
  },
  {
    "id": "UNG_073e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Trained",
    "text": "+1/+1"
  },
  {
    "id": "UNG_075",
    "_info": "(3) 3/3 [NEUTRAL]: Vicious Fledgling |BEAST",
    "text": "After this minion attacks a hero, <b>Adapt</b>."
  },
  {
    "id": "UNG_076",
    "_info": "(3) 3/1 [NEUTRAL]: Eggnapper",
    "text": "<b>Deathrattle:</b> Summon two 1/1 Raptors.",
    death ({summon}) {
      summon('UNG_076t1');
      summon('UNG_076t1');
    }
  },
  {
    "id": "UNG_076t1",
    "_info": "(1) 1/1 [*NEUTRAL]: Raptor |BEAST"
  },
  {
    "id": "UNG_078",
    "_info": "(2) 2/2 [DRUID]: Tortollan Forager",
    "text": "<b>Battlecry:</b> Add a random minion with 5 or more Attack to your hand."
  },
  {
    "id": "UNG_079",
    "_info": "(6) 8/8 [NEUTRAL]: Frozen Crusher |ELEMENTAL",
    "text": "After this minion attacks, <b>Freeze</b> it."
  },
  {
    "id": "UNG_082",
    "_info": "(3) 3/3 [NEUTRAL]: Thunder Lizard |BEAST",
    "text": "<b>Battlecry</b>: If you played an Elemental last turn, <b>Adapt</b>."
  },
  {
    "id": "UNG_083",
    "_info": "(3) 0/3 [NEUTRAL]: Devilsaur Egg",
    "text": "<b>Deathrattle:</b> Summon a 5/5 Devilsaur.",
    death ({summon}) {
      summon('UNG_083t1');
    }
  },
  {
    "id": "UNG_083t1",
    "_info": "(5) 5/5 [*NEUTRAL]: Devilsaur |BEAST"
  },
  {
    "id": "UNG_084",
    "_info": "(4) 3/3 [NEUTRAL]: Fire Plume Phoenix |ELEMENTAL",
    "text": "<b>Battlecry:</b> Deal 2 damage.",
    target: 'character',
    play ({target}) {
      target.dealDamage(2);
    }
  },
  {
    "id": "UNG_085",
    "_info": "(1) 2/3 [NEUTRAL]: Emerald Hive Queen |BEAST",
    "text": "Your minions cost (2) more."
  },
  {
    "id": "UNG_086",
    "_info": "(7) 5/3 [DRUID]: Giant Anaconda |BEAST",
    "text": "<b>Deathrattle:</b> Summon a minion from your hand with 5 or more Attack."
  },
  {
    "id": "UNG_087",
    "_info": "(5) 8/8 [NEUTRAL]: Bittertide Hydra |BEAST",
    "text": "Whenever this minion takes damage, deal 3 damage to your hero."
  },
  {
    "id": "UNG_088",
    "_info": "(8) 5/4 [NEUTRAL]: Tortollan Primalist",
    "text": "<b>Battlecry:</b> <b>Discover</b> a spell and cast it with random targets."
  },
  {
    "id": "UNG_089",
    "_info": "(4) 5/4 [NEUTRAL]: Gentle Megasaur |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b> your Murlocs."
  },
  {
    "id": "UNG_099",
    "_info": "(8) 7/7 [NEUTRAL]: Charged Devilsaur |BEAST",
    "text": "<b>Charge</b>\n<b>Battlecry:</b> Can't attack heroes this turn."
  },
  {
    "id": "UNG_100",
    "_info": "(5) 5/4 [DRUID]: Verdant Longneck |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b>."
  },
  {
    "id": "UNG_101",
    "_info": "(4) 3/3 [DRUID]: Shellshifter",
    "text": "[x]<b>Choose One - </b>Transform\ninto a 5/3 with <b>Stealth</b>;\nor a 3/5 with <b>Taunt</b>."
  },
  {
    "id": "UNG_101a",
    "_info": "(0) SPELL [*DRUID]: Raptor Form",
    "text": "+2 Attack and <b>Stealth</b>"
  },
  {
    "id": "UNG_101b",
    "_info": "(0) SPELL [*DRUID]: Direhorn Form",
    "text": "+2 Health and <b>Taunt</b>."
  },
  {
    "id": "UNG_101t",
    "_info": "(4) 5/3 [*DRUID]: Shellshifter |BEAST",
    "text": "<b>Stealth</b>"
  },
  {
    "id": "UNG_101t2",
    "_info": "(4) 3/5 [*DRUID]: Shellshifter |BEAST",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "UNG_101t3",
    "_info": "(4) 5/5 [*DRUID]: Shellshifter |BEAST",
    "text": "<b>Stealth</b>\n<b>Taunt</b>"
  },
  {
    "id": "UNG_103",
    "_info": "(4) SPELL [DRUID]: Evolving Spores",
    "text": "<b>Adapt</b> your minions."
  },
  {
    "id": "UNG_108",
    "_info": "(1) SPELL [DRUID]: Earthen Scales",
    "text": "Give a friendly minion +1/+1, then gain Armor equal to its Attack."
  },
  {
    "id": "UNG_108e",
    "_info": "ENCHANTMENT [*DRUID]: It's All Scaley...",
    "text": "+1/+1."
  },
  {
    "id": "UNG_109",
    "_info": "(3) 5/1 [DRUID]: Elder Longneck |BEAST",
    "text": "<b>Battlecry:</b> If you're holding a minion with 5 or more Attack, <b>Adapt</b>."
  },
  {
    "id": "UNG_111",
    "_info": "(5) SPELL [DRUID]: Living Mana",
    "text": "Transform your Mana Crystals into 2/2 minions. Recover the mana when they die."
  },
  {
    "id": "UNG_111t1",
    "_info": "(2) 2/2 [*DRUID]: Mana Treant",
    "text": "<b>Deathrattle:</b> Gain an empty Mana Crystal."
  },
  {
    "id": "UNG_113",
    "_info": "(4) 3/4 [NEUTRAL]: Bright-Eyed Scout",
    "text": "<b>Battlecry:</b> Draw a card. Change its Cost to (5)."
  },
  {
    "id": "UNG_113e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Scouted",
    "text": "Costs (5)."
  },
  {
    "id": "UNG_116",
    "_info": "(1) SPELL [DRUID]: Jungle Giants",
    "text": "[x]<b>Quest:</b> Summon\n5 minions with\n5 or more Attack.\n<b>Reward:</b> Barnabus."
  },
  {
    "id": "UNG_116t",
    "_info": "(5) 8/8 [*DRUID]: Barnabus the Stomper |BEAST",
    "text": "<b>Battlecry:</b> Reduce the\nCost of minions in your deck to (0)."
  },
  {
    "id": "UNG_116te",
    "_info": "ENCHANTMENT [*DRUID]: Romper Stompers",
    "text": "Costs (0)."
  },
  {
    "id": "UNG_201",
    "_info": "(2) 0/3 [SHAMAN]: Primalfin Totem |TOTEM",
    "text": "At the end of your turn, summon a 1/1 Murloc."
  },
  {
    "id": "UNG_201t",
    "_info": "(1) 1/1 [*NEUTRAL]: Primalfin |MURLOC"
  },
  {
    "id": "UNG_202",
    "_info": "(2) 1/1 [SHAMAN]: Fire Plume Harbinger |ELEMENTAL",
    "text": "<b>Battlecry:</b> Reduce the Cost of Elementals in your hand by (1)."
  },
  {
    "id": "UNG_205",
    "_info": "(1) 2/1 [NEUTRAL]: Glacial Shard |ELEMENTAL",
    "text": "<b>Battlecry:</b> <b>Freeze</b> an enemy."
  },
  {
    "id": "UNG_208",
    "_info": "(7) 4/4 [SHAMAN]: Stone Sentinel |ELEMENTAL",
    "text": "<b>Battlecry:</b> If you played an Elemental last turn, summon two 2/3 Elementals with <b>Taunt</b>."
  },
  {
    "id": "UNG_208t",
    "_info": "(2) 2/3 [*SHAMAN]: Rock Elemental |ELEMENTAL",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "UNG_211",
    "_info": "(8) 7/7 [SHAMAN]: Kalimos, Primal Lord |ELEMENTAL",
    "text": "[x]<b>Battlecry:</b> If you played an\nElemental last turn, cast an\nElemental Invocation."
  },
  {
    "id": "UNG_211a",
    "_info": "(0) SPELL [*SHAMAN]: Invocation of Earth",
    "text": "Fill your board with 1/1 Elementals."
  },
  {
    "id": "UNG_211aa",
    "_info": "(1) 1/1 [*SHAMAN]: Stone Elemental |ELEMENTAL"
  },
  {
    "id": "UNG_211b",
    "_info": "(0) SPELL [*SHAMAN]: Invocation of Water",
    "text": "Restore 12 Health to your hero."
  },
  {
    "id": "UNG_211c",
    "_info": "(0) SPELL [*SHAMAN]: Invocation of Fire",
    "text": "Deal 6 damage to the enemy hero."
  },
  {
    "id": "UNG_211d",
    "_info": "(0) SPELL [*SHAMAN]: Invocation of Air",
    "text": "Deal 3 damage to all enemy minions."
  },
  {
    "id": "UNG_800",
    "_info": "(3) 3/3 [HUNTER]: Terrorscale Stalker",
    "text": "<b>Battlecry:</b> Trigger a friendly minion's <b>Deathrattle</b>."
  },
  {
    "id": "UNG_801",
    "_info": "(5) 4/7 [NEUTRAL]: Nesting Roc |BEAST",
    "text": "<b>Battlecry:</b> If you control at least 2 other minions, gain <b>Taunt</b>."
  },
  {
    "id": "UNG_803",
    "_info": "(1) 2/1 [NEUTRAL]: Emerald Reaver |BEAST",
    "text": "<b>Battlecry:</b> Deal 1 damage to each hero.",
    xxx: 'should it be one frame or two ?',
    play ({$}) {
      $('hero').dealDamage(1);
      //-- vs 
      //$('own hero').dealDamage(1);
      //$('enemy hero').dealDamage(1);
    }
  },
  {
    "id": "UNG_806",
    "_info": "(10) 7/14 [NEUTRAL]: Ultrasaur |BEAST"
  },
  {
    "id": "UNG_807",
    "_info": "(2) 2/3 [NEUTRAL]: Golakka Crawler |BEAST",
    "text": "<b>Battlecry:</b> Destroy a Pirate and gain +1/+1."
  },
  {
    "id": "UNG_807e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Overfull Belly",
    "text": "Increased stats."
  },
  {
    "id": "UNG_808",
    "_info": "(2) 1/2 [NEUTRAL]: Stubborn Gastropod |BEAST",
    "text": "<b>Taunt</b>\n  <b>Poisonous</b>"
  },
  {
    "id": "UNG_809",
    "_info": "(1) 1/2 [NEUTRAL]: Fire Fly |ELEMENTAL",
    "text": "<b>Battlecry</b>: Add a 1/2 Elemental to your hand."
  },
  {
    "id": "UNG_809t1",
    "_info": "(1) 1/2 [*NEUTRAL]: Flame Elemental |ELEMENTAL"
  },
  {
    "id": "UNG_810",
    "_info": "(4) 2/6 [NEUTRAL]: Stegodon |BEAST",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "UNG_812",
    "_info": "(6) 8/2 [NEUTRAL]: Sabretooth Stalker |BEAST",
    "text": "<b>Stealth</b>"
  },
  {
    "id": "UNG_813",
    "_info": "(7) 4/8 [NEUTRAL]: Stormwatcher |ELEMENTAL",
    "text": "<b>Windfury</b>"
  },
  {
    "id": "UNG_814",
    "_info": "(3) 2/2 [NEUTRAL]: Giant Wasp |BEAST",
    "text": "<b>Stealth</b>\n <b>Poisonous</b>"
  },
  {
    "id": "UNG_816",
    "_info": "(5) 4/5 [NEUTRAL]: Servant of Kalimos |ELEMENTAL",
    "text": "[x]<b>Battlecry:</b> If you played\nan Elemental last turn,\n <b>Discover</b> an Elemental."
  },
  {
    "id": "UNG_817",
    "_info": "(4) SPELL [SHAMAN]: Tidal Surge",
    "text": "Deal $4 damage to a minion. Restore #4 Health to your hero."
  },
  {
    "id": "UNG_818",
    "_info": "(2) 1/1 [NEUTRAL]: Volatile Elemental |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Deal 3 damage to a random enemy minion."
  },
  {
    "id": "UNG_823",
    "_info": "(3) SPELL [ROGUE]: Envenom Weapon",
    "text": "Give your weapon <b>Poisonous</b>."
  },
  {
    "id": "UNG_829",
    "_info": "(1) SPELL [WARLOCK]: Lakkari Sacrifice",
    "text": "[x]<b>Quest:</b> Discard 6 cards.\n<b>Reward:</b> Nether Portal."
  },
  {
    "id": "UNG_829t1",
    "_info": "(5) SPELL [*WARLOCK]: Nether Portal",
    "text": "Open a permanent portal that summons 3/2 Imps."
  },
  {
    "id": "UNG_829t2",
    "_info": "(11) 0/1 [*WARLOCK]: Nether Portal",
    "text": "At the end of your turn, summon two 3/2 Imps."
  },
  {
    "id": "UNG_829t3",
    "_info": "(2) 3/2 [*WARLOCK]: Nether Imp |DEMON"
  },
  {
    "id": "UNG_830",
    "_info": "(6) 5/5 [WARLOCK]: Cruel Dinomancer",
    "text": "[x]<b>Deathrattle:</b> Summon a\nrandom minion you\ndiscarded this game."
  },
  {
    "id": "UNG_831",
    "_info": "(2) SPELL [WARLOCK]: Corrupting Mist",
    "text": "Corrupt every minion. Destroy them at the start of your next turn."
  },
  {
    "id": "UNG_831e",
    "_info": "ENCHANTMENT [*WARLOCK]: Corrupting Mist",
    "text": "At the start of the corrupting player's turn, destroy this minion."
  },
  {
    "id": "UNG_832",
    "_info": "(2) SPELL [WARLOCK]: Bloodbloom",
    "text": "The next spell you cast this turn costs Health instead of Mana."
  },
  {
    "id": "UNG_832e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Dark Power",
    "text": "Your next spell costs Health instead of Mana."
  },
  {
    "id": "UNG_833",
    "_info": "(4) 3/8 [WARLOCK]: Lakkari Felhound |DEMON",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Discard two random cards."
  },
  {
    "id": "UNG_834",
    "_info": "(5) SPELL [WARLOCK]: Feeding Time",
    "text": "Deal $3 damage to a minion. Summon three 1/1 Pterrordaxes.",
    target: 'minion',
    play ({target, summon}) {
      target.dealDamageSpell(3);
      summon('UNG_834t1');
      summon('UNG_834t1');
      summon('UNG_834t1');
    }
  },
  {
    "id": "UNG_834t1",
    "_info": "(1) 1/1 [*WARLOCK]: Pterrordax |BEAST"
  },
  {
    "id": "UNG_835",
    "_info": "(3) 3/3 [WARLOCK]: Chittering Tunneler |BEAST",
    "text": "<b>Battlecry:</b> <b>Discover</b> a spell. Deal damage to your hero equal to its Cost."
  },
  {
    "id": "UNG_836",
    "_info": "(2) 2/2 [WARLOCK]: Clutchmother Zavas |BEAST",
    "text": "Whenever you discard this, give it +2/+2 and return it to your hand."
  },
  {
    "id": "UNG_836e",
    "_info": "ENCHANTMENT [*WARLOCK]: Remembrance",
    "text": "+2/+2 each time this is discarded."
  },
  {
    "id": "UNG_838",
    "_info": "(7) 1/11 [WARRIOR]: Tar Lord |ELEMENTAL",
    "text": "<b>Taunt</b>\nHas +4 Attack during your opponent’s turn."
  },
  {
    "id": "UNG_840",
    "_info": "(6) 6/6 [NEUTRAL]: Hemet, Jungle Hunter",
    "text": "<b>Battlecry:</b> Destroy all cards in your deck that cost (3) or less."
  },
  {
    "id": "UNG_843",
    "_info": "(4) 3/3 [NEUTRAL]: The Voraxx",
    "text": "[x]After you cast a spell on\nthis minion, summon a\n1/1 Plant and cast\nanother copy on it."
  },
  {
    "id": "UNG_844",
    "_info": "(3) 4/8 [NEUTRAL]: Humongous Razorleaf",
    "text": "Can't attack."
  },
  {
    "id": "UNG_845",
    "_info": "(3) 2/3 [NEUTRAL]: Igneous Elemental |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Add two 1/2 Elementals to your hand."
  },
  {
    "id": "UNG_846",
    "_info": "(2) 2/1 [MAGE]: Shimmering Tempest |ELEMENTAL",
    "text": "<b>Deathrattle:</b> Add a random Mage spell to your hand."
  },
  {
    "id": "UNG_847",
    "_info": "(7) 6/6 [NEUTRAL]: Blazecaller |ELEMENTAL",
    "text": "<b>Battlecry:</b> If you played an Elemental last turn, deal 5 damage."
  },
  {
    "id": "UNG_848",
    "_info": "(8) 4/8 [NEUTRAL]: Primordial Drake |DRAGON",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Deal 2 damage\nto all other minions."
  },
  {
    "id": "UNG_851",
    "_info": "(5) 5/5 [NEUTRAL]: Elise the Trailblazer",
    "text": "<b>Battlecry:</b> Shuffle a sealed <b>Un'Goro</b> pack into your deck."
  },
  {
    "id": "UNG_851t1",
    "_info": "(2) SPELL [*NEUTRAL]: Un'Goro Pack",
    "text": "Add 5 <b>Journey to Un'Goro</b> cards to your hand."
  },
  {
    "id": "UNG_852",
    "_info": "(10) 12/12 [DRUID]: Tyrantus |BEAST",
    "text": "Can't be targeted by spells or Hero Powers."
  },
  {
    "id": "UNG_854",
    "_info": "(8) SPELL [PRIEST]: Free From Amber",
    "text": "<b>Discover</b> a minion that costs (8) or more. Summon it."
  },
  {
    "id": "UNG_856",
    "_info": "(1) SPELL [ROGUE]: Hallucination",
    "text": "<b>Discover</b> a card from your opponent's class."
  },
  {
    "id": "UNG_900",
    "_info": "(4) 3/4 [NEUTRAL]: Spiritsinger Umbra",
    "text": "After you summon a minion, trigger its <b>Deathrattle</b> effect."
  },
  {
    "id": "UNG_907",
    "_info": "(9) 5/5 [NEUTRAL]: Ozruk |ELEMENTAL",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Gain +5 Health\nfor each Elemental you\nplayed last turn."
  },
  {
    "id": "UNG_907e",
    "_info": "ENCHANTMENT [*NEUTRAL]: Just Blaze",
    "text": "+5 Health"
  },
  {
    "id": "UNG_910",
    "_info": "(2) SPELL [HUNTER]: Grievous Bite",
    "text": "Deal $2 damage to a minion and $1 damage to adjacent ones."
  },
  {
    "id": "UNG_912",
    "_info": "(1) 1/1 [HUNTER]: Jeweled Macaw |BEAST",
    "text": "<b>Battlecry:</b> Add a random Beast to your hand."
  },
  {
    "id": "UNG_913",
    "_info": "(5) 3/5 [HUNTER]: Tol'vir Warden",
    "text": "<b>Battlecry:</b> Draw two 1-Cost minions from your deck."
  },
  {
    "id": "UNG_914",
    "_info": "(1) 2/1 [HUNTER]: Raptor Hatchling |BEAST",
    "text": "<b>Deathrattle:</b> Shuffle a 4/3 Raptor into your deck."
  },
  {
    "id": "UNG_914t1",
    "_info": "(1) 4/3 [*HUNTER]: Raptor Patriarch |BEAST"
  },
  {
    "id": "UNG_915",
    "_info": "(2) 3/2 [HUNTER]: Crackling Razormaw |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b> a friendly Beast."
  },
  {
    "id": "UNG_916",
    "_info": "(1) SPELL [HUNTER]: Stampede",
    "text": "Each time you play a Beast this turn, add a random Beast to your hand."
  },
  {
    "id": "UNG_916e",
    "_info": "ENCHANTMENT [*HUNTER]: Stampeding"
  },
  {
    "id": "UNG_917",
    "_info": "(2) SPELL [HUNTER]: Dinomancy",
    "text": "Your Hero Power becomes 'Give a Beast +2/+2.'"
  },
  {
    "id": "UNG_917e",
    "_info": "ENCHANTMENT [*HUNTER]: Well Fed",
    "text": "+2/+2."
  },
  {
    "id": "UNG_917t1",
    "_info": "(2) HERO_POWER [*HUNTER]: Dinomancy",
    "text": "<b>Hero Power</b>\nGive a Beast +2/+2."
  },
  {
    "id": "UNG_919",
    "_info": "(7) 9/9 [HUNTER]: Swamp King Dred |BEAST",
    "text": "After your opponent plays a minion, attack it."
  },
  {
    "id": "UNG_920",
    "_info": "(1) SPELL [HUNTER]: The Marsh Queen",
    "text": "[x]<b>Quest:</b> Play seven\n1-Cost minions.\n<b>Reward:</b> Queen Carnassa."
  },
  {
    "id": "UNG_920t1",
    "_info": "(5) 8/8 [*HUNTER]: Queen Carnassa |BEAST",
    "text": "<b>Battlecry:</b> Shuffle 15 Raptors into your deck."
  },
  {
    "id": "UNG_920t2",
    "_info": "(1) 3/2 [*HUNTER]: Carnassa's Brood |BEAST",
    "text": "<b>Battlecry:</b> Draw a card."
  },
  {
    "id": "UNG_922",
    "_info": "(2) SPELL [WARRIOR]: Explore Un'Goro",
    "text": "Replace your deck with copies of \"<b>Discover</b> a card.\""
  },
  {
    "id": "UNG_922t1",
    "_info": "(1) SPELL [*WARRIOR]: Choose Your Path",
    "text": "<b>Discover</b> a card."
  },
  {
    "id": "UNG_923",
    "_info": "(1) SPELL [WARRIOR]: Iron Hide",
    "text": "Gain 5 Armor."
  },
  {
    "id": "UNG_925",
    "_info": "(6) 5/5 [WARRIOR]: Ornery Direhorn |BEAST",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> <b>Adapt</b>."
  },
  {
    "id": "UNG_926",
    "_info": "(2) 2/6 [WARRIOR]: Cornered Sentry",
    "text": "<b>Taunt</b>. <b>Battlecry:</b> Summon three 1/1 Raptors for your opponent."
  },
  {
    "id": "UNG_927",
    "_info": "(5) SPELL [WARRIOR]: Sudden Genesis",
    "text": "Summon copies of your damaged minions."
  },
  {
    "id": "UNG_928",
    "_info": "(3) 1/5 [NEUTRAL]: Tar Creeper |ELEMENTAL",
    "text": "<b>Taunt</b>\nHas +2 Attack during your opponent's turn."
  },
  {
    "id": "UNG_929",
    "_info": "(1) 1/1 WEAPON [WARRIOR]: Molten Blade",
    "text": "Each turn this is in your hand, transform it into a new weapon."
  },
  {
    "id": "UNG_929e",
    "_info": "ENCHANTMENT [*WARRIOR]: Magmic",
    "text": "Transforming into random weapons."
  },
  {
    "id": "UNG_933",
    "_info": "(9) 9/7 [WARRIOR]: King Mosh |BEAST",
    "text": "<b>Battlecry:</b> Destroy all damaged minions."
  },
  {
    "id": "UNG_934",
    "_info": "(1) SPELL [WARRIOR]: Fire Plume's Heart",
    "text": "[x]<b>Quest:</b> Play\n7 <b>Taunt</b> minions.\n<b>Reward:</b> Sulfuras."
  },
  {
    "id": "UNG_934t1",
    "_info": "(3) 4/2 WEAPON [*WARRIOR]: Sulfuras",
    "text": "<b>Battlecry:</b> Your Hero Power becomes 'Deal 8 damage to a random enemy.'"
  },
  {
    "id": "UNG_934t2",
    "_info": "(2) HERO_POWER [*NEUTRAL]: DIE, INSECT!",
    "text": "<b>Hero Power</b>\nDeal 8 damage to a random enemy."
  },
  {
    "id": "UNG_937",
    "_info": "(3) 3/2 [NEUTRAL]: Primalfin Lookout |MURLOC",
    "text": "<b>Battlecry:</b> If you control another Murloc, <b>Discover</b> a Murloc."
  },
  {
    "id": "UNG_938",
    "_info": "(3) 2/4 [SHAMAN]: Hot Spring Guardian |ELEMENTAL",
    "text": "<b>Taunt</b>\n<b>Battlecry:</b> Restore 3 Health."
  },
  {
    "id": "UNG_940",
    "_info": "(1) SPELL [PRIEST]: Awaken the Makers",
    "text": "<b>Quest:</b> Summon\n7 <b>Deathrattle</b> minions.<b>\nReward:</b> Amara, Warden of Hope."
  },
  {
    "id": "UNG_940t8",
    "_info": "(5) 8/8 [*PRIEST]: Amara, Warden of Hope",
    "text": "[x]<b>Taunt</b>\n<b>Battlecry:</b> Set your\nhero's Health to 40."
  },
  {
    "id": "UNG_941",
    "_info": "(2) SPELL [MAGE]: Primordial Glyph",
    "text": "<b>Discover</b> a spell. Reduce its Cost by (2)."
  },
  {
    "id": "UNG_941e",
    "_info": "ENCHANTMENT [*MAGE]: Primal Magic",
    "text": "Cost reduced."
  },
  {
    "id": "UNG_942",
    "_info": "(1) SPELL [SHAMAN]: Unite the Murlocs",
    "text": "[x]<b>Quest:</b> Summon\n10 Murlocs.\n<b>Reward:</b> Megafin."
  },
  {
    "id": "UNG_942t",
    "_info": "(5) 8/8 [*SHAMAN]: Megafin |MURLOC",
    "text": "<b>Battlecry:</b> Fill your hand with random Murlocs."
  },
  {
    "id": "UNG_946",
    "_info": "(3) 3/3 [NEUTRAL]: Gluttonous Ooze",
    "text": "<b>Battlecry:</b> Destroy your opponent's weapon and gain Armor equal to its Attack."
  },
  {
    "id": "UNG_948",
    "_info": "(4) SPELL [MAGE]: Molten Reflection",
    "text": "Choose a friendly minion. Summon a copy of it."
  },
  {
    "id": "UNG_950",
    "_info": "(7) 4/3 WEAPON [PALADIN]: Vinecleaver",
    "text": "[x]After your hero attacks,\nsummon two 1/1 Silver\nHand Recruits."
  },
  {
    "id": "UNG_952",
    "_info": "(6) SPELL [PALADIN]: Spikeridged Steed",
    "text": "Give a minion +2/+6 and <b>Taunt</b>. When it dies, summon a Stegodon."
  },
  {
    "id": "UNG_952e",
    "_info": "ENCHANTMENT [*PALADIN]: On a Stegodon",
    "text": "+2/+6 and <b>Taunt</b>.\n<b>Deathrattle:</b> Summon a Stegodon."
  },
  {
    "id": "UNG_953",
    "_info": "(2) 1/2 [PALADIN]: Primalfin Champion |MURLOC",
    "text": "<b>Deathrattle:</b> Return any spells you cast on this minion to your hand."
  },
  {
    "id": "UNG_953e",
    "_info": "ENCHANTMENT [*PALADIN]: Inspired",
    "text": "Storing spell."
  },
  {
    "id": "UNG_954",
    "_info": "(1) SPELL [PALADIN]: The Last Kaleidosaur",
    "text": "<b>Quest:</b> Cast 6 spells\non your minions.\n<b>Reward:</b> Galvadon."
  },
  {
    "id": "UNG_954t1",
    "_info": "(5) 5/5 [*PALADIN]: Galvadon |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b> 5 times."
  },
  {
    "id": "UNG_955",
    "_info": "(6) SPELL [MAGE]: Meteor",
    "text": "Deal $15 damage to a minion and $3 damage to adjacent ones.",
    target: 'minion',
    play ({target, $}) {
      target.dealDamageSpell(15);
      $('minion').adjacent(target).dealDamageSpell(3);
    }
  },
  {
    "id": "UNG_956",
    "_info": "(3) SPELL [SHAMAN]: Spirit Echo",
    "text": "Give your minions \"<b>Deathrattle:</b> Return  this to your hand.\""
  },
  {
    "id": "UNG_956e",
    "_info": "ENCHANTMENT [*SHAMAN]: Echoed Spirit",
    "text": "<b>Deathrattle:</b> Return to your hand."
  },
  {
    "id": "UNG_957",
    "_info": "(5) 3/6 [WARRIOR]: Direhorn Hatchling |BEAST",
    "text": "<b>Taunt</b>\n<b>Deathrattle:</b> Shuffle a 6/9 Direhorn with <b>Taunt</b> into your deck."
  },
  {
    "id": "UNG_957t1",
    "_info": "(5) 6/9 [*WARRIOR]: Direhorn Matriarch |BEAST",
    "text": "<b>Taunt</b>"
  },
  {
    "id": "UNG_960",
    "_info": "(1) SPELL [PALADIN]: Lost in the Jungle",
    "text": "Summon two 1/1 Silver Hand Recruits.",
    play ({summon}) {
      summon('CS2_101t');
      summon('CS2_101t');
    }
  },
  {
    "id": "UNG_961",
    "_info": "(1) SPELL [PALADIN]: Adaptation",
    "text": "<b>Adapt</b> a friendly minion."
  },
  {
    "id": "UNG_962",
    "_info": "(4) 3/4 [PALADIN]: Lightfused Stegodon |BEAST",
    "text": "<b>Battlecry:</b> <b>Adapt</b> your Silver Hand Recruits."
  },
  {
    "id": "UNG_963",
    "_info": "(5) 3/5 [PRIEST]: Lyra the Sunshard |ELEMENTAL",
    "text": "Whenever you cast a spell, add a random Priest spell to your hand."
  },
  {
    "id": "tt_004",
    "_info": "(3) 2/3 [NEUTRAL]: Flesheating Ghoul",
    "text": "Whenever a minion dies, gain +1 Attack."
  },
  {
    "id": "tt_004o",
    "_info": "ENCHANTMENT [*NEUTRAL]: Cannibalize",
    "text": "Increased Attack."
  },
  {
    "id": "tt_010",
    "_info": "(3) SPELL [MAGE]: Spellbender",
    "text": "<b>Secret:</b> When an enemy casts a spell on a minion, summon a 1/3 as the new target."
  },
  {
    "id": "tt_010a",
    "_info": "(1) 1/3 [*MAGE]: Spellbender"
  }
];

module.exports = actions;
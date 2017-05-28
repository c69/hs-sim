'use strict';
/* eslint-disable */

/*
http://hearthstone.gamepedia.com/Mana_cost
*/
const Minion = require('./minion.js');

const Tribe = {
    BEAST: 'Beast',
    DEMON: 'Demon',
    DRAGON: 'Dragon',
    ELEMENTAL: 'Elemental',
    MECH: 'Mech',
    MURLOC: 'Murloc',
    PIRATE: 'Pirate',
    TOTEM: 'Totem'
};

const Rarity = {
    BASIC: 'basic',
    COMMON: 'common',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

const Trait = {
    DIVINE_SHIELD: 'divine shield',
    TAUNT: 'taunt',
    WINDFURY: 'windfury'
};

/*
Adapt
Auto-Attack
Auto-cast
Battlecry
Cast spell
Charge
Choose One
Combo
Copy
Deal damage
Deathrattle
Destroy
Discard
Discover
Divine Shield
Draw cards
Elusive
Enrage
Equip
Forgetful
Freeze
Gain Armor
Generate
Immune
Inspire
Joust
Mega-Windfury
Modify cost
Overload
Permanent
Poisonous
Put into battlefield
Put into hand
Quest
Refresh Mana
Remove from deck
Replace
Restore Health
Return to hand
Secret
Shuffle into deck
Silence
Spell Damage
Spend mana
Stealth
Summon
Taunt
Take control
Transform
Unlimited attacks
Windfury 
*/

// milestone 3 wishlist:

// -- Spells
// 0) Coin [] Give yourself 1 mana this turn only
// 4) Blessing of Kings [minion] Give minion +4/+4
// 2) Healing for 8 [character] Heal 8hp

// -- Minions
// 2) Crockolisk 2/3 |Beast
new Minion(2, 'Crocolisk', 2, 3, Tribe.BEAST, Rarity.COMMON);
// 2) Raptor 3/2 |Beast
new Minion(2, 'Raptor', 3, 2, Tribe.BEAST, Rarity.COMMON);
// 4) Chillwind Yeti 5/4
new Minion(4, 'Chillwind Yeti', 5, 4, Rarity.COMMON);
// 3) Bear 3/3 Taunt |Beast
new Minion(3, 'Bear', 3, 3, Tribe.BEAST, Rarity.COMMON, [Trait.TAUNT]);

// 3) Stonebeak Owl 2/1 B: Silence a minion |Beast
// new Minion(3, 'Stonebeak Owl', 2, 1, Tribe.BEAST, Rarity.COMMON, [{
//     battlecry: 'silence @ minion || target[minion]; effect:silence; || buff[minion]:silence' 
// }]);

// 1) Flame Imp 3/2 B: 3dmg to own hero |Demon
new Minion(1, 'Flame Imp', 3, 2, Tribe.Demon, Rarity.COMMON, [{
    battlecry: target('own_hero').cast(Spell.dealDamage, 3)
}]);
// 1) Archer 1/1 B: 1dmg to enemy character
new Minion(1, 'Archer', 1, 1, Rarity.COMMON, [{
    battlecry: target('character').cast(Spell.dealDamage, 1)
}]);
// 2) Novice Engineer 2/1 B: Draw a card
new Minion(2, 'Novice Engineer', 2, 1, Rarity.COMMON, [{
    battlecry: Ability.drawCard(1) //owner drawCard(1)
}]);
// 2) Murloc Raider B: Summon 1/1 murloc |Murloc
new Minion(2, 'Murloc Raider', 2, 1, Tribe.MURLOC, Rarity.COMMON, [{
    //summon for Owner
    battlecry: Ability.summonMinion(new Minion(1, 'Just a Murloc', 1, 1, Tribe.MURLOC, Rarity.COMMON))
}]);
// 1) Argent Lancer 1/1 Divine Shield
new Minion(1, 'Argent Squire', 1, 1, Rarity.COMMON, [Trait.DIVINE_SHIELD]);
// 1) Leper Gnome 1/1 D: 2dmg to enemy hero
new Minion(1, 'Leper Gnome', 1, 1, Rarity.COMMON, [{
    deathrattle: Spell.to('enemy hero').dealDamage(2)
}]);
// 5) Abomination 4/4 D: 2dmg to ALL characters
new Minion(5, 'Abomination', 4, 4, Rarity.COMMON, [{
    deathrattle: Spell.to('*').dealDamage(2)
}]);
// 2) Direwolf Alpha 2/2 Adjacent minions have +1 damage |Beast
new Minion(2, 'Dire Wolf Alpha', 2, 2, Rarity.COMMON, [{
    aura: Aura.to('ajacent siblings').buff([might(1,1)])
}]);
// 4) Defender of Argus 2/4 B: Give adjacent minions have +2/+2 and Taunt
new Minion(4, 'Defender of Argus', 2, 4, Rarity.RARE, [{
    battlecry: Spell.to('ajacent siblings').buff([might(2,2), Trait.TAUNT])
}]);
// 3) Stonebeak Owl 2/1 B: Silence a minion |Beast
new Minion(3, 'Stonebeak Owl', 2, 1, Tribe.BEAST, Rarity.COMMON, [{
    battlecry: Spell.to('minion').buff([Trait.SILENCE]) 
}]);
// 3) Sun Cleric 2/2 Give friendly minion +1/+1 
new Minion(3, 'Sun Cleric', 2, 2, Rarity.COMMON, [{
    battlecry: Spell.to('own minion').buff([might(1,1)]) 
}]);
// 3) Acolyte of Pain 1/3 Whenever this minion takes damage, owner draws a card
new Minion(3, 'Acolyte of Pain', 1, 3, Rarity.COMMON, [{
    trigger: target('self').condition('takes damage').action(Ability.drawCard(1)) 
}]);
// 2) Knife Juggler 2/2 Whenever you summon minion, deal 1 dmg to random enemy
new Minion(2, 'Knife Juggler', 2, 2, Rarity.RARE, [{
    trigger: target('own minion').condition('is summoned').action(Spell.to('random enemy').dealDamage(1)),
    z: {
        target: 'own minion',
        event: 'minionSummoned', // characterTookDamage, minionWasHealed
        condition: function () {return true},
        action: Spell.to('random enemy').dealDamage(1)
    },
    react: when('own minion', 'minionSummoned', Spell.to('random enemy').dealDamage(1)),
    react: when(character('own minion').wasSummoned, Spell.to('random enemy').dealDamage(1))
}]);

// 1) Mana Wyrm 1/3 Whenever owner casts a spell, gain +1 attack
new Minion(1, 'Mana Wyrm', 1, 3, Rarity.BASIC, [{
    trigger: target('own minion').condition('is summoned').action(Spell.to('random enemy').dealDamage(1)),
    z: {
        target: 'own player',
        event: 'spellCast', // characterTookDamage, minionWasHealed
        condition: function (evt) {return evt.player === _this.owner},
        action: Spell.to('self').buff(might(1,0))
    },
    react: when(php.spellWasCastByOwnPlayer, Buff('self', 1, 0)),
    react: when('own player', 'spellCast', Spell.to('self').give(1,0)),
    react: when(player('own').castSpell, Spell.to('self').buff([might(1,0)]))
}]);
// 3) Raging Worgen 3/2 Enrage: Windfury and +2 attack
new Minion(3, 'Raging Worgen', 3, 2, Rarity.COMMON, [{
    enrage: Aura.to('self').buff([might(2,0), Trait.WINDFURY]),
    enrage1:$('.').buff([might(2,0), Trait.WINDFURY])  
}]);
Aura.to.TribeNot(Tribe.PIRATE).Enemy.Minion // brr..
Aura.to('random')
Aura.to('random minion')
Aura.to('random own minion')
Aura.to('random enemy minion')
Aura.to('random hero'), Aura.to('? hero') 
Aura.to('self'), Aura.to('!')
Aura.to('all'), Aura.to('*')
Aura.to('all minions'), Aura.to('minion'), Aura.to('..')
Aura.to('both heroes'), Aura.to('hero') // Aura.to('ALL heroes')
Aura.to('own')
Aura.to('own hero')
Aura.to('own minions')
Aura.to('enemy')
Aura.to('enemy hero')
Aura.to('enemy minions') 
Aura.to('adjacent') // minions, owned by same player
Spell.to('adjacent'); // how to implement Meteor ?

Aura.to('ALL pirates'), Aura.to('tribe:pirate')
Aura.to(v => v.tribe === Tribe.PIRATE)
Aura.to('ALL non-murlocs')
Aura.to(v => v.tribe !== Tribe.MURLOC)
Aura.to('all enemy non-murlocs')
Aura.to(v => v.tribe !== Tribe.MURLOC && v.owner !== minion.owner) // meh..


// -- Hero abilities
// 0) [] Deal 2dmg to own hero; Draw a card
new HeroPower(0, 'Life Tap', function () {
  Spell.to('own hero').dealDamage(2);
  Ability.drawCard(1);
});
// 2) [character] Deal 1dmg to target
new HeroPower(2, 'Fireblast', function (target) {
  Spell.to('select character')(target).dealDamage(1); // like if we are doing verification that target fits constraints
});
// 2) [] Deal 2dmg to enemy hero
new HeroPower(2, 'Arrow to the Face', function () {
  Spell.to('enemy hero').dealDamage(2);
});
// 2) [place] Summon 1/1 Silverhand Recruit
new HeroPower(2, 'Silverhand Recruit', function () {
  Ability.at('own rightmost').summon(new Minion(1, 'Siverhand Recruit', 1, 1, Rarity.BASIC));
});
// 2) [character] Heal target for 2hp
new HeroPower(2, 'Heal', function (target) {
  Spell.to('select')(target).heal(2);
  Spell.to(target).heal(2);
});
// 2) [] Summon random basic totem
new HeroPower(2, 'Summon Totem', function () {
  let totems = [
      // funny thing: i already forgot the order of Rarity vs Tribe
      new Minion(1, 'Snake Totem', 0, 2, Rarity.BASIC, Tribe.TOTEM, [Trait.TAUNT]),
      new Minion(1, 'Generic Useless Totem', 1, 1, Rarity.BASIC),
      new Minion(1, 'Spell Damage Totem', 0, 2, Rarity.BASIC, [spellDamage(2)]),
      new Minion(1, 'Healing Totem', 0, 2, Rarity.BASIC, [{
          trigger: Spell.on('end own turn').to('own').heal(1)
      }])
  ];
  let dice = Math.floor(Math.random()*3 - 0.1);  
  Ability.at('own rightmost').summon(totems[dice]);
});

module.exports = {
};
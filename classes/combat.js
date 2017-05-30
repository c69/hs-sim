'use strict';

const {
  TAGS,
  //EVENTS
} = require('../data/constants.js');

 /** 
   * Execute combat action
   * @param {MinionCard|HeroCard} attacker
   * @param {MinionCard|HeroCard} target
   * @param {?Game} game
   */
  function combat (attacker, target, game) {
    //console.log(`Attacking ${attacker} -> ${target}`);  
    if (!target) throw 'no target'; //return;
    if (target.health < 1) throw `dead target ${target.name} #${target.card_id} @${target.zone}`; //return;
    if (attacker.health < 1) throw `dead attacker ${attacker.name} #${attacker.card_id} @${attacker.zone}`; //return;
    if (attacker.attack < 1) throw `harmless attacker ${attacker.name} #${attacker.card_id}`; //return;
    if (attacker.owner !== game.activePlayer) throw 'wrong turn'; //return; // is there a way to attack on enemy turn ? - UNGORO:WarriorLegendDino(8)
    if (target.owner === attacker.owner) throw 'own unit'; //return; // will fail for Hunter:Misdirection secret, and Ogres
    if (attacker.tags.includes(TAGS.windfury)) {
      if (attacker.attackedThisTurn > 1) throw 'already attacked too many times this turn'; //return
    } else {
      if (attacker.attackedThisTurn > 0) throw 'already attacked this turn'; //return
    }
    console.log(`⚔️ ${attacker.name}(${attacker.attack}/${attacker.health}) attacks ${target.name}(${target.attack}/${target.health})`);
    //console.log(`🛡️ ${attacker.name} attacks ${target.name}(${target.attack}/${target.health})`);
    
    // this looks like generic Card._damageApply(n)
    [
      [attacker, target.attack],
      [target, attacker.attack]
    ].forEach(([character, dmg]) => character._damageApply(dmg));
    
    attacker.attackedThisTurn += 1;  
        
    //console.log(`⚔️ end----`);
  }

  module.exports = combat;
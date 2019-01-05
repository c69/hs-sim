import {
    createCard,
    // CardDefinitionsIndex,
} from './cardUniverse';

import {
    // CARD_TYPES,
    TAGS_LIST,
    KnownMechanics,
    // EVENTS,
    // ZONES
} from '../data/constants';

import {
    applyBuff
} from './buff';

/* ----

move(card, from, to)

BASIC_PLAYER_ACTIONS
.attack
    _with_minion
    _with_hero
.play
    _minion
    _spell
    _weapon
    _hero
.use_power

BASIC_MECHANICS
hit(n)
heal(n)



2	Keywords
2.1	Adapt -> target.adapt() >> from (3 of 9) choose (1) apply .buff
2.2	Battlecry -> .on(play).battlecry()
2.3	Charge -> target#charge
2.4	Choose One -> .on(play).chooseOne();
2.4.1 Choose Twice (2 of 3) -> https://hearthstone.gamepedia.com/Choose_Twice
2.5	Combo -> if(combo).on(play).combo()
2.6	Counter -> @@counter_spell .on(before_spell)
2.7	Deathrattle -> .on(die).deathrattle()
2.8	Discover -> discover(query) AND move to @aside ?
2.9	Divine Shield -> target#divine_shield
2.10	Enrage -> if(damaged)#enraged
2.11	Freeze -> target#frozen
2.12	Immune -> target#immune
2.13	Inspire -> on(power).inspire()
2.14	Lifesteal -> on(caused_damage).lifesteal(n)
2.15	Mega-Windfury -> target#mega_winfury
2.16	Overload -> player#overload(n)
2.17	Poisonous -> target#poisonous
2.18	Quest -> on(play).quest.start().progress().complete()
2.19	Recruit -> (query)from(@deck)move(@play)
2.20	Secret -> on(play).secret.add(1).toggle(own_turn).trigger()
2.21	Silence -> target#silence
2.22	Stealth -> target#stealth
2.23	Spell Damage -> aura(player, spell_damage_bonus)
2.24	Taunt -> target#taunt
2.25	Windfury -> target#windfury
?? -    Echo
?? -    Magnetic
?? -    Overkill

3	Other abilities
3.1	Card draw -> effect - !draw(player, n)
3.2	Cast spell -> !create(spell_id, player).cast()
3.3	Copy -> copy(target) => create(target.id, player)
3.4	Deal -> damage target.dealDamage(n)
3.5	Destroy -> target.destroy()
3.6	Disable -> Hero Power disableHeroPower(player) / enable?
3.7	Discard -> target.discard()
3.8	Enchant -> target.enchant ~ buff // permanent, temporary, aura
3.9	Elusive -> target#elusive (cannot be targeted by spells or hero powers)
3.10	Equip -> create(weapon_id, player) move @play
3.11	Forgetful -> on(before_attack, self) random(0.5) pickNewTarget()
3.12	Gain Armor -> armor(player)
3.13	Generate -> create(card_id, player)move @hand "generates new card and places in into players HAND"
3.14	Increment attribute -> target.stats(s: +n)
3.15	Joust -> "Reveals a random minion from each player's deck. If the player who initiated the Joust produces a minion with a higher mana cost, they win the Joust, activating a secondary effect. Both minions are then shuffled back into their respective decks."
3.16	Mind control effect -> target.giveTo(player) / posess(target, player)
3.17	Modify cost -> stats
3.18	Multiply attribute -> stats
3.19	No Durability loss -> target#indestructible
3.20	Permanent target#permanent (minions @play without health/attack/cost)
3.21	Put into battlefield -> move(target)to @play
3.22	Put into hand -> draw(query) from deck to hand
3.23	Refresh Mana -> player.(mana = maxMana)
3.24	Remove from deck -> target@deck.mill()
3.25	Replace -> "Replace one card with another, without destroying or discarding the original card."
3.26	Restore Health -> target.heal()
3.27	Return -> target.returnToHand()
3.28	Set attribute -> stats
3.29	Shuffle into deck -> shuffle(target, player)
3.30	Spend mana -> "Spends mana in addition to the normal mana cost to produce an extra effect. Currently, all cards with this ability spend all available mana, and the effect is proportional to the amount of mana spent."
3.31	Summon -> summon(create(minion), player)
3.32	Transform -> "Changes a minion into something else irreversibly, entirely replacing the previous card."
3.33	Transform in hand -> "At the start of the controlling player's turn, changes a card into something else while it is in the player's hand."
3.34	Unlimited attacks -> #unlimited_attacks
3.x     Upgradeable -- see: Kobold gemstones
*/

/*4	Types of ability
--- ---
4.1	Area of effect -- see list: https://hearthstone.gamepedia.com/Area_of_effect
4.2	In-hand effect -> auraHand() https://hearthstone.gamepedia.com/In-hand_effect
4.2.1. In-deck effect (only Patches and Malchezaar)
4.3	On-discard effect -> on(self, discard)
4.4	On-draw effect -> on(self, draw)
4.5	Ongoing effect -> aura()
4.6	Positional effect -> adjacent(), also crushing walls and PvE spells https://hearthstone.gamepedia.com/Positional_effect
4.7	Random effect -- https://hearthstone.gamepedia.com/Random_effect
4.8	Removal


4.9	Triggered effect -> on() https://hearthstone.gamepedia.com/Triggered_effect

2	Cards [with triggered abilities]
2.1	Using Hero Powers - on(inspire = hero_power, own)
2.2	Card-playing
2.2.1	Any card type - on(card_played)
2.2.2	Spell-casting - on(spell_cast)
2.2.2.1	Whenever
2.2.2.2	After
2.2.3	Playing a minion from the hand - on(card_played_from_hand)
2.2.3.1	That minion
2.2.4	Another minion
2.2.5	Secret-playing
2.3	Minion summoning
2.3.1	Whenever you summon - on(minion_summon_intent)
2.3.2	After you summon - on(minion_summoned)
2.4	Attacking
2.4.1	Hero attacks - on(character_attacked)
2.4.2	Minion attacks - on(character_attacked)
2.4.3	Any attack - on(character_attacked)
2.5	Character damage
2.5.1	Taking minion damage - on(character_damaged)
2.5.1.1	This minion
2.5.1.2	Friendly minions
2.5.1.3	Another minion
2.5.1.4	Any minion
2.5.2	Taking hero damage
2.5.3	Dealing damage - on(character_damage, attacker=self)
2.6	Healing - on(character_healed)
2.7	Minion death - on(minion_died)
2.7.1	That minion
2.7.2	Another minion
2.7.3	Attacking and killing - on(lethal_attack)
2.8	End of turn
2.8.1	End of your turn - on(turn_end, player=owner)
2.8.2	End of your opponent's turn - on(turn_end, player!=own)
2.8.3	End of each turn - on(turn_end, player=owner)
2.8.4	End of the turn - once(turn_end)
2.8.5	Related cards
2.9	Start of turn
2.9.1	Start of your turn - on(turn_start, player=owner)
2.9.2	Start of your opponent's turn - on(turn_start, player!=owner)
2.9.3	Start of each turn - on(turn_start)
2.10	Drawing a card - on(card_drawn)
2.10.1	Drawing another card - on(card_drawn) ???
2.11	Discarding a card - on(card_discarded)
2.11.1	Discarding another card - ???
2.12	Revealing a Secret - on(secret_revealed)
2.13	Equipping a weapon - on(weapon_equipped)
2.14	Gaining Armor - on(armor_gained)
2.15	Overloading Mana Crystals - on(mana_overloaded)
2.16	Miscellaneous
3	Patch changes
4	References

5	Boss and Tavern Brawl abilities
5.1	Auto-cast
5.2	Auto-Attack
   ----
*/

/**
 * factory of bound helpers for use in abilty definitions
 */
export default function mechanics (card, game, $, board): KnownMechanics {
    return {
        summon (id) {
            console.log(`TRIGGER.summon: Summoning ${id}`);
            if ($('own minion').length >= 7) return;

            let MY_CREATION = createCard(id, card.owner, game.eventBus);
            board.add(MY_CREATION);
            board._summon(MY_CREATION);
            //console.log('its real!!!', MY_CREATION);
        },
        draw (n) {
            console.log(`TRIGGER: try to draw ${n}cards`);
            card.owner.draw(n);
        },
        buff (t, id_or_Tag) {
            if (!t) throw new RangeError('No target provided for buff');
            if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

            let targetArray = Array.isArray(t) ? t : [t];
            targetArray.forEach(v => {
                if (TAGS_LIST.includes(id_or_Tag)) {
                    v.buffs.push(id_or_Tag); // check for duplicates
                } else {
                    let enchantmentCard = createCard(id_or_Tag, card.owner, game.eventBus);

                    applyBuff({
                        card: enchantmentCard,
                        target: v,
                        $,
                        board,
                        game
                    });
                }
            });
            return t;
        }
    }
}

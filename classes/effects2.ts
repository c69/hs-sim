import {
    // CARD_TYPES,
    TAGS,
    TAGS_LIST,
    KnownEnvConstants,
    KnownMechanics,

    Cards,
    Types,
    EVENTS,
    // ZONES
} from '../data/constants';


function emit (event: Events, data: {
    target: Cards.Card, // draw=Card, turn=Player, manaOverload=Player
    by: Cards.Card, // attacked, damaged
    // isLethal ?
    // amount (of damage) ?
}) {

}

type Events = 'a' | 'b' | 'c' | 'CHARACTER_DAMAGED';
type Stats = 'attack' | 'b' | 'c';
type Xprops = 'tags' | 'buff' | 'xxx';

type Stuff = KnownEnvConstants & KnownMechanics;
type CardDef = {
    id: string;
    _info?: string;
    text?: string;

    name?: string;

    tags?: string[];

    target?: string;
    play? (options: {target: any} & Stuff): void | any; // play

    spell? (): void; // play
    battlecry? (): void; // play
    deathrattle? (): void; // death
    on?: {
        [K in Events]?: {
            if?: string | ((target: Cards.Card) => boolean);
            zone?: Types.ZonesAllCAPS;
            once?: true;
            action: () => void;
        }
    },
    aura?: {
        target: string;
        buff: string; // no more FRIKING ANONYMOUS BUFFs !

        zone?: Types.ZonesAllCAPS
    }[],
    buff?: string;
    xxx?: string;
    //_______________________
    _ideas_draft_?: {
        //[K in Stats]?: number | ((a: number, env?: object) => number);

        duration?: 'permanent' | 'turn' | 'event';
        till?: Event;
        zone?: Types.ZonesAllCAPS;
    }
}

type Ench = {
   // [K in Stats]?: number; // | ((a: number, env?: object) => number);
    //attack: number;
    [K2 in Xprops]?: any;
    //tags?: string[];
    // tagsDelete?: string[];
//        [K in Stats]?: number | ((a: number, env?: object) => number);
}

const sampleDefs: CardDef[] = [{
    id: 'XXX_45',
    name: 'Weird Minion',
    tags: [TAGS.taunt],
    on: {
        [EVENTS.character_damaged]: {
            if: 'self',
            action () {

            }
        }
    },
    aura: [{
        // zone: 'HAND',
        target: 'owm minion .race=demon',
        buff: 'GVG_067e'
    }, {
        target: 'own hero',
        buff: 'GVG_067e:Hero/HsSim' // [TAGS.immune]
    }]
}];

const def2: CardDef[] = [
    {
        id: `CS2_024`,
        _info: `(2) SPELL [MAGE]: Frostbolt`,
        text: `Deal $3 damage to a character and <b>Freeze</b> it.`,
        target: 'character',
        play: ({target}) => target.dealDamageSpell(3).buff(TAGS.frozen)
    },
    {
        id: `CS2_031`,
        _info: `(1) SPELL [MAGE]: Ice Lance`,
        text: `<b>Freeze</b> a character. If it was already <b>Frozen</b>, deal $4 damage instead.`,
        target: 'character',
        play: ({target}) => target.tags.has(TAGS.frozen) ? target.dealDamageSpell(4) : target.give(TAGS.frozen)
    },
    {
        id: `CS2_045`,
        _info: `(2) SPELL [SHAMAN]: Rockbiter Weapon`,
        text: `Give a friendly character +3 Attack this turn.`,
        target: 'own character',
        play: ({target}) => target.giveUntil('CS2_045e', EVENTS.turn_ended)
    },
    {
        id: `CS2_045e`,
        _info: `ENCHANTMENT [*SHAMAN]: Rockbiter Weapon`,
        text: `This character has +3 Attack this turn.`,
        // enchantments NEVER have their own .cost
        // they are always put in game by spells or abilities
        attack: 3
    },
    {
        id: `CS2_063`,
        _info: `(1) SPELL [WARLOCK]: Corruption`,
        text: `Choose an enemy minion. At the start of your turn, destroy it.`,
        play: ({target}) => target.give('CS2_063e')
    },
    {
        id: `CS2_063e`,
        _info: `ENCHANTMENT [*WARLOCK]: Corruption`,
        text: `At the start of the corrupting player's turn, destroy this minion.`,
        on: {
            event: EVENTS.turn_started,
            // if: ({target, owner}) => target === owner,
            if: ({event, owner}) => event.target === owner,
            action: ({host}) => host.destroy()
            // action: ({self}) => self.destroy()
        }
    },
    {
        id: `GVG_021`,
        _info: `(9) 9/7 [WARLOCK]: Mal'Ganis |DEMON`,
        text: `Your other Demons have +2/+2.\nYour hero is <b>Immune</b>.`
        aura: [{
            target: 'own character .race=DEMON',
            buff: 'GVG_021e'
        }, {
            target: 'own hero',
            tags: [TAGS.immune]
        }]
    },
    {
        id: `GVG_021e`,
        _info: `ENCHANTMENT [*WARLOCK]: Grasp of Mal'Ganis`,
        text: `Mal'Ganis is granting +2/+2.`,
        attack: 2,
        health: 2
    },
    {
        id: `EX1_565`,
        _info: `(2) 0/3 [SHAMAN]: Flametongue Totem |TOTEM`,
        text: `Adjacent minions have +2 Attack.`,
        aura: [{
          target: 'adjacent',
          buff: 'EX1_565o'
        }]
      },
      {
        id: `EX1_565o`,
        _info: `ENCHANTMENT [*SHAMAN]: Flametongue`,
        text: `+2 Attack from Flametongue Totem.`,
        attack: 2
      },
      {
        id: `EX1_506a`,
        _info: `(1) 1/1 [*NEUTRAL]: Murloc Scout |MURLOC`
      },
      {
        id: `EX1_507`,
        _info: `(3) 3/3 [NEUTRAL]: Murloc Warleader |MURLOC`,
        text: `Your other Murlocs have +2/+1.`,
        aura: [{
            target: 'other own .race=murloc',
            buff: 'EX1_507e'
        }]
      },
      {
        id: `EX1_507e`,
        _info: `ENCHANTMENT [*NEUTRAL]: Mrgglaargl!`,
        text: `+2/+1 from Murloc Warleader.`,
        attack: 2,
        health: 1
      },
      {
        id: `EX1_508`,
        _info: `(1) 1/1 [NEUTRAL]: Grimscale Oracle |MURLOC`,
        text: `Your other Murlocs have +1 Attack.`,
        aura: [{
            target: 'other own .race=murloc',
            buff: 'EX1_508o'
        }]
      },
      {
        id: `EX1_508o`,
        _info: `ENCHANTMENT [*NEUTRAL]: Mlarggragllabl!`,
        text: `This Murloc has +1 Attack.`,
        attack: 1
      },
      {
        id: `EX1_509`,
        _info: `(1) 1/2 [NEUTRAL]: Murloc Tidecaller |MURLOC`,
        text: `Whenever you summon a Murloc, gain +1 Attack.`,
        on: {
            event: EVENTS.minion_summoned,
            matches: 'own minion .race=murloc',
            if: ({event, self}) => (event.target.race === 'MURLOC' && event.target.owner === self.owner),
            action: ({self}) => self.give('EX1_509e')
        }
      },
      {
        id: `EX1_509e`,
        _info: `ENCHANTMENT [*NEUTRAL]: Blarghghl`,
        text: `Increased Attack.`,
        attack: 1
      },
      {
        id: `EX1_619`,
        _info: `(2) SPELL [PALADIN]: Equality`,
        text: `Change the Health of ALL minions to 1.`,
        play: ({$}) => $('all minion').give('EX1_619e')
      },
      {
        id: `EX1_619e`,
        _info: `ENCHANTMENT [*PALADIN]: Equality`,
        text: `Health changed to 1.`,
        health: 1
      },
      {
        id: `EX1_059`,
        _info: `(2) 2/2 [NEUTRAL]: Crazed Alchemist`,
        text: `<b>Battlecry:</b> Swap the Attack and Health of a minion.`,
        target: 'minion',
        play: ({target}) => target.give('EX1_059e')
      },
      {
        id: `EX1_059e`,
        _info: `ENCHANTMENT [*NEUTRAL]: Experiments!`,
        text: `Attack and Health have been swapped by Crazed Alchemist.`,
        // priority ???
        attack: ({host}) => host.health,
        health: ({host}) => host.attack
      },
      {
        id: `EX1_062`,
        _info: `(4) 2/4 [NEUTRAL]: Old Murk-Eye |MURLOC`,
        text: `<b>Charge</b>. Has +1 Attack for each other Murloc on the battlefield.`,
        tags: [TAGS.charge],
        refresh: {
            attack: (n, {$}) => n + $('other minion .race=murloc')
        },
        refresh_: ({$, self}) => (self.attack += $('minion .race=murloc').length)
        // small time buccaneer has his enchantment :( but not murk eye
      },
      {
        "id": "CFM_325",
        "_info": "(1) 1/1 [NEUTRAL]: Small-Time Buccaneer |PIRATE",
        "text": "Has +2 Attack while you have a weapon equipped.",
        refresh: {
            // lol :(
            buffs: ({$}) => $('own weapon').length ? 'CFM_325e' : []
        }
      },
      {
        "id": "CFM_325e",
        "_info": "ENCHANTMENT [*NEUTRAL]: Equipped",
        "text": "+2 Attack.",
        attack: 2
      },
      {
        "id": "CS2_146",
        "_info": "(1) 2/1 [NEUTRAL]: Southsea Deckhand |PIRATE",
        "text": "Has <b>Charge</b> while you have a weapon equipped.",
        refresh: {
            tags: ({$}) => $('own weapon').length ? [TAGS.charge] : []
        }
      },
      {
        id: `EX1_620`,
        _info: `(25) 8/8 [NEUTRAL]: Molten Giant`,
        text: `Costs (1) less for each damage your hero has taken.`,
        refresh: {
            zone: ZONES.hand,
            cost: (n, {$}) => {
                let hero = $('own hero')[0];
                return n - (hero.healthFull - hero.health);
            }
        }
        refresh_: ({self, $}) => {
            // self.cost << imperative refresh is not composable ! :(

            let h = $('own hero')[0].health;
            let c = v - (30 - h);
            return c > 0 ? c : 0;
        },
        _legacy_aura: {
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
        id: `EX1_621`,
        _info: `(0) SPELL [PRIEST]: Circle of Healing`,
        text: `Restore #4 Health to ALL minions.`,
        play: ({$}) => $('all minion').heal(4)
      },
      {
        id: `EX1_622`,
        _info: `(3) SPELL [PRIEST]: Shadow Word: Death`,
        text: `Destroy a minion with 5 or more Attack.`,
        target: 'minion .attack>=5',
        play: ({target}) => target.destroy()
      },
      {
        id: `EX1_623`,
        _info: `(6) 6/6 [PRIEST]: Temple Enforcer`,
        text: `<b>Battlecry:</b> Give a friendly minion +3 Health.`,
        target: 'own minion',
        play: ({target}) => target.give('EX_623e'),
        // play: ({target, buff}) => buff(target, 'EX_623e')
      },
      {
        id: `EX1_623e`,
        _info: `ENCHANTMENT [*PRIEST]: Infusion`,
        text: `+3 Health.`,
        health: 3
      }
];
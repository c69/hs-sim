/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/27/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CardBack, Card } from './CardStyled';
import HandCard from './HandCard';
import PlayCard from './PlayCard';
import HeroCard from './HeroCard';

export default class BaseCard extends Component {
  static propTypes = {
    hand: PropTypes.bool,
    hero: PropTypes.bool,
    play: PropTypes.bool,
    deck: PropTypes.bool,
    targets: PropTypes.arrayOf(PropTypes.shape()),
    back: PropTypes.bool,
    entity: PropTypes.shape({
      card_id: PropTypes.number.isRequired,
      action: PropTypes.object,
    }),
    selectCard: PropTypes.func.isRequired,
    selectTarget: PropTypes.func,
  };

  static defaultProps = {
    hand: false,
    hero: false,
    play: false,
    deck: false,
    targets: [],
    back: false,
    entity: {},
    selectTarget: () => null,
  };

  constructor(props) {
    super(props);
    this.selectCard = this.selectCard.bind(this);
    this.selectTarget = this.selectTarget.bind(this);
  }

  selectCard() {
    this.props.selectCard(this.props.entity.action);
  }
  selectTarget() {
    this.props.selectTarget(this.props.entity.card_id);
  }

  render() {
    const {
      back,
      hand,
      hero,
      play,
      deck,
      targets,
      entity,
      entity: {
        action,
      },
    } = this.props;

    if (back || deck) return <CardBack deck={deck} />;

    // check if card is available for selection
    // selectable vs available vs canBeSelected
    const isPlayable = !!action;

    // Check if card is a target
    const isTarget = targets && targets[entity.card_id];

    return (
      <Card
        onClick={() => {
          if (isTarget) {
            this.selectTarget();
            return;
          }
          if (isPlayable) {
            this.selectCard();
          }
        }
        }
        available={isPlayable}
        target={isTarget}
        entity={entity}
      >
        {deck && <HandCard deck entity={entity} />}
        {hand && <HandCard hand entity={entity} />}
        {play && <PlayCard entity={entity} />}
        {hero && <HeroCard entity={entity} />}
      </Card>
    );
  }
}

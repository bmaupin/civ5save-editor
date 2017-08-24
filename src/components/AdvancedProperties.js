import Civ5Save from 'civ5save';
import PropertyList from './PropertyList';
import React from 'react';

export default function AdvancedProperties(props) {
  let advancedProperties = {
    'policySaving': 'Allow policy saving',
    'promotionSaving': 'Allow promotion saving',
    'completeKills': 'Complete kills',
    'newRandomSeed': 'New random seed',
    'noBarbarians': 'No barbarians',
    'noCityRazing': 'No city razing',
    'oneCityChallenge': 'One-city challenge',
    'ragingBarbarians': 'Raging barbarians',
    'randomPersonalities': 'Random personalities',
  }

  if (props.savegame.gameMode === Civ5Save.GAME_MODES.MULTI) {
    delete advancedProperties.newRandomSeed;
  }

  return (
    <PropertyList
      classes={props.classes}
      label="Advanced options"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={advancedProperties}
    />
  );
}

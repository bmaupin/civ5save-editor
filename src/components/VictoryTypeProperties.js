import PropertyList from './PropertyList';
import React from 'react';

export default function VictoryTypeProperties(props) {
  return (
    <PropertyList
      classes={props.classes}
      label="Victory types"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={{
        'timeVictory': 'Time victory',
        'maxTurns': 'Max turns',
        'scienceVictory': 'Science victory',
        'dominationVictory': 'Domination victory',
        'culturalVictory': 'Cultural victory',
        'diplomaticVictory': 'Diplomatic victory',
      }}
    />
  );
}

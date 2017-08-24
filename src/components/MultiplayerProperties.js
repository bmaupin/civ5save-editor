import Civ5Save from 'civ5save';
import PropertyList from './PropertyList';
import React from 'react';

export default function MultiplayerProperties(props) {
  let multiplayerProperties = {
    'pitboss': 'Pitboss',
    'privateGame': 'Private game',
    'turnTimerEnabled': 'Turn timer',
    'turnTimerLength': '',
    'turnMode': 'Turn mode',
  }

  if (props.savegame.gameMode === Civ5Save.GAME_MODES.HOTSEAT) {
    delete multiplayerProperties.pitboss;
    delete multiplayerProperties.privateGame;
    delete multiplayerProperties.turnMode;
  }

  return (
    <PropertyList
      classes={props.classes}
      label="Multiplayer options"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={multiplayerProperties}
    />
  );
}

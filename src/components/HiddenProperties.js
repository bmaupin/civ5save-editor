import PropertyList from './PropertyList';
import React from 'react';

export default function HiddenProperties(props) {
  return (
    <PropertyList
      classes={props.classes}
      label="Hidden options"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={{
        'alwaysPeace': 'Always peace',
        'alwaysWar': 'Always war',
        'lockMods': 'Lock mods',
        'noChangingWarPeace': 'No changing war or peace',
        'noCultureOverviewUI': 'No culture overview UI',
        'noEspionage': 'No espionage',
        'noHappiness': 'No happiness',
        'noPolicies': 'No policies',
        'noReligion': 'No religion',
        'noScience': 'No science',
        'noWorldCongress': 'No world congress',
      }}
    />
  );
}

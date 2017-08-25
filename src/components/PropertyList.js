import Civ5Save from 'civ5save';
import { FormGroup } from 'material-ui/Form';
import PropertyCheckbox from './PropertyCheckbox';
import PropertyNumberTextField from './PropertyNumberTextField';
import PropertyRadioGroup from './PropertyRadioGroup';
import Paper from 'material-ui/Paper';
import React from 'react';
import Typography from 'material-ui/Typography';

export default function PropertyList(props) {
  return (
    <div className={props.classes.propertyList}>
      <Typography className={props.classes.propertyListHeading} type="subheading">
        {props.label}
      </Typography>
      <Paper className={props.classes.paper}>
        <FormGroup className={props.classes.propertyListBody}>
          {Object.keys(props.saveProperties).map(propertyName => {
            let textFieldDisabled = null;
            let textFieldLabel = null;
            if (propertyName === 'maxTurns') {
              textFieldDisabled = !props.savegame.timeVictory;
              textFieldLabel = props.saveProperties[propertyName];
            } else if (propertyName === 'turnTimerLength') {
              textFieldDisabled = !props.savegame.turnTimerEnabled;
              textFieldLabel = (props.savegame.pitboss === true ? 'Hours' : 'Seconds');
            }
            if (propertyName === 'maxTurns' || propertyName ===  'turnTimerLength') {
              return (
                <PropertyNumberTextField
                  classes={props.classes}
                  disabled={textFieldDisabled}
                  label={textFieldLabel}
                  key={propertyName}
                  name={propertyName}
                  onPropertyChanged={props.onPropertyChanged}
                  value={props.savegame[propertyName]}
                />
              )
            } else if (propertyName === 'turnMode') {
              return (
                <PropertyRadioGroup
                  classes={props.classes}
                  label={props.saveProperties[propertyName]}
                  key={propertyName}
                  name={propertyName}
                  onPropertyChanged={props.onPropertyChanged}
                  selectedValue={props.savegame[propertyName]}
                  values={Object.values(Civ5Save.TURN_MODES)}
                />
              )
            } else {
              return (
                <PropertyCheckbox
                  checked={props.savegame[propertyName]}
                  classes={props.classes}
                  key={propertyName}
                  label={props.saveProperties[propertyName]}
                  onPropertyChanged={props.onPropertyChanged}
                  value={propertyName}
                />
              )
            }
          })}
        </FormGroup>
      </Paper>
    </div>
  );
}
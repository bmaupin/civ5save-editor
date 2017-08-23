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
    <div>
      <Typography type="subheading"
        style={{
          margin: '20px 0 0 20px',
        }}>
        {props.label}
      </Typography>
      <Paper
        className={props.classes.paper}
      >
        <FormGroup
          style={{
            padding: '10px 20px',
          }}
        >
          {Object.keys(props.saveProperties).map(propertyName => {
            let disabled = null;
            if (propertyName === 'maxTurns') {
              disabled = !props.savegame.timeVictory;
            } else if (propertyName === 'turnTimerLength') {
              disabled = !props.savegame.turnTimerEnabled;
            }
            if (propertyName === 'maxTurns' || propertyName ===  'turnTimerLength') {
              return (
                <PropertyNumberTextField
                  disabled={disabled}
                  label={props.savegame.pitboss === true ? 'Hours' : 'Seconds'}
                  key={propertyName}
                  name={propertyName}
                  onPropertyChanged={props.onPropertyChanged}
                  value={props.savegame[propertyName]}
                />
              )
            } else if (propertyName === 'turnMode') {
              return (
                <PropertyRadioGroup
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
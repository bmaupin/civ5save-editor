import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import React, { PureComponent } from 'react';

export default class PropertyCheckbox extends PureComponent {
  constructor(props) {
    super(props);

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  handleCheckboxClick(event) {
    this.props.onPropertyChanged(event.target.value, event.target.checked);

    if (event.target.value === 'timeVictory' && event.target.checked === false) {
      this.props.onPropertyChanged('maxTurns', 0);
    }
  }

  render() {
    return (
      <FormControlLabel
        className={this.props.classes.formControlLabel}
        control={
          <Checkbox
            checked={this.props.checked}
            className={this.props.classes.checkbox}
            onClick={this.handleCheckboxClick}
            value={this.props.value}
          />
        }
        label={this.props.label}
      />
    )
  }
}

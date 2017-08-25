import { FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

export default class PropertyRadioGroup extends Component {
  constructor(props) {
    super(props);

    this.handleRadioGroupChange = this.handleRadioGroupChange.bind(this);
  }

  handleRadioGroupChange(event) {
    this.props.onPropertyChanged(event.target.name, event.target.value);
  }

  render() {
    return (
      <div>
        <Typography
          style={{
            padding: '12px 0 0 0',
          }}
          type="body1"
        >
          {this.props.label}
        </Typography>
        <RadioGroup
          className={this.props.classes.subProperty}
          name={this.props.name}
          onChange={this.handleRadioGroupChange}
          selectedValue={this.props.selectedValue}
        >
          {this.props.values.map((value, i) =>
            <FormControlLabel className={this.props.classes.radioButton} control={<Radio />} key={value} label={value} value={value} />
          )}
        </RadioGroup>
      </div>
    );
  }
}

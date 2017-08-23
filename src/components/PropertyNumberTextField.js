import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class PropertyNumberTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };

    this.handleTextFieldBlur = this.handleTextFieldBlur.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  // Update the value from props if it changes as well
  componentWillReceiveProps(nextProps) {
    // Using a string is a hack because otherwise the label will move and cover up the value
    this.setState({value: String(nextProps.value)});
  }

  handleTextFieldBlur(event) {
    // Forcing the input to a number will convert an empty string to 0
    this.props.onPropertyChanged(event.target.name, Number(event.target.value));
  }

  handleTextFieldChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div
        style={{
          padding: '0 12px',
        }}
      >
        <TextField
          disabled={this.props.disabled}
          inputProps={{
            max: 999,
            min: 0,
          }}
          label={this.props.label}
          name={this.props.name}
          onBlur={this.handleTextFieldBlur}
          onChange={this.handleTextFieldChange}
          // Setting min and max messes up the width
          style={{
            width: '100%',
          }}
          type="number"
          value={this.state.value}
        />
      </div>
    );
  }
}

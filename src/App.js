import Checkbox from 'material-ui/Checkbox';
import Civ5Save from 'civ5save';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import './App.css';

const darkTheme = createMuiTheme({
  palette: createPalette({
    type: 'dark',
  }),
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: hack until we find a better way to handle where savegame might be undefined
      savegame: ''
    };

    this.handleNewSavegame = this.handleNewSavegame.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
  }

  handleNewSavegame(newSavegame) {
    this.setState({
      savegame: newSavegame
    });
  }

  handlePropertyChange(propertyName, newValue) {
    this.setState((previousState) => {
      previousState.savegame[propertyName] = newValue;
      return previousState;
    });
  }

  render() {
    return (
      <MuiThemeProvider className="App" theme={darkTheme}>
        <Grid container
          style={{
            background: darkTheme.palette.background.default,
            color: darkTheme.palette.text.primary,
          }}>
          <Grid item>
            <List style={{
              backgroundColor: darkTheme.palette.background.paper,
              // TODO: height is bigger than the viewable area
              height: '100vh'
            }}>
              <FileUploader
                onNewSavegame={this.handleNewSavegame}
              />
              <FileDownloader
                savegame={this.state.savegame}
              />
            </List>
          </Grid>
          <Grid item>
            <GeneralProperties
              savegame={this.state.savegame}
            />
          </Grid>
          <Grid item>
            <SavePropertiesList
              onPropertyChanged={this.handlePropertyChange}
              savegame={this.state.savegame}
            />
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

class FileDownloader extends Component {
  constructor(props) {
    super(props);

    // Store URL in a variable so we can revoke it when we're done with it
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#Notes
    this.downloadURL = null;
  }

  createDownloadURL() {
    // TODO: hack until we find a better way to handle where savegame might be undefined
    if (this.props.savegame !== "") {
      if (!isNullOrUndefined(this.downloadURL)) {
        URL.revokeObjectURL(this.downloadURL);
      }

      this.downloadURL = window.URL.createObjectURL(this.props.savegame.toFile('New.Civ5Save'));
      return this.downloadURL;
    }
  }

  render() {
    // TODO: Disable the download link if a save file hasn't been loaded yet
    return (
      <ListItem button
        component="a"
        download="New.Civ5Save"
        href={this.createDownloadURL()}
      >
        <ListItemIcon>
          <Icon>file_download</Icon>
        </ListItemIcon>
        <ListItemText primary="Download" />
      </ListItem>
    );
  }
}

class FileUploader extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleChange(event) {
    if (this.refs.fileUploader.files.length > 0) {
      let newSavegame = await Civ5Save.fromFile(this.refs.fileUploader.files[0]);
      this.props.onNewSavegame(newSavegame);
    }
  }

  handleClick(event) {
    this.refs.fileUploader.click();
  }

  render() {
    return (
      <ListItem button
        onClick={this.handleClick}
      >
        <ListItemIcon>
          <Icon>folder_open</Icon>
        </ListItemIcon>
        <ListItemText primary="Open" />
        <input type="file" ref="fileUploader" onChange={this.handleChange} style={{display: "none"}} />
      </ListItem>
    );
  }
}

class GeneralProperties extends Component {
  render () {
    return (
      <List
        dense={true}
        style={{
          fontSize: darkTheme.typography.fontSize,
        }}
      >
        <ListItem>
          Game build: {this.props.savegame.gameBuild}
        </ListItem>
        <ListItem>
          {/* TODO: Handle if this is undefined */}
          Game version: {String(this.props.savegame.gameVersion)}
        </ListItem>
        <ListItem>
          Current turn: {this.props.savegame.currentTurn}
        </ListItem>
        <ListItem>
          Player 1 civilization: {this.props.savegame.player1Civilization}
        </ListItem>
        <ListItem>
          Difficulty {this.props.savegame.difficulty}
        </ListItem>
        <ListItem>
          Starting era: {this.props.savegame.startingEra}
        </ListItem>
        <ListItem>
          Current era: {this.props.savegame.currentEra}
        </ListItem>
        <ListItem>
          Game pace: {this.props.savegame.gamePace}
        </ListItem>
        <ListItem>
          Map size: {this.props.savegame.mapSize}
        </ListItem>
        <ListItem>
          Map file: {this.props.savegame.mapFile}
        </ListItem>
      </List>
    );
  }
}

class SavePropertiesList extends Component {
  constructor(props) {
    super(props);

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  handleCheckboxClick(event) {
    this.props.onPropertyChanged(event.target.value, event.target.checked);
  }

  handleTextFieldChange(event) {
    this.props.onPropertyChanged(event.target.name, event.target.value);
  }

  render() {
    return (
      <FormGroup
        style={{
          backgroundColor: darkTheme.palette.background.contentFrame,
          fontSize: darkTheme.typography.fontSize,
          margin: '20px 0',
          padding: '10px 20px',
        }}
      >
        <TextField
          label="Max turns"
          name="maxTurns"
          onChange={this.handleTextFieldChange}
          type="number"
          value={this.props.savegame.maxTurns}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={possiblyUndefinedBool(this.props.savegame.timeVictory)}
              onClick={this.handleCheckboxClick}
              value="timeVictory"
            />
          }
          label="Time victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={possiblyUndefinedBool(this.props.savegame.scienceVictory)}
              onClick={this.handleCheckboxClick}
              value="scienceVictory"
            />
          }
          label="Science victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={possiblyUndefinedBool(this.props.savegame.dominationVictory)}
              onClick={this.handleCheckboxClick}
              value="dominationVictory"
            />
          }
          label="Domination victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={possiblyUndefinedBool(this.props.savegame.culturalVictory)}
              onClick={this.handleCheckboxClick}
              value="culturalVictory"
            />
          }
          label="Cultural victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={possiblyUndefinedBool(this.props.savegame.diplomaticVictory)}
              onClick={this.handleCheckboxClick}
              value="diplomaticVictory"
            />
          }
          label="Diplomatic victory"
        />
      </FormGroup>
    );
  }
}

export default App;

function possiblyUndefinedBool(variable) {
  if (typeof variable === 'undefined') {
    return false;
  } else {
    return variable;
  }
}

// https://stackoverflow.com/a/416327/399105
function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

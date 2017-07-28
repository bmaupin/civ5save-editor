import Checkbox from 'material-ui/Checkbox';
import Civ5Save from 'civ5save';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { createStyleSheet } from 'material-ui/styles';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import './App.css';

const darkTheme = createMuiTheme({
  palette: createPalette({
    type: 'dark',
  }),
});

const styleSheet = createStyleSheet( () => ({
  '@global': {
    body: {
      background: darkTheme.palette.background.default,
      color: darkTheme.palette.text.primary,
    }
  }
}));

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
    console.log(propertyName, newValue);

// this.setState((previousState) => {
//   previousState.abc.xyz = 'blurg';
//   return previousState;
// });

    this.setState((previousState) => {
      previousState.savegame[propertyName] = newValue;
      return previousState;
    });
  }

  render() {
    return (
      <MuiThemeProvider className="App" theme={darkTheme}>
        <Grid container>
          <Grid item>
            <List style={{
              backgroundColor: darkTheme.palette.background.paper,
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

      // TODO: testing
      newSavegame.timeVictory = false;

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
      //   <List
      //   dense={true}
      //   style={{
      //     backgroundColor: darkTheme.palette.background.contentFrame,
      //   }}
      // >
      //   <ListItem>
      //     Max turns: {this.props.savegame.maxTurns}
      //   </ListItem>
      //   <ListItem>
      //     {/*TODO: Remove String() cast*/}
      //     Time victory: {String(this.props.savegame.timeVictory)}
      //   </ListItem>
      //   <ListItem>
      //     {/*TODO: Remove String() cast*/}
      //     Science victory: {String(this.props.savegame.scienceVictory)}
      //   </ListItem>
      //   <ListItem>
      //     {/*TODO: Remove String() cast*/}
      //     Domination victory: {String(this.props.savegame.dominationVictory)}
      //   </ListItem>
      //   <ListItem>
      //     {/*TODO: Remove String() cast*/}
      //     Cultural victory: {String(this.props.savegame.culturalVictory)}
      //   </ListItem>
      //   <ListItem>
      //     {/*TODO: Remove String() cast*/}
      //     Diplomatic victory: {String(this.props.savegame.diplomaticVictory)}
      //   </ListItem>
      // </List>

  // handleChange = name => (event, checked) => {
  //   //this.setState({ [name]: checked });
  //   this.props.savegame[name] = checked;
  // };
  /*
  onChange={this.props.onPropertyChanged('timeVictory')}
  onChange={this.props.onPropertyChanged('scienceVictory')}
  */

  constructor(props) {
    super(props);

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  handleCheckboxClick(event) {
    // console.log(event);
    // console.log(event.target);

    this.props.onPropertyChanged(event.target.value, event.target.checked);
  }

  render() {
    return (
      <div>
      <List
        dense={true}
        style={{
          backgroundColor: darkTheme.palette.background.contentFrame,
        }}
      >
        <ListItem>
          <Checkbox
            checked={evalPossiblyNullOrUndefinedBool(this.props.savegame.timeVictory)}
            onClick={this.handleCheckboxClick}
            value="timeVictory"
          />
          <ListItemText primary="Time victory" />
        </ListItem>
        <ListItem>
          <Checkbox
            checked={evalPossiblyNullOrUndefinedBool(this.props.savegame.scienceVictory)}
            onClick={this.handleCheckboxClick}
            value="scienceVictory"
          />
          <ListItemText primary="Science victory" />
        </ListItem>
      </List>
      <FormGroup
        style={{
          backgroundColor: darkTheme.palette.background.contentFrame,
          fontSize: darkTheme.typography.fontSize,
          margin: '20px 0',
          padding: '10px 20px',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={evalPossiblyNullOrUndefinedBool(this.props.savegame.dominationVictory)}
              onClick={this.handleCheckboxClick}
              value="dominationVictory"
            />
          }
          label="Domination victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={evalPossiblyNullOrUndefinedBool(this.props.savegame.culturalVictory)}
              value="culturalVictory"
            />
          }
          label="Cultural victory"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={evalPossiblyNullOrUndefinedBool(this.props.savegame.diplomaticVictory)}
              value="diplomaticVictory"
            />
          }
          label="Diplomatic victory"
        />
      </FormGroup>
      </div>
    );
  }
}

export default withStyles(styleSheet)(App);

function evalPossiblyNullOrUndefinedBool(variable) {
  if (isNullOrUndefined(variable)) {
    return false;
  } else {
    return variable;
  }
}

// https://stackoverflow.com/a/416327/399105
function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

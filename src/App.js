import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox';
import Civ5Save from 'civ5save';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
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
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography type="title"
                // This makes sure the button is aligned on the right
                style={{ flex:"1" }}>
                {/* TODO: make this a constant */}
                Civilization V save editor
              </Typography>
              {/* TODO: make the URL a constant */}
              <IconButton color="contrast" href="https://github.com/bmaupin/react-civ5save">
                <SvgIcon>
                  <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                </SvgIcon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid container
            // Without this, padding is added to every grid item
            gutter={0}
            style={{
              background: darkTheme.palette.background.default,
              color: darkTheme.palette.text.primary,
              // Fixes excess height and app bar drop shadow
              position: "fixed",
              // Fixes app bar drop shadow (together with position=fixed)
              zIndex: "-1",
            }}>
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
        </div>
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

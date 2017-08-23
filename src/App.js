import AppBar from 'material-ui/AppBar';
import { CircularProgress } from 'material-ui/Progress';
import Civ5Save from 'civ5save';
import Collapse from 'material-ui/transitions/Collapse';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import createTypography from 'material-ui/styles/typography';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import PropertyList from './components/PropertyList';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import './App.css';

const APP_TITLE = 'Civilization V save editor';
const DEMO_SAVE_FILE = 'demo/demo.Civ5Save';
const REPO_URL = 'https://github.com/bmaupin/react-civ5save';

const darkTheme = (() => {
  const palette = createPalette({
    type: 'dark',
  });

  // The default font for all Material UI elements is handled here. For everything else use CSS
  const typography = createTypography(palette, {
    fontFamily: '"Tw Cen W01 Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 'initial',
  });

  // Nested properties can't be defined in createTypography()
  typography.body1.fontSize = 'initial';
  typography.subheading.fontSize = '1.17em';
  typography.title.fontSize = '1.5em';

  return createMuiTheme({
    palette: palette,
    typography: typography,
  });
})();

const styles = createStyleSheet(theme => ({
  paper: {
    backgroundColor: darkTheme.palette.background.contentFrame,
    margin: '10px 20px 20px 20px',
  },
}));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savegame: null,
      savegameState: App.SAVEGAME_STATES.NOT_LOADED,
    };

    this.changeSavegameState = this.changeSavegameState.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleNewSavegame = this.handleNewSavegame.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
  }

  changeSavegameState(newState) {
    this.setState({
      savegameState: newState,
    });
  }

  handleError(error) {
    this.setState({
      error: error,
      savegameState: App.SAVEGAME_STATES.ERROR,
    });
  }

  handleNewSavegame(newSavegame, newSavegameFilename) {
    this.setState({
      savegame: newSavegame,
      savegameFilename: newSavegameFilename,
      savegameState: App.SAVEGAME_STATES.LOADED,
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
      <MuiThemeProvider className="App" theme={darkTheme}
        style={{
          height: '100%',
        }}>
        <div style={{
          height: '100%',
        }}>
          <AppBar
             style={{
              // Make sure app bar doesn't cover up page content
              position: 'relative',
            }}>
            <Toolbar>
              <Typography
                // This makes sure the button is aligned on the right
                style={{ flex: '1' }}
                type="title"
              >
                {APP_TITLE}
              </Typography>
              <IconButton color="contrast" href={REPO_URL}>
                <SvgIcon>
                  <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                </SvgIcon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <div
            style={{
              background: darkTheme.palette.background.default,
              color: darkTheme.palette.text.primary,
              display: 'flex',
              // TODO: we've subtracted the appbar height to prevent overflow. Is there a more elegant way to do this?
              minHeight: 'calc(100% - 64px)',
            }}
          >
            <div
              style={{
                minHeight: '100%',
              }}
            >
              <List
                style={{
                  backgroundColor: darkTheme.palette.background.paper,
                  // TODO: we've subtracted the padding height to prevent overflow. Is there a more elegant way to do this?
                  height: 'calc(100% - 8px)',
                  padding: '8px 0 0',
                }}
              >
                <FileUploader
                  changeSavegameState={this.changeSavegameState}
                  onError={this.handleError}
                  onNewSavegame={this.handleNewSavegame}
                />
                <FileDownloader
                  disabled={this.state.savegameState !== App.SAVEGAME_STATES.LOADED}
                  savegame={this.state.savegame}
                  savegameFilename={this.state.savegameFilename}
                />
                <ListItem button component="a" href={`${REPO_URL}/issues`}>
                  <ListItemIcon>
                    <Icon>bug_report</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Report bug" />
                </ListItem>
                <DemoButton
                  changeSavegameState={this.changeSavegameState}
                  onNewSavegame={this.handleNewSavegame}
                />
              </List>
            </div>
            <div
              style={{
                flex: '1',
              }}
            >
              {this.state.savegameState === App.SAVEGAME_STATES.NOT_LOADED &&
                <List
                  style={{
                    opacity: '0.8',
                    padding: '8px',
                  }}
                >
                  <ListItem>
                    <ListItemText primary="← Start by clicking here to open a Civilization V save file from your computer" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="← When you're done, click here to download a new save file with the changes" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="← If you have any problems, you can report a bug here" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="← Click here to see what the editor looks like without having to open a save file" />
                  </ListItem>
                </List>
              }
              {this.state.savegameState === App.SAVEGAME_STATES.LOADING &&
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <div>
                    <CircularProgress size={50} />
                  </div>
                </div>
              }
              {this.state.savegameState === App.SAVEGAME_STATES.LOADED &&
                <div
                  style={{
                    // TODO: adjust this as necessary
                    maxWidth: '900px',
                  }}>
                  <ReadOnlyPropertiesList
                    classes={this.props.classes}
                    savegame={this.state.savegame}
                  />
                  <div
                    style={{
                      display: 'flex',
                    }}>
                    <AdvancedProperties
                      classes={this.props.classes}
                      onPropertyChanged={this.handlePropertyChange}
                      savegame={this.state.savegame}
                    />
                    <HiddenProperties
                      classes={this.props.classes}
                      onPropertyChanged={this.handlePropertyChange}
                      savegame={this.state.savegame}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'column nowrap',
                      }}>
                      <VictoryTypes
                        classes={this.props.classes}
                        onPropertyChanged={this.handlePropertyChange}
                        savegame={this.state.savegame}
                      />
                      {(this.state.savegame.gameMode === Civ5Save.GAME_MODES.MULTI ||
                        this.state.savegame.gameMode === Civ5Save.GAME_MODES.HOTSEAT) &&
                        <MultiplayerProperties
                          classes={this.props.classes}
                          onPropertyChanged={this.handlePropertyChange}
                          savegame={this.state.savegame}
                        />
                      }
                    </div>
                  </div>
                </div>
              }
              {this.state.savegameState === App.SAVEGAME_STATES.ERROR &&
                <Typography type="subheading"
                  style={{
                    margin: '20px',
                  }}
                >
                  <p><Icon style={{ fontSize: '50px' }}>error_outline</Icon></p>
                  <p>The following error was encountered when trying to open your save file:</p>
                  <p>
                  <code>
                    {this.state.error.message}
                  </code>
                  </p>
                  <p>Please try another file or use the link on the left to report a bug.</p>
                </Typography>
              }
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.SAVEGAME_STATES = {
  ERROR: 'Error',
  LOADED: 'Loaded',
  LOADING: 'Loading',
  NOT_LOADED: 'Not loaded',
};

class DemoButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  getFileBlob(url) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.addEventListener('load', function() {
        resolve(xhr.response);
      });
      xhr.addEventListener('error', function() {
        reject(xhr.statusText);
      });
      xhr.send();
    });
  }

  async handleClick(event) {
    this.props.changeSavegameState(App.SAVEGAME_STATES.LOADING);
    let demoSaveFile = await this.getFileBlob(DEMO_SAVE_FILE);
    let demoSavegame = await Civ5Save.fromFile(demoSaveFile);
    this.props.onNewSavegame(demoSavegame, DEMO_SAVE_FILE.split('/').pop());
  }

  render() {
    return (
      <ListItem button
        onClick={this.handleClick}
      >
        <ListItemIcon>
          <Icon>play_circle_outline</Icon>
        </ListItemIcon>
        <ListItemText primary="Demo" />
      </ListItem>
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
    if (!isNullOrUndefined(this.props.savegame)) {
      if (!isNullOrUndefined(this.downloadURL)) {
        URL.revokeObjectURL(this.downloadURL);
      }

      this.downloadURL = window.URL.createObjectURL(this.props.savegame.toFile(this.props.savegameFilename));
      return this.downloadURL;
    }
  }

  render() {
    return (
      <ListItem button
        component="a"
        disabled={this.props.disabled}
        download={this.props.savegameFilename}
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
      this.props.changeSavegameState(App.SAVEGAME_STATES.LOADING);
      let newSaveFile = this.refs.fileUploader.files[0];
      try {
        let newSavegame = await Civ5Save.fromFile(newSaveFile);
        this.props.onNewSavegame(newSavegame, newSaveFile.name);
      } catch (e) {
        this.props.onError(e);
      }
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
        <ListItemText primary="Open save file" />
        <input type="file" ref="fileUploader" onChange={this.handleChange} style={{display: "none"}} />
      </ListItem>
    );
  }
}

function AdvancedProperties(props) {
  let advancedProperties = {
    'policySaving': 'Allow policy saving',
    'promotionSaving': 'Allow promotion saving',
    'completeKills': 'Complete kills',
    'newRandomSeed': 'New random seed',
    'noBarbarians': 'No barbarians',
    'noCityRazing': 'No city razing',
    'oneCityChallenge': 'One-city challenge',
    'ragingBarbarians': 'Raging barbarians',
    'randomPersonalities': 'Random personalities',
  }

  if (props.savegame.gameMode === Civ5Save.GAME_MODES.MULTI) {
    delete advancedProperties.newRandomSeed;
  }

  return (
    <PropertyList
      classes={props.classes}
      label="Advanced options"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={advancedProperties}
    />
  );
}

function HiddenProperties(props) {
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

function MultiplayerProperties(props) {
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

class ReadOnlyPropertiesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.readOnlyProperties = {
      'gameBuild': 'Game build',
      'gameVersion': 'Game version',
      'gameMode': 'Game mode',
      'currentTurn': 'Current turn',
      'player1Civilization': 'Player 1 civilization',
      'difficulty': 'Difficulty',
      'startingEra': 'Starting era',
      'currentEra': 'Current era',
      'gamePace': 'Game pace',
      'mapSize': 'Map size',
      'mapFile': 'Map',
    }
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  isSavegamePropertyDefined(propertyName) {
    return !isNullOrUndefined(this.props.savegame) && typeof this.props.savegame[propertyName] !== 'undefined';
  }

  render () {
    return (
      <div>
        <IconButton
          aria-expanded={this.state.expanded}
          aria-label="Game details"
          onClick={this.handleExpandClick}
          style={{
            fontSize: darkTheme.typography.fontSize,
            height: 'initial',
            margin: '14px 0 0 20px',
            width: 'initial',
          }}
        >
          <Typography type="subheading">
            Game details
          </Typography>
          <Icon
            style={{
              margin: '6px',
              transform: (this.state.expanded && 'rotate(180deg)'),
              transition: darkTheme.transitions.create('transform', {
                duration: darkTheme.transitions.duration.shortest,
              })
            }}
          >expand_more</Icon>
        </IconButton>
        <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
          <Paper
            className={this.props.classes.paper}
          >
            <Grid container
              style={{
                padding: '10px 20px',
              }}
            >
              {Object.keys(this.readOnlyProperties).map(propertyName =>
                this.isSavegamePropertyDefined(propertyName) &&
                  <Grid item key={propertyName} xs={2}>
                    <Typography type='body1'>{this.readOnlyProperties[propertyName]}:<br /><em>{this.props.savegame[propertyName]}</em></Typography>
                  </Grid>
              )}
              {this.isSavegamePropertyDefined('enabledDLC') &&
                <Grid item xs={12}>
                  <Typography type='body1'>DLC: <em>{this.props.savegame.enabledDLC.join(', ') || 'None'}</em></Typography>
                </Grid>
              }
            </Grid>
          </Paper>
        </Collapse>
      </div>
    );
  }
}

function VictoryTypes(props) {
  return (
    <PropertyList
      classes={props.classes}
      label="Victory types"
      onPropertyChanged={props.onPropertyChanged}
      savegame={props.savegame}
      saveProperties={{
        'timeVictory': 'Time victory',
        'maxTurns': 'Max turns',
        'scienceVictory': 'Science victory',
        'dominationVictory': 'Domination victory',
        'culturalVictory': 'Cultural victory',
        'diplomaticVictory': 'Diplomatic victory',
      }}
    />
  );
}

export default withStyles(styles)(App);

// https://stackoverflow.com/a/416327/399105
function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox';
import Civ5Save from 'civ5save';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import createTypography from 'material-ui/styles/typography';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import './App.css';

const darkTheme = (() => {
  const palette = createPalette({
    type: 'dark',
  });

  // The default font for all Material UI elements is handled here. For everything else use CSS
  const typography = createTypography(palette, {
    fontFamily: '"Tw Cen W01 Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 'initial',
  });

  // Nested properties can be defined in createTypography()
  typography.body1.fontSize = 'initial';
  typography.subheading.fontSize = '1.17em';
  typography.title.fontSize = '1.5em';

  return createMuiTheme({
    palette: palette,
    typography: typography,
  });
})();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savegame: null
    };

    this.handleNewSavegame = this.handleNewSavegame.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.isSavegameLoaded = this.isSavegameLoaded.bind(this);
    this.isSavegamePropertyDefined = this.isSavegamePropertyDefined.bind(this);
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

  isSavegameLoaded() {
    return !isNullOrUndefined(this.state.savegame);
  }

  isSavegamePropertyDefined(propertyName) {
    return !isNullOrUndefined(this.state) && !isNullOrUndefined(this.state.savegame) && typeof this.state.savegame[propertyName] !== 'undefined';
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
            style={{
              background: darkTheme.palette.background.default,
              color: darkTheme.palette.text.primary,
              // Don't vertically shrink the sidebar to make room for content
              flexWrap: 'nowrap',
              // Fix grid gutter adding horizontal scrollbar
              margin: 0,
              // TODO: we've subtracted the appbar height to prevent overflow. Is there a more elegant way to do this?
              minHeight: 'calc(100% - 64px)',
              width: '100%',
            }}>
            <Grid item
              style={{
                padding: 0,
              }}>
              <List style={{
                backgroundColor: darkTheme.palette.background.paper,
                // TODO: we've subtracted the padding height to prevent overflow. Is there a more elegant way to do this?
                height: 'calc(100% - 8px)',
                padding: '8px 0 0',
              }}>
                <FileUploader
                  onNewSavegame={this.handleNewSavegame}
                />
                <FileDownloader
                  disabled={!this.isSavegameLoaded()}
                  savegame={this.state.savegame}
                />
              </List>
            </Grid>
            {this.isSavegameLoaded() &&
              <Grid item
                style={{
                  // Make sure content shrinks if there isn't enough space for it
                  flexShrink: '1',
                  // TODO: adjust this as necessary
                  maxWidth: '1000px',
                }}>
                <ReadOnlyPropertiesList
                  isSavegamePropertyDefined={this.isSavegamePropertyDefined}
                  savegame={this.state.savegame}
                />
              </Grid>
            }
            {/*this.isSavegameLoaded() &&
              <Grid item>
                <VictoryTypes
                  isSavegamePropertyDefined={this.isSavegamePropertyDefined}
                  onPropertyChanged={this.handlePropertyChange}
                  savegame={this.state.savegame}
                />
              </Grid>
            */}
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
    if (!isNullOrUndefined(this.props.savegame)) {
      if (!isNullOrUndefined(this.downloadURL)) {
        URL.revokeObjectURL(this.downloadURL);
      }

      this.downloadURL = window.URL.createObjectURL(this.props.savegame.toFile('New.Civ5Save'));
      return this.downloadURL;
    }
  }

  render() {
    return (
      <ListItem button
        component="a"
        disabled={this.props.disabled}
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
        <ListItemText primary="Open Civ5Save" />
        <input type="file" ref="fileUploader" onChange={this.handleChange} style={{display: "none"}} />
      </ListItem>
    );
  }
}

class ReadOnlyPropertiesList extends Component {
  constructor(props) {
    super(props);

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

  render () {
    return (
      <Grid container
        style={{
          padding: '16px',
        }}
      >
        {Object.keys(this.readOnlyProperties).map(propertyName =>
          this.props.isSavegamePropertyDefined(propertyName) &&
            <Grid item xs={3}>
              <Typography type='body1'>{this.readOnlyProperties[propertyName]}: <em>{this.props.savegame[propertyName]}</em></Typography>
            </Grid>
        )}
        {this.props.isSavegamePropertyDefined('enabledDLC') &&
          <Grid item xs={12}>
            <Typography type='body1'>DLC: <em>{this.props.savegame.enabledDLC.join(', ')}</em></Typography>
          </Grid>
        }
      </Grid>
    );
  }
}

class VictoryTypes extends Component {
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
      <Paper
        style={{
          // TODO
          backgroundColor: darkTheme.palette.background.contentFrame,
        }}
      >
        <FormGroup
          style={{
            fontSize: darkTheme.typography.fontSize,
            margin: '20px 0',
            padding: '10px 20px',
          }}
        >
          {this.props.isSavegamePropertyDefined('maxTurns') &&
            <TextField
              label="Max turns"
              name="maxTurns"
              onChange={this.handleTextFieldChange}
              type="number"
              value={this.props.savegame.maxTurns}
            />
          }
          {this.props.isSavegamePropertyDefined('timeVictory') &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.savegame.timeVictory}
                  onClick={this.handleCheckboxClick}
                  value="timeVictory"
                />
              }
              label="Time victory"
            />
          }
          {this.props.isSavegamePropertyDefined('scienceVictory') &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.savegame.scienceVictory}
                  onClick={this.handleCheckboxClick}
                  value="scienceVictory"
                />
              }
              label="Science victory"
            />
          }
          {this.props.isSavegamePropertyDefined('dominationVictory') &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.savegame.dominationVictory}
                  onClick={this.handleCheckboxClick}
                  value="dominationVictory"
                />
              }
              label="Domination victory"
            />
          }
          {this.props.isSavegamePropertyDefined('culturalVictory') &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.savegame.culturalVictory}
                  onClick={this.handleCheckboxClick}
                  value="culturalVictory"
                />
              }
              label="Cultural victory"
            />
          }
          {this.props.isSavegamePropertyDefined('diplomaticVictory') &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.savegame.diplomaticVictory}
                  onClick={this.handleCheckboxClick}
                  value="diplomaticVictory"
                />
              }
              label="Diplomatic victory"
            />
          }
        </FormGroup>
      </Paper>
    );
  }
}

export default App;

// https://stackoverflow.com/a/416327/399105
function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

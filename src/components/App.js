import AdvancedProperties from './AdvancedProperties';
import AppBar from 'material-ui/AppBar';
import { CircularProgress } from 'material-ui/Progress';
import Civ5Save from 'civ5save';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import createTypography from 'material-ui/styles/typography';
import DemoButton from './DemoButton';
import DownloadFileButton from './DownloadFileButton';
import HiddenProperties from './HiddenProperties';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MuiThemeProvider } from 'material-ui/styles';
import MultiplayerProperties from './MultiplayerProperties';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import ReadOnlyProperties from './ReadOnlyProperties';
import UploadFileButton from './UploadFileButton';
import VictoryTypeProperties from './VictoryTypeProperties';

const APP_TITLE = 'Civilization V save editor';
const REPO_URL = 'https://github.com/bmaupin/react-civ5save-editor';

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
  checkbox: {
    height: '36px',
  },
  formControlLabel: {
    marginRight: '0',
  },
  paper: {
    backgroundColor: darkTheme.palette.background.contentFrame,
  },
  propertyList: {
    margin: '20px 0 4px 24px',
  },
  propertyListBody: {
    margin: '10px 0 0 0',
    padding: '10px 20px',
  },
  radioButton: {
    height: '36px',
  },
  subProperty: {
    padding: '0 0 0 12px',
  }
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
      <MuiThemeProvider
        className="App"
        style={{
          height: '100%',
        }}
        theme={darkTheme}
      >
        <div
          style={{
            height: '100%',
          }}
        >
          <AppBar
             style={{
              // Make sure app bar doesn't cover up page content
              position: 'relative',
            }}
          >
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
                  boxSizing: 'border-box',
                  height: '100%',
                }}
              >
                <UploadFileButton
                  changeSavegameState={this.changeSavegameState}
                  onError={this.handleError}
                  onNewSavegame={this.handleNewSavegame}
                />
                <DownloadFileButton
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
                  onError={this.handleError}
                  onNewSavegame={this.handleNewSavegame}
                />
              </List>
            </div>
            <div
              style={{
                flex: '1',
                padding: '0 24px 20px 0',
              }}
            >
              {this.state.savegameState === App.SAVEGAME_STATES.NOT_LOADED &&
                <List
                  style={{
                    opacity: '0.8',
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
                    <ListItemText primary="← Click here to try out the editor with a sample save file" />
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
                <div>
                  <ReadOnlyProperties
                    classes={this.props.classes}
                    savegame={this.state.savegame}
                    theme={darkTheme}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexFlow: 'row wrap',
                    }}
                  >
                    <VictoryTypeProperties
                      classes={this.props.classes}
                      onPropertyChanged={this.handlePropertyChange}
                      savegame={this.state.savegame}
                    />
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
              }
              {this.state.savegameState === App.SAVEGAME_STATES.ERROR &&
                <Typography
                  style={{
                    margin: '20px',
                  }}
                  type="subheading"
                >
                  <p><Icon style={{ fontSize: '50px' }}>error_outline</Icon></p>
                  <p>The following error was encountered when trying to open the save file:</p>
                  <pre>
                    {this.state.error.message}
                  </pre>
                  <p dangerouslySetInnerHTML={{__html: this.state.error.customMessage}} />
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

export default withStyles(styles)(App);

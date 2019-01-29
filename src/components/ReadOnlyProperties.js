import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = createStyleSheet(theme => ({
  readOnlyPropertiesItem: {
    padding: '0 16px 16px 0',
  },
}));

class ReadOnlyProperties extends Component {
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
      'difficulty': 'Difficulty',
      'startingEra': 'Starting era',
      'currentEra': 'Current era',
      'gamePace': 'Game pace',
      'mapSize': 'Map size',
      'mapFile': 'Map',
    }
  }

  getPlayerList() {
    let playerListArray = this.props.savegame.players.map(player => {
      if (typeof player.civilization !== 'undefined') {
        return `${player.civilization} (${player.status})`;
      } else {
        return `(${player.status})`;
      }
    });
    let playerList = playerListArray.join(', ');

    return playerList;
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  isSavegamePropertyDefined(propertyName) {
    return !isNullOrUndefined(this.props.savegame) && typeof this.props.savegame[propertyName] !== 'undefined';
  }

  render () {
    return (
      <div
        className={this.props.classes.propertyList}
        style={{
          // TODO: adjust this as necessary
          maxWidth: '900px',
        }}
      >
        <IconButton
          aria-expanded={this.state.expanded}
          aria-label="Game details"
          className={this.props.classes.propertyListHeading}
          onClick={this.handleExpandClick}
          style={{
            fontSize: this.props.theme.typography.fontSize,
            height: 'initial',
            width: 'initial',
          }}
        >
          <Typography type="subheading">
            Game details
          </Typography>
          <Icon
            style={{
              margin: '0 6px',
              transform: (this.state.expanded && 'rotate(180deg)'),
              transition: this.props.theme.transitions.create('transform', {
                duration: this.props.theme.transitions.duration.shortest,
              })
            }}
          >expand_more</Icon>
        </IconButton>
        <Collapse
          in={this.state.expanded}
          style={{
            // Make sure box shadow isn't cut off by overflow: hidden (https://stackoverflow.com/a/33949075/399105)
            margin: '-5px',
            padding: '5px',
          }}
          transitionDuration="auto"
        >
          <Paper className={this.props.classes.paper}>
            <div
              className={this.props.classes.propertyListBody}
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                // Offset the padding of the inside elements
                paddingBottom: '0px',
                paddingRight: '0px',
                // More closely match the padding of the other property lists
                paddingTop: '16px',
              }}
            >
              {Object.keys(this.readOnlyProperties).map(propertyName =>
                this.isSavegamePropertyDefined(propertyName) &&
                  <div
                    className={this.props.classes.readOnlyPropertiesItem}
                    key={propertyName}
                    style={{
                      flex: '0 1 130px',
                    }}
                  >
                    <Typography type='body1'>{this.readOnlyProperties[propertyName]}:<br /><em>{this.props.savegame[propertyName]}</em></Typography>
                  </div>
              )}
              <div className={this.props.classes.readOnlyPropertiesItem}>
                <Typography type='body1'>Players: <em>{this.getPlayerList()}</em></Typography>
              </div>
              {this.isSavegamePropertyDefined('enabledDLC') &&
                <div
                className={this.props.classes.readOnlyPropertiesItem}
                style={{
                  width: '100%',
                }}>
                  <Typography type='body1'>DLC: <em>{this.props.savegame.enabledDLC.join(', ') || 'None'}</em></Typography>
                </div>
              }
              {this.isSavegamePropertyDefined('enabledMods') &&
                <div
                  className={this.props.classes.readOnlyPropertiesItem}
                  style={{
                    width: '100%',
                  }}>
                  <Typography type='body1'>Mods: <em>{this.props.savegame.enabledMods.join(', ') || 'None'}</em></Typography>
                </div>
              }
            </div>
          </Paper>
        </Collapse>
      </div>
    );
  }
}

function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

export default withStyles(styles)(ReadOnlyProperties);

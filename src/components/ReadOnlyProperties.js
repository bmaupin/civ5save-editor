import Collapse from 'material-ui/transitions/Collapse';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

export default class ReadOnlyProperties extends Component {
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
            fontSize: this.props.theme.typography.fontSize,
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
              transition: this.props.theme.transitions.create('transform', {
                duration: this.props.theme.transitions.duration.shortest,
              })
            }}
          >expand_more</Icon>
        </IconButton>
        <Collapse in={this.state.expanded} transitionDuration="auto">
          <Paper className={this.props.classes.paper}>
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

function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

import Civ5Save from 'civ5save';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savegame: ''
    };

    this.handleNewSavegame = this.handleNewSavegame.bind(this);
  }

  handleNewSavegame(newSavegame) {
    this.setState({
      savegame: newSavegame
    });
  }

  render() {
    return (
      <div className="App">
        <FileUploader
          savegame={this.state.savegame}
          onNewSavegame={this.handleNewSavegame}
        />
        <SavePropertiesList
          savegame={this.state.savegame}
        />
      </div>
    );
  }
}

class FileUploader extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    // TODO: handle if user clicks cancel instead of selecting a file
    let newSavegame = await Civ5Save.fromFile(this.refs.fileUploader.files[0]);
    this.props.onNewSavegame(newSavegame);
  }

  render() {
    return (
      <div>
        <input type="file" ref="fileUploader" onChange={this.handleChange} />
      </div>
    );
  }
}

class SavePropertiesList extends Component {
  render() {
    return (
      <ul>
        <li>
          Game build: {this.props.savegame.gameBuild}
        </li>
        <li>
          {/*TODO: Handle if this is undefined*/}
          Game version: {String(this.props.savegame.gameVersion)}
        </li>
        <li>
          Current turn: {this.props.savegame.currentTurn}
        </li>
        <li>
          Player 1 civilization: {this.props.savegame.player1Civilization}
        </li>
        <li>
          Difficulty {this.props.savegame.difficulty}
        </li>
        <li>
          Starting era: {this.props.savegame.startingEra}
        </li>
        <li>
          Current era: {this.props.savegame.currentEra}
        </li>
        <li>
          Game pace: {this.props.savegame.gamePace}
        </li>
        <li>
          Map size: {this.props.savegame.mapSize}
        </li>
        <li>
          Map file: {this.props.savegame.mapFile}
        </li>
        <li>
          Max turns: {this.props.savegame.maxTurns}
        </li>
        <li>
          {/*TODO: Remove String() cast*/}
          Time victory: {String(this.props.savegame.timeVictory)}
        </li>
        <li>
          {/*TODO: Remove String() cast*/}
          Science victory: {String(this.props.savegame.scienceVictory)}
        </li>
        <li>
          {/*TODO: Remove String() cast*/}
          Domination victory: {String(this.props.savegame.dominationVictory)}
        </li>
        <li>
          {/*TODO: Remove String() cast*/}
          Cultural victory: {String(this.props.savegame.culturalVictory)}
        </li>
        <li>
          {/*TODO: Remove String() cast*/}
          Diplomatic victory: {String(this.props.savegame.diplomaticVictory)}
        </li>
      </ul>
    );
  }
}

export default App;

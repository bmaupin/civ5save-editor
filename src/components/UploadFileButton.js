import App from '../App';
import Civ5Save from 'civ5save';
import Icon from 'material-ui/Icon';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import React, { Component } from 'react';

export default class UploadFileButton extends Component {
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
      <ListItem button onClick={this.handleClick}>
        <ListItemIcon>
          <Icon>folder_open</Icon>
        </ListItemIcon>
        <ListItemText primary="Open save file" />
        <input type="file" ref="fileUploader" onChange={this.handleChange} style={{display: "none"}} />
      </ListItem>
    );
  }
}

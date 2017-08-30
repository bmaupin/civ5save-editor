import Icon from 'material-ui/Icon';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import React, { Component } from 'react';

export default class DownloadFileButton extends Component {
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

      this.downloadURL = window.URL.createObjectURL(this.props.savegame.toBlob());
      return this.downloadURL;
    }
  }

  render() {
    return (
      <ListItem
        button
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

function isNullOrUndefined(variable) {
  return typeof variable === 'undefined' || variable === null;
}

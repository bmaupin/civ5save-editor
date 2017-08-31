import App from './App';
import Civ5Save from 'civ5save';
import Icon from 'material-ui/Icon';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import React from 'react';

const DEMO_SAVE_FILE = 'demo/demo.Civ5Save';

export default function DemoButton(props) {
  function getFileBlob(url) {
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

  async function handleClick(event) {
    props.changeSavegameState(App.SAVEGAME_STATES.LOADING);
    let demoSaveFile = await getFileBlob(DEMO_SAVE_FILE);
    try {
      let demoSavegame = await Civ5Save.fromFile(demoSaveFile);
      props.onNewSavegame(demoSavegame, DEMO_SAVE_FILE.split('/').pop());
    } catch (e) {
      e.customMessage = 'Your web browser may be outdated. Please see here for more information: <a href="http://outdatedbrowser.com">outdatedbrowser.com</a>';
      props.onError(e);
    }
  }

  return (
    <ListItem
      button
      onClick={handleClick}
    >
      <ListItemIcon>
        <Icon>play_circle_outline</Icon>
      </ListItemIcon>
      <ListItemText primary="Demo" />
    </ListItem>
  );
}

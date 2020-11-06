import './css/style.css'

import logMessage from './js/logger'
if (module.hot)       // eslint-disable-line no-undef   //??
  module.hot.accept() // eslint-disable-line no-undef   //??

import Level from "./js/Level.js";
import Stage from "./js/Stage.js";
// import ProtonEffects from "./ProtonEffects.js";
import LogIn from "./js/LogIn.js";
import Config from "./js/Config.js";

export default class App extends Stage {

  constructor() {

    super();

    window.onload = () => {
      this.Config = Config;
      this.storageData = localStorage.getItem('match3football');
      if (!Config.hasLogin) {                   // REMOVES LOGIN PHASE..FOR TESTS ONLY
        this.startLevel();
      } else {
        if (this.storageData) {
          this.checkUserData();
        } else {
          this.login = new LogIn(this);
        }
      }
    };
  }

  startLevel() {
    // this.proton = new ProtonEffects(this);
    this.level = new Level(this);
    this.stage.addChild(this.level);
  }

  getLevel() {
    return this.level;
  }

  checkUserData() {
    $.ajax({
      url: "storageData",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ data: this.storageData }),
      success: (res) => {
        if (!res.authorized) {
          this.login = new LogIn(this);
        } else {
          this.startLevel();
        }
      }
    });
  }
}

new App;


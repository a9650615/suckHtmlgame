import Framework, {ES6Trans} from './framework_es6';
import {Resource, Game} from './constant';
import BeatsMapParser from './modules/BeatsMapParser';
import SongParser from './modules/SongParser';
import Img from './components/Img';
import Sprite from './components/Sprite';
import Stage from './components/Stage';
import SilderStage from './components/SilderStage';
import Botton from './components/Botton';

class GamePlayScene extends ES6Trans {
  initializeProgressResource() {
    this.state = {
      frame: 0,
      hp: 100, //百分比
      combo: 0, // 連擊
      loaded: false,
      play: false,
      currentStep: 0,
      hpWidth: 5,
      totalScore: 0
    };

    this.beatsMap = {};
    this.song = new SongParser();
  }

  characterUpdate() {
    let list = [1,2,3,4,5,6,4,3,2,1];
    this.setState({
      frame: this.state.frame+0.1
    });
    if(this.state.frame>list.length) 
      this.setState({
        frame: 1
      });
    this.component.character.showPiece(list[parseInt(this.state.frame)]);
  }

  playSong() {
    if (this.song.getPlayer().paused)
      this.song.getPlayer().play(); // 播放歌曲
  }

  onkeydown(e) {
    let keyCode = Game.keyCode;
    switch(e.keyCode) {
      case keyCode.leftHit:
        this.component.silderStage.keyHit(0);
        break;
      case keyCode.rightHit:
        this.component.silderStage.keyHit(1);
        break;
      case 32:
        let player = this.song.getPlayer();
        if (Game.debug) {
          if (player.paused) 
            player.play()
          else 
            player.pause()
        }
        break;
    }
  }

  load() {
    let GameWidth = Game.window.width, GameHeight = Game.window.height;
    new Img(this).set({
      url: Resource.image+'/background.jpg',
      x: 0,
      y: -200,
      width: 1920
    });
   
    this.component = {
      stage: new Stage(this).set({
        hpWidth: this.state.hpWidth
      }),
      silderStage: new SilderStage(this).set({
        x: 10,
        y: Game.window.height * 0.525,
        width: Game.window.width - 20,
        height: (Game.window.height*0.45),
        hpWidth: this.state.hpWidth
      }),
      character: new Sprite(this).set({
        url: Resource.image+'bisca_battler_rpg_maker_mv_by_retrospriteresources-dagd3xg.png',
        wPiece: 9,
        hPiece: 6,
        sprWidth: 120,
        sprHeight: 120,
        x: (Game.window.width-120)/2,
        y: GameHeight * 0.2
      }),
      debugText: new Botton(this).set({
        x: 100,
        y: 30,
        textColor: 'white',
        text: 'debbug text'
      }),
      scoreText: new Botton(this).set({
        x: 100,
        y: 50,
        textColor: 'white',
        text: 'debbug text'
      })
    };
    
    let songFolder = Resource.songs+'BBKKBKK/';
    new BeatsMapParser(songFolder+'BBKKBKK[default].json').then((data) => {
      this.beatsMap = data;
      this.beatsMap.beatsMap = Object.keys(this.beatsMap.beatsMap).map((index) => {
        return this.beatsMap.beatsMap[index];
      });
      this.song.setUrl(songFolder+this.beatsMap.songFile, this.beatsMap.songFile, () => {
        this.setState({
          loaded: true,
          play: true
        });
        this.component.silderStage.loadbeatsMap(this.beatsMap);
        if (!Game.debug)
          this.playSong();
      });
    });
  }

  update() {
    this.characterUpdate();
    if (this.state.play) {
      if(this.state.hp>0) {
        // 扣血範例
        this.setState({
          hp: this.state.hp - 0.01
        });
      }
      let silder = this.component.silderStage;
      this.state.totalScore = Math.round(1000000 * (silder.getScore()));
    }
  }

  render() {
    this.component.stage.set({
      hp: this.state.hp
    });
    if (this.state.play) {
      let fixCurrentTime = this.song.getCurrentTime()-this.beatsMap.songOffset;
      let revertBpm = 60/this.beatsMap.bpm;
      let step = (fixCurrentTime / revertBpm).toFixed(2);
      this.state.currentStep = step;
      this.component.silderStage.setCurrentTime(fixCurrentTime, step);
      this.component.debugText.set({
        text: 'step:'+step
      });
      this.component.scoreText.set({
        text: 'score:'+this.state.totalScore
      });
    }
  }
}

export default Framework.exClass(Framework.Level , new GamePlayScene().transClass());

import Framework, {ES6Trans} from './framework_es6';
import { Resource , Game } from './constant';
import Button from './components/Button';
import Img from './components/Img';
import Rect from './components/Rectangle'
import Ani from './helper/Ani'

class startScreen extends ES6Trans {
  initialize() {
    this.audio = new Framework.Audio({
      ready:{
        mp3: Resource.sounds+'ready.wav'
      }
    })
  }

	load() {
		this.component = {
			background: new Rect(this).set({
				x: 0,
				y: 0,
				background: '#000000',
				width: Game.window.width,
				height: Game.window.height
			}),
      backgroundImg: new Img(this).set({
        url: Resource.image+'/start_background_n.png',
        x: 0,
        y: 0  ,
        width: 1280,
        height: 720
      }),
			start: new Button(this).set({
        text: "> Press Enter or click here !!<",
        x: Game.window.width * 0.5,
        y: Game.window.height * 0.85,
        textSize: 40,
        textColor: '#ffffff',
				textFont: '微軟正黑體'
      }).setEvent('click', (e) => {
        this.audio.play({name: 'ready', loop: false})
        setTimeout(() => {
          Framework.Game.goToLevel("selectMusic")
        }, 500)
      })
		}

    this.Ani = new Ani()
    this.loopAni = this.loopAni.bind(this)
    this.loopAni()
	}

  loopAni() {
    this.Ani.fromTo({opacity: 0.3}, {opacity: 1}, 1, (data) => {
      this.component.start.set(data)
      this.forceUpdate()
    }, 'loop').then(() => {
      this.Ani.fromTo({opacity: 1}, {opacity: 0.3}, 0.7, (data) => {
        this.component.start.set(data)
        this.forceUpdate()
      }, 'loop').then(this.loopAni)
    })
  }

	onkeydown(e) {
		if (e.key === 'Enter') {
      this.audio.play({name: 'ready', loop: false})
      setTimeout(() => {
        Framework.Game.goToLevel("selectMusic")
      }, 500)
    }
	}

	fresh() {
    this.Ani.update()
	}

  render() {
		
  }
}

export default Framework.exClass(Framework.GameMainMenu , new startScreen().transClass());
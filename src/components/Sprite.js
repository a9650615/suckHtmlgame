import Framework from '../framework_es6';
import Img from './Img';

export default class Sprite extends Img{
  constructor(prop) {
    super(prop);
    this.state = {
      x: 0,
      y: 0,
      width: null,
      height: null,
      url: null,
      wPiece: 1,
      hPiece: 1,
      sprWidth: null,
      sprHeight: null,
      showPiece: 0
    };
    
  }

  showPiece(number = 0) {
    this.setState({
      showPiece: parseInt(number) - 1
    });
    // let state = this.state;
    // this._tmpCanvas.resize(state.width/state.wPiece, state.height/state.hPiece);
  }

  render(ctx) {
    let state = this.state;
    let next = (state.showPiece%(state.wPiece));
    let level = parseInt(state.showPiece/(state.wPiece));
    let pieceX = (state.wPiece>1)?(state.width/state.wPiece):state.width;
    let pieceY = (state.hPiece>1)?(state.height/state.hPiece):state.height;
    let sprWidth = this.state.sprWidth;
    let sprHeight = this.state.sprHeight;
    let offsetX = pieceX * next;
    let offsetY = pieceY * level;
    let ele = this._tmpCanvas.element();
    
    if(ele.width != (sprWidth||pieceX) || ele.width != (sprHeight||pieceY))
      this._tmpCanvas.resize(sprWidth||pieceX, sprHeight||pieceY);
    ctx.drawImage(this.preLoadImg, 
      offsetX, offsetY, parseInt(pieceX), parseInt(pieceY),
      0, 0, parseInt(sprWidth||pieceX), parseInt(sprHeight||pieceY)
    );
  }
}
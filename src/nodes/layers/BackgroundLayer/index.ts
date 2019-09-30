class BackgroundLayer extends cc.Node {
  constructor(resource) {
    super();
    this.addBackgroundImage(resource);
  }

  addBackgroundImage(resource: string) {
    this.removeAllChildren();
    const backgroundImage = new cc.Sprite(resource || window.bgImage);
    const { width, height } = cc.director.getWinSize();

    const centerPos = cc.p(width / 2, height / 2);
    backgroundImage.setPosition(centerPos);

    const scaleX = width / backgroundImage.width;
    const scaleY = height / backgroundImage.height;
    backgroundImage.setScale(scaleX, scaleY);

    this.addChild(backgroundImage);
  }
}

export default BackgroundLayer;

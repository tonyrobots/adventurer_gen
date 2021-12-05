import Phaser from 'phaser';

export default {
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: '#000',
  scale: {
    width: 1024,
    height: 800,
    mode: Phaser.Scale.NONE,
    // autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

import Player from './player';

export class APNG {
  public width = 0;

  public height = 0;

  public numPlays = 0;

  public playTime = 0;

  public frames: Frame[] = [];

  public createImages() {
    return Promise.all(this.frames.map(f => f.createImage()));
  }

  public getPlayer(context: CanvasRenderingContext2D, autoPlay = false) {
    return this.createImages().then(() => new Player(this, context, autoPlay));
  }
}

export class Frame {
  public left = 0;

  public top = 0;

  public width = 0;

  public height = 0;

  public delay = 0;

  public disposeOp = 0;

  public blendOp = 0;

  public imageData: Blob | null = null;

  public imageElement: HTMLImageElement | null = null;

  public dataParts?: Array<Uint8Array>;

  public createImage(): Promise<void> {
    if (this.imageElement) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(this.imageData);
      this.imageElement = document.createElement('img');
      this.imageElement.onload = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      this.imageElement.onerror = () => {
        URL.revokeObjectURL(url);
        this.imageElement = null;
        reject(new Error('Image creation error'));
      };
      this.imageElement.src = url;
    });
  }
}

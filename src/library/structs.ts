import Player from './player';

export class APNG {
  /**
   * with of canvas, pixels
   */
  public width = 0;

  /**
   * height of canvas, pixels
   */
  public height = 0;

  /**
   * number of times to loop animation (0 = infinite looping)
   */
  public numPlays = 0;

  /**
   * total duration of one loop in milliseconds
   */
  public playTime = 0;

  /**
   * array of frames
   */
  public frames: Frame[] = [];

  /**
   * create imageElement's for all frames
   */
  public createImages() {
    return Promise.all(this.frames.map(f => f.createImage()));
  }

  /**
   * Create Player on given context and start playing if autoPlay is true.
   * @param context CanvasRenderingContext2D
   * @param autoPlay default is `false`
   */
  public getPlayer(context: CanvasRenderingContext2D, autoPlay = false) {
    return this.createImages().then(() => new Player(this, context, autoPlay));
  }
}

export class Frame {
  /**
   * left offset of frame, pixels
   */
  public left = 0;

  /**
   * top offset of frame, pixels
   */
  public top = 0;

  /**
   * with of frame, pixels
   */
  public width = 0;

  /**
   * height of frame, pixels
   */
  public height = 0;

  /**
   * time to show frame in milliseconds
   */
  public delay = 0;

  /**
   * type of dispose operation (see APNG spec.)
   */
  public disposeOp = 0;

  /**
   * type of blend operation (see APNG spec.)
   */
  public blendOp = 0;

  /**
   * image data in PNG (not animated) format
   */
  public imageData: Blob | null = null;

  /**
   * image data rendered as HTML Image element.
   *
   * This field is null right after 'parse', use `Frame.createImage()` or `APNG.createImages()` to fill this field.
   */
  public imageElement: HTMLImageElement | null = null;

  public dataParts?: Array<Uint8Array>;

  /**
   * create imageElement for this frame
   */
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

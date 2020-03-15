import { EventEmitter } from 'events';
import { APNG, Frame } from './structs';

class Player extends EventEmitter {
  public context: CanvasRenderingContext2D;

  /**
   * animation playback rate
   */
  public playbackRate = 1.0;

  private _apng: APNG;

  private _prevFrame?: Frame;

  private _prevFrameData: ImageData | null = null;

  private _currentFrameNumber = 0;

  private _ended = false;

  private _paused = true;

  private _numPlays = 0;

  public constructor(
    apng: APNG,
    context: CanvasRenderingContext2D,
    autoPlay: boolean,
  ) {
    super();
    this._apng = apng;
    this.context = context;
    this.stop();
    if (autoPlay) {
      this.play();
    }
  }

  /**
   * current frame number
   */
  public get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  /**
   * current frame
   */
  public get currentFrame() {
    return this._apng.frames[this._currentFrameNumber];
  }

  /**
   * move to next frame and render it on context
   *
   *  Use this method to manual, frame by frame, rendering.
   */
  public renderNextFrame() {
    this._currentFrameNumber =
      (this._currentFrameNumber + 1) % this._apng.frames.length;
    if (this._currentFrameNumber === this._apng.frames.length - 1) {
      this._numPlays++;
      if (this._apng.numPlays !== 0 && this._numPlays >= this._apng.numPlays) {
        this._ended = true;
        this._paused = true;
      }
    }

    if (this._prevFrame && this._prevFrame.disposeOp === 1) {
      this.context.clearRect(
        this._prevFrame.left,
        this._prevFrame.top,
        this._prevFrame.width,
        this._prevFrame.height,
      );
    } else if (this._prevFrame && this._prevFrame.disposeOp === 2) {
      this.context.putImageData(
        this._prevFrameData!,
        this._prevFrame.left,
        this._prevFrame.top,
      );
    }

    const frame = this.currentFrame;
    this._prevFrame = frame;
    this._prevFrameData = null;
    if (frame.disposeOp === 2) {
      this._prevFrameData = this.context.getImageData(
        frame.left,
        frame.top,
        frame.width,
        frame.height,
      );
    }
    if (frame.blendOp === 0) {
      this.context.clearRect(frame.left, frame.top, frame.width, frame.height);
    }

    this.context.drawImage(frame.imageElement!, frame.left, frame.top);

    this.emit('frame', this._currentFrameNumber);
    if (this._ended) {
      this.emit('end');
    }
  }

  // playback

  /**
   * playback is paused
   */
  public get paused() {
    return this._paused;
  }

  /**
   * playback is ended
   */
  public get ended() {
    return this._ended;
  }

  /**
   * start or resume playback
   */
  public play() {
    this.emit('play');

    if (this._ended) {
      this.stop();
    }
    this._paused = false;

    let nextRenderTime =
      performance.now() + this.currentFrame.delay / this.playbackRate;
    const tick = (now: number) => {
      if (this._ended || this._paused) {
        return;
      }
      if (now >= nextRenderTime) {
        while (
          now - nextRenderTime >=
          this._apng.playTime / this.playbackRate
        ) {
          nextRenderTime += this._apng.playTime / this.playbackRate;
          this._numPlays++;
        }
        do {
          this.renderNextFrame();
          nextRenderTime += this.currentFrame.delay / this.playbackRate;
        } while (!this._ended && now > nextRenderTime);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /**
   * pause playback
   */
  public pause() {
    if (!this._paused) {
      this.emit('pause');
      this._paused = true;
    }
  }

  /**
   * stop playback and rewind to start
   */
  public stop() {
    this.emit('stop');
    this._numPlays = 0;
    this._ended = false;
    this._paused = true;
    // render first frame
    this._currentFrameNumber = -1;
    this.context.clearRect(0, 0, this._apng.width, this._apng.height);
    this.renderNextFrame();
  }
}

interface Player {
  /**
   * playback started
   */
  addListener(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  addListener(
    event: 'frame',
    listener: (currentFrameNumber: number) => void,
  ): this;
  /**
   * playback paused
   */
  addListener(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  addListener(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  addListener(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  on(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  on(event: 'frame', listener: (currentFrameNumber: number) => void): this;
  /**
   * playback paused
   */
  on(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  on(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  on(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  once(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  once(event: 'frame', listener: (currentFrameNumber: number) => void): this;
  /**
   * playback paused
   */
  once(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  once(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  once(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  removeListener(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  removeListener(
    event: 'frame',
    listener: (currentFrameNumber: number) => void,
  ): this;
  /**
   * playback paused
   */
  removeListener(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  removeListener(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  removeListener(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  off(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  off(event: 'frame', listener: (currentFrameNumber: number) => void): this;
  /**
   * playback paused
   */
  off(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  off(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  off(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  emit(event: 'play'): boolean;
  /**
   * frame played
   */
  emit(event: 'frame', currentFrameNumber: number): boolean;
  /**
   * playback paused
   */
  emit(event: 'pause'): boolean;
  /**
   * playback stopped
   */
  emit(event: 'stop'): boolean;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  emit(event: 'end'): boolean;

  /**
   * playback started
   */
  prependListener(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  prependListener(
    event: 'frame',
    listener: (currentFrameNumber: number) => void,
  ): this;
  /**
   * playback paused
   */
  prependListener(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  prependListener(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  prependListener(event: 'end', listener: () => void): this;

  /**
   * playback started
   */
  prependOnceListener(event: 'play', listener: () => void): this;
  /**
   * frame played
   */
  prependOnceListener(
    event: 'frame',
    listener: (currentFrameNumber: number) => void,
  ): this;
  /**
   * playback paused
   */
  prependOnceListener(event: 'pause', listener: () => void): this;
  /**
   * playback stopped
   */
  prependOnceListener(event: 'stop', listener: () => void): this;
  /**
   * playback ended (for APNG with finite count of plays)
   */
  prependOnceListener(event: 'end', listener: () => void): this;
}

export default Player;

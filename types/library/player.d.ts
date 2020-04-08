import { EventEmitter } from 'events';
import { APNG, Frame } from './structs';
declare class Player extends EventEmitter {
    context: CanvasRenderingContext2D;
    /**
     * animation playback rate
     */
    playbackRate: number;
    private _apng;
    private _prevFrame?;
    private _prevFrameData;
    private _currentFrameNumber;
    private _ended;
    private _paused;
    private _numPlays;
    constructor(apng: APNG, context: CanvasRenderingContext2D, autoPlay: boolean);
    /**
     * current frame number
     */
    get currentFrameNumber(): number;
    /**
     * current frame
     */
    get currentFrame(): Frame;
    /**
     * move to next frame and render it on context
     *
     *  Use this method to manual, frame by frame, rendering.
     */
    renderNextFrame(): void;
    /**
     * playback is paused
     */
    get paused(): boolean;
    /**
     * playback is ended
     */
    get ended(): boolean;
    /**
     * start or resume playback
     */
    play(): void;
    /**
     * pause playback
     */
    pause(): void;
    /**
     * stop playback and rewind to start
     */
    stop(): void;
}
interface Player {
    /**
     * playback started
     */
    addListener(event: 'play', listener: () => void): this;
    /**
     * frame played
     */
    addListener(event: 'frame', listener: (currentFrameNumber: number) => void): this;
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
    removeListener(event: 'frame', listener: (currentFrameNumber: number) => void): this;
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
    prependListener(event: 'frame', listener: (currentFrameNumber: number) => void): this;
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
    prependOnceListener(event: 'frame', listener: (currentFrameNumber: number) => void): this;
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

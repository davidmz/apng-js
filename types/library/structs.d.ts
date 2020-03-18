import Player from './player';
export declare class APNG {
    /**
     * with of canvas, pixels
     */
    width: number;
    /**
     * height of canvas, pixels
     */
    height: number;
    /**
     * number of times to loop animation (0 = infinite looping)
     */
    numPlays: number;
    /**
     * total duration of one loop in milliseconds
     */
    playTime: number;
    /**
     * array of frames
     */
    frames: Frame[];
    /**
     * create imageElement's for all frames
     */
    createImages(): Promise<void[]>;
    /**
     * Create Player on given context and start playing if autoPlay is true.
     * @param context CanvasRenderingContext2D
     * @param autoPlay default is `false`
     */
    getPlayer(context: CanvasRenderingContext2D, autoPlay?: boolean): Promise<Player>;
}
export declare class Frame {
    /**
     * left offset of frame, pixels
     */
    left: number;
    /**
     * top offset of frame, pixels
     */
    top: number;
    /**
     * with of frame, pixels
     */
    width: number;
    /**
     * height of frame, pixels
     */
    height: number;
    /**
     * time to show frame in milliseconds
     */
    delay: number;
    /**
     * type of dispose operation (see APNG spec.)
     */
    disposeOp: number;
    /**
     * type of blend operation (see APNG spec.)
     */
    blendOp: number;
    /**
     * image data in PNG (not animated) format
     */
    imageData: Blob | null;
    /**
     * image data rendered as HTML Image element.
     *
     * This field is null right after 'parse', use `Frame.createImage()` or `APNG.createImages()` to fill this field.
     */
    imageElement: HTMLImageElement | null;
    dataParts?: Array<Uint8Array>;
    /**
     * create imageElement for this frame
     */
    createImage(): Promise<void>;
}

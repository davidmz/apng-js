import Player from './player';

/**
 * @property {number} currFrameNumber
 * @property {Frame} currFrame
 * @property {boolean} paused
 * @property {boolean} ended
 */
export class APNG {
    /** @type {number} */
    width = 0;
    /** @type {number} */
    height = 0;
    /** @type {number} */
    numPlays = 0;
    /** @type {number} */
    playTime = 0;
    /** @type {Frame[]} */
    frames = [];

    /**
     *
     * @return {Promise.<*>}
     */
    createImages() {
        return Promise.all(this.frames.map(f => f.createImage()));
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     * @param {boolean} autoPlay
     * @return {Promise.<Player>}
     */
    getPlayer(context, autoPlay = false) {
        return this.createImages().then(() => new Player(this, context, autoPlay));
    }
}

export class Frame {
    /** @type {number} */
    left = 0;
    /** @type {number} */
    top = 0;
    /** @type {number} */
    width = 0;
    /** @type {number} */
    height = 0;
    /** @type {number} */
    delay = 0;
    /** @type {number} */
    disposeOp = 0;
    /** @type {number} */
    blendOp = 0;
    /** @type {Blob} */
    imageData = null;
    /** @type {HTMLImageElement} */
    imageElement = null;

    createImage() {
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
                reject(new Error("Image creation error"));
            };
            this.imageElement.src = url;
        });
    }
}

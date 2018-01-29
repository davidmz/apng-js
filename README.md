# apng-js

`apng-js` provides functions for parse and render animated PNG's 
([APNG](https://en.wikipedia.org/wiki/APNG)).
 
## Demo page

[https://davidmz.github.io/apng-js/](https://davidmz.github.io/apng-js/)
 
## Usage

### Using Babel/Webpack

This library is written using ES2015 Javascript. If you are already using [babel](https://babeljs.io), you can easily integrate this library with the following steps.

`npm install apng-js`

then, import `parseAPNG` into your app...

```JavaScript
import parseAPNG from 'apng-js'

const apng = parseAPNG( require('./images/elephant.png') );

```



### Using plain old Javascript

Using a module loader like [requirejs](http://requirejs.org/):

- Install the library: `npm install apng-js`

Then, import the compiled library (located @ `lib/index.js` using requirejs:

```JavaScript
<script src="path/to/require.min.js"></script>
<script>

/// require the compiled js library from its location in the node_modules folder:
require(['./node_modules/apng-js/lib/index'], function(parseAPNGLib) {
    
    var parseAPNG = parseAPNGLib.default
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
             parseAPNG(this.response);      // parse the response
        }
    }
    xhr.open('GET', '.images/elephant.png', true);   // load an .apng via ajax
    xhr.responseType =  "arraybuffer";      // use arraybuffer response
    xhr.send(); 


});
</script>
```

## API

### parseAPNG(buf: ArrayBuffer): (APNG|Error)

**Default exported function**. Parses APNG data, returns APNG object (see below) or Error.
This function can be used in node.js environment.
Object methods relies on browser features (canvas, requestAnimationFrame…)
and should work only in browser.

Usage:
```JavaScript
import parseAPNG from 'apng-js';

const apng = parseAPNG(buffer);
if (apng instanceof Error) {
    // handle error
}
// work with apng object
```

### isNotPNG(err: Error): boolean

Checks if Error is 'Not a PNG' error.

### isNotAPNG(err: Error): boolean

Checks if Error is 'Not an animated PNG' error.

## Classes

### APNG
Structure of APNG file.
```JavaScript
class APNG {
    width: number     // with of canvas, pixels
    height: number    // height of canvas, pixels
    numPlays: number  // number of times to loop animation (0 = infinite looping)
    playTime: number  // total duration of one loop in milliseconds
    frames: Frame[]   // array of frames

    // Methods
    createImages(): Promise // create imageElement's for all frames
    getPlayer(context: CanvasRenderingContext2D, autoPlay: boolean = false): Promise.<Player>
        // Create Player (see below) on given context and start playing
        // if autoPlay is true.
}
````

### Frame
Individual APNG frame.
```JavaScript
class Frame {
    left: number      // left offset of frame, pixels
    top: number       // top offset of frame, pixels
    width: number     // with of frame, pixels
    height: number    // height of frame, pixels
    delay: number     // time to show frame in milliseconds
    disposeOp: number // type of dispose operation (see APNG spec.)
    blendOp: number   // type of blend operation (see APNG spec.)
    imageData: Blob   // image data in PNG (not animated) format
    
    imageElement: HTMLImageElement // image data rendered as HTML Image element.
                                   // This field is null right after 'parse',
                                   // use Frame.createImage() or APNG.createImages()
                                   // to fill this field.
                                   
    // Methods
    createImage(): Promise // create imageElement for this frame
}
```
### Player
Player renders APNG frames on given rendering context and plays APNG animation.
```JavaScript
class Player {
    context: CanvasRenderingContext2D
    playbackRate: number = 1.0 // animation playback rate
           
    currFrameNumber: number // current frame number (read only)
    currFrame: Frame        // current frame (read only)
    paused: boolean         // playback is paused (read only)
    ended: boolean          // playback is ended (read only)

    // Methods
    play()      // start or resume playback
    pause()     // pause playback
    stop()      // stop playback and rewind to start
    
    renderNextFrame()       // move to next frame and render it on context
                            // Use this method to manual, frame by frame, rendering.
}
```

Player object is an [EventEmitter](https://nodejs.org/api/events.html). You can listen to following events:

  * **play** — playback started;
  * **pause** — playback paused;
  * **stop** — playback stopped;
  * **end** — playback ended (for APNG with finite count of plays).

import { PNG } from "pngjs";

function grayScale(this: PNG): Buffer {
    loopPixels.call(this, function (this: PNG, i: number) {
        const grayScale = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        //console.log(grayScale);
        this.data[i] = grayScale;
        this.data[i + 1] = grayScale;
        this.data[i + 2] = grayScale;
    });
    return this.data;
}

function sepia(this: PNG): Buffer {
    loopPixels.call(this, function(this: PNG, i: number) { 
        const newRed = 0.393 * this.data[i] + 0.769 * this.data[i + 1] + 0.189 * this.data[i + 2];
        const newGreen = 0.349 * this.data[i] + 0.686 * this.data[i + 1] + 0.168 * this.data[i + 2];
        const newBlue = 0.272 * this.data[i] + 0.534 * this.data[i + 1] + 0.131 * this.data[i + 2];

        this.data[i] = Math.min(newRed, 255);
        this.data[i + 1] = Math.min(newGreen, 255);
        this.data[i + 2] = Math.min(newBlue, 255);
    });
    return this.data;
}

function dithering(this: PNG): Buffer {
    let previousError = 0;
    loopPixels.call(this, function(this: PNG, i: number) {
        const grayScale = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        if (grayScale > 127) {
            if (previousError === 0) {
                setAllPixels(this, i, 255);
                previousError = grayScale - 255;
            }
            else {
                setAllPixels(this, i, grayScale - previousError);
                previousError = 0;
            } 
        } else {
            if (previousError === 0) {
                setAllPixels(this, i, 0);
                previousError = grayScale;
            } else {
                setAllPixels(this, i, grayScale + previousError);
                previousError = 0;
            }
        } 
    });
    return this.data;
};

function setAllPixels(
    png: PNG,
    i: number,
    newValue: number,
): void {
    png.data[i] = newValue;
    png.data[i + 1] = newValue;
    png.data[i + 2] = newValue;
}


function loopPixels(
    this: PNG,
    transformation: (this: PNG, i: number) => void
): Buffer {
    for (let i = 0; i < this.data.length; i += 4) {
        transformation.call(this, i);
    }
    return this.data;
}


export default {
    grayScale,
    sepia,
    dithering,
}

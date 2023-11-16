export function grayScale(data: Buffer): Buffer {
    for (let i = 0; i < data.length; i += 4) {
        const grayScale = (data[i] + data[i + 1] + data[i + 2]) / 3;

        data[i] = grayScale;
        data[i + 1] = grayScale;
        data[i + 2] = grayScale;
    }

    return data;
}

export function lark(data: Buffer): Buffer {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] * 1.2, 255);
        data[i + 1] = Math.min(data[i + 1] * 1.1, 255);
        data[i + 2] = Math.min(data[i + 2] * 0.9, 255);
    }

    return data;
}

export function sepia(data: Buffer): Buffer {
    for (let i = 0; i < data.length; i += 4) {
        const newRed = 0.393 * data[i] + 0.769 * data[i + 1] + 0.189 * data[i + 2];
        const newGreen = 0.349 * data[i] + 0.686 * data[i + 1] + 0.168 * data[i + 2];
        const newBlue = 0.272 * data[i] + 0.534 * data[i + 1] + 0.131 * data[i + 2];

        data[i] = Math.min(newRed, 255);
        data[i + 1] = Math.min(newGreen, 255);
        data[i + 2] = Math.min(newBlue, 255);
    }

    return data;
}

export function dithering(data: Buffer): Buffer {
    let previousError = 0;
    for (let i = 0; i < data.length; i += 4) {
        const grayScale = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let newPixelValue;

        if (grayScale > 127) {
            newPixelValue = previousError === 0 ? 255 : grayScale - previousError;
            previousError = previousError === 0 ? grayScale - newPixelValue : 0;
        } else {
            newPixelValue = previousError === 0 ? 0 : grayScale + previousError;
            previousError = previousError === 0 ? grayScale + newPixelValue : 0;
        }

        data[i] = newPixelValue;
        data[i + 1] = newPixelValue;
        data[i + 2] = newPixelValue;
    }

    return data;
};

export function inverted(data: Buffer): Buffer {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }

    return data;
}

function setRGBValues(
    data: Buffer,
    i: number,
    newValue: number,
): void {
    data[i] = newValue;
    data[i + 1] = newValue;
    data[i + 2] = newValue;
}

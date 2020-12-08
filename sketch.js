
let sourceImage; // Declare variable 'img'.
let resultImage;
let success;

// make maps with https://www.piskelapp.com/
// run with python -m http.server

function preload() {
  sourceImage = loadImage('assets/map16.png');
}


function setup() {
  createCanvas(480, 480);
  // 

  // sourceImage = createImage(230, 230);
  // sourceImage.loadPixels();
  // for (let x = 0; x < sourceImage.width; x++) {
  //   for (let y = 0; y < sourceImage.height; y++) {
  //     let a = map(y, 0, sourceImage.height, 255, 0);
  //     sourceImage.set(x, y, [0, 153, 204, a]);
  //   }
  // }
  // sourceImage.updatePixels();

  // sourceImage = loadImage('assets/map.png');
  sourceImage.loadPixels();

  const width = sourceImage.width;
  const height = sourceImage.height;
  const destWidth = 128;
  const destHeight = 128;

  // let sourceImageData[sourceImage.width * sourceImage.height * 4];
  // var sourceImageData = new Array(sourceImage.width * sourceImage.height * 4);
  var sourceImageData = new Uint8Array(sourceImage.width * sourceImage.height * 4);

  let i = 0;
  for (let x = 0; x < sourceImage.width; x++) {
    for (let y = 0; y < sourceImage.height; y++) {
      let color = sourceImage.get(x, y);
      let r = color[0];
      let g = color[1];
      let b = color[2];
      let a = color[3];
      // console.log('c');
      sourceImageData[i] = r;
      sourceImageData[i + 1] = g;
      sourceImageData[i + 2] = b;
      sourceImageData[i + 3] = a;
      i += 4;
    }
  }
  

  // data : The RGBA data of the source image.
  // dataWidth : The width of the source image.
  // dataHeight : The height of the source image.
  // N : Size of the patterns.
  // width : The width of the generation (in pixels).
  // height : The height of the generation (in pixels).
  // periodicInput : Whether the source image is to be considered as periodic / as a repeatable texture.
  // periodicOutput : Whether the generation should be periodic / a repeatable texture.
  // symmetry : Allowed symmetries from 1 (no symmetry) to 8 (all mirrored / rotated variations)
  // ground : Id of the specific pattern to use as the bottom of the generation (learn more)

  var model = new OverlappingModel(sourceImageData, width, height, 3, destWidth, destHeight, false, false, 8, 0);
  success = model.generate(Math.random);

  if (success) {
    console.log('Success');
    const result = model.graphics();

    // new Jimp(destWidth, destHeight, function (err, image) {
    //   image.bitmap.data = Buffer.from(result.buffer);
    //   image.write('./output/overlapping-model.png');
    // });

    // resultImage = result.buffer;
    resultImage = createImage(destWidth, destHeight);
    resultImage.loadPixels();
    let i = 0;
    for (let x = 0; x < destWidth; x++) {
      for (let y = 0; y < destHeight; y++) {
        // let a = map(y, 0, resultImage.height, 255, 0);
        // RGBA
        let r = result[i];
        let g = result[i + 1];
        let b = result[i + 2];
        let a = result[i + 3];

        // image is in 255, 255, 255, 255
        resultImage.set(x, y, [r,g,b,a]);
        i += 4;
      }
    }
    resultImage.updatePixels();
  } else {
    console.log('The generation ended in a contradiction');
  }

}

function draw() {
  background(220);
  // ellipse(50,50,80,80);

  let scale = 3;

  noSmooth();

  image(sourceImage, 20, 20, sourceImage.width * scale, sourceImage.height * scale);
  
  if (resultImage) {
    // scale(2);
    // pixelDensity(5);
    
    image(resultImage, 20+4+sourceImage.width * scale, 20, resultImage.width * scale, resultImage.height * scale);
  }

  smooth(4);



}
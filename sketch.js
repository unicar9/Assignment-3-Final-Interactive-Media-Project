let images = [];
let stars = [];

let thumbnails = [];
let graphics = [];

let decoratingObjs = [];

const bgColors = ["#2A1C52", "#7027A0", "#120358", "#3B1449"];
const planeStrokeColors = ["#f800b7", "#09CDFE", "#FF76FF", "#1481EF"];
const moonColors = ["#f4631f", "#C32BAD", "#FF124F", "#ED2685"];
const musicBarColors = ["#03B3FE", "#FFF338", "#0CECDD", "#F1E52A"];

let colorIndex = 0;

let bgColor = bgColors[colorIndex];
let planeStroke = planeStrokeColors[colorIndex];
let moonColor = moonColors[colorIndex];
let musicBarColor = musicBarColors[colorIndex];

let mic, pg, angleOffset, boxNumber;

let yoff = 0.0;
let startAnimation = false;

let angle = 0;
let index = 0;

function setup() {
  // create canvas
  const c = createCanvas(windowWidth, windowHeight, WEBGL);
  pg = createGraphics(windowWidth, windowHeight);
  // background(bgColor);

  // Add an event for when a file is dropped onto the canvas
  userStartAudio();

  // create a mic audio input
  mic = new p5.AudioIn();
  mic.start();

  for (var i = 0; i < random(300, 600); i++) {
    stars[i] = new Star();
  }

  angleOffset = random(0.01, 0.06);
  boxNumber = Math.floor(random(10, 20));
}

function draw() {
  background(bgColor);

  thumbnails.forEach((img, i) => {
    image(img.img, -width / 2 + i * 200, -250, img.w, img.h);
  });

  if (!startAnimation) return;
  ambientLight(200);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

  pointLight(250, 250, 250, locX, locY, 100);

  fill(moonColor);

  push();
  translate(0, -100);
  noStroke();

  sphere(100);
  pop();

  angle += angleOffset;
  index += 0.01;

  // the plane
  push();
  translate(-width / 2, height * 0.35);
  rotateX(PI / 2);

  for (let x = 0; x < width + 35; x += 35) {
    for (let y = 0; y < 300; y += 35) {
      push();
      translate(x, y);
      noFill();

      strokeWeight(2);
      stroke(planeStroke);

      rect(0, 0, 35);
      pop();
    }
  }
  pop();
  // the plane

  // graphics (audio visulisor)
  let vol = mic.getLevel();
  let scale = map(vol, 0, 1, 0.5, 1);
  // pg.background(bgColor);
  let xoff = 0;
  for (let x = -width / 2; x <= width / 2; x += 30) {
    let y = map(noise(xoff, yoff), 0, 1, -80, -300);

    fill(musicBarColor);
    noStroke();
    rect(x, height * 0.35, 10, y * scale);
    xoff += 0.1;
  }

  yoff += 0.003;

  // the glitched images
  graphics.forEach((g, i) => {
    let img = images[i];
    img.drawGlitch(g);
    image(g, img.posX, img.posY);
  });

  push();
  translate(-width / 2, -height / 2);
  for (let i = 0; i < stars.length; i++) {
    stars[i].drawStar();
    stars[i].blink();
  }
  pop();

  // decorating objects
  decoratingObjs.forEach((d) => {
    d.rotate();
  });

  rotateBox(boxNumber);
}

function gotFile(file) {
  let positionY = random(-0.5 * windowHeight, 0.5 * windowHeight - 400);
  // If it's an image file
  if (file.type === "image/png" || file.type === "image/jpeg") {
    // Create an image DOM element but don't show it
    const data = URL.createObjectURL(file);

    let img = createImg(data, "elems", "anonymous", () => {
      // Draw the image onto the canvas
      let imgW = 200;
      let imgH = (200 * img.height) / img.width;
      thumbnails.push({ img: img, w: imgW, h: imgH });
      images.push(
        new GlitchedImage(
          img,
          -0.5 * windowWidth + images.length * random(180, 250),
          positionY,
          imgW,
          imgH
        )
      );
      const pGraphic = createGraphics(imgW, imgH);
      graphics.push(pGraphic);
    });
  } else {
    console.log("Not an image file!");
  }
}

function rotateBox(num) {
  rotateY(angle * 0.3);

  Array(num)
    .fill(1)
    .map((_) => {
      rotateY((PI * 2) / num);
      push();
      translate(0, -100, 100 + sin(index + mouseX / 500) * 200);
      rotateY(angle * 0.5);
      rotateX(angle * 0.2);
      rotateZ(angle * 0.4);
      fill(musicBarColor);
      box(10, 10, 80);
      pop();
    });
}

function mousePressed() {
  decoratingObjs.push(new Obj3d(mouseX, mouseY));
}

function keyPressed() {
  // pressing S key
  if (keyCode === 83) {
    saveCanvas("vaporwave-art", "jpg");
  }
}

windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
};

class Obj3d {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.ringRadius = random(10, 30);
    this.tubeRadius = 10;
    this.angleOffset = random(0, 0.5);
    this.rotatingSpeed = random(0.01, 0.05);
  }

  rotate() {
    push();
    translate(this.posX - 0.5 * width, this.posY - 0.5 * height);
    rotateX(this.angleOffset + frameCount * this.rotatingSpeed);
    rotateY(this.angleOffset + frameCount * this.rotatingSpeed);
    rotateZ(this.angleOffset + frameCount * this.rotatingSpeed);
    fill(planeStroke);
    torus(this.ringRadius, this.tubeRadius);
    pop();
  }
}

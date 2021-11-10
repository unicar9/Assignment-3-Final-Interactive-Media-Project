window.addEventListener("dragover", (e) => {
  e.preventDefault();
});

window.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (e.dataTransfer.items[i].kind === "file") {
        const file = e.dataTransfer.items[i].getAsFile();

        gotFile(file);
        document.querySelector(".images-wrapper").textContent = "";
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      gotFile(file);
    }
  }
});

const wrapper = document.querySelector(".wrapper");

const upload = document.getElementById("upload");
const audioPlayer = document.getElementById("audioPlayer");

const btn = document.querySelector(".btn");

const form = document.querySelector("form");

upload.addEventListener("change", (e) => {
  audioPlayer.src = URL.createObjectURL(e.target.files[0]);
});

btn.addEventListener("click", () => {
  startAnimation = true;
  thumbnails = [];
  audioPlayer.play();
  wrapper.style.display = "none";
});

form.addEventListener("submit", (e) => {
  const data = new FormData(form);
  colorIndex = data.get("color_scheme");

  bgColor = bgColors[colorIndex];
  planeStroke = planeStrokeColors[colorIndex];
  moonColor = moonColors[colorIndex];
  musicBarColor = musicBarColors[colorIndex];
  e.preventDefault();
});

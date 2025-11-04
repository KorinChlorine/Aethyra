const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

// Initialize classes
slides.forEach((slide, index) => {
  slide.classList.remove("left", "center", "right");
  if (index === 0) slide.classList.add("center");
  else if (index === 1) slide.classList.add("right");
  else if (index === totalSlides - 1) slide.classList.add("left");
});

function rotateSlides() {
  slides.forEach(slide => {
    // Get current state
    if (slide.classList.contains("left")) {
      slide.classList.remove("left"); // disappear/offscreen
    } else if (slide.classList.contains("center")) {
      slide.classList.remove("center");
      slide.classList.add("left"); // move to left peek
    } else if (slide.classList.contains("right")) {
      slide.classList.remove("right");
      slide.classList.add("center"); // move to center
    }
  });

  // Find next slide to become .right
  const currentCenters = Array.from(slides).find(slide => slide.classList.contains("center"));
  const nextIndex = (Array.from(slides).indexOf(currentCenters) + 1) % totalSlides;
  slides[nextIndex].classList.add("right");
}

// Auto rotate every 4 seconds
setInterval(rotateSlides, 4000);

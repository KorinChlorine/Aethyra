// windEffect.js

export function initWindScrollEffect() {
  const sections = document.querySelectorAll("section");
  const leaves = document.querySelectorAll(".leaf");
  let currentScroll = 0;
  let targetScroll = 0;
  const ease = 0.08;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windStrength = Math.sin(scrollY * 0.002) * 20;

    sections.forEach((sec, index) => {
      const offset = scrollY * 0.1 * (index % 2 === 0 ? 1 : -1) + windStrength;
      sec.style.transform = `translateX(${offset}px)`;
    });

    leaves.forEach((leaf, i) => {
      const offsetX = Math.sin(scrollY * 0.005 + i) * 40;
      const offsetY = Math.cos(scrollY * 0.003 + i) * 20;
      leaf.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${
        offsetX / 2
      }deg)`;
    });
  });

  function smoothScroll() {
    targetScroll = window.scrollY;
    currentScroll += (targetScroll - currentScroll) * ease;
    window.scrollTo(0, currentScroll);
    requestAnimationFrame(smoothScroll);
  }
  smoothScroll();
}
window.addEventListener("load", initWindScrollEffect);

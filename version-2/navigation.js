const header = document.querySelector('#site-header');
const links = [...header.querySelectorAll('a[href^="#"]')];
const sections = links.map(link => document.getElementById(link.hash.slice(1)));

let currentLink = links[0];
let scheduledFrame = null;

function updateNavigation() {
  scheduledFrame = null;
  const readingLine = header.getBoundingClientRect().bottom + 36;
  const nearPageEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  let index = 0;

  for (let position = 1; position < sections.length; position += 1) {
    if (sections[position].getBoundingClientRect().top <= readingLine) {
      index = position;
    }
  }

  if (nearPageEnd) index = sections.length - 1;
  if (links[index] === currentLink) return;

  currentLink.removeAttribute('aria-current');
  currentLink = links[index];
  currentLink.setAttribute('aria-current', 'location');
}

function scheduleUpdate() {
  if (scheduledFrame === null) scheduledFrame = requestAnimationFrame(updateNavigation);
}

new ResizeObserver(() => {
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  scheduleUpdate();
}).observe(header);

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
updateNavigation();

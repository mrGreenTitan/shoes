const heroBtnLeft = document.getElementById("heroBtnLeft");
const heroBtnRight = document.getElementById("heroBtnRight");

let heroItem = document.querySelector(".product-item-wrap");
let footItem = document.querySelector(".item-prew-wrap");

let heroImg = heroItem.querySelector("img");
let footImg = footItem.querySelector("img");

const products = ["img/items/item-1.webp", "img/items/item-2.webp", "img/items/item-3.webp", "img/items/item-4.webp"];

let currentIndex = 0;
let isAnimating = false;

heroBtnLeft.addEventListener("click", function () {
  if (isAnimating) return;
  isAnimating = true;

  // 1. Создаем клон и получаем целевую позицию
  let clone = createClone(footItem);
  let targetPos = flyPos(heroItem);

  // 2. Находим СТАРТОВЫЙ центр клона (он совпадает с футером)
  const footRect = footItem.getBoundingClientRect();
  const startX = footRect.left + footRect.width / 2;
  const startY = footRect.top + footRect.height / 2;

  // 3. Вычисляем дистанцию полета (Дельта X и Дельта Y)
  const moveX = targetPos.x - startX;
  const moveY = targetPos.y - startY;

  footItem.classList.add("show", "move");

  // 4. Запускаем анимацию
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.transition = "transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease";

      clone.style.transform = `translate(${moveX}px, ${moveY}px)`;
      clone.style.opacity = "0";
    });
  });

  // Считаем индексы правильно:
  let nextIndex = (currentIndex + 1) % products.length;
  let nextPreviewIndex = (nextIndex + 1) % products.length;

  // Меняем картинку в футере на следующий товар по кругу
  footImg.src = products[nextPreviewIndex];

  // Обновляем текущий индекс
  currentIndex = nextIndex;

  setTimeout(() => {
    footItem.classList.remove("show", "move");
  }, 400);

  // 5. Завершение анимации
  clone.addEventListener("transitionend", function handler(e) {
    if (e.propertyName !== "transform") return;
    clone.removeEventListener("transitionend", handler);

    clone.remove();
    isAnimating = false;
  });
});

function flyPos(el) {
  const rect = el.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: rect.width,
    height: rect.height,
  };
}

function createClone(el) {
  const rect = el.getBoundingClientRect();
  const computed = window.getComputedStyle(el);
  const clone = el.cloneNode(true);

  Object.assign(clone.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transformOrigin: "center center",
    transform: computed.transform,
    opacity: computed.opacity,
    margin: "0",
    pointerEvents: "none",
    zIndex: "9999",
  });

  document.body.appendChild(clone);

  return clone;
}

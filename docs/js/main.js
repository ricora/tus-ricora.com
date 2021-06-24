const toggleHeaders = document.querySelectorAll(".toggle h4");
const toggleInners = document.querySelectorAll(".toggle .inner");

const cycle = async (ms, f) => {
  const process = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    const conti = f();
    if (conti) {
      await process();
    }
  };
  await process();
};

// CSS Property Transition
const cssPropTrans = async (elm, cssProp, ms, from, to, unit = (v) => { return v }) => {
  let value = from;
  await cycle(1000 / 60, () => {
    if (from <= value && value <= to || to <= value && value <= from) {
      elm.style[cssProp] = unit(value);
      value += (to - from) / (ms / (1000 / 60));
      return true;
    } else {
      elm.style[cssProp] = unit(to);
      return false;
    }
  });
};

const getHeight = (elm) => {
  const clone = elm.cloneNode(true);
  elm.parentNode.appendChild(clone);
  clone.style.display = "block";
  clone.style.height = "auto";
  clone.style.visibility = "hidden";
  const height = clone.offsetHeight;
  elm.parentNode.removeChild(clone);
  return height;
};

const openParagraph = async (i) => {
  const inner = toggleInners[i];
  const header = toggleHeaders[i];
  const height = getHeight(inner);
  if (!inner.style.isEasing) {
    inner.style.isEasing = true;
    inner.style.opacity = 0;
    inner.style.display = "block";
    await Promise.all([
      cssPropTrans(inner, "opacity", 160, 0, 1.0),
      cssPropTrans(inner, "height", 160, 0, height, (v) => `${v}px`),
      cssPropTrans(header.downIcon, "transform", 160, 0, 180, (v) => `rotate(${v}deg)`),
    ]);
    inner.style.isEasing = false;
  }
};

const closePragraph = async (i) => {
  const inner = toggleInners[i];
  const header = toggleHeaders[i];
  const height = getHeight(inner);
  if (!inner.style.isEasing) {
    inner.style.isEasing = true;
    await Promise.all([
      cssPropTrans(inner, "opacity", 160, 1.0, 0),
      cssPropTrans(inner, "height", 160, height, 0, (v) => `${v}px`),
      cssPropTrans(header.downIcon, "transform", 160, 180, 0, (v) => `rotate(${v}deg)`),
    ]);
    inner.style.display = "none";
    inner.style.isEasing = false;
  }
}

toggleHeaders.forEach((_, i) => {
  const downIcon = document.createElement("img");
  downIcon.setAttribute("src", "./icon/down.svg");
  toggleHeaders[i].appendChild(downIcon);
  toggleHeaders[i].downIcon = toggleHeaders[i].lastElementChild;

  toggleHeaders[i].addEventListener("click", () => {
    if (toggleInners[i].offsetHeight === 0) {
      openParagraph(i);
    } else {
      closePragraph(i);
    }
  });
});

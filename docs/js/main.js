const toggleHeaders = document.querySelectorAll(".toggle h4");
const toggleParagraphs = document.querySelectorAll(".toggle p");

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

const openParagraph = async (i) => {
  const p = toggleParagraphs[i];
  const h = toggleHeaders[i];
  if (!p.style.isEasing) {
    p.style.isEasing = true;
    p.style.opacity = 0;
    p.style.display = "block";
    await Promise.all([
      cssPropTrans(p, "opacity", 160, 0, 1.0),
      cssPropTrans(p, "lineHeight", 160, 0, 2.0),
      cssPropTrans(h.downIcon, "transform", 160, 0, 180, (v) => `rotate(${v}deg)`),
    ]);
    p.style.isEasing = false;
  }
};

const closePragraph = async (i) => {
  const p = toggleParagraphs[i];
  const h = toggleHeaders[i];
  if (!p.style.isEasing) {
    p.style.isEasing = true;
    await Promise.all([
      cssPropTrans(p, "opacity", 160, 1.0, 0),
      cssPropTrans(p, "lineHeight", 160, 2.0, 0),
      cssPropTrans(h.downIcon, "transform", 160, 180, 0, (v) => `rotate(${v}deg)`),
    ]);
    p.style.display = "none";
    p.style.isEasing = false;
  }
}

toggleHeaders.forEach((_, i) => {
  const downIcon = document.createElement("img");
  downIcon.setAttribute("src", "./icon/down.svg");
  toggleHeaders[i].appendChild(downIcon);
  toggleHeaders[i].downIcon = toggleHeaders[i].lastElementChild;

  toggleHeaders[i].addEventListener("click", () => {
    if (toggleParagraphs[i].style.display === "none") {
      openParagraph(i);
    } else {
      closePragraph(i);
    }
  });
});

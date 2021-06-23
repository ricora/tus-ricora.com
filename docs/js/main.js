const activityListHeaders = document.querySelectorAll(".topic.activity li h4");
const activityListParagraphs = document.querySelectorAll(".topic.activity li p");

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
const cssPropTrans = async (elm, cssProp, from, to, ms) => {
  let value = Number(elm.style[cssProp]) || from;
  await cycle(1000 / 60, () => {
    if (from <= value && value <= to || to <= value && value <= from) {
      elm.style[cssProp] = value;
      value += (to - from) / (ms / (1000 / 60));
      return true;
    } else {
      elm.style[cssProp] = to;
      return false;
    }
  });
};

const openParagraph = async (p) => {
  if (!p.style.isEasing) {
    p.style.isEasing = true;
    p.style.opacity = 0;
    p.style.display = "block";
    await Promise.all([
      cssPropTrans(p, "opacity", 0, 1.0, 160),
      cssPropTrans(p, "lineHeight", 0, 2.0, 160),
    ]);
    p.style.isEasing = false;
  }
};

const closePragraph = async (p) => {
  if (!p.style.isEasing) {
    p.style.isEasing = true;
    await Promise.all([
      cssPropTrans(p, "opacity", 1.0, 0, 160),
      cssPropTrans(p, "lineHeight", 2.0, 0, 160),
    ]);
    p.style.display = "none";
    p.style.isEasing = false;
  }
}

activityListHeaders.forEach((_, i) => {
  activityListHeaders[i].addEventListener("click", () => {
    if (activityListParagraphs[i].style.display === "none") {
      openParagraph(activityListParagraphs[i]);
    } else {
      closePragraph(activityListParagraphs[i]);
    }
  });
});

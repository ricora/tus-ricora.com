const activityListHeaders = document.querySelectorAll(".topic.activity li h4");
const activityListParagraphs = document.querySelectorAll(".topic.activity li p");
const joinButton = document.querySelector(".fixed-screen.join a");

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
const cssPropTrans = async (elm, cssProp, ms, from, to, unit = "") => {
  let value = Number(elm.style[cssProp].slice(0, -unit.length)) || from;
  await cycle(1000 / 60, () => {
    if (from <= value && value <= to || to <= value && value <= from) {
      elm.style[cssProp] = `${value}${unit}`;
      value += (to - from) / (ms / (1000 / 60));
      return true;
    } else {
      elm.style[cssProp] = `${to}${unit}`;
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
      cssPropTrans(p, "opacity", 160, 0, 1.0),
      cssPropTrans(p, "lineHeight", 160, 0, 2.0),
    ]);
    p.style.isEasing = false;
  }
};

const closePragraph = async (p) => {
  if (!p.style.isEasing) {
    p.style.isEasing = true;
    await Promise.all([
      cssPropTrans(p, "opacity", 160, 1.0, 0),
      cssPropTrans(p, "lineHeight", 160, 2.0, 0),
    ]);
    p.style.display = "none";
    p.style.isEasing = false;
  }
}

const expandJoinButton = async () => {
  if (!joinButton.isEasing) {
    joinButton.isEasing = true;
    cssPropTrans(joinButton, "width", 160, 0, 100, "%");
    joinButton.isExpand = true;
    joinButton.isEasing = false;
  }
};

const collapseJoinButton = async () => {
  if (!joinButton.isEasing) {
    joinButton.isEasing = true;
    cssPropTrans(joinButton, "width", 160, 100, 0, "%");
    joinButton.isExpand = false;
    joinButton.isEasing = false;
  }
};

activityListHeaders.forEach((_, i) => {
  activityListHeaders[i].addEventListener("click", () => {
    if (activityListParagraphs[i].style.display === "none") {
      openParagraph(activityListParagraphs[i]);
    } else {
      closePragraph(activityListParagraphs[i]);
    }
  });
});

joinButton.isExpand = false;
document.addEventListener("scroll", () => {
  scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  const pageMostBottom = scrollHeight - window.innerHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop >= pageMostBottom) {
    if (!joinButton.isExpand) {
      expandJoinButton();
    }
  } else {
    if (joinButton.isExpand) {
      collapseJoinButton();
    }
  }
});

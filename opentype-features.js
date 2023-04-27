function getTextNodes(node) {
  let textNodes = [];

  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    node.childNodes.forEach(child => {
      textNodes = textNodes.concat(getTextNodes(child));
    });
  }

  return textNodes;
}

const toggleFeatureButtons = [
  // ...list of feature button objects...

  { id: "toggle-kern", feature: '"kern" 1' },
  { id: "toggle-ligatures", feature: '"liga" 1' },
  { id: "toggle-swash", feature: '"swsh" 1' },
  { id: "toggle-calt", feature: '"calt" 1' },
  { id: "toggle-dlig", feature: '"dlig" 1' },
  { id: "toggle-hlig", feature: '"hlig" 1' },
  { id: "toggle-salt", feature: '"salt" 1' },
  { id: "toggle-titl", feature: '"titl" 1' },
  { id: "toggle-ss01", feature: '"ss01" 1' },
  { id: "toggle-ss02", feature: '"ss02" 1' },
  { id: "toggle-ss03", feature: '"ss03" 1' },
  { id: "toggle-ss04", feature: '"ss04" 1' },
  { id: "toggle-ss05", feature: '"ss05" 1' },
  { id: "toggle-ss06", feature: '"ss06" 1' },
  { id: "toggle-ss07", feature: '"ss07" 1' },
  { id: "toggle-ss08", feature: '"ss08" 1' },
  { id: "toggle-ss09", feature: '"ss09" 1' },
  { id: "toggle-ss10", feature: '"ss10" 1' },
  { id: "toggle-ss11", feature: '"ss11" 1' },
  { id: "toggle-ss12", feature: '"ss12" 1' },
  { id: "toggle-ss13", feature: '"ss13" 1' },
  { id: "toggle-ss14", feature: '"ss14" 1' },
  { id: "toggle-ss15", feature: '"ss15" 1' },
  { id: "toggle-ss16", feature: '"ss16" 1' },
  { id: "toggle-ss17", feature: '"ss17" 1' },
  { id: "toggle-ss18", feature: '"ss18" 1' },
  { id: "toggle-ss19", feature: '"ss19" 1' },
  { id: "toggle-ss20", feature: '"ss20" 1' },
  { id: "toggle-onum", feature: '"onum" 1' },
  { id: "toggle-frac", feature: '"frac" 1' }, // Added "frac" button listener
  { id: "toggle-tnum", feature: '"tnum" 1' }, // Added "tnum" button listener
  { id: "toggle-zero", feature: '"zero" 1' }, // Added "zero" button listener
  { id: "toggle-pnum", feature: '"pnum" 1' }, // Added "pnum" button listener
  { id: "toggle-smcp", feature: '"smcp" 1' }, // Added "smcp" button listener
  { id: "toggle-c2sc", feature: '"c2sc" 1' }, // Added "c2sc" button listener
];

toggleFeatureButtons.forEach(({ id, feature }) => {
  const button = document.getElementById(id);
  let isEnabled = false;

  button.addEventListener("click", () => {
    isEnabled = !isEnabled;
    toggleFeature(feature, isEnabled);
  });
});

const activeFeatures = new Set();

function toggleFeature(feature, isEnabled) {
  const selectedText = window.getSelection();
  if (selectedText && selectedText.rangeCount) {
    const range = selectedText.getRangeAt(0);

    if (isEnabled) {
      activeFeatures.add(feature);
    } else {
      activeFeatures.delete(feature);
    }

    const featureSettings = activeFeatures.size > 0 ? Array.from(activeFeatures).join(', ') : 'normal';

    const commonAncestor = range.commonAncestorContainer;
    let span;

    if (commonAncestor.nodeType === Node.TEXT_NODE) {
      span = document.createElement('span');
      range.surroundContents(span);
    } else if (commonAncestor.tagName === 'SPAN') {
      span = commonAncestor;
    } else {
      console.warn('Selection is not a text node or contained within a <span> element.');
      return;
    }

    span.style.fontFeatureSettings = featureSettings;
    selectedText.removeAllRanges();
    selectedText.addRange(range);
  }
}

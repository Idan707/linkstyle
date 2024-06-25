import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://www.linkedin.com/*"],
  all_frames: true
}

const UNICODE_MAP = {
  bold: {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
    'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
    'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
    'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
    'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  italic: {
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
    'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
    'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
    'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
    'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
  }
};

function injectFormatButtons() {
  const editorContainer = document.querySelector('.editor-container');
  
  if (editorContainer && !document.querySelector('.custom-format-buttons')) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'custom-format-buttons';
    buttonContainer.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 9999;
      display: flex;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      padding: 4px;
    `;

    const boldButton = createFormatButton('B', 'Bold');
    const italicButton = createFormatButton('I', 'Italic');

    buttonContainer.appendChild(boldButton);
    buttonContainer.appendChild(italicButton);

    editorContainer.appendChild(buttonContainer);
  }
}

function createFormatButton(text: string, title: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.title = title;
  button.style.cssText = `
    margin: 0 2px;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
    color: #5f6368;
    border: none;
    border-radius: 3px;
    font-weight: bold;
    font-size: 14px;
    transition: background-color 0.3s ease;
  `;
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#f1f3f4';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'transparent';
  });
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    formatText(title.toLowerCase() as 'bold' | 'italic');
  });
  return button;
}

function formatText(style: 'bold' | 'italic') {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    const unicodeText = applyUnicodeStyle(selectedText, style);

    const span = document.createElement('span');
    span.textContent = unicodeText;
    
    range.deleteContents();
    range.insertNode(span);

    // Move the cursor to the end of the inserted text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.setEndAfter(span);
    selection.addRange(newRange);

    // Trigger input event to ensure LinkedIn recognizes the change
    const editor = document.querySelector('.ql-editor[contenteditable="true"]');
    if (editor) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

function applyUnicodeStyle(text: string, style: 'bold' | 'italic'): string {
  return text.split('').map(char => UNICODE_MAP[style][char] || char).join('');
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        injectFormatButtons();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function init() {
  observeDOM();
  injectFormatButtons();
}

init();
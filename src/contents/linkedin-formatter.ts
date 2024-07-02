import type { PlasmoCSConfig } from "plasmo"

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (a: string, b: any, c?: any) => void
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PLASMO_PUBLIC_GTAG_ID?: string
  }
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
  all_frames: true
}

// Google Analytics setup
const GA_TRACKING_ID = process.env.PLASMO_PUBLIC_GTAG_ID || 'YOUR-GA-TRACKING-ID'

function loadGoogleAnalytics() {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID)
}

function sendGAEvent(action: string, category: string, label: string) {
  window.gtag('event', action, {
    'event_category': category,
    'event_label': label
  })
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
  },
  retro: {
    'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸', 'j': '🅹',
    'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃',
    'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉',
    'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹',
    'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃',
    'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉',
    '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾',
    '!': '❗', '?': '❓', '.': '⊡', ',': '⋮', ':': '∶', ';': '⋮', '-': '➖', '+': '➕', '*': '✱', '=': '🟰',
    '(': '❪', ')': '❫', '[': '❲', ']': '❳', '{': '❴', '}': '❵', '<': '❰', '>': '❱', '/': '➗', '\\': '➘',
    '|': '❘', '_': '▁', '@': '🌀', '#': '⯃', '$': '💲', '%': '💯', '^': '🔼', '&': '🔭', '~': '〰'
  }
};

const UNICODE_SYMBOLS = ['►', '✦', '◆', '❖', '◊', '♦', '⬥', '◈'];

function injectFormatButtons() {
    const shareBox = document.querySelector('.share-box');
    if (!shareBox) return;
  
    const editorContainer = shareBox.querySelector('.ql-editor[contenteditable="true"]');
    if (!editorContainer) return;
  
    let buttonContainer = shareBox.querySelector('.custom-format-buttons') as HTMLDivElement;
    
    if (!buttonContainer) {
      buttonContainer = document.createElement('div');
      buttonContainer.className = 'custom-format-buttons';
      buttonContainer.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 9999;
        display: flex;
        background-color: #005db6;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        padding: 4px;
      `;
  
      const boldButton = createFormatButton('B', 'Bold');
      const italicButton = createFormatButton('I', 'Italic');
      const retroButton = createFormatButton('R', 'Retro');
      const unicodeButton = createUnicodeButton('+', 'Unicode');
  
      buttonContainer.appendChild(boldButton);
      buttonContainer.appendChild(italicButton);
      buttonContainer.appendChild(retroButton);
      buttonContainer.appendChild(unicodeButton);
  
      shareBox.appendChild(buttonContainer);
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
      color: #fff;
      border: none;
      border-radius: 3px;
      font-weight: bold;
      font-size: 14px;
      transition: background-color 0.3s ease;
    `;
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#c7d7f6';
    });
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'transparent';
    });
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      formatText(title.toLowerCase() as 'bold' | 'italic' | 'retro');
      sendGAEvent('click', 'Formatting', title); // Send GA event
    });
    return button;
  }

function createUnicodeButton(text: string, title: string): HTMLButtonElement {
  const button = createFormatButton(text, title);
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleUnicodeDropdown(button);
  });
  return button;
}

function createUnicodeDropdown(): HTMLDivElement {
    const dropdown = document.createElement('div');
    dropdown.className = 'unicode-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 0;
      left: 100%;
      background-color: #759be5;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      padding: 4px;
      display: none;
      white-space: nowrap;
      margin-left: 5px;
    `;
  
    UNICODE_SYMBOLS.forEach(symbol => {
      const symbolButton = document.createElement('button');
      symbolButton.textContent = symbol;
      symbolButton.style.cssText = `
        margin: 0 2px;
        padding: 4px 8px;
        cursor: pointer;
        background: transparent;
        color: #e0e8f9;
        border: none;
        border-radius: 3px;
        font-size: 14px;
        transition: background-color 0.3s ease;
      `;
      symbolButton.addEventListener('mouseover', () => {
        symbolButton.style.backgroundColor = '#759be5';
      });
      symbolButton.addEventListener('mouseout', () => {
        symbolButton.style.backgroundColor = 'transparent';
      });
      symbolButton.addEventListener('click', () => insertUnicodeSymbol(symbol));
      dropdown.appendChild(symbolButton);
    });
  
    return dropdown;
  }

  function toggleUnicodeDropdown(button: HTMLButtonElement) {
    let dropdown = document.querySelector('.unicode-dropdown') as HTMLDivElement;
    if (!dropdown) {
      dropdown = createUnicodeDropdown();
      button.parentElement?.appendChild(dropdown);
    }
  
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'flex';
    } else {
      dropdown.style.display = 'none';
    }
  }

function insertUnicodeSymbol(symbol: string) {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    const formattedText = `${symbol} ${selectedText}`;

    range.deleteContents();
    const textNode = document.createTextNode(formattedText);
    range.insertNode(textNode);

    // Move the cursor to the end of the inserted text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(range.endContainer);
    newRange.setEndAfter(range.endContainer);
    selection.addRange(newRange);

    // Trigger input event to ensure LinkedIn recognizes the change
    const editor = document.querySelector('.ql-editor[contenteditable="true"]');
    if (editor) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Close the dropdown after inserting the symbol
  const dropdown = document.querySelector('.unicode-dropdown') as HTMLDivElement;
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function formatText(style: 'bold' | 'italic' | 'retro') {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    const formattedText = applyUnicodeStyle(selectedText, style);

    range.deleteContents();
    const textNode = document.createTextNode(formattedText);
    range.insertNode(textNode);

    // Move the cursor to the end of the inserted text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(range.endContainer);
    newRange.setEndAfter(range.endContainer);
    selection.addRange(newRange);

    // Trigger input event to ensure LinkedIn recognizes the change
    const editor = document.querySelector('.ql-editor[contenteditable="true"]');
    if (editor) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

function applyUnicodeStyle(text: string, style: 'bold' | 'italic' | 'retro'): string {
  return text.split('').map(char => UNICODE_MAP[style][char] || char).join('');
}
function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const shareBox = document.querySelector('.share-box');
          if (shareBox) {
            injectFormatButtons();
          } else {
            // Remove button container if share box is not present
            const buttonContainer = document.querySelector('.custom-format-buttons');
            if (buttonContainer) {
              buttonContainer.remove();
            }
          }
        }
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function init() {
    loadGoogleAnalytics();
    observeDOM();
    
    // Periodically check for the share box and inject buttons if necessary
    setInterval(() => {
      const shareBox = document.querySelector('.share-box');
      if (shareBox) {
        injectFormatButtons();
        sendGAEvent('view', 'UI', 'Share Box Loaded'); // Send GA event when share box is loaded
      }
    }, 1000);
  }
  
  init();
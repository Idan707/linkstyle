import type { PlasmoCSConfig } from "plasmo"
import { UNICODE_MAP, UNICODE_SYMBOLS } from "./unicode-map"
import { insertUnicodeSymbol, toUnicodeVariant } from './unicode-func';


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
        background: linear-gradient(135deg, #4ade80, #3b82f6);
        border-radius: 20px;
        padding: 2px;
      `;
  
      const boldButton = createFormatButton('B', 'Bold');
      const italicButton = createFormatButton('I', 'Italic');
      const retroButton = createFormatButton('R', 'Retro');
      const unicodeButton = createUnicodeButton('⦿', 'Unicode', 'Bullet Points');
  
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
      padding: 6px 10px;
      cursor: pointer;
      color: #000;
      border: none;
      border-radius: 16px;
      font-weight: 700;
      font-size: 12px;
    `;
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = 'rgba(255,255,255,0.4)';
    });
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'transparent';
    });
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      formatText(title.toLowerCase() as 'bold' | 'italic' | 'retro');
    });
    return button;
  }



  
function createUnicodeButton(text: string, title: string, tooltip?: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.title = tooltip || title;
  button.style.cssText = `
    margin: 0 2px;
    padding: 6px 10px;
    cursor: pointer;
    color: #000;
    border: none;
    border-radius: 16px;
    font-weight: 700;
    font-size: 14px;
  `;
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'rgba(255,255,255,0.4)';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'transparent';
  });
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
      background: linear-gradient(135deg, #4ade80, #3b82f6);
      border-radius: 16px;
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
        padding: 2px 4px;
        cursor: pointer;
        background: transparent;
        color: #e0e8f9;
        border: none;
        border-radius: 16px;
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


function formatText(style: 'bold' | 'italic' | 'retro') {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    const variant = style === 'retro' ? 'squared negative' : style;
    const formattedText = toUnicodeVariant(selectedText, variant);

    range.deleteContents();
    const textNode = document.createTextNode(formattedText);
    range.insertNode(textNode);

    // Adjust selection to cover the formatted text
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
    observeDOM();
    
    // Periodically check for the share box and inject buttons if necessary
    setInterval(() => {
      const shareBox = document.querySelector('.share-box');
      if (shareBox) {
        injectFormatButtons();
      }
    }, 1000);
  }
  
  init();
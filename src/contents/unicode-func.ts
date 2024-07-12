export function insertUnicodeSymbol(symbol: string) {
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
  
  
   /**
   * Converts text to various Unicode variants
   * @param str - The input string to convert
   * @param variant - The desired Unicode variant
   * @param flags - Optional flags for additional styling
   * @returns The converted Unicode string
   */
export  function toUnicodeVariant(str: string, variant: string, flags?: string): string {
    // Define offsets for different Unicode variants
    const offsets: {[key: string]: number[]} = {
      m: [0x1d670, 0x1d7f6], // Monospace
      b: [0x1d400, 0x1d7ce], // Bold 
      i: [0x1d434, 0x00030], // Italic
      bi: [0x1d468, 0x00030], // Bold Italic
      c: [0x1d49c, 0x00030], // Script
      bc: [0x1d4d0, 0x00030], // Bold Script
      g: [0x1d504, 0x00030], // Gothic
      d: [0x1d538, 0x1d7d8], // Double-struck
      bg: [0x1d56c, 0x00030], // Bold Gothic
      s: [0x1d5a0, 0x1d7e2], // Sans-serif
      bs: [0x1d5d4, 0x1d7ec], // Bold Sans-serif
      is: [0x1d608, 0x00030], // Italic Sans-serif
      bis: [0x1d63c, 0x00030], // Bold Italic Sans-serif
      o: [0x24b6, 0x2460], // Circled
      on: [0x1f150, 0x2460], // Negative Circled
      p: [0x249c, 0x2474], // Parenthesized
      q: [0x1f130, 0x00030], // Squared
      qn: [0x1f170, 0x00030], // Negative Squared
      w: [0xff21, 0xff10], // Fullwidth
      u: [0x2090, 0xff10] // Subscript
    };
  
    // Map variant names to their respective offset keys
    const variantOffsets: {[key: string]: string} = {
      'monospace': 'm',
      'bold' : 'b',
      'italic' : 'i',
      'bold italic' : 'bi',
      'script': 'c',
      'bold script': 'bc',
      'gothic': 'g',
      'gothic bold': 'bg',
      'doublestruck': 'd',
      'sans': 's',
      'bold sans' : 'bs',
      'italic sans': 'is',
      'bold italic sans': 'bis',
      'parenthesis': 'p',
      'circled': 'o',
      'circled negative': 'on',
      'squared': 'q',
      'squared negative': 'qn',
      'fullwidth': 'w'
    };
  
    // Define special characters for each variant
    const special: {[key: string]: {[key: string]: number}} = {
      m: { ' ': 0x2000, '-': 0x2013 },
      i: { 'h': 0x210e },
      g: { 'C': 0x212d, 'H': 0x210c, 'I': 0x2111, 'R': 0x211c, 'Z': 0x2128 },
      d: { 'C': 0x2102, 'H': 0x210D, 'N': 0x2115, 'P': 0x2119, 'Q': 0x211A, 'R': 0x211D, 'Z': 0x2124 },
      o: { '0': 0x24EA, '1': 0x2460, '2': 0x2461, '3': 0x2462, '4': 0x2463, '5': 0x2464, '6': 0x2465, '7': 0x2466, '8': 0x2467, '9': 0x2468 },
      on: {}, p: {}, q: {}, qn: {}, w: {}
    };
  
    // Add support for small cases in certain variants
    ['p', 'w', 'on', 'q', 'qn'].forEach(t => {
      for (let i = 97; i <= 122; i++) {
        special[t][String.fromCharCode(i)] = offsets[t][0] + (i-97);
      }
    });
  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
  
    // Helper functions
    const getType = (variant: string): string => variantOffsets[variant] || (offsets[variant] ? variant : 'm');
    const getFlag = (flag: string, flags?: string): boolean => flags ? flag.split('|').some(f => flags.split(',').indexOf(f) > -1) : false;
  
    const type = getType(variant);
    const underline = getFlag('underline|u', flags);
    const strike = getFlag('strike|s', flags);
    
    let result = '';
    for (let c of str) {
      let index;
      if (special[type] && special[type][c]) c = String.fromCodePoint(special[type][c]);
      if (type && (index = chars.indexOf(c)) > -1) {
        result += String.fromCodePoint(index + offsets[type][0]);
      } else if (type && (index = numbers.indexOf(c)) > -1) {
        result += String.fromCodePoint(index + offsets[type][1]);
      } else {
        result += c;
      }
      if (underline) result += '\u0332'; // Add combining underline
      if (strike) result += '\u0336'; // Add combining strike
    }
    return result;
  }
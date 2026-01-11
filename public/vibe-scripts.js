// Vibe Scripts Bundle - Auto-generated, do not edit

(function() {
  // Prevent double initialization
  if (window.__vibeConsoleCapture) return;
  window.__vibeConsoleCapture = true;

  const MAX_LOGS_PER_FLUSH = 50;
  const FLUSH_INTERVAL = 500;
  const MAX_ARG_LENGTH = 1000;
  const MAX_STACK_LENGTH = 2000;

  let logBuffer = [];
  let flushTimeout = null;

  // Safely serialize arguments for postMessage
  function safeSerialize(arg) {
    try {
      if (arg === undefined) return { type: 'undefined' };
      if (arg === null) return null;
      if (typeof arg === 'function') return { type: 'function', name: arg.name || 'anonymous' };
      if (arg instanceof Error) {
        return {
          type: 'error',
          name: arg.name,
          message: arg.message,
          stack: arg.stack ? arg.stack.slice(0, MAX_STACK_LENGTH) : undefined
        };
      }
      if (typeof arg === 'object') {
        const str = JSON.stringify(arg);
        if (str.length > MAX_ARG_LENGTH) {
          return { type: 'object', preview: str.slice(0, MAX_ARG_LENGTH) + '...' };
        }
        return JSON.parse(str);
      }
      if (typeof arg === 'string' && arg.length > MAX_ARG_LENGTH) {
        return arg.slice(0, MAX_ARG_LENGTH) + '...';
      }
      return arg;
    } catch (e) {
      return { type: 'unserializable', toString: String(arg).slice(0, 200) };
    }
  }

  // Send buffered logs to parent
  function flushLogs() {
    if (logBuffer.length === 0) return;

    const logsToSend = logBuffer.slice(0, MAX_LOGS_PER_FLUSH);
    logBuffer = logBuffer.slice(MAX_LOGS_PER_FLUSH);

    try {
      window.parent.postMessage({
        source: 'vibe-console-capture',
        logs: logsToSend
      }, '*');
    } catch (e) {
      // Silently fail if postMessage fails
    }

    // Continue flushing if more logs
    if (logBuffer.length > 0) {
      flushTimeout = setTimeout(flushLogs, FLUSH_INTERVAL);
    } else {
      flushTimeout = null;
    }
  }

  // Schedule a flush
  function scheduleFlush() {
    if (flushTimeout === null) {
      flushTimeout = setTimeout(flushLogs, FLUSH_INTERVAL);
    }
  }

  // Override console methods
  const originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console)
  };

  function createOverride(type) {
    return function(...args) {
      // Call original
      originalConsole[type](...args);

      // Capture for parent
      logBuffer.push({
        type: type,
        timestamp: Date.now(),
        args: args.map(safeSerialize)
      });

      scheduleFlush();
    };
  }

  console.log = createOverride('log');
  console.warn = createOverride('warn');
  console.error = createOverride('error');
  console.info = createOverride('info');

  // Capture uncaught errors
  window.addEventListener('error', function(event) {
    try {
      window.parent.postMessage({
        source: 'vibe-console-capture',
        error: {
          type: 'error',
          message: event.message || 'Unknown error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack?.slice(0, MAX_STACK_LENGTH),
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      // Silently fail
    }
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    try {
      const reason = event.reason;
      window.parent.postMessage({
        source: 'vibe-console-capture',
        error: {
          type: 'unhandledrejection',
          message: reason?.message || String(reason) || 'Unhandled promise rejection',
          stack: reason?.stack?.slice(0, MAX_STACK_LENGTH),
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      // Silently fail
    }
  });

  // Flush on page unload
  window.addEventListener('beforeunload', function() {
    if (logBuffer.length > 0) {
      flushLogs();
    }
  });
})();


(function() {
  // Prevent double initialization
  if (window.__vibeDomTagger) return;
  window.__vibeDomTagger = true;

  let isActive = false;
  let hoverOverlay = null;
  let currentElement = null;
  let selectionOverlays = []; // Persistent selection highlights
  let currentSelectionPaths = []; // Track which elements are currently selected (paths from parent)

  const MAX_INNER_HTML = 500;
  const MAX_TEXT_CONTENT = 200;

  // Create hover highlight overlay
  function createHoverOverlay() {
    if (hoverOverlay) return hoverOverlay;

    hoverOverlay = document.createElement('div');
    hoverOverlay.id = 'vibe-tagger-hover';
    hoverOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      background: rgba(59, 130, 246, 0.15);
      border: 2px solid rgba(59, 130, 246, 0.8);
      border-radius: 4px;
      z-index: 999998;
      transition: all 0.1s ease;
      display: none;
    `;
    document.body.appendChild(hoverOverlay);
    return hoverOverlay;
  }

  // Create a selection highlight overlay for a specific element
  function createSelectionOverlay(element, index) {
    const overlay = document.createElement('div');
    overlay.className = 'vibe-selection-overlay';
    overlay.dataset.selectionIndex = index;
    overlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      background: rgba(34, 197, 94, 0.12);
      border: 2px solid rgba(34, 197, 94, 0.7);
      border-radius: 4px;
      z-index: 999997;
    `;

    // Add index badge
    const badge = document.createElement('div');
    badge.style.cssText = `
      position: absolute;
      top: -10px;
      left: -10px;
      width: 20px;
      height: 20px;
      background: #22c55e;
      color: white;
      font-size: 11px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    badge.textContent = String(index + 1);
    overlay.appendChild(badge);

    document.body.appendChild(overlay);
    return overlay;
  }

  // Update selection overlay position
  function updateSelectionOverlay(overlay, rect) {
    overlay.style.left = rect.x + 'px';
    overlay.style.top = rect.y + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
  }

  // Clear all selection overlays
  function clearSelectionOverlays() {
    selectionOverlays.forEach(o => o.remove());
    selectionOverlays = [];
  }

  // Find element by path (best effort matching)
  function findElementByPath(path) {
    // Try direct querySelector first
    try {
      const el = document.querySelector(path);
      if (el) return el;
    } catch { /* selector may be invalid - continue */ }

    // Fallback: search by parts
    const parts = path.split(' > ');
    let candidates = Array.from(document.querySelectorAll(parts[parts.length - 1].split('.')[0].split('#')[0]));

    for (const candidate of candidates) {
      if (getElementPath(candidate) === path) {
        return candidate;
      }
    }

    return null;
  }

  // Update selection highlights from parent
  function updateSelections(paths) {
    // Store the paths for deselection detection
    currentSelectionPaths = paths || [];

    clearSelectionOverlays();

    currentSelectionPaths.forEach((path, index) => {
      const element = findElementByPath(path);
      if (element) {
        const rect = element.getBoundingClientRect();
        const overlay = createSelectionOverlay(element, index);
        updateSelectionOverlay(overlay, rect);
        selectionOverlays.push(overlay);
      }
    });
  }

  // Check if an element's path is in current selections
  function isElementSelected(el) {
    const path = getElementPath(el);
    return currentSelectionPaths.includes(path);
  }

  // Update selection positions on scroll/resize
  function updateSelectionPositions() {
    // Re-find elements and update positions (paths may have shifted)
    const paths = selectionOverlays.map((o, i) => o.dataset.path).filter(Boolean);
    if (paths.length > 0) {
      // Simple position refresh
      document.querySelectorAll('.vibe-selection-overlay').forEach(overlay => {
        // Positions get updated on next updateSelections call
      });
    }
  }

  // Get element path (CSS selector-like)
  function getElementPath(el) {
    const parts = [];
    let current = el;
    let depth = 0;

    while (current && current !== document.body && depth < 5) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += '#' + current.id;
      } else if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        if (classes.length > 0 && classes[0]) {
          selector += '.' + classes.join('.');
        }
      }
      parts.unshift(selector);
      current = current.parentElement;
      depth++;
    }

    return parts.join(' > ');
  }

  // Get parent structure
  function getParentStructure(el) {
    const parts = [];
    let current = el.parentElement;
    let depth = 0;

    while (current && current !== document.body && depth < 3) {
      let info = current.tagName.toLowerCase();
      if (current.id) info += '#' + current.id;
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        if (classes.length > 0 && classes[0]) {
          info += '.' + classes.join('.');
        }
      }
      parts.push(info);
      current = current.parentElement;
      depth++;
    }

    return parts.join(' < ');
  }

  // Get element info
  function getElementInfo(el) {
    const rect = el.getBoundingClientRect();
    const computed = window.getComputedStyle(el);

    const attrs = {};
    for (const attr of el.attributes) {
      if (attr.name !== 'style' && !attr.name.startsWith('data-vibe')) {
        attrs[attr.name] = attr.value.slice(0, 100);
      }
    }

    let innerHTML = el.innerHTML;
    if (innerHTML && innerHTML.length > MAX_INNER_HTML) {
      innerHTML = innerHTML.slice(0, MAX_INNER_HTML) + '...';
    }

    let textContent = el.textContent?.trim();
    if (textContent && textContent.length > MAX_TEXT_CONTENT) {
      textContent = textContent.slice(0, MAX_TEXT_CONTENT) + '...';
    }

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || undefined,
      className: el.className && typeof el.className === 'string' ? el.className : undefined,
      textContent: textContent || undefined,
      attributes: attrs,
      boundingRect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      path: getElementPath(el),
      parentStructure: getParentStructure(el),
      innerHTML: innerHTML || undefined,
      computedStyles: {
        display: computed.display,
        position: computed.position,
        visibility: computed.visibility,
        opacity: computed.opacity,
        backgroundColor: computed.backgroundColor,
        color: computed.color
      }
    };
  }

  // Screenshot capture disabled
  async function captureElementScreenshot(el) {
    return null;
  }

  // Handle mouse move
  function handleMouseMove(e) {
    if (!isActive) return;

    const target = e.target;
    if (!target || target === hoverOverlay || target.id === 'vibe-tagger-hover' ||
        target.classList?.contains('vibe-selection-overlay')) return;

    currentElement = target;

    const rect = target.getBoundingClientRect();
    const overlay = createHoverOverlay();
    overlay.style.display = 'block';
    overlay.style.left = rect.x + 'px';
    overlay.style.top = rect.y + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
  }

  // Handle click
  async function handleClick(e) {
    if (!isActive || !currentElement) return;

    e.preventDefault();
    e.stopPropagation();

    const elementPath = getElementPath(currentElement);

    // Check if element is already selected - if so, deselect it
    if (currentSelectionPaths.includes(elementPath)) {
      window.parent.postMessage({
        source: 'vibe-dom-tagger',
        type: 'element-deselected',
        path: elementPath
      }, '*');
      // Stay active for more selections/deselections
      return;
    }

    // Otherwise, select the element
    const elementInfo = getElementInfo(currentElement);
    const screenshot = await captureElementScreenshot(currentElement);

    window.parent.postMessage({
      source: 'vibe-dom-tagger',
      type: 'element-selected',
      data: {
        element: elementInfo,
        screenshot: screenshot,
        timestamp: Date.now()
      }
    }, '*');

    // Stay active for more selections/deselections
  }

  // Handle escape key
  function handleKeyDown(e) {
    if (!isActive) return;

    if (e.key === 'Escape') {
      window.parent.postMessage({
        source: 'vibe-dom-tagger',
        type: 'tagger-cancelled'
      }, '*');
      deactivate();
    }
  }

  // Activate tagger mode
  function activate() {
    if (isActive) return;
    isActive = true;

    createHoverOverlay();
    document.body.style.cursor = 'crosshair';

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    window.parent.postMessage({
      source: 'vibe-dom-tagger',
      type: 'tagger-ready'
    }, '*');
  }

  // Deactivate tagger mode
  function deactivate() {
    if (!isActive) return;
    isActive = false;

    if (hoverOverlay) {
      hoverOverlay.style.display = 'none';
    }
    document.body.style.cursor = '';
    currentElement = null;

    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('keydown', handleKeyDown, true);
  }

  // Listen for commands from parent
  window.addEventListener('message', function(event) {
    const data = event.data;
    if (!data || data.source !== 'vibe-dom-tagger-command') return;

    if (data.action === 'activate') {
      activate();
    } else if (data.action === 'deactivate') {
      deactivate();
    } else if (data.action === 'update-selections') {
      updateSelections(data.selections || []);
    }
  });

  // Update selection positions on scroll
  window.addEventListener('scroll', updateSelectionPositions, { passive: true });
  window.addEventListener('resize', updateSelectionPositions, { passive: true });
})();


(function() {
  // Version check - allows re-injection when script is updated
  const SCRIPT_VERSION = 3;
  if (window.__vibeAutomationVersion >= SCRIPT_VERSION) return;
  window.__vibeAutomationVersion = SCRIPT_VERSION;
  window.__vibeAutomation = true;

  // ═══════════════════════════════════════════════════════════════════
  // VISUAL HIGHLIGHT STYLES - Matches DOM tagger style
  // ═══════════════════════════════════════════════════════════════════
  const style = document.createElement('style');
  style.textContent = `
    /* AI Action Highlight - Simple blue box like DOM tagger */
    .vibe-ai-highlight {
      position: absolute;
      pointer-events: none;
      z-index: 999999;
      border: 2px solid rgba(59, 130, 246, 0.8);
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.15);
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 4px;
    }

    .vibe-ai-highlight::after {
      content: attr(data-action);
      font-size: 9px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: rgba(59, 130, 246, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Click ripple effect */
    .vibe-ai-click-ripple {
      position: absolute;
      pointer-events: none;
      z-index: 999998;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.3);
      transform: translate(-50%, -50%) scale(0);
      animation: vibe-ai-ripple 0.4s ease-out forwards;
    }

    @keyframes vibe-ai-ripple {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
      }
    }

    /* Typing indicator - muted style */
    .vibe-ai-typing {
      position: absolute;
      pointer-events: none;
      z-index: 999999;
      padding: 4px 8px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: rgba(59, 130, 246, 0.7);
      font-size: 11px;
      font-family: 'SF Mono', Monaco, monospace;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT FINDING - DRAMATICALLY IMPROVED ACCURACY
  // Supports: Shadow DOM, Web Components, Dynamic Content, Deep Nesting
  // ═══════════════════════════════════════════════════════════════════

  // Interactive element selectors (what users actually want to click)
  const INTERACTIVE_SELECTORS = 'button, a, [role="button"], [role="link"], input, select, textarea, label, [tabindex]:not([tabindex="-1"])';
  const CONTAINER_SELECTORS = 'div, span, section, article, main, header, footer, nav, aside, form';
  const HEADING_SELECTORS = 'h1, h2, h3, h4, h5, h6, p';

  // ═══════════════════════════════════════════════════════════════════
  // SHADOW DOM TRAVERSAL - Critical for Web Components & UI Libraries
  // ═══════════════════════════════════════════════════════════════════

  // Recursively find all elements matching selector, including inside shadow DOMs
  function querySelectorAllDeep(selector, root = document) {
    const results = [];

    // Get elements from current root
    try {
      const elements = root.querySelectorAll(selector);
      results.push(...elements);
    } catch (e) {
      // Invalid selector, skip
    }

    // Recursively search shadow roots
    const allElements = root.querySelectorAll('*');
    for (const el of allElements) {
      if (el.shadowRoot) {
        const shadowResults = querySelectorAllDeep(selector, el.shadowRoot);
        results.push(...shadowResults);
      }
    }

    return results;
  }

  // Find single element including shadow DOM
  function querySelectorDeep(selector, root = document) {
    // Try current root first
    try {
      const element = root.querySelector(selector);
      if (element) return element;
    } catch { /* selector may be invalid - continue */ }

    // Search shadow roots
    const allElements = root.querySelectorAll('*');
    for (const el of allElements) {
      if (el.shadowRoot) {
        const found = querySelectorDeep(selector, el.shadowRoot);
        if (found) return found;
      }
    }

    return null;
  }

  // Get all interactive elements including those in shadow DOM
  function getAllInteractiveElements() {
    const results = [];

    function traverse(root) {
      // Query interactive elements in this root
      const interactiveSelectors = INTERACTIVE_SELECTORS + ', ' + HEADING_SELECTORS;
      try {
        const elements = root.querySelectorAll(interactiveSelectors);
        results.push(...elements);
      } catch { /* selector may be invalid - continue */ }

      // Traverse shadow roots
      const allElements = root.querySelectorAll('*');
      for (const el of allElements) {
        if (el.shadowRoot) {
          traverse(el.shadowRoot);
        }
      }
    }

    traverse(document);
    return results;
  }

  // Get the "light DOM" text content (excludes shadow DOM internal text)
  function getVisibleText(el) {
    // For elements with shadow DOM, get slotted content or fallback
    if (el.shadowRoot) {
      const slot = el.shadowRoot.querySelector('slot');
      if (slot) {
        const assigned = slot.assignedNodes();
        if (assigned.length > 0) {
          return assigned.map(n => n.textContent || '').join('').trim();
        }
      }
    }
    return el.textContent?.trim() || '';
  }

  // Normalize text for comparison - handles whitespace, hidden chars
  function normalizeText(text) {
    if (!text) return '';
    return text
      .replace(/[\s\u00A0\u200B]+/g, ' ')  // Normalize all whitespace including nbsp, zero-width
      .trim()
      .toLowerCase();
  }

  // Check if element is truly interactive
  function isInteractive(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const tabindex = el.getAttribute('tabindex');

    // Direct interactive elements
    if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) return true;
    // Role-based interactive
    if (['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem', 'option', 'switch'].includes(role)) return true;
    // Focusable elements
    if (tabindex && tabindex !== '-1') return true;
    // Labels with for attribute
    if (tag === 'label' && el.getAttribute('for')) return true;
    // Custom elements that are typically interactive
    if (tag.includes('-') && (el.onclick || el.getAttribute('onclick'))) return true;

    return false;
  }

  // Check if element is visible and has dimensions (with caching for performance)
  const visibilityCache = new WeakMap();
  function isVisible(el) {
    if (visibilityCache.has(el)) return visibilityCache.get(el);

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      visibilityCache.set(el, false);
      return false;
    }

    // Only check computed style for elements that pass size check (expensive operation)
    const style = window.getComputedStyle(el);
    const visible = style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   parseFloat(style.opacity) > 0;

    visibilityCache.set(el, visible);
    return visible;
  }

  // Clear visibility cache (call before each action)
  function clearVisibilityCache() {
    // WeakMap auto-clears, but we reassign to be safe with dynamic content
  }

  // CRITICAL FIX: Check if a container has an interactive child that matches the text
  // This prevents clicking wrapper divs when the actual button is inside
  function findInteractiveChildWithText(container, searchText) {
    const normalizedSearch = normalizeText(searchText);
    const interactiveChildren = container.querySelectorAll(INTERACTIVE_SELECTORS);

    for (const child of interactiveChildren) {
      if (!isVisible(child)) continue;
      const childText = normalizeText(child.textContent);
      // Check exact match first
      if (childText === normalizedSearch) return child;
    }
    // Then partial match
    for (const child of interactiveChildren) {
      if (!isVisible(child)) continue;
      const childText = normalizeText(child.textContent);
      if (childText.includes(normalizedSearch)) return child;
    }
    return null;
  }

  // Score element specificity - lower is better (more specific)
  function scoreElement(el) {
    const rect = el.getBoundingClientRect();
    let score = rect.width * rect.height;

    // STRONGLY prefer interactive elements
    if (isInteractive(el)) {
      score *= 0.001;  // 1000x preference for interactive elements
    }

    // Prefer elements with less text (more specific match)
    const textLength = el.textContent?.length || 0;
    score += textLength * 0.1;

    // Prefer deeper elements (children over parents)
    let depth = 0;
    let parent = el.parentElement;
    while (parent && depth < 20) {
      depth++;
      parent = parent.parentElement;
    }
    score -= depth * 10;  // Deeper = lower score = better

    return score;
  }

  function findElement(selector, options = {}) {
    if (!selector) return null;
    const { strictInteractive = false } = options;

    // Escape special CSS characters for querySelector
    const escapedSelector = selector.replace(/([!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~])/g, '\\$1');
    const normalizedSelector = normalizeText(selector);

    // ═══════════════════════════════════════════════════════════════════
    // STRATEGY 1: Playwright-style role/text locators
    // ═══════════════════════════════════════════════════════════════════

    // Support "role:button" or "button:Add" syntax
    const roleMatch = selector.match(/^(role|button|link|input|text):(.+)$/i);
    if (roleMatch) {
      const [, type, value] = roleMatch;
      const normalizedValue = normalizeText(value);

      if (type.toLowerCase() === 'role' || type.toLowerCase() === 'button') {
        // Search buttons including shadow DOM
        const buttons = querySelectorAllDeep('button, [role="button"]');
        for (const btn of buttons) {
          if (!isVisible(btn)) continue;
          if (normalizeText(getVisibleText(btn)) === normalizedValue) return btn;
        }
        for (const btn of buttons) {
          if (!isVisible(btn)) continue;
          if (normalizeText(getVisibleText(btn)).includes(normalizedValue)) return btn;
        }
      }
      if (type.toLowerCase() === 'link') {
        const links = querySelectorAllDeep('a, [role="link"]');
        for (const link of links) {
          if (!isVisible(link)) continue;
          if (normalizeText(getVisibleText(link)) === normalizedValue) return link;
        }
      }
      if (type.toLowerCase() === 'input') {
        const inputs = querySelectorAllDeep('input, textarea, select');
        for (const input of inputs) {
          if (!isVisible(input)) continue;
          const label = input.getAttribute('aria-label') || input.placeholder || input.name || '';
          if (normalizeText(label) === normalizedValue || normalizeText(label).includes(normalizedValue)) {
            return input;
          }
        }
      }
      if (type.toLowerCase() === 'text') {
        // Fall through to text search with this value
        selector = value;
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // STRATEGY 2: Direct CSS selector (if it looks like one)
    // Uses deep query to search shadow DOM too
    // ═══════════════════════════════════════════════════════════════════

    if (/^[.#\\[]/.test(selector) || /^[a-z][a-z0-9-]*$/i.test(selector)) {
      try {
        // Try regular DOM first (faster), then shadow DOM
        let element = document.querySelector(selector);
        if (!element) {
          element = querySelectorDeep(selector);
        }
        if (element && isVisible(element)) {
          // CRITICAL: If we found a container, check for interactive child
          if (!isInteractive(element)) {
            const interactiveChild = findInteractiveChildWithText(element, element.textContent);
            if (interactiveChild) return interactiveChild;
          }
          return element;
        }
      } catch (e) {
        // Invalid selector, continue to text search
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // STRATEGY 3: Text-based search with STRICT interactive preference
    // Searches ALL elements including shadow DOM
    // ═══════════════════════════════════════════════════════════════════

    // Use deep traversal to include shadow DOM elements
    const allElements = getAllInteractiveElements();
    let candidates = [];

    for (const el of allElements) {
      if (!isVisible(el)) continue;

      // Use getVisibleText for proper shadow DOM handling
      const text = normalizeText(getVisibleText(el));
      const ariaLabel = normalizeText(el.getAttribute('aria-label') || '');

      // Match against visible text OR aria-label
      const isExact = text === normalizedSelector || ariaLabel === normalizedSelector;
      const isPartial = !isExact && (text.includes(normalizedSelector) || ariaLabel.includes(normalizedSelector));

      if (isExact || isPartial) {
        candidates.push({
          element: el,
          isExact,
          isInteractive: isInteractive(el),
          score: scoreElement(el)
        });
      }
    }

    // Sort candidates by priority:
    // 1. Interactive + Exact match (best)
    // 2. Interactive + Partial match
    // 3. Non-interactive + Exact match
    // 4. Non-interactive + Partial match
    candidates.sort((a, b) => {
      // Interactive always beats non-interactive
      if (a.isInteractive !== b.isInteractive) {
        return a.isInteractive ? -1 : 1;
      }
      // Exact beats partial
      if (a.isExact !== b.isExact) {
        return a.isExact ? -1 : 1;
      }
      // Lower score is better
      return a.score - b.score;
    });

    // CRITICAL FIX: Before returning any non-interactive element,
    // check if it has an interactive child that matches
    for (const candidate of candidates) {
      const el = candidate.element;

      // If interactive, return it directly
      if (candidate.isInteractive) {
        return el;
      }

      // If strict mode and not interactive, skip
      if (strictInteractive) continue;

      // For non-interactive containers, ALWAYS check for interactive children
      const interactiveChild = findInteractiveChildWithText(el, selector);
      if (interactiveChild) {
        return interactiveChild;  // Return the button/link inside, not the container
      }

      // Only return container if no interactive child exists
      // (e.g., clicking a heading or paragraph is sometimes valid)
      if (!strictInteractive) {
        return el;
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // STRATEGY 4: Attribute-based fallbacks
    // ═══════════════════════════════════════════════════════════════════

    // aria-label
    try {
      const element = document.querySelector('[aria-label*="' + escapedSelector + '" i]');
      if (element && isVisible(element)) return element;
    } catch { /* selector may be invalid - continue */ }

    // placeholder
    try {
      const element = document.querySelector('[placeholder*="' + escapedSelector + '" i]');
      if (element && isVisible(element)) return element;
    } catch { /* selector may be invalid - continue */ }

    // data-testid
    try {
      const element = document.querySelector('[data-testid*="' + escapedSelector + '" i]');
      if (element && isVisible(element)) return element;
    } catch { /* selector may be invalid - continue */ }

    // input value
    try {
      const inputs = document.querySelectorAll('input, textarea');
      for (const el of inputs) {
        if (!isVisible(el)) continue;
        if (el.value?.toLowerCase().includes(selector.toLowerCase())) {
          return el;
        }
      }
    } catch { /* selector may be invalid - continue */ }

    return null;
  }

  // Extended findElement that returns metadata about the search
  function findElementWithMetadata(selector, options = {}) {
    const normalizedSelector = normalizeText(selector);
    const allElements = document.querySelectorAll(INTERACTIVE_SELECTORS + ', ' + HEADING_SELECTORS + ', ' + CONTAINER_SELECTORS);

    let matchCount = 0;
    let interactiveMatchCount = 0;

    for (const el of allElements) {
      if (!isVisible(el)) continue;
      const text = normalizeText(el.textContent);
      if (text === normalizedSelector || text.includes(normalizedSelector)) {
        matchCount++;
        if (isInteractive(el)) interactiveMatchCount++;
      }
    }

    const element = findElement(selector, options);

    return {
      element,
      matchCount,
      interactiveMatchCount,
      isAmbiguous: matchCount > 1,
      selectedIsInteractive: element ? isInteractive(element) : false
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // VISUAL FEEDBACK
  // ═══════════════════════════════════════════════════════════════════

  function showHighlight(element, action) {
    const rect = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'vibe-ai-highlight';
    highlight.setAttribute('data-action', action);
    highlight.style.cssText = `
      top: ${rect.top + window.scrollY - 4}px;
      left: ${rect.left + window.scrollX - 4}px;
      width: ${rect.width + 8}px;
      height: ${rect.height + 8}px;
    `;
    document.body.appendChild(highlight);

    // Remove after animation
    setTimeout(() => highlight.remove(), 1500);
    return highlight;
  }

  function showClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'vibe-ai-click-ripple';
    ripple.style.cssText = `
      top: ${y + window.scrollY}px;
      left: ${x + window.scrollX}px;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  }

  function showTypingIndicator(element, text) {
    const rect = element.getBoundingClientRect();
    const indicator = document.createElement('div');
    indicator.className = 'vibe-ai-typing';
    indicator.textContent = text.length > 30 ? text.slice(0, 30) + '...' : text;
    indicator.style.cssText = `
      top: ${rect.bottom + window.scrollY + 8}px;
      left: ${rect.left + window.scrollX}px;
    `;
    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 2000);
  }

  // ═══════════════════════════════════════════════════════════════════
  // ACTIONS - WITH VERIFICATION AND DETAILED METADATA
  // ═══════════════════════════════════════════════════════════════════

  // Generate a unique CSS selector for an element (for debugging/retry)
  function getUniqueSelector(el) {
    if (el.id) return '#' + el.id;

    const tag = el.tagName.toLowerCase();
    let selector = tag;

    // Add distinguishing classes (first 2, skip utility classes)
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(' ')
        .filter(c => c && !c.match(/^(p-|m-|w-|h-|flex|grid|text-|bg-|border)/))
        .slice(0, 2);
      if (classes.length) selector += '.' + classes.join('.');
    }

    // Add index among siblings if needed
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(el) + 1;
        selector += ':nth-of-type(' + index + ')';
      }
    }

    return selector;
  }

  // Wait for element with retry (handles async rendering)
  async function waitForElement(selector, options = {}, maxWait = 2000) {
    const startTime = Date.now();
    const pollInterval = 100;

    while (Date.now() - startTime < maxWait) {
      const result = findElementWithMetadata(selector, options);
      if (result.element) return result;
      await new Promise(r => setTimeout(r, pollInterval));
    }
    return findElementWithMetadata(selector, options); // Final attempt
  }

  async function performClick(selector, options = {}) {
    // Use retry-aware find for async content
    const searchResult = await waitForElement(selector, options);
    const { element, matchCount, interactiveMatchCount, isAmbiguous, selectedIsInteractive } = searchResult;

    if (!element) {
      return {
        success: false,
        error: 'Element not found after 2s: ' + selector,
        searchDetails: {
          matchCount: 0,
          suggestion: 'Try using a more specific selector like "button:Add" or check the snapshot for available elements'
        }
      };
    }

    // VERIFICATION: Warn if clicking a non-interactive element
    const tag = element.tagName.toLowerCase();
    const isClickableTag = ['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tag);
    const hasClickRole = ['button', 'link', 'checkbox', 'radio', 'tab'].includes(element.getAttribute('role'));

    if (!isClickableTag && !hasClickRole) {
      console.warn('[Vibe] Warning: Clicking non-interactive element:', tag, element.className);
    }

    // Visual feedback
    showHighlight(element, 'AI Click');
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Delay for visual effect
    await new Promise(r => setTimeout(r, 300));
    showClickRipple(x, y);

    // Scroll into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(r => setTimeout(r, 200));

    // Capture state before click for verification
    const beforeHTML = document.body.innerHTML.length;
    const beforeElementCount = document.querySelectorAll('*').length;

    // Perform click
    element.click();

    // Wait briefly for React/DOM updates
    await new Promise(r => setTimeout(r, 150));

    // Verify click had effect (DOM changed)
    const afterHTML = document.body.innerHTML.length;
    const afterElementCount = document.querySelectorAll('*').length;
    const domChanged = beforeHTML !== afterHTML || beforeElementCount !== afterElementCount;

    // Build detailed response
    const response = {
      success: true,
      element: {
        tagName: element.tagName,
        text: normalizeText(element.textContent)?.slice(0, 100),
        id: element.id || undefined,
        className: element.className || undefined,
        uniqueSelector: getUniqueSelector(element),
        isInteractive: selectedIsInteractive
      },
      searchDetails: {
        matchCount,
        interactiveMatchCount,
        isAmbiguous,
        selectedIsInteractive
      },
      verification: {
        domChanged,
        note: domChanged ? 'DOM updated after click' : 'No visible DOM change detected'
      }
    };

    // Add warnings for potential issues
    const warnings = [];
    if (isAmbiguous) {
      warnings.push('Multiple elements matched "' + selector + '" (' + matchCount + ' total, ' + interactiveMatchCount + ' interactive)');
    }
    if (!selectedIsInteractive) {
      warnings.push('Clicked non-interactive element (' + tag + ') - expected button/link/input');
    }
    if (!domChanged && selectedIsInteractive) {
      warnings.push('Click may have failed - no DOM change detected. Try "button:' + selector + '" for precision');
    }
    if (warnings.length > 0) {
      response.warning = warnings.join('. ');
    }

    return response;
  }

  async function performType(selector, text) {
    const element = findElement(selector);
    if (!element) {
      return { success: false, error: 'Element not found: ' + selector };
    }

    // Handle undefined/null/empty text
    const textToType = text || '';

    // Visual feedback
    showHighlight(element, 'AI Type');
    await new Promise(r => setTimeout(r, 300));
    showTypingIndicator(element, textToType || '(clearing)');

    // Focus and type
    element.focus();

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      // For React controlled inputs, we need to use the native value setter
      // and dispatch a proper input event that React can intercept
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        element.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, textToType);
      } else {
        element.value = textToType;
      }

      // Dispatch input event that React listens to
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      // React 16+ uses this property
      inputEvent.simulated = true;
      element.dispatchEvent(inputEvent);

      // Also dispatch change for good measure
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.isContentEditable) {
      element.textContent = textToType;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    return {
      success: true,
      element: {
        tagName: element.tagName,
        id: element.id,
        value: element.value || textToType
      }
    };
  }

  async function performSelect(selector, value) {
    const element = findElement(selector);
    if (!element || element.tagName !== 'SELECT') {
      return { success: false, error: 'Select element not found: ' + selector };
    }

    showHighlight(element, 'AI Select');
    await new Promise(r => setTimeout(r, 300));

    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));

    return { success: true, value };
  }

  async function performScroll(direction, amount = 300) {
    const scrollAmount = direction === 'up' ? -amount : amount;
    window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    return { success: true, scrolled: scrollAmount };
  }

  function getSnapshot() {
    // Get accessibility-tree-style snapshot - optimized for LLM understanding
    // Format: Simple text-based tree that Claude can easily parse and act on
    // NOW INCLUDES SHADOW DOM ELEMENTS for Web Component support
    const lines = [];
    lines.push('=== Page Snapshot ===');
    lines.push('URL: ' + window.location.href);
    lines.push('Title: ' + document.title);
    lines.push('');
    lines.push('=== Interactive Elements (including Shadow DOM) ===');
    lines.push('(Use exact text in quotes, or "button:Text" / "link:Text" / "input:placeholder" for precision)');
    lines.push('');

    // Use deep traversal to find ALL interactive elements including shadow DOM
    const allElements = getAllInteractiveElements();
    let idx = 0;
    const seenTexts = new Map();  // Track duplicate text for warning
    let shadowDOMCount = 0;

    for (const el of allElements) {
      const rect = el.getBoundingClientRect();
      // Skip invisible elements
      if (rect.width === 0 || rect.height === 0) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      // Check if element is in shadow DOM
      const inShadow = el.getRootNode() !== document;
      if (inShadow) shadowDOMCount++;

      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role') || tag;
      // Use getVisibleText for proper shadow DOM slot handling
      const rawText = getVisibleText(el);
      const text = rawText.slice(0, 60);
      const normalizedText = normalizeText(rawText);
      const label = el.getAttribute('aria-label') || el.placeholder || el.title || '';
      const value = el.value || '';
      const disabled = el.disabled ? ' [disabled]' : '';
      const viewport = inViewport ? '' : ' [offscreen]';
      const shadowMarker = inShadow ? ' [shadow]' : '';

      // Track text for duplicate detection
      if (normalizedText) {
        seenTexts.set(normalizedText, (seenTexts.get(normalizedText) || 0) + 1);
      }

      // Build readable description with targeting hints
      let desc = '';
      let targetHint = '';  // Unique selector hint

      if (tag === 'button' || role === 'button') {
        desc = 'Button: "' + (text || label || 'unnamed') + '"' + disabled + viewport + shadowMarker;
        targetHint = text ? 'button:' + text : (label ? 'button:' + label : '');
      } else if (tag === 'a') {
        desc = 'Link: "' + (text || label || el.href || 'unnamed') + '"' + viewport + shadowMarker;
        targetHint = text ? 'link:' + text : '';
      } else if (tag === 'input') {
        const inputType = el.type || 'text';
        if (inputType === 'checkbox' || inputType === 'radio') {
          desc = (inputType === 'checkbox' ? 'Checkbox' : 'Radio') + ': "' + (label || text || el.name || 'unnamed') + '" [' + (el.checked ? 'checked' : 'unchecked') + ']' + disabled + shadowMarker;
        } else {
          desc = 'Input (' + inputType + '): "' + (label || el.placeholder || el.name || 'unnamed') + '"' + (value ? ' = "' + value.slice(0, 30) + '"' : '') + disabled + shadowMarker;
          targetHint = (label || el.placeholder) ? 'input:' + (label || el.placeholder) : '';
        }
      } else if (tag === 'textarea') {
        desc = 'Textarea: "' + (label || el.placeholder || el.name || 'unnamed') + '"' + (value ? ' = "' + value.slice(0, 30) + '..."' : '') + disabled + shadowMarker;
      } else if (tag === 'select') {
        const selectedOption = el.options?.[el.selectedIndex];
        desc = 'Dropdown: "' + (label || el.name || 'unnamed') + '"' + (selectedOption ? ' = "' + selectedOption.text + '"' : '') + disabled + shadowMarker;
      } else if (tag.match(/^h[1-6]$/)) {
        desc = 'Heading (' + tag + '): "' + text + '"';
      } else if (tag === 'form') {
        desc = 'Form: "' + (el.name || el.id || 'unnamed') + '"';
      } else if (tag.includes('-')) {
        // Custom element / web component
        desc = 'Component (' + tag + '): "' + (text || label || 'unnamed') + '"' + viewport + shadowMarker;
        targetHint = text ? 'button:' + text : '';  // Most custom elements act like buttons
      } else {
        desc = role + ': "' + (text || label || 'unnamed') + '"' + viewport + shadowMarker;
      }

      // Add ID hint if available (most reliable selector)
      if (el.id) {
        targetHint = '#' + el.id;
      }

      lines.push('[' + idx + '] ' + desc + (targetHint ? '  →  ' + targetHint : ''));
      idx++;
    }

    if (idx === 0) {
      lines.push('(No interactive elements found)');
    }

    // Show shadow DOM stats if any found
    if (shadowDOMCount > 0) {
      lines.push('');
      lines.push('=== Shadow DOM ===');
      lines.push(shadowDOMCount + ' elements found inside shadow DOM (marked with [shadow])');
      lines.push('These elements are fully supported - use the same selectors');
    }

    // Warn about duplicate text (ambiguity risk)
    const duplicates = Array.from(seenTexts.entries()).filter(([, count]) => count > 1);
    if (duplicates.length > 0) {
      lines.push('');
      lines.push('=== AMBIGUITY WARNING ===');
      lines.push('These texts appear on multiple elements - use precise selectors:');
      duplicates.forEach(([text, count]) => {
        lines.push('  "' + text + '" appears ' + count + 'x - use "button:' + text + '" or "link:' + text + '"');
      });
    }

    lines.push('');
    lines.push('=== Usage ===');
    lines.push('Click: vibe-browser click "Button text"');
    lines.push('Click (precise): vibe-browser click "button:Add" or "link:Home" or "input:Search"');
    lines.push('Type: vibe-browser type "placeholder text" "text to type"');
    lines.push('Scroll: vibe-browser scroll down');
    lines.push('');
    lines.push('The system auto-retries for 2s and verifies clicks actually worked.');

    return {
      url: window.location.href,
      title: document.title,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollY: window.scrollY,
      elementCount: idx,
      shadowDOMCount: shadowDOMCount,
      // Return both structured and text format
      snapshot: lines.join('\n')
    };
  }

  function getPageContent() {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 5000),
      html: document.body.innerHTML.slice(0, 10000)
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // SCREENSHOT CAPTURE
  // Uses native Canvas API with styled fallback - no external CDN needed
  // ═══════════════════════════════════════════════════════════════════

  // Extract primary colors from the page
  function extractPageColors() {
    const colors = { bg: '#ffffff', accent: '#3b82f6', text: '#1f2937' };

    try {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      const bgColor = computed.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        colors.bg = bgColor;
      }

      // Find accent color from buttons or links
      const accentEl = document.querySelector('button, a, [class*="primary"], [class*="accent"]');
      if (accentEl) {
        const accentBg = window.getComputedStyle(accentEl).backgroundColor;
        if (accentBg && accentBg !== 'rgba(0, 0, 0, 0)' && accentBg !== 'transparent') {
          colors.accent = accentBg;
        }
      }
    } catch (e) {
      // Use defaults
    }

    return colors;
  }

  // Create a styled thumbnail when DOM capture fails
  function createStyledThumbnail(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const colors = extractPageColors();
    const title = document.title || 'Untitled Project';
    const heading = document.querySelector('h1, h2, h3')?.textContent?.slice(0, 50) || '';

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.bg);
    gradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Accent bar at top
    ctx.fillStyle = colors.accent;
    ctx.fillRect(0, 0, width, 6);

    // Simulated UI elements
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    // Nav bar simulation
    ctx.fillRect(20, 20, width - 40, 24);
    // Content blocks
    ctx.fillRect(20, 60, width * 0.6, 16);
    ctx.fillRect(20, 84, width * 0.8, 12);
    ctx.fillRect(20, 104, width * 0.5, 12);
    // Card simulation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(20, 130, width - 40, 80);

    // Button simulation
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.roundRect(20, 230, 80, 28, 4);
    ctx.fill();

    // Title text
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    const displayTitle = title.length > 30 ? title.slice(0, 30) + '...' : title;
    ctx.fillText(displayTitle, 20, height - 20);

    return canvas.toDataURL('image/jpeg', 0.85);
  }

  async function captureScreenshot(options = {}) {
    const { width = 400, height = 300, quality = 0.8 } = options;

    try {
      // Strategy 1: Use native canvas rendering of visible elements
      const canvas = document.createElement('canvas');
      const viewWidth = Math.min(window.innerWidth, 1200);
      const viewHeight = Math.min(window.innerHeight, 900);
      canvas.width = viewWidth;
      canvas.height = viewHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }

      // Draw background
      const bodyStyle = window.getComputedStyle(document.body);
      ctx.fillStyle = bodyStyle.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, viewWidth, viewHeight);

      // Capture visible elements as simplified shapes
      const elements = document.body.querySelectorAll('*');
      let drawnElements = 0;
      const maxElements = 100; // Limit for performance

      for (const el of elements) {
        if (drawnElements >= maxElements) break;

        const rect = el.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) continue;
        if (rect.top > viewHeight || rect.bottom < 0) continue;
        if (rect.left > viewWidth || rect.right < 0) continue;

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;

        const bgColor = style.backgroundColor;
        const borderColor = style.borderColor;

        // Draw element background if visible
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          const radius = parseInt(style.borderRadius) || 0;
          if (radius > 0) {
            ctx.beginPath();
            ctx.roundRect(rect.left, rect.top, rect.width, rect.height, Math.min(radius, 12));
            ctx.fill();
          } else {
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
          }
          drawnElements++;
        }

        // Draw borders if visible
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && style.borderWidth !== '0px') {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = parseInt(style.borderWidth) || 1;
          ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        // Draw text for headings
        if (['H1', 'H2', 'H3', 'P', 'SPAN', 'A', 'BUTTON'].includes(el.tagName)) {
          const text = el.textContent?.trim().slice(0, 50);
          if (text && rect.width > 40) {
            ctx.fillStyle = style.color || '#000000';
            const fontSize = parseInt(style.fontSize) || 14;
            ctx.font = style.fontWeight + ' ' + Math.min(fontSize, 24) + 'px sans-serif';
            ctx.fillText(text, rect.left + 4, rect.top + fontSize + 4, rect.width - 8);
            drawnElements++;
          }
        }

        // Draw images - attempt to render actual image content
        if (el.tagName === 'IMG') {
          try {
            const img = el;
            if (img.complete && img.naturalWidth > 0) {
              ctx.drawImage(img, rect.left, rect.top, rect.width, rect.height);
              drawnElements++;
            }
          } catch (imgErr) {
            // Cross-origin image - draw placeholder
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
            drawnElements++;
          }
        }

        // Draw SVG elements
        if (el.tagName === 'SVG' || el.tagName === 'svg') {
          try {
            const svgEl = el;
            const svgData = new XMLSerializer().serializeToString(svgEl);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const svgImg = new Image();
            svgImg.src = svgUrl;
            // For sync rendering, try to draw if already loaded (usually inline SVGs)
            if (svgImg.complete) {
              ctx.drawImage(svgImg, rect.left, rect.top, rect.width, rect.height);
              drawnElements++;
            }
            URL.revokeObjectURL(svgUrl);
          } catch (svgErr) {
            // SVG render failed - draw placeholder
            ctx.fillStyle = style.color || '#9ca3af';
            ctx.fillRect(rect.left + rect.width/4, rect.top + rect.height/4, rect.width/2, rect.height/2);
          }
        }

        // Draw background images from CSS (hero sections, etc.)
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.startsWith('url(')) {
          try {
            const bgUrl = bgImage.slice(5, -2); // Remove url(" and ")
            if (bgUrl && !bgUrl.startsWith('data:')) {
              // Draw a gradient approximation for background images
              const gradient = ctx.createLinearGradient(rect.left, rect.top, rect.left + rect.width, rect.top + rect.height);
              gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
              gradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)');
              ctx.fillStyle = gradient;
              ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
            }
          } catch (bgErr) {
            // Ignore background image errors
          }
        }
      }

      // Scale to thumbnail size
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = width;
      thumbCanvas.height = height;
      const thumbCtx = thumbCanvas.getContext('2d');

      if (!thumbCtx) {
        throw new Error('Thumbnail canvas unavailable');
      }

      // Calculate aspect ratio scaling (crop to fit)
      const srcRatio = viewWidth / viewHeight;
      const destRatio = width / height;
      let srcX = 0, srcY = 0, srcW = viewWidth, srcH = viewHeight;

      if (srcRatio > destRatio) {
        srcW = viewHeight * destRatio;
        srcX = (viewWidth - srcW) / 2;
      } else {
        srcH = viewWidth / destRatio;
        srcY = 0;
      }

      thumbCtx.drawImage(canvas, srcX, srcY, srcW, srcH, 0, 0, width, height);
      const dataUrl = thumbCanvas.toDataURL('image/jpeg', quality);

      // If the capture looks empty (mostly one color), use styled fallback
      const imageData = thumbCtx.getImageData(0, 0, width, height);
      let colorVariance = 0;
      const sampleStep = 100;
      for (let i = 0; i < imageData.data.length; i += sampleStep * 4) {
        const diff = Math.abs(imageData.data[i] - imageData.data[i + sampleStep * 4] || 0);
        colorVariance += diff;
      }

      if (colorVariance < 500 || drawnElements < 5) {
        // Page looks empty, use styled fallback
        const fallbackUrl = createStyledThumbnail(width, height);
        if (fallbackUrl) {
          return {
            success: true,
            data: { dataUrl: fallbackUrl, width, height, method: 'styled-fallback' }
          };
        }
      }

      return {
        success: true,
        data: {
          dataUrl,
          width,
          height,
          originalWidth: viewWidth,
          originalHeight: viewHeight,
          method: 'canvas-render'
        }
      };
    } catch (e) {
      console.warn('[Vibe] Canvas capture failed, using styled fallback:', e.message);

      // Fallback to styled thumbnail
      const fallbackUrl = createStyledThumbnail(width, height);
      if (fallbackUrl) {
        return {
          success: true,
          data: { dataUrl: fallbackUrl, width, height, method: 'styled-fallback' }
        };
      }

      return { success: false, error: e.message || 'Screenshot capture failed' };
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MESSAGE HANDLER
  // ═══════════════════════════════════════════════════════════════════

  window.addEventListener('message', async (event) => {
    // Only accept messages from parent
    if (event.source !== window.parent) return;

    const { type, id, action, selector, text, value, direction, amount } = event.data;
    if (type !== 'vibe-browser-action') return;

    let result;
    try {
      switch (action) {
        case 'click':
          result = await performClick(selector);
          break;
        case 'type':
          result = await performType(selector, text);
          break;
        case 'select':
          result = await performSelect(selector, value);
          break;
        case 'scroll':
          result = await performScroll(direction, amount);
          break;
        case 'snapshot':
          result = { success: true, data: getSnapshot() };
          break;
        case 'content':
          result = { success: true, data: getPageContent() };
          break;
        case 'wait':
          await new Promise(r => setTimeout(r, amount || 1000));
          result = { success: true };
          break;
        case 'screenshot':
          result = await captureScreenshot(event.data.options || {});
          break;
        default:
          result = { success: false, error: 'Unknown action: ' + action };
      }
    } catch (error) {
      result = { success: false, error: error.message };
    }

    // Send result back to parent
    window.parent.postMessage({
      type: 'vibe-browser-result',
      id,
      result
    }, '*');
  });

  // Notify parent that automation is ready
  window.parent.postMessage({ type: 'vibe-browser-ready' }, '*');
  console.log('[Vibe] Browser automation ready');
})();


(function() {
  // Avoid double-initialization
  if (window.__vibeRouteDetectorInitialized) return;
  window.__vibeRouteDetectorInitialized = true;

  // Store detected routes
  let detectedRoutes = new Set(['/']);
  let currentRoute = window.location.pathname || '/';

  // Send message to parent
  function sendToParent(type, data) {
    try {
      window.parent.postMessage({
        source: 'vibe-route-detector',
        type: type,
        ...data
      }, '*');
    } catch (e) {
      console.warn('[Route Detector] Failed to send message:', e);
    }
  }

  // Report current state
  function reportState() {
    sendToParent('state', {
      routes: Array.from(detectedRoutes).sort(),
      currentRoute: currentRoute
    });
  }

  // Detect routes from React Router DOM
  function detectReactRouterRoutes() {
    // Method 1: Look for data-route attributes (if app adds them)
    document.querySelectorAll('[data-route]').forEach(el => {
      const route = el.getAttribute('data-route');
      if (route) detectedRoutes.add(route);
    });

    // Method 2: Look for anchor tags with href starting with /
    document.querySelectorAll('a[href^="/"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href && !href.startsWith('//') && !href.includes(':')) {
        // Clean up dynamic segments for display
        const cleanRoute = href.split('?')[0].split('#')[0];
        if (cleanRoute && cleanRoute.length < 50) {
          detectedRoutes.add(cleanRoute);
        }
      }
    });

    // Method 3: Look for NavLink/Link components (React Router)
    document.querySelectorAll('[class*="nav"], [class*="menu"], nav').forEach(nav => {
      nav.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href');
        if (href && href.startsWith('/')) {
          const cleanRoute = href.split('?')[0].split('#')[0];
          if (cleanRoute && cleanRoute.length < 50) {
            detectedRoutes.add(cleanRoute);
          }
        }
      });
    });
  }

  // Monitor for route changes
  function setupRouteMonitoring() {
    // Track current location
    const updateCurrentRoute = () => {
      const newRoute = window.location.pathname || '/';
      if (newRoute !== currentRoute) {
        currentRoute = newRoute;
        detectedRoutes.add(currentRoute);
        sendToParent('route-changed', { currentRoute, routes: Array.from(detectedRoutes).sort() });
      }
    };

    // Listen for popstate (back/forward)
    window.addEventListener('popstate', updateCurrentRoute);

    // Intercept pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(updateCurrentRoute, 0);
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      setTimeout(updateCurrentRoute, 0);
    };

    // Listen for hashchange (hash routing)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#/')) {
        currentRoute = hash.slice(1); // Remove #
        detectedRoutes.add(currentRoute);
        sendToParent('route-changed', { currentRoute, routes: Array.from(detectedRoutes).sort() });
      }
    });
  }

  // Listen for navigation commands from parent
  function setupCommandListener() {
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || data.source !== 'vibe-route-command') return;

      switch (data.action) {
        case 'navigate':
          if (data.path) {
            // Try React Router navigation first
            if (window.__vibeNavigate) {
              window.__vibeNavigate(data.path);
            } else {
              // Fallback to history API
              history.pushState({}, '', data.path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
            currentRoute = data.path;
            sendToParent('route-changed', { currentRoute, routes: Array.from(detectedRoutes).sort() });
          }
          break;

        case 'detect':
          detectReactRouterRoutes();
          reportState();
          break;

        case 'get-state':
          reportState();
          break;
      }
    });
  }

  // Expose navigation helper for React Router integration
  window.__vibeSetNavigate = function(navigateFn) {
    window.__vibeNavigate = navigateFn;
  };

  // Initialize
  function init() {
    setupRouteMonitoring();
    setupCommandListener();

    // Initial detection after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          detectReactRouterRoutes();
          reportState();
        }, 500); // Wait for React to render
      });
    } else {
      setTimeout(() => {
        detectReactRouterRoutes();
        reportState();
      }, 500);
    }

    // Re-detect periodically for SPAs that load routes dynamically
    let detectCount = 0;
    const detectInterval = setInterval(() => {
      detectReactRouterRoutes();
      detectCount++;
      // Stop after 10 detections (5 seconds)
      if (detectCount >= 10) {
        clearInterval(detectInterval);
      }
    }, 500);

    // Also detect on any click (might reveal new routes)
    document.addEventListener('click', () => {
      setTimeout(detectReactRouterRoutes, 100);
    }, { passive: true });

    console.log('[Vibe] Route detector initialized');
  }

  init();
})();


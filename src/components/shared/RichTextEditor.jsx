import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { sanitizeRichText } from '@/lib/siteContent';

const toolbarButtons = [
  { label: 'H1', command: 'formatBlock', value: 'H1' },
  { label: 'H2', command: 'formatBlock', value: 'H2' },
  { label: 'H3', command: 'formatBlock', value: 'H3' },
  { label: 'Bold', command: 'bold' },
];

const RichTextEditor = ({ value = '', onChange, placeholder = 'Start writing...' }) => {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const normalized = sanitizeRichText(value);
    if (editor.innerHTML !== normalized) {
      editor.innerHTML = normalized;
    }
  }, [value]);

  const syncContent = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = sanitizeRichText(editor.innerHTML);
    editor.innerHTML = nextValue;
    onChange?.(nextValue);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection || !editor || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return selection;

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
    return selection;
  };

  const findBlockElement = (node) => {
    const editor = editorRef.current;
    let currentNode = node?.nodeType === Node.TEXT_NODE ? node.parentNode : node;

    while (currentNode && currentNode !== editor) {
      if (/^(P|H1|H2|H3|LI)$/i.test(currentNode.nodeName)) {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }

    return null;
  };

  const findBlockFromSelection = (selection) => {
    const editor = editorRef.current;
    if (!editor || !selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const directBlock = findBlockElement(range.startContainer);
    if (directBlock) return directBlock;

    if (range.startContainer === editor) {
      const candidate =
        editor.childNodes[range.startOffset] ||
        editor.childNodes[Math.max(0, range.startOffset - 1)];

      if (candidate) {
        return findBlockElement(candidate) || candidate;
      }
    }

    return null;
  };

  const applyBlockFormat = (tagName) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const selection = restoreSelection() || window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      const block = document.createElement(tagName);
      block.innerHTML = '<br />';
      editor.appendChild(block);
      syncContent();
      return;
    }

    const range = selection.getRangeAt(0);

    if (!range.collapsed && range.toString().trim()) {
      const extracted = range.extractContents();
      const wrapper = document.createElement(tagName);
      wrapper.appendChild(extracted);
      range.insertNode(wrapper);

      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveSelection();
      syncContent();
      return;
    }

    const block = findBlockFromSelection(selection);

    if (block) {
      const replacement = document.createElement(tagName);
      replacement.innerHTML = block.innerHTML || '<br />';
      block.parentNode?.replaceChild(replacement, block);

      const newRange = document.createRange();
      newRange.selectNodeContents(replacement);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveSelection();
      syncContent();
      return;
    }

    document.execCommand('formatBlock', false, tagName);
    saveSelection();
    syncContent();
  };

  const applyInlineCommand = (command) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const selection = restoreSelection() || window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    if (selection.isCollapsed || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);

    if (command === 'bold') {
      const extracted = range.extractContents();
      const wrapper = document.createElement('strong');
      wrapper.appendChild(extracted);
      range.insertNode(wrapper);

      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveSelection();
      syncContent();
      return;
    }

    document.execCommand(command, false, null);
    saveSelection();
    syncContent();
  };

  const applyListCommand = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand('insertUnorderedList', false, null);
    syncContent();
  };

  return (
    <div className="max-h-[65vh] overflow-y-auto rounded-2xl border border-white/15 bg-white/5">
      <div className="sticky top-0 z-10 flex flex-wrap gap-2 border-b border-white/10 bg-[rgba(25,25,25,0.92)] p-3 backdrop-blur">
        {toolbarButtons.map((button) => (
          <Button
            key={`${button.command}-${button.label}`}
            type="button"
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/10 text-xs text-white hover:bg-white/20"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              if (button.command === 'formatBlock') {
                applyBlockFormat(button.value);
                return;
              }

              applyInlineCommand(button.command);
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onBlur={() => {
          saveSelection();
          syncContent();
        }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        className="admin-rich-text min-h-[320px] bg-transparent p-4 text-sm leading-7 text-white outline-none"
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;

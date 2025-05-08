import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import './HighlightedTextarea.scss';

const { TextArea } = Input;

interface HighlightedTextareaProps {
}

const HighlightedTextarea: React.FC<HighlightedTextareaProps> = () => {
  const [value, setValue] = useState<string>('');
  const [highlightedValue, setHighlightedValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    highlightText();
  }, [value]);

  const highlightText = () => {
    const parts = splitText(value);
    const highlighted = parts
      .map(part => {
        if (isLogicOperator(part)) {
          return `<span class="logic-operator">${part}</span>`;
        } else if (isKeyValuePair(part)) {
          const [key, value] = part.split("=");
          const cleanKey = key.replace(/["“”]/g, '');
          return `<span class="key">${cleanKey}</span>=<span class="value">${value}</span>`;
        } else if (isInsideQuotes(part)) {
          return `<span class="value">${part}</span>`;
        } else {
          return part;
        }
      })
      .join('');
    setHighlightedValue(highlighted);
  };

  const splitText = (text: string): string[] => {
    const regex = /(\b(?:AND|OR|NOT)\b|TI=["“”][^"“”]*["“”]|URL=["“”][^"“”]*["“”]|DP=["“”][^"“”]*["“”]|AB=["“”][^"“”]*["“”]|["“”][^"“”]*["“”]|TI|URL|DP|AB)/g;
    const parts: string[] = [];
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(match[0]);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };


  const isLogicOperator = (text: string): boolean => {
    return /^(AND|OR|NOT)$/i.test(text);
  };

  const isKeyValuePair = (text: string): boolean => {
    return /^(TI|URL|DP|AB)=["“”][^"“”]*["“”]$/.test(text);
  };

  const isInsideQuotes = (text: string): boolean => {
    return /^["“”][^"“”]*["“”]$/.test(text);
  };


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="highlighted-textarea">
      <div className="textarea-wrapper">
        <TextArea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          rows={10}
          className="real-textarea"
        />
        <div
          className="highlight-overlay"
          dangerouslySetInnerHTML={{ __html: highlightedValue }}
        />
      </div>
    </div>
  );
};

export default HighlightedTextarea;

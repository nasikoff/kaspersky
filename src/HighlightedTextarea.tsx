// HighlightedTextarea.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import './HighlightedTextarea.scss';

const { TextArea } = Input;

interface HighlightedTextareaProps {}

const HighlightedTextarea: React.FC<HighlightedTextareaProps> = () => {
    const [text, setText] = useState<string>('');
    const highlightedTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedTextRef.current) {
            highlight();
        }
    }, [text]);

    const highlight = () => {
        if (!highlightedTextRef.current) return;

        Prism.languages.customLanguage = {
            'keyword': /\b(OR|AND|NOT)\b/,
            'key': /(TI=|AB=|DP=|URL=)/,
            'string': /[\u0022\u201C\u201D](?:[^\\\u0022\u201C\u201D]|\\.)*[\u0022\u201C\u201D]/,
        };

        const highlightedText = Prism.highlight(text, Prism.languages.customLanguage, 'customLanguage');

        const addClasses = (html: string) => {
            let result = html;
            result = result.replace(/<span class="token keyword">/g, '<span class="token keyword custom-keyword">');
            result = result.replace(/<span class="token key">/g, '<span class="token key custom-key">');
            result = result.replace(/<span class="token string">/g, '<span class="token string custom-string">');
            return result;
        };

        highlightedTextRef.current.innerHTML = addClasses(highlightedText);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    return (
        <div className="highlighted-textarea-container">
            <TextArea
                value={text}
                onChange={handleChange}
                placeholder="Введите текст..."
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ resize: 'none' }}
            />
            <div className="highlighted-text" ref={highlightedTextRef}></div>
        </div>
    );
};

export default HighlightedTextarea;

// 本地代码高亮脚本 - 替换 highlight.js

(function() {
    'use strict';
    
    // 语言关键字映射
    const languageKeywords = {
        javascript: [
            'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'return',
            'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch',
            'throw', 'new', 'this', 'super', 'typeof', 'instanceof', 'in', 'of', 'break', 'continue'
        ],
        java: [
            'public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface',
            'extends', 'implements', 'import', 'package', 'void', 'int', 'String', 'boolean',
            'if', 'else', 'for', 'while', 'do', 'return', 'try', 'catch', 'throw', 'throws',
            'new', 'this', 'super', 'null', 'true', 'false'
        ],
        python: [
            'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or',
            'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda',
            'True', 'False', 'None', 'pass', 'break', 'continue'
        ],
        css: [
            'color', 'background', 'font', 'margin', 'padding', 'border', 'width', 'height',
            'display', 'position', 'top', 'left', 'right', 'bottom', 'flex', 'grid'
        ],
        html: [
            'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'header', 'footer', 'nav', 'section', 'article', 'aside', 'main'
        ]
    };
    
    // 高亮单个代码块
    function highlightCodeBlock(codeElement) {
        const code = codeElement.textContent;
        const parentPre = codeElement.closest('pre');
        
        if (!parentPre) return;
        
        // 尝试从类名中获取语言
        let language = 'plain';
        const className = codeElement.className || parentPre.className;
        const langMatch = className.match(/(?:lang|language)-(\w+)/);
        if (langMatch) {
            language = langMatch[1].toLowerCase();
        }
        
        const highlightedCode = highlightCode(code, language);
        codeElement.innerHTML = highlightedCode;
        codeElement.classList.add('hljs', `language-${language}`);
    }
    
    // 高亮代码
    function highlightCode(code, language) {
        let highlighted = escapeHtml(code);
        
        // 高亮关键字
        const keywords = languageKeywords[language] || [];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="hljs-keyword">${keyword}</span>`);
        });
        
        // 高亮字符串
        highlighted = highlighted.replace(
            /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
            '<span class="hljs-string">$1$2$1</span>'
        );
        
        // 高亮数字
        highlighted = highlighted.replace(
            /\b(\d+\.?\d*)\b/g,
            '<span class="hljs-number">$1</span>'
        );
        
        // 高亮注释
        if (language === 'javascript' || language === 'java' || language === 'css') {
            // 单行注释
            highlighted = highlighted.replace(
                /(\/\/.*$)/gm,
                '<span class="hljs-comment">$1</span>'
            );
            // 多行注释
            highlighted = highlighted.replace(
                /(\/\*[\s\S]*?\*\/)/g,
                '<span class="hljs-comment">$1</span>'
            );
        } else if (language === 'python') {
            // Python注释
            highlighted = highlighted.replace(
                /(#.*$)/gm,
                '<span class="hljs-comment">$1</span>'
            );
        } else if (language === 'html') {
            // HTML注释
            highlighted = highlighted.replace(
                /(<!--[\s\S]*?-->)/g,
                '<span class="hljs-comment">$1</span>'
            );
            // HTML标签
            highlighted = highlighted.replace(
                /(&lt;\/?)([\w-]+)([^&]*?)(&gt;)/g,
                '$1<span class="hljs-tag">$2</span>$3$4'
            );
        }
        
        // 高亮函数调用
        highlighted = highlighted.replace(
            /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
            '<span class="hljs-function">$1</span>'
        );
        
        return highlighted;
    }
    
    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 高亮所有代码块
    function highlightAll() {
        const codeElements = document.querySelectorAll('pre code');
        codeElements.forEach(highlightCodeBlock);
    }
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', highlightAll);
    } else {
        highlightAll();
    }
    
    // 暴露给全局
    window.hljs = {
        highlightAll: highlightAll,
        highlight: highlightCode
    };
})(); 
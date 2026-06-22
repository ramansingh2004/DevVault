'use client';

import { BlockResponse } from '@/types/api.types';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  block: BlockResponse;
  isEditing?: boolean;
  onEdit?: (content: string) => void;
}

const LANGUAGE_OPTIONS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'bash',
  'shell',
  'plaintext',
];

export function CodeBlock({ block, isEditing = false, onEdit }: CodeBlockProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [content, setContent] = useState(block.content);
  const [language, setLanguage] = useState((block.meta?.language as string) || 'javascript');
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (onEdit && content.trim()) {
      onEdit(content);
    }
    setIsEditingLocal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEditingLocal || isEditing) {
    return (
      <div className="space-y-3 p-4 bg-muted/50 rounded-md">
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 bg-background border border-input rounded text-sm"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditingLocal(false);
            }
          }}
          className="w-full bg-background border border-input rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-sm min-h-40"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent transition-colors text-xs"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <div
        onClick={() => setIsEditingLocal(true)}
        className="cursor-pointer bg-[#282c34] text-white overflow-x-auto"
      >
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
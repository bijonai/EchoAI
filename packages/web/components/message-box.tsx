import React, { useMemo } from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ShikiHighlighter from 'react-shiki'
import remarkBreaks from 'remark-breaks'

// Define types for markdown components
type MarkdownComponentProps = {
  children?: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Memoize markdown components to prevent unnecessary re-renders
const MemoizedMarkdownComponents: Components = {
  p: React.memo(({ children, ...pProps }: MarkdownComponentProps) => (
    <p {...pProps} className="text-sm leading-6 my-2">
      {children}
    </p>
  )),
  h1: React.memo(({ children, ...h1Props }: MarkdownComponentProps) => (
    <h1 {...h1Props} className="text-xl font-bold my-2">
      {children}
    </h1>
  )),
  h2: React.memo(({ children, ...h2Props }: MarkdownComponentProps) => (
    <h2 {...h2Props} className="text-lg font-bold my-2">
      {children}
    </h2>
  )),
  h3: React.memo(({ children, ...h3Props }: MarkdownComponentProps) => (
    <h3 {...h3Props} className="text-base font-bold my-2">
      {children}
    </h3>
  )),
  h4: React.memo(({ children, ...h4Props }: MarkdownComponentProps) => (
    <h4 {...h4Props} className="text-sm font-bold my-1">
      {children}
    </h4>
  )),
  ul: React.memo(({ children, ...ulProps }: MarkdownComponentProps) => (
    <ul
      {...ulProps}
      className="text-sm list-disc pl-4 my-2 space-y-1"
    >
      {children}
    </ul>
  )),
  ol: React.memo(({ children, ...olProps }: MarkdownComponentProps) => (
    <ol
      {...olProps}
      className="text-sm list-decimal pl-4 my-2 space-y-1"
    >
      {children}
    </ol>
  )),
  li: React.memo(({ children, ...liProps }: MarkdownComponentProps) => (
    <li {...liProps} className="text-sm">
      {children}
    </li>
  )),
  table: React.memo(({ children, ...tableProps }: MarkdownComponentProps) => (
    <div className="my-2 overflow-x-auto">
      <table
        {...tableProps}
        className="text-sm min-w-full border-collapse border border-gray-300"
      >
        {children}
      </table>
    </div>
  )),
  th: React.memo((thProps: MarkdownComponentProps) => (
    <th
      {...thProps}
      className="text-sm border border-gray-300 px-3 py-1.5 bg-gray-50"
    />
  )),
  td: React.memo(({ children, ...tdProps }: MarkdownComponentProps) => (
    <td
      {...tdProps}
      className="text-sm border border-gray-300 px-3 py-1.5"
    >
      {children}
    </td>
  )),
  blockquote: React.memo(({ children, ...bqProps }: MarkdownComponentProps) => (
    <blockquote
      {...bqProps}
      className="text-sm border-l-4 border-gray-300 pl-3 my-2 italic"
    >
      {children}
    </blockquote>
  )),
  a: React.memo(({ children, ...aProps }: MarkdownComponentProps) => (
    <a
      {...aProps}
      className="text-sm text-blue-600 hover:underline"
    >
      {children}
    </a>
  )),
  strong: React.memo(({ children, ...strongProps }: MarkdownComponentProps) => (
    <strong {...strongProps} className="text-sm font-bold">
      {children}
    </strong>
  )),
  em: React.memo(({ children, ...emProps }: MarkdownComponentProps) => (
    <em {...emProps} className="text-sm italic">
      {children}
    </em>
  )),
  code: React.memo(({ node, className, children, ...rest }: MarkdownComponentProps) => {
    const match = /language-(\w+)/.exec(className || '')
    if (match) {
      return (
        <div className="my-2">
          <ShikiHighlighter
            language={match[1]}
            theme="github-dark"
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              borderRadius: '4px',
              padding: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
            }}
          >
            {String(children)}
          </ShikiHighlighter>
        </div>
      )
    }
    return (
      <code
        {...rest}
        className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm`}
      >
        {children}
      </code>
    )
  })
}

export default React.memo(function MessageBox(
  props: {
    avatar: string,
    role: 'user' | 'assistant',
    content: string,
  }
) {
  const markdownPlugins = useMemo(() => [remarkGfm, remarkMath, remarkBreaks], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <div
      className={`flex w-full p-2 gap-2 text-sm ${props.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        }`}
    >
      <div className="flex-shrink-0 w-8 h-8">
        <img className="w-full h-full rounded-full" src={props.avatar} />
      </div>
      <div className="flex-grow min-w-0">
        <div className="w-full h-full bg-[rgba(255,255,255,0.5)] rounded-lg p-4">
          <div className="prose prose-sm max-w-none">
            <Markdown
              remarkPlugins={markdownPlugins}
              rehypePlugins={rehypePlugins}
              components={MemoizedMarkdownComponents}
            >
              {props.content}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
})

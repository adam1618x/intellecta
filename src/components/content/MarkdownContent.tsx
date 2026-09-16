import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    content: string;
    className?: string;
};

/**
 * Shared Markdown renderer for both the public article and the admin preview.
 *
 * Raw HTML is deliberately skipped. React Markdown also applies its safe URL
 * transform, so article content cannot inject executable HTML or javascript:
 * links while regular Markdown and GitHub-Flavoured Markdown remain available.
 */
export default function MarkdownContent({ content, className = "" }: Props) {
    return (
        <div className={`markdown-content ${className}`.trim()}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                {content}
            </ReactMarkdown>
        </div>
    );
}

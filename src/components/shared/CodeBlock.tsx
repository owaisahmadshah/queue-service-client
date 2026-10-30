import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string | object
  title?: string
}

export function CodeBlock({ code, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const formattedCode =
    typeof code === "object" ? JSON.stringify(code, null, 2) : code

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-black/80 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-3 py-1.5 text-muted-foreground">
        <span className="text-[10px] font-semibold uppercase">
          {title || "JSON Payload"}
        </span>
        <button
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 text-[10px] transition-colors hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 leading-relaxed text-emerald-400">
        <code>{formattedCode}</code>
      </pre>
    </div>
  )
}

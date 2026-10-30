import { useState } from "react"
import { apiKeyService } from "@/services/api-key.service"
import { Button } from "@/components/ui/button"
import { X, Key, Copy, Check, Loader2, AlertCircle } from "lucide-react"
import type { ApiKey } from "@/types/api-key.types"

interface CreateApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState("")
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const keyData = await apiKeyService.createKey({
        name: name.trim() || undefined,
      })
      setCreatedKey(keyData)
      onSuccess()
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to generate API key"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = () => {
    if (createdKey?.key) {
      navigator.clipboard.writeText(createdKey.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleModalClose = () => {
    setCreatedKey(null)
    setName("")
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono backdrop-blur-xs">
      <div className="w-full max-w-md space-y-5 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Key className="h-4 w-4 text-primary" />
            <span>
              {createdKey ? "API KEY GENERATED" : "CREATE NEW API KEY"}
            </span>
          </div>
          <button
            onClick={handleModalClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {createdKey ? (
          <div className="space-y-4 text-xs">
            <div className="space-y-1 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-amber-300">
              <span className="font-bold uppercase">Important Notice:</span>
              <p className="text-[11px] leading-relaxed">
                Save this key now. It will not be shown again!
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                Your Secret Key
              </label>
              <div className="flex items-center gap-2 rounded border border-border bg-black/80 p-2.5 font-mono text-emerald-400">
                <code className="flex-1 truncate">{createdKey.key}</code>
                <button
                  onClick={handleCopy}
                  className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleModalClose}
              className="h-9 w-full cursor-pointer text-xs"
            >
              I Have Stored My Secret Key
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase">
                Key Name / Description
              </label>
              <input
                type="text"
                minLength={4}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Production Webhook Service"
                className="h-9 w-full rounded border border-input bg-background px-3 focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="h-8 cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 cursor-pointer gap-2 text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Generate Key"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

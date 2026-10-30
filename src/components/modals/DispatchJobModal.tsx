import { useState } from "react"
import { jobService } from "@/services/job.service"
import { Button } from "@/components/ui/button"
import { X, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { NotificationJobChannel } from "@/types/job.types"

interface DispatchJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const getDate = () => Date.now().toString()

export function DispatchJobModal({
  isOpen,
  onClose,
  onSuccess,
}: DispatchJobModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [channel, setChannel] = useState<NotificationJobChannel>("email")
  const [idempotencyKey, setIdempotencyKey] = useState(
    `manual-test-${getDate()}`
  )
  const [priority, setPriority] = useState(1)
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [payloadJson, setPayloadJson] = useState(
    JSON.stringify(
      {
        to: "developer@example.com",
        subject: "Test Job Execution",
        html: "<h1>Queue Service Notification</h1><p>Manual dispatch test payload.</p>",
      },
      null,
      2
    )
  )

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!apiKey.trim()) {
      setError(
        "An active API key (qs_...) is required to post notification jobs"
      )
      return
    }

    let parsedPayload: Record<string, unknown>
    try {
      parsedPayload = JSON.parse(payloadJson)
    } catch {
      setError("Invalid JSON format in payload field")
      return
    }

    setIsSubmitting(true)
    try {
      await jobService.dispatchJob(
        {
          channel,
          idempotency_key: idempotencyKey,
          priority: Number(priority),
          max_attempts: Number(maxAttempts),
          payload: parsedPayload,
        },
        apiKey.trim()
      )

      setSuccessMsg("Job enqueued successfully!")
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1000)
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ||
          "Failed to dispatch notification job"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono backdrop-blur-xs">
      <div className="w-full max-w-lg space-y-5 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Send className="h-4 w-4 text-primary" />
            <span>DISPATCH NOTIFICATION JOB</span>
          </div>
          <button
            onClick={onClose}
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

        {successMsg && (
          <div className="flex items-center gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground uppercase">
              API Key (x-api-key)
            </label>
            <input
              type="text"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="qs_your_api_key_here"
              className="h-9 w-full rounded border border-input bg-background px-3 font-mono focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground uppercase">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) =>
                  setChannel(e.target.value as NotificationJobChannel)
                }
                className="h-9 w-full rounded border border-input bg-background px-3 font-mono focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="email">email</option>
                <option value="webhook">webhook</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground uppercase">
                Priority
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="h-9 w-full rounded border border-input bg-background px-3 font-mono focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground uppercase">
                Idempotency Key
              </label>
              <input
                type="text"
                required
                value={idempotencyKey}
                onChange={(e) => setIdempotencyKey(e.target.value)}
                className="h-9 w-full rounded border border-input bg-background px-3 font-mono focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground uppercase">
                Max Retries
              </label>
              <input
                type="number"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="h-9 w-full rounded border border-input bg-background px-3 font-mono focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground uppercase">
              Payload (JSON)
            </label>
            <textarea
              rows={5}
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
              className="w-full rounded border border-input bg-black/80 p-3 font-mono text-[11px] text-emerald-400 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
                "Enqueue Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

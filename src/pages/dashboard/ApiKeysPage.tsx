import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiKeyService } from "@/services/api-key.service"
import { QUERY_KEYS } from "@/config/constants"
import { PageHeader } from "@/components/shared/PageHeader"
import { CreateApiKeyModal } from "@/components/modals/CreateApiKeyModal"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { KeyRound, Plus, Ban, RefreshCw, ShieldCheck } from "lucide-react"

export function ApiKeysPage() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    data: keys,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.API_KEYS,
    queryFn: apiKeyService.getUserKeys,
  })

  const revokeMutation = useMutation({
    mutationFn: apiKeyService.revokeKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.API_KEYS })
    },
  })

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="API Keys Manager"
        description="Generate, inspect, and revoke x-api-key authentication tokens for server-to-server notifications"
      >
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 cursor-pointer gap-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Create API Key
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <KeyRound className="h-4 w-4" />
          <span>Active & Revoked Tokens ({keys?.length || 0})</span>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex cursor-pointer items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase">
              <tr>
                <th className="p-3">Key ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Loading API keys...
                  </td>
                </tr>
              ) : keys?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No API keys generated yet. Create one to dispatch jobs via
                    REST!
                  </td>
                </tr>
              ) : (
                keys?.map((key) => {
                  const isRevoked = !!key.revoked_at
                  return (
                    <tr
                      key={key.id}
                      className="transition-colors hover:bg-muted/10"
                    >
                      <td className="p-3 font-semibold text-primary">
                        {key.id.slice(0, 8)}...
                      </td>
                      <td className="p-3 font-medium">
                        {key.name || "Unnamed Key"}
                      </td>
                      <td className="p-3">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400 uppercase">
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                            <ShieldCheck className="h-3 w-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(key.created_at)}
                      </td>
                      <td className="p-3 text-right">
                        {!isRevoked && (
                          <button
                            onClick={() =>
                              revokeMutation.mutate({ key_id: key.id })
                            }
                            disabled={revokeMutation.isPending}
                            className="inline-flex cursor-pointer items-center gap-1 text-xs text-rose-400 hover:underline disabled:opacity-50"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            <span>Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}

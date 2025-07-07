import React from "react";
import { Candidate } from "../interfaces/candidate.interface";
import { Button } from "./ui/button";
import { Eye, Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  candidates: Candidate[];
  onViewResume: (candidate: Candidate) => void;
  onSendEmail: (candidateId: number) => void;
  emailStatus: Record<number, "idle" | "sending" | "sent" | "error">;
  loading: boolean;
};

const getMatchColor = (percent: number) => {
  if (percent >= 80) return "text-green-600";
  if (percent >= 50) return "text-yellow-600";
  return "text-red-600";
};

const CandidateTable: React.FC<Props> = ({
  candidates,
  onViewResume,
  onSendEmail,
  emailStatus,
  loading,
}) => (
  <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white shadow">
    <table className="min-w-full divide-y divide-blue-100">
      <thead className="bg-blue-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Sr No
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Name
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Email
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Match %
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Resume
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-blue-900">
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {candidates.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center text-muted-foreground py-6">
              No candidates found.
            </td>
          </tr>
        ) : (
          candidates.map((candidate, idx) => {
            const status = emailStatus[candidate.id] || "idle";
            return (
              <tr key={candidate.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 text-sm">{idx + 1}</td>
                <td className="px-4 py-2 text-sm font-medium text-blue-900">
                  {candidate.name}
                </td>
                <td className="px-4 py-2 text-sm">{candidate.email}</td>
                <td
                  className={`px-4 py-2 text-sm font-bold ${getMatchColor(
                    candidate.matchPercentage
                  )}`}>
                  {candidate.matchPercentage}%
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View Resume"
                    aria-label="View Resume"
                    onClick={() => onViewResume(candidate)}>
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </td>
                <td className="px-4 py-2">
                  {status === "sending" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      aria-label="Sending Email">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    </Button>
                  ) : status === "sent" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      aria-label="Email Sent">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                  ) : status === "error" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      aria-label="Email Error">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Send Email"
                      aria-label="Send Email"
                      onClick={() => onSendEmail(candidate.id)}
                      disabled={loading}>
                      <Mail className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

export default CandidateTable;

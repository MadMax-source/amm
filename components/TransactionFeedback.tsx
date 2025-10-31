'use client';

interface TransactionFeedbackProps {
  transaction: {
    signature: string;
    status: 'success' | 'error';
    message: string;
  };
  onClose: () => void;
}

export default function TransactionFeedback({ transaction, onClose }: TransactionFeedbackProps) {
  const explorerUrl = transaction.signature
    ? `https://solscan.io/tx/${transaction.signature}?cluster=devnet`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-4 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {transaction.status === 'success' ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 sm:h-10 sm:w-10">
                <svg
                  className="h-5 w-5 text-green-500 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 sm:h-10 sm:w-10">
                <svg
                  className="h-5 w-5 text-red-500 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
            <h3 className="text-base font-semibold text-white sm:text-lg">
              {transaction.status === 'success' ? 'Transaction Successful' : 'Transaction Failed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:text-slate-300"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4 whitespace-pre-wrap rounded-lg bg-slate-700/50 p-3 text-xs text-slate-300 sm:p-4 sm:text-sm">
          {transaction.message}
        </div>

        {transaction.signature && (
          <div className="mb-4">
            <p className="mb-2 text-xs text-slate-400 sm:text-sm">Transaction Signature</p>
            <p className="break-all rounded-lg bg-slate-700/50 p-2 font-mono text-xs text-white sm:truncate">
              {transaction.signature}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {transaction.signature && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              View on Solscan
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-slate-700 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

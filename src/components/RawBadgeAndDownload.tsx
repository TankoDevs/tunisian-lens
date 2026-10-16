import React from 'react';
import { ShieldCheck, FileArchive } from 'lucide-react';

interface RawProps {
  isRaw?: boolean;
  rawDownloadUrl?: string;
  className?: string;
}

export const RawBadgeAndDownload: React.FC<RawProps> = ({ isRaw, rawDownloadUrl, className = '' }) => {
  if (!isRaw) return null;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-ochre/10 border border-ochre/30 rounded-2xl ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-ochre/20 text-ochre flex items-center justify-center shrink-0 border border-ochre/30">
          <ShieldCheck size={18} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-semibold text-ochre-light">Verified RAW Capture</h5>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-ochre/20 text-ochre border border-ochre/30">
              R2 EGRESS FREE
            </span>
          </div>
          <p className="text-[11px] text-mist font-light">Authentic uncompressed camera sensor file</p>
        </div>
      </div>

      {rawDownloadUrl && (
        <a
          href={rawDownloadUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-ochre hover:bg-ochre-light text-canvas font-semibold text-xs rounded-xl transition shadow-md shadow-ochre/20"
        >
          <FileArchive size={14} />
          <span>Download RAW</span>
        </a>
      )}
    </div>
  );
};

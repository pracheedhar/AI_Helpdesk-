import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Paperclip, File, Download, Upload, AlertCircle } from 'lucide-react';

export default function AttachmentSection({ ticketId }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Dummy uploading form state
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const fetchAttachments = async () => {
    try {
      const { data } = await api.get(`/tickets/${ticketId}/attachments`);
      if (data.success) {
        setAttachments(data.data);
      }
    } catch (err) {
      setError('Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [ticketId]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim() || !fileName.trim()) return;

    try {
      setUploading(true);
      setError('');
      const { data } = await api.post(`/tickets/${ticketId}/attachments`, {
        fileUrl,
        fileName,
      });
      if (data.success) {
        setAttachments((prev) => [data.data, ...prev]);
        setFileUrl('');
        setFileName('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload attachment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Paperclip size={16} style={{ color: '#2563eb' }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          Attachments ({attachments.length})
        </h3>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 12, padding: '8px 12px', fontSize: 12 }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Attachment lists */}
      {loading ? (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loading attachments...</div>
      ) : attachments.length === 0 ? (
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '12px 0',
            background: 'var(--surface-2)',
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          No files attached.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {attachments.map((a) => (
            <div
              key={a._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: 'var(--surface-2)',
                borderRadius: 6,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <File size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={a.fileName}
                >
                  {a.fileName}
                </span>
              </div>
              <a
                href={a.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  gap: 4,
                }}
              >
                <Download size={12} />
                View
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Mock Upload Form */}
      <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Upload Attachment (Simulated)
        </div>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="form-input"
          placeholder="File Name (e.g. logs.txt)"
          style={{ fontSize: 12, padding: '6px 10px' }}
          required
        />
        <input
          type="url"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="form-input"
          placeholder="File URL (e.g. https://example.com/file)"
          style={{ fontSize: 12, padding: '6px 10px' }}
          required
        />
        <button
          type="submit"
          className="btn btn-secondary btn-sm"
          style={{ justifyContent: 'center' }}
          disabled={uploading}
        >
          <Upload size={12} />
          {uploading ? 'Attaching...' : 'Attach File'}
        </button>
      </form>
    </div>
  );
}

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";

/**
 * ImageUpload — supports both URL input and file upload (Cloudinary).
 * Props:
 *   value (string)    — current image URL
 *   onChange (fn)      — called with new URL string
 *   label (string)     — field label
 */
export default function ImageUpload({ value = "", onChange, label = "Image" }) {
  const [mode, setMode] = useState("url"); // "url" | "upload"
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUrlApply = () => {
    onChange(urlInput.trim());
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large — max 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      setUrlInput(data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      const msg = err.response?.data?.detail || "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-brand-textSecondary font-semibold mb-2">
        {label}
      </label>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-3">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            mode === "url"
              ? "bg-brand-primary text-white"
              : "bg-brand-subtle text-brand-textSecondary hover:bg-brand-secondary"
          }`}
        >
          <LinkIcon size={12} /> Paste URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            mode === "upload"
              ? "bg-brand-primary text-white"
              : "bg-brand-subtle text-brand-textSecondary hover:bg-brand-secondary"
          }`}
        >
          <Upload size={12} /> Upload File
        </button>
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bk-input flex-1"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="btn-primary px-4 py-2 text-xs"
          >
            Apply
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className="border-2 border-dashed border-brand-primary/20 rounded-xl p-6 text-center cursor-pointer hover:border-brand-primary/40 hover:bg-brand-subtle/50 transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-brand-textMuted">
              <Loader2 size={24} className="animate-spin text-brand-primary" />
              <span className="text-xs">Uploading to cloud…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-brand-textMuted">
              <Upload size={24} className="text-brand-primary/50" />
              <span className="text-xs">Click to choose an image (max 5MB)</span>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-24 rounded-lg object-cover border border-brand-primary/10"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => { onChange(""); setUrlInput(""); }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

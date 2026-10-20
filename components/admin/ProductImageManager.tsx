"use client";

import React, { useState, useRef } from "react";
import { Upload, X, ArrowUp, ArrowDown, Edit3, Image as ImageIcon, Link as LinkIcon, Check, RefreshCw } from "lucide-react";

interface ProductImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ProductImageManager({ images, onChange }: ProductImageManagerProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress / resize image if needed before saving as Data URL to keep storage lean
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        reject(new Error("Please upload a valid image file (PNG, JPG, WebP, SVG)."));
        return;
      }

      // Max file size 5MB
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("Image size should be less than 5MB."));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // If image is large, resize using Canvas to avoid bloating localStorage
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/webp", 0.85));
              return;
            }
          }
          resolve(result);
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const dataUrl = await processImageFile(file);
        newImages.push(dataUrl);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to process image.");
      }
    }
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setManualUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);
    onChange(newImages);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditUrlValue(images[index]);
  };

  const saveEditedUrl = (index: number) => {
    if (!editUrlValue.trim()) return;
    const updated = [...images];
    updated[index] = editUrlValue.trim();
    onChange(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group ${
          isDraggingOver
            ? "border-fylter-gold bg-fylter-gold/10 scale-[1.01]"
            : "border-fylter-border/60 hover:border-fylter-gold/60 bg-fylter-darkest/60 hover:bg-fylter-dark/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center text-fylter-gold group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-fylter-offWhite">
            Drag & drop product images here, or <span className="text-fylter-gold underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-fylter-muted">
            Supports PNG, JPG, WebP, SVG • Auto-optimized for instant loading
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alternative URL Input */}
      <form onSubmit={handleManualAdd} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fylter-muted">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Or paste an image URL (https://...)"
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-xs text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-1 focus:ring-fylter-gold/40 focus:border-fylter-gold/50"
          />
        </div>
        <button
          type="submit"
          disabled={!manualUrl.trim()}
          className="px-4 py-2 rounded-lg btn-3d-gold text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          Add URL
        </button>
      </form>

      {/* Image Gallery & Editing List */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-fylter-paleGold uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-fylter-gold" />
            Product Gallery ({images.length} images — first is primary thumbnail)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-xl border p-2.5 flex items-center gap-3 bg-fylter-darkest/90 transition-all ${
                  i === 0
                    ? "border-fylter-gold/60 shadow-lg shadow-fylter-gold/5"
                    : "border-fylter-border/40 hover:border-fylter-border"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative w-16 h-16 rounded-lg border border-fylter-border/40 bg-fylter-dark overflow-hidden shrink-0 group">
                  <img
                    src={img}
                    alt={`Product preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-fylter-gold text-fylter-darkest text-[9px] font-black uppercase text-center py-0.5">
                      Cover
                    </span>
                  )}
                </div>

                {/* Details / Inline Edit */}
                <div className="flex-1 min-w-0">
                  {editingIndex === i ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editUrlValue}
                        onChange={(e) => setEditUrlValue(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded bg-fylter-dark border border-fylter-gold/60 text-fylter-offWhite focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => saveEditedUrl(i)}
                        className="p-1 rounded bg-fylter-gold text-fylter-darkest hover:bg-fylter-lightGold"
                        title="Save URL"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="p-1 rounded bg-fylter-border/40 text-fylter-muted hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-fylter-offWhite font-medium truncate">
                        {img.startsWith("data:") ? "Uploaded Image (Local File)" : img}
                      </p>
                      <span className="text-[10px] text-fylter-muted">
                        Position #{i + 1} {i === 0 ? "• Primary Hero Image" : ""}
                      </span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => handleMoveImage(i, "up")}
                      disabled={i === 0}
                      className="p-1 rounded text-fylter-muted hover:text-fylter-gold hover:bg-fylter-dark disabled:opacity-20 disabled:hover:text-fylter-muted transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImage(i, "down")}
                      disabled={i === images.length - 1}
                      className="p-1 rounded text-fylter-muted hover:text-fylter-gold hover:bg-fylter-dark disabled:opacity-20 disabled:hover:text-fylter-muted transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => (editingIndex === i ? setEditingIndex(null) : startEditing(i))}
                      className="p-1 rounded text-fylter-muted hover:text-fylter-gold hover:bg-fylter-dark transition-colors"
                      title="Edit URL"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="p-1 rounded text-red-400/70 hover:text-red-400 hover:bg-red-950/40 ml-auto transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-fylter-muted italic">No images added yet. Drag and drop or upload an image above.</p>
      )}
    </div>
  );
}

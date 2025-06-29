import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export default function ImagePreviewModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  alt = "Image preview" 
}: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-green-500">
        <div className="relative flex items-center justify-center min-h-[50vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
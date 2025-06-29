import React, { useState } from 'react';
import ImagePreviewModal from './image-preview-modal';

interface ClickableImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  rounded?: 'full' | 'lg';
}

export default function ClickableImage({ 
  src, 
  alt = "Clickable image", 
  className = "",
  onClick,
  width = "w-full",
  height = "h-full",
  rounded = 'lg',
}: ClickableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`${width} ${height} cursor-pointer transition-transform hover:scale-105 ${className}`}
        style={{ aspectRatio: '1/1' }}
        onClick={handleClick}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${rounded === 'full' ? 'rounded-full' : 'rounded-lg'}`}
        />
      </div>
      
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={src}
        alt={alt}
      />
    </>
  );
} 
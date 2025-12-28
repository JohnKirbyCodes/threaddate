"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Full size image view of {alt}
          </Dialog.Description>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

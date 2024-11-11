"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Ai = "openai" | "recraft" | "ideogram" | "black-forest-labs";
type ImageGenerateInput = {
  id?: string;
  type: "generate";
  ai: Ai;
  model: string;
  prompt: string;
  size: string;
  url: string;
  expiresAt: number;
  raw?: boolean;
};
type ImageVectorizeInput = {
  id?: string;
  type: "vectorize";
  ai: Ai;
  url: string;
  expiresAt: number;
};
type ImageRemoveBackgroundInput = {
  id?: string;
  type: "remove-background";
  ai: "recraft";
  url: string;
  expiresAt: number;
};
export type Image = { id: string } & (
  | ImageGenerateInput
  | ImageVectorizeInput
  | ImageRemoveBackgroundInput
);

type ImageContextType = {
  images: Image[];
  addImage: (
    data: ImageGenerateInput | ImageVectorizeInput | ImageRemoveBackgroundInput
  ) => { id: string };
  removeImage: (id: string) => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const storedImages = Object.keys(localStorage).filter((key) =>
      key.startsWith("gennmix-")
    );

    const parsedImages = storedImages.map((key) =>
      JSON.parse(localStorage.getItem(key)!)
    ) as Image[];

    const filteredImages = parsedImages.filter((image) => {
      const expired = image.expiresAt < Date.now();
      if (expired) {
        localStorage.removeItem(`gennmix-${image.id}`);
      }
      return !expired;
    });

    setImages(filteredImages);
  }, []);

  const addImage = (
    data: ImageGenerateInput | ImageVectorizeInput | ImageRemoveBackgroundInput
  ) => {
    const id = data.id ?? crypto.randomUUID();
    const newImage = { ...data, id } as Image;
    localStorage.setItem(`gennmix-${id}`, JSON.stringify(newImage));
    setImages([newImage, ...images]);
    return { id };
  };

  const removeImage = (id: string) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
    localStorage.removeItem(`gennmix-${id}`);
  };

  return (
    <ImageContext.Provider value={{ images, addImage, removeImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
}

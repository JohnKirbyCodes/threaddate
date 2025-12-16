import { z } from "zod";

export const tagSubmissionSchema = z.object({
  // Step 1: Image
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP"
    ),
  croppedImage: z.string().optional(), // Base64 cropped image

  // Step 2: Classification
  brandId: z.number().positive("Please select a brand"),
  category: z.enum([
    "Neck Tag",
    "Care Tag",
    "Button/Snap",
    "Zipper",
    "Tab",
    "Stitching",
    "Print/Graphic",
    "Hardware",
    "Other",
  ]),

  // Step 3: Details
  era: z.enum([
    "Pre-1900s",
    "1900s",
    "1910s",
    "1920s",
    "1930s",
    "1940s",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s (Y2K)",
    "2010s",
    "2020s",
    "Modern",
  ]),
  yearStart: z.number().min(1800).max(2030).optional(),
  yearEnd: z.number().min(1800).max(2030).optional(),
  stitchType: z.enum(["Single", "Double", "Chain", "Other"]).optional(),
  originCountry: z.string().max(100).optional(),
  submissionNotes: z.string().max(1000).optional(),
});

export type TagSubmission = z.infer<typeof tagSubmissionSchema>;

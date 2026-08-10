import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    section: z.enum(['Stories', 'Japan', 'World', 'Arts', 'Notebook']),
    themes: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    language: z.enum(['ja', 'en']).default('ja'),
  }),
});

export const collections = { stories };

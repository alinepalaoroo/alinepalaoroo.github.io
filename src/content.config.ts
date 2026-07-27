import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    setor: z.string(),
    periodo: z.string(),
    stack: z.array(z.string()),
    ordem: z.number(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    publicadoEm: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { cases, blog };

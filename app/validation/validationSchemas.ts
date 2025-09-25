import { z } from 'zod'

export const domainSchema = z.object({
  domain: z.string().min(1, "Dont leave this section empty")
    .refine((value: string) => {
      const domainRegex = /^www\.[a-z0-9-]+\.com$/i

      if (domainRegex.test(value)) return true;

      return false;
    }, {
      message: "Domain name must be in the form of 'www.example.com'."
    }),

  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  isActive: z.union([z.literal(0), z.literal(1)])
})
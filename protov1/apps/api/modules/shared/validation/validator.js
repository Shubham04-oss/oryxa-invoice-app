// Request validation helper using Zod

import { z } from 'zod';

/**
 * Validate request body against Zod schema
 */
export function validateRequest(schema, data) {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    throw error;
  }
}

/**
 * Common validation schemas
 */

export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const currencySchema = z.enum([
  'USD',
  'EUR',
  'GBP',
  'INR',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
]);

export const dateSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  'Invalid date format'
);

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Middleware for Next.js API routes
 */
export function withValidation(schema) {
  return (handler) => {
    return async (req, res) => {
      const validation = validateRequest(schema, req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      // Attach validated data to request
      req.validatedData = validation.data;

      return handler(req, res);
    };
  };
}

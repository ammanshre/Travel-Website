import { z } from 'zod';

export const createTaxiSchema = z.object({
    make: z.string().nonempty({ message: "Make is required" }),
    model: z.string().nonempty({ message: "Model is required" }),
    year: z.number().min(1900, { message: "Year must be at least 1900" }),
    licensePlate: z.string().nonempty({ message: "License Plate is required" }),
    color: z.string().nonempty({ message: "Color is required" }),
    capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
    ratePerKm: z.number().min(0, { message: "Rate per KM must be at least 0" }),
});

export type CreateTaxiFormValues = z.infer<typeof createTaxiSchema>;

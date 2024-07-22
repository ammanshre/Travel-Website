// src/schemas/createHotelSchema.ts
import { z } from "zod";

export const createHotelSchema = z.object({
  hotelName: z.string().nonempty({ message: "Hotel Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
  city: z.object({
    city: z.string().nonempty(),
    _id: z.string().nonempty(),
    population: z.number().min(1)
  }).nullable()
});

export type CreateHotelFormValues = z.infer<typeof createHotelSchema>;

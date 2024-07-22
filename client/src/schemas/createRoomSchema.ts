import * as z from "zod";

export const createRoomSchema = z.object({
    name: z.string().nonempty("Room name is required"),
    description: z.string().nonempty("Description is required"),
    price: z.preprocess((val) => Number(val), z.number().positive("Price must be a positive number")),
    quantity: z.preprocess((val) => Number(val), z.number().positive("Quantity must be a positive number").int("Quantity must be an integer")),
    type: z.enum(['single', 'double', 'suite', 'deluxe', 'presidential']),
});

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

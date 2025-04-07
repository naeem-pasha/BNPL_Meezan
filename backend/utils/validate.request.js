const { z } = require("zod");

// Define Zod validation schema
const requestByUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, {
    message: "Invalid CNIC format (e.g., 12345-1234567-1)",
  }),
  email: z.string().email({ message: "Invalid email format" }),
  EmployID: z.string().min(1, { message: "EmployID is required" }),
  phoneNo: z.string().regex(/^03\d{9}$/, {
    message: "Invalid phone number format (e.g., 03001234567)",
  }),
  City: z.string().min(1, { message: "City is required" }),
  bikeColor: z.string().min(1, { message: "Bike color is required" }),
  bikeVarient: z.string().min(1, { message: "Bike variant is required" }),
  engineNo: z.number().optional(),
  chasisNo: z.number().optional(),
  status: z.string().optional(),
  isAprovedByBank: z.boolean().optional(),
  isAprovedByVendor: z.boolean().optional(),

  installment_tenure: z
    .number()
    .min(1, { message: "Installment tenure must be a positive number" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
});

module.exports = requestByUserSchema;

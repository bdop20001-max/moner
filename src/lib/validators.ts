import { z } from "zod";

export const memberLoginSchema = z.object({
  userId: z.string().trim().min(3, "ইউজার আইডি দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("সঠিক ইমেইল দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8, "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "নতুন পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });

export const memberProfileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  profession: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(600).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export const genderEnum = z.enum(["MALE", "FEMALE"]);

export const adminCreateMemberSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  gender: genderEnum,
  age: z.coerce.number().int().min(18, "সদস্য অবশ্যই ১৮ বছর বা তার বেশি হতে হবে").max(90),
  district: z.string().trim().min(2).max(60),
  profession: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(600).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  planId: z.string().optional().or(z.literal("")),
  avatarColor: z.string().optional(),
});

export const adminUpdateMemberSchema = adminCreateMemberSchema.extend({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  verification: z.enum(["UNVERIFIED", "PENDING", "VERIFIED"]),
  featured: z.coerce.boolean(),
});

export const walletAdjustSchema = z.object({
  amount: z.coerce.number().int(),
  credits: z.coerce.number().int(),
  note: z.string().trim().max(200).optional().or(z.literal("")),
});

export const planUpsertSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "slug শুধু ছোট হাতের অক্ষর, সংখ্যা ও - দিয়ে হতে হবে"),
  price: z.coerce.number().int().min(0),
  durationDays: z.coerce.number().int().min(1),
  chatCredits: z.coerce.number().int().min(0),
  features: z.string().trim().min(1), // newline-separated in the form, split before saving
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const reportSchema = z.object({
  reportedId: z.string().min(1),
  reason: z.string().trim().min(3).max(120),
  details: z.string().trim().max(600).optional().or(z.literal("")),
});

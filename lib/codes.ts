import { customAlphabet } from "nanoid";

export const generateShortCode = customAlphabet(
  "23456789ABCDEFGHJKMNPQRSTUVWXYZ",
  6,
);

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Bengali Helper Functions
const bngNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\d/g, (d) => bngNumbers[parseInt(d)]);
}

export const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export function getCurrentBengaliMonth() {
  return BENGALI_MONTHS[new Date().getMonth()];
}

export function getCurrentYear() {
  return new Date().getFullYear().toString();
}

export function formatCurrency(amount: number) {
  return `৳ ${toBengaliNumber(amount)}`;
}

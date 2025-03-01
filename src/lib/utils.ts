import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsAdmin = async (userId: string) =>{
    let isAdmin;
    const { data: customer, error } = await supabase
      .from("customers")
      .select("subscription_tier")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return;
    }

    isAdmin = customer?.subscription_tier === "admin";

    return isAdmin;
  }
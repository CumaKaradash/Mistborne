import { supabase } from "@/lib/supabase"

export interface Letter {
  id: string
  content: string
  mood: string
  delivery_at: string
  created_at: string
}

export async function sendLetter(content: string, mood: string): Promise<{ success: boolean; error?: string }> {
  const deliveryAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from("letters").insert({
    content,
    mood,
    delivery_at: deliveryAt,
  })

  if (error) {
    console.error("Error sending letter:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getArrivedLetters(): Promise<Letter[]> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .lte("delivery_at", now)
    .order("delivery_at", { ascending: false })

  if (error) {
    console.error("Error fetching letters:", error)
    return []
  }

  return data || []
}

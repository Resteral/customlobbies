import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Local developer mode fallback inventory
      return NextResponse.json({
        gold_pot: 1,
        gold_seed: 5,
        status: "local_dev_fallback"
      })
    }

    // Query premium items table in Supabase
    const { data: items, error } = await supabase
      .from('premium_items')
      .select('item_type, quantity')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const inventory: Record<string, number> = {
      gold_pot: 0,
      gold_seed: 0
    }

    items?.forEach(item => {
      inventory[item.item_type] = (inventory[item.item_type] || 0) + item.quantity
    })

    return NextResponse.json(inventory)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

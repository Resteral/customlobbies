import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Mock listings for developer mode
      return NextResponse.json([
        { id: "mock-list-1", seller_name: "TraderJoe", item_type: "diamond_weed", quantity: 1, price_cash: 500 },
        { id: "mock-list-2", seller_name: "FisherPaul", item_type: "golden_bass", quantity: 2, price_cash: 150 },
        { id: "mock-list-3", seller_name: "MinerDave", item_type: "scrap_metal", quantity: 5, price_cash: 25 }
      ])
    }

    const { data: listings, error } = await supabase
      .from('p2p_market_listings')
      .select('*')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(listings)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { item_type, quantity, price_cash } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Mock listing success
      return NextResponse.json({
        success: true,
        status: "simulated_local_list",
        message: "Successfully listed item on simulated market."
      })
    }

    const { data: listing, error } = await supabase
      .from('p2p_market_listings')
      .insert({
        seller_id: user.id,
        seller_name: user.email?.split('@')[0] || "Player",
        item_type: item_type,
        quantity: quantity,
        price_cash: price_cash,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, listing })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

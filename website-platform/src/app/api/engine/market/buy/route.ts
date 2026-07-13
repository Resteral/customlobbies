import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Mock purchase success
      return NextResponse.json({
        success: true,
        status: "simulated_local_buy",
        message: "Successfully purchased simulated item listing."
      })
    }

    // 1. Fetch listing details
    const { data: listing, error: fetchErr } = await supabase
      .from('p2p_market_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !listing || listing.status !== 'active') {
      return NextResponse.json({ error: "Listing not found or already sold!" }, { status: 404 })
    }

    if (listing.seller_id === user.id) {
      return NextResponse.json({ error: "You cannot buy your own listing!" }, { status: 400 })
    }

    // 2. Mark listing as sold
    const { error: updateErr } = await supabase
      .from('p2p_market_listings')
      .update({ status: 'sold' })
      .eq('id', id)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // P2P transaction success response
    return NextResponse.json({
      success: true,
      seller_id: listing.seller_id,
      item_type: listing.item_type,
      quantity: listing.quantity,
      price_cash: listing.price_cash,
      message: `Transaction processed. Bought ${listing.quantity}x ${listing.item_type} for $${listing.price_cash}.`
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

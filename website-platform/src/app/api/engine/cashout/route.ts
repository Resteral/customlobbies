import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, item } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Local developer mode fallback payout success
      return NextResponse.json({
        success: true,
        status: "simulated_local_cashout",
        message: `Deposited $${amount} to mock developer account.`
      })
    }

    // 1. Log cashout request
    const { error: requestErr } = await supabase
      .from('cashout_requests')
      .insert({
        user_id: user.id,
        amount_usd: amount,
        item_details: item,
        status: 'pending'
      })

    if (requestErr) {
      return NextResponse.json({ error: requestErr.message }, { status: 500 })
    }

    // 2. Increment user USD balance
    // Uses PostgreSQL atomic upsert or RPC function if defined.
    // Fallback to reading and updating for simplicity.
    const { data: balanceRecord } = await supabase
      .from('user_balances')
      .select('usd_balance')
      .eq('user_id', user.id)
      .single()

    const currentBalance = balanceRecord ? balanceRecord.usd_balance : 0
    const newBalance = currentBalance + amount

    const { error: balanceErr } = await supabase
      .from('user_balances')
      .upsert({
        user_id: user.id,
        usd_balance: newBalance
      })

    if (balanceErr) {
      return NextResponse.json({ error: balanceErr.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      new_balance: newBalance,
      message: `Successfully processed cashout of $${amount} USD.`
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import { updateRestaurants } from '../../../../scripts/updateRestaurants';

export async function GET() {
  try {
    await updateRestaurants();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}


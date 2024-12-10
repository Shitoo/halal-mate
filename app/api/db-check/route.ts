import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Test the database connection
    const result = await sql`SELECT COUNT(*) FROM restaurants`;
    
    // Get a sample of restaurants to verify data
    const sample = await sql`
      SELECT * FROM restaurants 
      LIMIT 5
    `;
    
    return NextResponse.json({ 
      status: 'connected',
      totalCount: result.rows[0].count,
      sampleData: sample.rows,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: error
    }, { status: 500 });
  }
}


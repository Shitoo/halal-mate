import { sql } from '@vercel/postgres';
import { updateRestaurants } from './updateRestaurants';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

async function populateDatabase() {
  try {
    // First, check if the table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'restaurants'
      );
    `;

    if (!tableExists.rows[0].exists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS restaurants (
          id SERIAL PRIMARY KEY,
          place_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          vicinity TEXT NOT NULL,
          lat DOUBLE PRECISION NOT NULL,
          lng DOUBLE PRECISION NOT NULL,
          rating DOUBLE PRECISION,
          user_ratings_total INTEGER,
          city TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create the index in a separate query
      await sql`
        CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city)
      `;
      
      console.log('Created restaurants table and index');
    }

    // Update restaurants data
    await updateRestaurants();
    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

// Run the population script
populateDatabase().catch(console.error);


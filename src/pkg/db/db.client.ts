import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare:false is REQUIRED for the Supabase Transaction Pooler (prepared statements unsupported).
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle({ client, schema });

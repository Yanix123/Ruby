import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { favorites, items } from "./schema";

// Standalone client (session-mode pooler) — the seed runs outside Next.js.
const client = postgres(process.env.DIRECT_URL ?? process.env.DATABASE_URL!, {
  prepare: false,
});
const db = drizzle({ client, schema });

// imageUrl is left null on purpose — the poster placeholder is derived at render
// time by `posterUrl()` (single source of truth in shared/ui/movie-card).
const movies = [
  { title: "Blade Runner 2049", description: "A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard." },
  { title: "Arrival", description: "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft land worldwide." },
  { title: "Dune", description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset on the desert planet Arrakis." },
  { title: "Interstellar", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { title: "The Martian", description: "An astronaut is presumed dead and left behind on Mars, and must find a way to survive and signal that he is alive." },
  { title: "Ex Machina", description: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence." },
  { title: "Annihilation", description: "A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply." },
  { title: "Moon", description: "An astronaut nears the end of his three-year solitary stint mining helium-3 on the far side of the Moon." },
];

async function main() {
  // "Clear movies only, keep users": favorites first (FK), then items.
  await db.delete(favorites);
  await db.delete(items);

  await db.insert(items).values(movies);

  const count = await db.select().from(items);
  console.log(`seeded ${count.length} movies`);
  await client.end();
}

main().then(() => process.exit(0));

import type { InferSelectModel } from 'drizzle-orm'

import type { items } from '@/pkg/db/schema.table'

// Derived from the Drizzle schema so the type can never drift from the table.
export type IMovie = InferSelectModel<typeof items>

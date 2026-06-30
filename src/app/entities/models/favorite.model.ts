import type { InferSelectModel } from 'drizzle-orm'

import type { favorites } from '@/pkg/db/schema.table'

// Derived from the Drizzle schema so the type can never drift from the table.
export type IFavorite = InferSelectModel<typeof favorites>

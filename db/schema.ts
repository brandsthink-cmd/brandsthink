import {sql} from 'drizzle-orm';
import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const leads=sqliteTable('leads',{
 id:text('id').primaryKey(),name:text('name').notNull(),business:text('business').notNull(),email:text('email').notNull(),phone:text('phone').notNull().default(''),website:text('website').notNull().default(''),industry:text('industry').notNull().default(''),budget:text('budget').notNull().default(''),currentLeads:integer('current_leads'),targetLeads:integer('target_leads'),challenge:text('challenge').notNull(),consent:integer('consent').notNull(),privacyVersion:text('privacy_version').notNull(),ipHash:text('ip_hash').notNull(),createdAt:text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
},t=>[index('idx_leads_ip_created').on(t.ipHash,t.createdAt)]);

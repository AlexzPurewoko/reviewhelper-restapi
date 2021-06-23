import express from 'express'
import { SupabaseClient } from "@supabase/supabase-js";

export abstract class Handler {
    abstract path: string;
    protected supabase: SupabaseClient | null = null;

    abstract handle(request: express.Request , response:  express.Response): Promise<void>

    setSupabase(supabaseClient: SupabaseClient): void {
        this.supabase = supabaseClient;
    }
}
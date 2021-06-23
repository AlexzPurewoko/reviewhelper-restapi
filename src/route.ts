import { SupabaseClient } from "@supabase/supabase-js";
import { Handler } from "./data/handler";
import { GetGuidelineByClassId } from "./handler/GetGuidelineByClassId";
import {Express} from 'express-serve-static-core';
import { GetGuidelineClasses } from "./handler/GetGuidelineClasses";
import { AddClassGuideline } from "./handler/AddClassGuideline";
import { AddGuideline } from "./handler/AddGuideline";
import { DeleteGuidelineData } from "./handler/DeleteGuidelineData";
import { DeleteGuidelineClass } from "./handler/DeleteGuidelineClass";


// just add your custom handlers here...
const handlerData: Handler[] = [
    new GetGuidelineByClassId(),
    new GetGuidelineClasses(),
    new AddClassGuideline(),
    new AddGuideline(), 
    new DeleteGuidelineData(),
    new DeleteGuidelineClass()
]

export async function initializeRoutes(supabase: SupabaseClient, expressApp: Express) {
    // initialize supabase on all routes 
    handlerData.forEach((item) => {
        item.setSupabase(supabase);
    });

    // initialize all paths
    handlerData.forEach((item) => {
        expressApp.get(item.path, (req, res) => {
            item.handle(req, res);
        });
    })
}
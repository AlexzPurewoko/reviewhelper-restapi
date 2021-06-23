import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import { initializeRoutes } from './route';

const PORT = process.env.PORT || 5000;



(async () => {
    const supabaseUrl: string = 'https://idcwghyjlmjudylmanoi.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || "add here"
    console.log(supabaseKey)
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.auth.signIn({
        email: "purwoko908@gmail.com"
    })

    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    initializeRoutes(supabase, app);

    app.listen(PORT, () => {
        console.log(`Server is running at PORT ${PORT}`);
    })

})();

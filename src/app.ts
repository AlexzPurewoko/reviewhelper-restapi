import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import { initializeRoutes } from './route';

const PORT = process.env.PORT || 5000;



(async () => {
    const supabaseUrl: string = 'https://idcwghyjlmjudylmanoi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI0NDA1MjYwLCJleHAiOjE5Mzk5ODEyNjB9.a8tXFD2SObhZDbCFmoD_yVQ5Lh2Ed_ng9HDn1IKt9g8'
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.auth.signIn({
        email: "purwoko908@gmail.com"
    })

    console.log(await supabase?.from("guideline_classes")?.select("*"))

    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    initializeRoutes(supabase, app);

    app.listen(PORT, () => {
        console.log(`Server is running at PORT ${PORT}`);
    })

})();

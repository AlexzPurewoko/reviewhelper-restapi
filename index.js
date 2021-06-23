// const hapi = require("@hapi/hapi");
// const PORT = process.env.PORT || 5000;

// const init = async () => {
//     const server = hapi.Server({
//         port: 3000,
//         host: 'localhost'
//     });

//     await server.start();
//     server.
//     console.log('server running on %s', server.info.url);
// }

// process.on('unhandledRejection', (err) => {
//     console.log(err)
//     process.exit(1);
// });

// init();

const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const {createClient} = require('@supabase/supabase-js');

const supabaseUrl = 'https://idcwghyjlmjudylmanoi.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDQwNTI2MCwiZXhwIjoxOTM5OTgxMjYwfQ.xI8xC_BphiCoKYbkrWHOBgt2ngjWm-CpOLaKR6NzuSI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    let { data, error } = await supabase
        .from('table-coba')
        .select('*')
    
    console.log(data)
    
    const app = express();
    app.exte
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    app.get('/', (req, res) => {
        res.status(200);
        res.json(data[0])
    })
    
    
    app.listen(PORT, () => console.log('Server started!'));
    
}

main()

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/cool', (req, res) => res.send(cool()))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
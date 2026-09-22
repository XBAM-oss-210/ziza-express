require('dotenv').config();   //charger le package et le .env
const express = require ('express')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path')
const helmet = require('helmet');


const pool =require('./config/database')
const adminRoutes= require('./routes/adminRoutes')
const clientRoute= require('./routes/clientRoute');
const { checkOpenHours } = require('./middlewares/checkOpenHour');

const app = express();
app.set('trust proxy', 1); //

const port = process.env.PORT || 3000;

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(express.static('public'));
    app.use(express.json());
    app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],

            styleSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com"
            ],

            fontSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.gstatic.com"
            ],

            scriptSrc: ["'self'"],

            objectSrc: ["'none'"],
        },



    })
    );

    app.use(
    session({
        // Stocke les sessions dans PostgreSQL
        store: new pgSession({
        pool: pool,
        createTableIfMissing: true

        }),

        // secret:Clé secrète utilisée par express-session pour sécuriser les données/signatures des cookies de session
        //resave: Ne recrée pas inutilement la session à chaque requête
        // saveUninitialized: Ne crée pas de session pour un utilisateur qui n'en utilise pas
        //httponly Empêche JavaScript dans le navigateur d'accéder au cooki

        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 5
        }
    })
    );


    app.get('/', (req, res) => {
            res.render ('index');
        });
    app.get('/order-tracking', (req, res) => {
        res.render('ordertracking');
    });

    app.get('/about-us', (req, res) => {
        res.render('about-us');
    });

    app.get('/urgence-service', (req, res) => {
        res.render('urgence-service');
    });


    app.use('/api/admin',adminRoutes)
    app.use('/client',checkOpenHours,clientRoute)
    app.use('/admin_ziza',adminRoutes)
    

    app.use((req, res) => {
        res.render("client/closed");
    });
    

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Serveur running on http://localhost:${port}`);
    });
}

module.exports = app;


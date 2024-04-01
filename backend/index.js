import express from 'express';
import FileUpload from 'express-fileupload'
import cors from 'cors';
import session from 'express-session';
import SequelzeStore from 'connect-session-sequelize';
import dotenv from 'dotenv';
import db from './config/Database.js';
import UserRoute from './routes/UserRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
dotenv.config();

const app = express();

const sessionStore = SequelzeStore(session.Store);

const store = new sessionStore({
    db: db
})

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// Uncoment perintah dibawah untuk langsung auto migrate, setelah itu coment lagi.
// (async () => {
//     await db.sync();
// })();
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...");
})
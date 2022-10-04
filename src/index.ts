import http from 'http';
import Express from 'express';

const PORT = process.env.PORT || 3000;
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

http.createServer(app).listen(() => console.log(`server listening at ${PORT} 🚀`));

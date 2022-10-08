import http from 'http';
import express from 'express';
import PresentationResourcesOrchestrator from './presentation/resources';
import ConcreteInMemoryCache from './data-access/in-memory-cache/implementation';

const PORT = process.env.PORT || 3000;
const app = express();
const router = PresentationResourcesOrchestrator.configureRouter({
  routerInstance: express.Router(),
  inMemoryCache: new ConcreteInMemoryCache(),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

http.createServer(app).listen(PORT, () => console.log(`server listening at ${PORT} 🚀`));

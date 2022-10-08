import { Router } from 'express';
import TodoController from './to-do/controller';
import InMemoryCache from '../../data-access/in-memory-cache';
import InMemoryTodoRepository from '../../data-access/repositories/to-do/in-memory';

export type PresentationResourcesOrchestratorProps = {
  routerInstance: Router;
  inMemoryCache: InMemoryCache;
};
export default class PresentationResourcesOrchestrator {
  static configureRouter({
    routerInstance,
    inMemoryCache,
  }: PresentationResourcesOrchestratorProps): Router {
    const todoRepository = new InMemoryTodoRepository(inMemoryCache);
    const todosCtrl = new TodoController(todoRepository);

    routerInstance.post('/to-dos', todosCtrl.create);
    routerInstance.get('/to-dos/mine', todosCtrl.listMine);

    return routerInstance;
  }
}

import { Router } from 'express';
import ConcreteTodoBuilder from '../../domain/entities/to-do/builder/implementation';
import TodoController from './to-do/controller';

export default class PresentationResourcesOrchestrator {
  static configureRouter(routerInstance: Router): Router {
    const todosCtrl = new TodoController(new ConcreteTodoBuilder());
    routerInstance.get('/to-dos/mine', todosCtrl.listMine);
    return routerInstance;
  }
}

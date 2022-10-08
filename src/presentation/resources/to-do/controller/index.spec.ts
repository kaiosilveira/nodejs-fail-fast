import TodoController from '.';
import * as httpCodes from '../../../enumerators/http/status-codes';
import FakeTodoRepository from '../../../../data-access/repositories/to-do/fake';
import FakeExpressFactory from '../../../../__mocks__/express/factory';
import FakeTodo from '../../../../domain/entities/to-do/fake';

describe('TodoController', () => {
  describe('create', () => {
    const userId = '123-abc';

    it('should return bad request if title is not defined', async () => {
      const todoRepository = new FakeTodoRepository();
      const ctrl = new TodoController(todoRepository);

      const req = FakeExpressFactory.createRequest({ headers: {}, body: { title: undefined } });
      const res = FakeExpressFactory.createResponse();
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid to-do title' });
    });

    it('should return bad request if user id is undefined', async () => {
      const todoRepository = new FakeTodoRepository();
      const ctrl = new TodoController(todoRepository);

      const req = FakeExpressFactory.createRequest({
        headers: { 'x-user-id': undefined },
        body: { title: 'Learn Typescript' },
      });

      const res = FakeExpressFactory.createResponse();
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid user identifier' });
    });

    it('should return bad request if user id is empty', async () => {
      const todoRepository = new FakeTodoRepository();
      const ctrl = new TodoController(todoRepository);

      const req = FakeExpressFactory.createRequest({
        headers: { 'x-user-id': '' },
        body: { title: 'Learn Typescript' },
      });

      const res = FakeExpressFactory.createResponse();
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid user identifier' });
    });

    it('should create a to do', async () => {
      const id = 'abc-def';
      const title = 'Learn Typescript';

      const createdTodo = new FakeTodo();
      jest.spyOn(createdTodo, 'toJSON').mockReturnValue({ id, title });

      const todoRepository = new FakeTodoRepository();
      jest.spyOn(todoRepository, 'create').mockResolvedValue(createdTodo);

      const req = FakeExpressFactory.createRequest({
        headers: { 'x-user-id': userId },
        body: { title },
      });

      const res = FakeExpressFactory.createResponse();
      const spyOnResJson = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoRepository);
      await ctrl.create(req, res);

      expect(spyOnResJson).toHaveBeenCalledWith({ id, title });
    });
  });

  describe('list', () => {
    it('should return bad request if user id is not provided', async () => {
      const todoRepository = new FakeTodoRepository();

      const req = FakeExpressFactory.createRequest();
      const res = FakeExpressFactory.createResponse();
      const spyOnStatusFn = jest.spyOn(res, 'status');
      const spyOnJsonFn = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoRepository);
      await ctrl.listMine(req, res);

      expect(spyOnStatusFn).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnJsonFn).toHaveBeenCalledWith({ msg: 'Invalid user identifier' });
    });

    it('should return all registered to-dos for a given user', async () => {
      const userId = 'abc-123';
      const todoRepository = new FakeTodoRepository();

      const fakeTodo1 = new FakeTodo();
      jest
        .spyOn(fakeTodo1, 'toJSON')
        .mockReturnValue({ id: '456-123', title: 'Learn TS', ownerId: userId });

      const fakeTodo2 = new FakeTodo();
      jest
        .spyOn(fakeTodo2, 'toJSON')
        .mockReturnValue({ id: '567-423', title: 'Read TDD', ownerId: userId });

      jest.spyOn(todoRepository, 'listByOwnerId').mockResolvedValue([fakeTodo1, fakeTodo2]);

      const req = FakeExpressFactory.createRequest({ headers: { 'x-user-id': userId }, body: {} });
      const res = FakeExpressFactory.createResponse();
      const spyOnJsonFn = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoRepository);
      await ctrl.listMine(req, res);

      expect(spyOnJsonFn).toHaveBeenCalledWith([fakeTodo1.toJSON(), fakeTodo2.toJSON()]);
    });
  });
});

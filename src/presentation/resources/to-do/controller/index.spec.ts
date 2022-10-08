jest.mock('../../../../domain/entities/to-do/builder');

import TodoController from '.';
import * as httpCodes from '../../../enumerators/http/status-codes';

import FakeTodo from '../../../../domain/entities/to-do/fake';
import ConcreteTodo from '../../../../domain/entities/to-do/implementation';
import FakeTodoBuilder from '../../../../domain/entities/to-do/builder/fake';

import FakeExpressFactory from '../../../../__mocks__/express/factory';

describe('TodoController', () => {
  describe('create', () => {
    const userId = '123-abc';

    it('should return 403 - BAD REQUEST if title is not defined', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

      const req = FakeExpressFactory.createRequest({ headers: {}, body: { title: undefined } });
      const res = FakeExpressFactory.createResponse();
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid to-do title' });
    });

    it('should return 403 - BAD REQUEST if user id is undefined', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

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

    it('should return 403 - BAD REQUEST if user id is empty', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

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
      const todoBuilder = new FakeTodoBuilder();
      const fakeTodo = new FakeTodo();

      jest.spyOn(fakeTodo, 'save').mockImplementation(jest.fn());
      jest.spyOn(fakeTodo, 'toJSON').mockReturnValue({ id, title });
      jest.spyOn(todoBuilder, 'build').mockReturnValue(fakeTodo);
      const spyOnWithTitle = jest.spyOn(todoBuilder, 'withTitle').mockReturnValue(todoBuilder);
      const spyOnWithOwnerId = jest.spyOn(todoBuilder, 'withOwnerId').mockReturnValue(todoBuilder);

      const req = FakeExpressFactory.createRequest({
        headers: { 'x-user-id': userId },
        body: { title },
      });

      const res = FakeExpressFactory.createResponse();
      const spyOnResJson = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoBuilder);
      await ctrl.create(req, res);

      expect(spyOnWithOwnerId).toHaveBeenCalledWith(userId);
      expect(spyOnWithTitle).toHaveBeenCalledWith(title);
      expect(spyOnResJson).toHaveBeenCalledWith({ id, title });
    });
  });

  describe('list', () => {
    it('should return 403 - BAD REQUEST if user id is not provided', () => {
      const todoBuilder = new FakeTodoBuilder();
      const req = FakeExpressFactory.createRequest();
      const res = FakeExpressFactory.createResponse();
      const spyOnStatusFn = jest.spyOn(res, 'status');
      const spyOnJsonFn = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoBuilder);
      ctrl.listMine(req, res);

      expect(spyOnStatusFn).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnJsonFn).toHaveBeenCalledWith({ msg: 'Invalid user identifier' });
    });

    it('should return all registered to-dos for a given user', async () => {
      const userId = 'abc-123';
      const todo1 = new ConcreteTodo({ id: '456-123', title: 'Learn TS', ownerId: userId });
      const todo2 = new ConcreteTodo({ id: '567-423', title: 'Read TDD', ownerId: userId });

      const todoBuilder = new FakeTodoBuilder();
      const fakeTodo = new FakeTodo();

      jest.spyOn(fakeTodo, 'listByOwnerId').mockResolvedValue([todo1, todo2]);
      jest.spyOn(todoBuilder, 'withTitle').mockReturnValue(todoBuilder);
      jest.spyOn(todoBuilder, 'build').mockReturnValue(fakeTodo);

      const req = FakeExpressFactory.createRequest({ headers: { 'x-user-id': userId }, body: {} });
      const res = FakeExpressFactory.createResponse();
      const spyOnJsonFn = jest.spyOn(res, 'json');

      const ctrl = new TodoController(todoBuilder);
      await ctrl.listMine(req, res);

      expect(spyOnJsonFn).toHaveBeenCalledWith([todo1.toJSON(), todo2.toJSON()]);
    });
  });
});

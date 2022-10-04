import { Request, Response } from 'express';
import FakeExpressResponse from '../../../../__mocks__/express/response';
import TodoController from '.';
import * as httpCodes from '../../../enumerators/http/status-codes';
import FakeTodoService from '../../../../application/services/todo/fake';

describe('TodoController', () => {
  describe('create', () => {
    it('should return 403 - BAD REQUEST if title is not defined', async () => {
      const todoService = new FakeTodoService();
      const ctrl = new TodoController({ todoService });

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      const req = { body: {} } as Request;

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid to-do title' });
    });

    it('should create a to do', async () => {
      const title = 'Learn Typescript';
      const todoService = new FakeTodoService();

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnResJson = jest.spyOn(res, 'json');
      const spyOnSvcCreate = jest
        .spyOn(todoService, 'createTodo')
        .mockReturnValue(Promise.resolve(1));

      const req = { body: { title } } as Request;

      const ctrl = new TodoController({ todoService });
      await ctrl.create(req, res);

      expect(spyOnSvcCreate).toHaveBeenCalledWith({ title });
      expect(spyOnResJson).toHaveBeenCalledWith({ id: 1, title });
    });
  });
});

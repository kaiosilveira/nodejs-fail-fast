jest.mock('../../../../domain/entities/to-do/builder');

import { Request, Response } from 'express';

import TodoController from '.';
import * as httpCodes from '../../../enumerators/http/status-codes';

import FakeTodo from '../../../../domain/entities/to-do/fake';
import FakeTodoBuilder from '../../../../domain/entities/to-do/builder/fake';

import FakeExpressResponse from '../../../../__mocks__/express/response';

describe('TodoController', () => {
  describe('create', () => {
    const userId = '123-abc';

    it('should return 403 - BAD REQUEST if title is not defined', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      const req = { headers: {}, body: { title: undefined } } as Request;

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid to-do title' });
    });

    it('should return 403 - BAD REQUEST if user id is undefined', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      const req = {
        headers: { 'x-user-id': undefined },
        body: { title: 'Learn Typescript' },
      } as unknown as Request;

      await ctrl.create(req, res);

      expect(spyOnStatus).toHaveBeenCalledWith(httpCodes.BAD_REQUEST);
      expect(spyOnResJson).toHaveBeenCalledWith({ msg: 'Invalid user identifier' });
    });

    it('should return 403 - BAD REQUEST if user id is empty', async () => {
      const todoBuilder = new FakeTodoBuilder();
      const ctrl = new TodoController(todoBuilder);

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnStatus = jest.spyOn(res, 'status');
      const spyOnResJson = jest.spyOn(res, 'json');

      const req = {
        headers: { 'x-user-id': '' },
        body: { title: 'Learn Typescript' },
      } as unknown as Request;

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
      jest.spyOn(todoBuilder, 'withTitle').mockReturnValue(todoBuilder);
      jest.spyOn(todoBuilder, 'build').mockReturnValue(fakeTodo);

      const res = new FakeExpressResponse() as unknown as Response;
      const spyOnResJson = jest.spyOn(res, 'json');

      const req = { headers: { 'x-user-id': userId }, body: { title } } as unknown as Request;

      const ctrl = new TodoController(todoBuilder);
      await ctrl.create(req, res);

      expect(spyOnResJson).toHaveBeenCalledWith({ id, title });
    });
  });
});

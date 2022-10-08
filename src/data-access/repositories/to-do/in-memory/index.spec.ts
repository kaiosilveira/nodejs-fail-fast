jest.mock('crypto');

import * as Crypto from 'crypto';
import InMemoryTodoRepository from '.';
import ConcreteTodo from '../../../../domain/entities/to-do/implementation';
import FakeInMemoryCache from '../../../in-memory-cache/fake';

jest.spyOn(Crypto, 'randomUUID').mockReturnValue('');

describe('InMemoryTodoRepository', () => {
  describe('list', () => {
    it('should return an empty array if no to-do was found in the cache', async () => {
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'exists').mockResolvedValue(false);

      const retrievalManager = new InMemoryTodoRepository(inMemoryCache);
      const todoList = await retrievalManager.list();

      expect(todoList).toEqual([]);
    });

    it('should return an empty array if to-do entry in cache is undefined', async () => {
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'exists').mockResolvedValue(true);
      jest.spyOn(inMemoryCache, 'get').mockResolvedValue(undefined);

      const retrievalManager = new InMemoryTodoRepository(inMemoryCache);
      const todoList = await retrievalManager.list();

      expect(todoList).toEqual([]);
    });

    it('should throw an error if to-do entry in cache is not an array', async () => {
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'exists').mockResolvedValue(true);
      jest.spyOn(inMemoryCache, 'get').mockResolvedValue('42');

      const retrievalManager = new InMemoryTodoRepository(inMemoryCache);
      await expect(retrievalManager.list()).rejects.toThrow(
        'Cache has a fatal defect. To-dos entry is not an array'
      );
    });

    it('should list all to-dos', async () => {
      const todo1Json = { id: '123', title: 'Learn TS', ownerId: '234' };
      const todo2Json = { id: '345', title: 'Learn Active Record', ownerId: '456' };

      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'exists').mockResolvedValue(true);
      jest.spyOn(inMemoryCache, 'get').mockResolvedValue(JSON.stringify([todo1Json, todo2Json]));

      const retrievalManager = new InMemoryTodoRepository(inMemoryCache);
      const todoList = await retrievalManager.list();

      expect(todoList).toEqual([new ConcreteTodo(todo1Json), new ConcreteTodo(todo2Json)]);
    });
  });

  describe('listByOwnerId', () => {
    afterEach(() => jest.resetAllMocks());

    it('should throw an error if ownerId is empty', async () => {
      const ownerId = '';
      const inMemoryCache = new FakeInMemoryCache();
      const todoRepo = new InMemoryTodoRepository(inMemoryCache);

      await expect(todoRepo.listByOwnerId(ownerId)).rejects.toThrow(
        'Failed to list all to-dos by owner id. Invalid owner identifier'
      );
    });

    it('should return an empty array if there is items in the to-do entry in the cache', async () => {
      const ownerId = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce(undefined);

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.listByOwnerId(ownerId);

      expect(result).toEqual([]);
    });

    it('should throw an error if cache entry for to-dos is not an array', async () => {
      const ownerId = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce('42');

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      await expect(todoRepo.listByOwnerId(ownerId)).rejects.toThrow(
        'Cache has a fatal defect. To-dos entry is not an array'
      );
    });

    it('should list all to-dos from a given owner id', async () => {
      const ownerId = 'abc-123';
      const todo1Data = { id: '123', title: 'Learn TS', ownerId };
      const todo2Data = { id: '234', title: 'Learn the repository pattern', ownerId };
      const todo3Data = { id: '456', title: 'Learn React', ownerId: 'bcd-234' };

      const inMemoryCache = new FakeInMemoryCache();
      jest
        .spyOn(inMemoryCache, 'get')
        .mockResolvedValueOnce(JSON.stringify([todo1Data, todo2Data, todo3Data]));

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.listByOwnerId(ownerId);

      expect(result).toHaveLength(2);
      expect(result.some(todo => todo.getId() === todo1Data.id)).toBe(true);
      expect(result.some(todo => todo.getId() === todo2Data.id)).toBe(true);
      expect(result.some(todo => todo.getId() === todo3Data.id)).toBe(false);
    });
  });

  describe('getById', () => {
    it('should throw an error if id is invalid', async () => {
      const id = '';
      const inMemoryCache = new FakeInMemoryCache();
      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      await expect(todoRepo.getById(id)).rejects.toThrow(
        'Failed to get to-do by id. Invalid identifier'
      );
    });

    it('should return undefined if there is no entry in the cache for to-dos', async () => {
      const id = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce(undefined);

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.getById(id);

      expect(result).toEqual(undefined);
    });

    it('should return undefined if to-do entry in cache is empty', async () => {
      const id = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce('[]');

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.getById(id);

      expect(result).toEqual(undefined);
    });

    it('should throw an error if cache entry for to-dos is not an array', async () => {
      const id = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce('42');

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      await expect(todoRepo.getById(id)).rejects.toThrow(
        'Cache has a fatal defect. To-dos entry is not an array'
      );
    });

    it('should return a to-do by its id', async () => {
      const id = 'abc-123';
      const inMemoryCache = new FakeInMemoryCache();
      const todoData = { id, ownerId: '345-edv', title: 'Learn TS' };
      jest.spyOn(inMemoryCache, 'get').mockResolvedValue(JSON.stringify([todoData]));

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.getById(id);

      expect(result).toBeDefined();
      expect(result?.getId()).toEqual(todoData.id);
      expect(result?.getOwnerId()).toEqual(todoData.ownerId);
      expect(result?.getTitle()).toEqual(todoData.title);
    });
  });

  describe('create', () => {
    it('should throw an error if title is invalid', async () => {
      const inMemoryCache = new FakeInMemoryCache();
      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      await expect(todoRepo.create({ title: '', ownerId: 'abc-123' })).rejects.toThrow(
        'Failed to create to-do. Title is invalid'
      );
    });

    it('should throw an error if ownerId is invalid', async () => {
      const inMemoryCache = new FakeInMemoryCache();
      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      await expect(todoRepo.create({ title: 'Learn TS', ownerId: '' })).rejects.toThrow(
        'Failed to create to-do. OwnerId is invalid'
      );
    });

    it('should create a to-do', async () => {
      const id = 'abc-123';
      const ownerId = '234-134';
      const title = 'Learn TS';

      const inMemoryCache = new FakeInMemoryCache();
      jest.spyOn(inMemoryCache, 'get').mockResolvedValueOnce(JSON.stringify([]));
      jest.spyOn(inMemoryCache, 'set').mockResolvedValueOnce(undefined);
      jest.spyOn(Crypto, 'randomUUID').mockReturnValue(id);

      const todoRepo = new InMemoryTodoRepository(inMemoryCache);
      const result = await todoRepo.create({ title, ownerId });

      expect(result.getId()).toBe(id);
      expect(result.getTitle()).toEqual(title);
      expect(result.getOwnerId()).toEqual(ownerId);
    });
  });
});

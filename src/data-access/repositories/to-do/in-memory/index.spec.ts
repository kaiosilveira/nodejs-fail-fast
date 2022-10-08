import InMemoryTodoRepository from '.';
import ConcreteTodo from '../../../../domain/entities/to-do/implementation';
import FakeInMemoryCache from '../../../in-memory-cache/fake';

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
});

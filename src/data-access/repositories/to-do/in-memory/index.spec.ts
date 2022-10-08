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
});

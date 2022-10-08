import noop from 'lodash/noop';
import ConcreteTodo from '.';
import { TodoPersistenceManager } from '../../../../data-access/persistence/managers/persistence-manager';
import { TodoRetrievalManager } from '../../../../data-access/retrieval/managers/retrieval-manager';

describe('ConcreteTodo', () => {
  describe('toJSON', () => {
    it('should return a POJO representation of itself', () => {
      const title = 'Learn active record';
      const ownerId = '1234';
      const todo = new ConcreteTodo({ title, ownerId });

      const json = todo.toJSON();

      expect(json).toEqual({ title, ownerId });
    });
  });

  describe('save', () => {
    it('should throw an error if no persistance manager was defined when executing save', async () => {
      const todo = new ConcreteTodo({ title: 'Learn Typescript', ownerId: '2345' });
      await expect(todo.save()).rejects.toThrow(`No persistance manager was defined for to-do`);
    });

    it('should save itself', async () => {
      const id = 'abc';
      const persistenceManager = { save: () => Promise.resolve(id) } as TodoPersistenceManager;

      const todo = new ConcreteTodo({
        title: 'Learn Typescript',
        ownerId: '2345',
        persistenceManager,
      });
      await todo.save();

      expect(todo.getId()).toEqual(id);
    });
  });

  describe('list', () => {
    it('should throw an error if no persistence manager was defined for to-do when executing list', async () => {
      const todo = new ConcreteTodo({ title: 'Temp obj', ownerId: 'system' });
      await expect(todo.list()).rejects.toThrow(
        `No retrieval manager was defined for to-do with id "${todo.getId()}"`
      );
    });

    it('should return a list of to-do items', async () => {
      const persistenceManager = { save: noop } as unknown as TodoPersistenceManager;
      const retrievalManager = { list: noop } as unknown as TodoRetrievalManager;
      const todoList = [
        new ConcreteTodo({ id: '1234', title: 'Learn JS', ownerId: '234' }),
        new ConcreteTodo({ id: '2345', title: 'Learn Typescript', ownerId: '234' }),
        new ConcreteTodo({ id: '2346', title: 'Learn C#', ownerId: '235' }),
      ];

      jest.spyOn(retrievalManager, 'list').mockResolvedValue(todoList);

      const todo = new ConcreteTodo({
        title: 'Temp obj',
        ownerId: 'system',
        persistenceManager,
        retrievalManager,
      });

      const result = await todo.list();

      expect(result).toEqual(todoList);
    });
  });
});

import ConcreteTodo from '.';
import { TodoPersistenceManager } from '../../../../data-access/persistence/managers/persistence-manager';

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
});

import ConcreteTodo from '.';

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
});

import ConcreteTodo from '.';

describe('ConcreteTodo', () => {
  describe('toJSON', () => {
    it('should return a POJO representation of itself', () => {
      const title = 'Learn active record';
      const todo = new ConcreteTodo(title);
      const json = todo.toJSON();
      expect(json).toEqual({ title });
    });
  });
});

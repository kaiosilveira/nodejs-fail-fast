import TodoBuilder from '.';

describe('TodoBuilder', () => {
  describe('withTitle', () => {
    it('should throw an error if title is empty', () => {
      expect(() => new TodoBuilder().withTitle('')).toThrow(
        'Invalid title. Expected a non-empty string.'
      );
    });

    it('should build a to-do with a title', () => {
      const title = 'Learn the Active Record pattern';
      const todo = new TodoBuilder().withTitle(title).build();
      expect(todo.getTitle()).toEqual(title);
    });
  });
});

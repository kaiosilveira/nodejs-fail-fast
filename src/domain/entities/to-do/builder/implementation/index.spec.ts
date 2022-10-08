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

  describe('withOwnerId', () => {
    it('should throw an error if title is empty', () => {
      expect(() => new TodoBuilder().withOwnerId('')).toThrow(
        'Invalid ownerId. Expected a non-empty string.'
      );
    });

    it('should build a to-do with a ownerId', () => {
      const ownerId = '1234-432432';
      const todo = new TodoBuilder().withOwnerId(ownerId).build();
      expect(todo.getOwnerId()).toEqual(ownerId);
    });
  });
});

[![Continuous Integration](https://github.com/kaiosilveira/nodejs-ts-express-template/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/nodejs-ts-express-template/actions/workflows/ci.yml)

ℹ️ _This repository is an example implementation in NodeJS of the "fail fast" pattern as described in "Release it! - Nygard" and is part of my Stability Patterns Series. Check out [kaiosilveira/stability-patterns](https://github.com/kaiosilveira/stability-patterns) for more details._

# Fail Fast

Software systems eventually fail. They fail because of many reasons, but especially because of malformed inputs. In such cases, it's always better to _fail fast_, i.e., before compromising a lot of expensive resources in an optimistic attempt to execute an operation just to fail miserably later, making clients wait for much more time than they should. This pattern shares some ideas on how to approach this idea.

## Hypothetical domain

The hypothetical domain presented here is a simple "to-do" application, with endpoints to create and list the to-dos. Each to-do has a `title`, an `ownerId` and an `id` (after being created). The `Todo` interface looks like this:

```typescript
interface Todo extends Serializable {
  getId(): string;
  getOwnerId(): string;
  getTitle(): string;
}
```

Notice that it implements the `Serializable` interface, which defines the `toJSON` operation. This is used to ensure that all entities are parsed back to raw JSON objects before being delivered to external clients.

Interactions with the application are performed over HTTP:

- Create a to-do:

```shell
➜ curl -X POST localhost:3000/to-dos -H 'x-user-id: 1234' -d title="Learn Active Record"
```

- List all my to-dos:

```shell
➜ curl -X GET localhost:3000/to-dos/mine -H 'x-user-id: 1234'
```

## Application structure

This application is structured in three main layers:

- `domain`: Contains the entity definitions

- `data-access`: Contains all the logic related to storing data to and retrieving data from the data store

- `presentation`: Contains the definitions for endpoints and routes

## Failing fast

The concept of "failing fast" is applied in multiple layers. First of all, the `TodoController` does not move forward with an operation if the input values are malformed. A good example is:

```javascript
export default class TodoController {
  // code
  async create(req: Request, res: Response) {
    const { title } = req.body;
    const userId = req.headers['x-user-id']?.toString();

    if (!title) return res.status(BAD_REQUEST).json({ msg: 'Invalid to-do title' });
    if (!userId) return res.status(BAD_REQUEST).json({ msg: 'Invalid user identifier' });

    const todo = await this.todoRepository.create({ title, ownerId: userId });
    return res.json(todo.toJSON());
  }
  // more code
}
```

It fails fast with a `400: BAD REQUEST` if either `title` or `userId` is `undefined`, and only after validating that everything is ok, it proceeds to invoke the `todoRepository`.

The `TodoRepository` itself also implements a "fail fast" approach. When listing all to-dos of a given user, for instance, it performs the following validations before compromising potentially expensive database resources:

- makes sure `ownerId` is valid
- exits early if there is no cache entry for the `TO_DO_KEY`

```javascript
export default class InMemoryTodoRepository implements TodoRepository {
  // core
  async listByOwnerId(ownerId: string): Promise<Todo[]> {
    if (!ownerId)
      throw new Error('Failed to list all to-dos by owner id. Invalid owner identifier');

    const serializedPayload = await this.inMemoryCache.get(TO_DO_KEY);
    if (!serializedPayload) return [];

    const todoList = this.deserializeTodoList(serializedPayload);
    const todoListOfOwner = todoList.filter((t: Todo) => t.getOwnerId() === ownerId);
    return todoListOfOwner;
  }
  // more code
}
```

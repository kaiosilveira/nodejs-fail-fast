import { Request, Response } from 'express';
import TodoBuilder from '../../../../domain/entities/to-do/builder';
import { BAD_REQUEST } from '../../../enumerators/http/status-codes';

export default class TodoController {
  constructor(private readonly todoBuilder: TodoBuilder) {
    this.create = this.create.bind(this);
    this.listMine = this.listMine.bind(this);
  }

  async create(req: Request, res: Response) {
    const { title } = req.body;
    const userId = req.headers['x-user-id']?.toString();

    if (!title) return res.status(BAD_REQUEST).json({ msg: 'Invalid to-do title' });
    if (!userId) return res.status(BAD_REQUEST).json({ msg: 'Invalid user identifier' });

    const todo = this.todoBuilder.withOwnerId(userId).withTitle(title).build();
    todo.save();

    return res.json(todo.toJSON());
  }

  async listMine(req: Request, res: Response) {
    const userId = req.headers['x-user-id']?.toString();
    if (!userId) return res.status(BAD_REQUEST).json({ msg: 'Invalid user identifier' });

    const result = await this.todoBuilder.build().listByOwnerId(userId);
    return res.json(result.map(r => r.toJSON()));
  }
}

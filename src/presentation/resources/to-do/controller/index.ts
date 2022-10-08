import { Request, Response } from 'express';
import TodoRepository from '../../../../data-access/repositories/to-do';
import { BAD_REQUEST } from '../../../enumerators/http/status-codes';

export default class TodoController {
  constructor(private readonly todoRepository: TodoRepository) {
    this.create = this.create.bind(this);
    this.listMine = this.listMine.bind(this);
  }

  async create(req: Request, res: Response) {
    const { title } = req.body;
    const userId = req.headers['x-user-id']?.toString();

    if (!title) return res.status(BAD_REQUEST).json({ msg: 'Invalid to-do title' });
    if (!userId) return res.status(BAD_REQUEST).json({ msg: 'Invalid user identifier' });

    const todo = await this.todoRepository.create({ title, ownerId: userId });
    return res.json(todo.toJSON());
  }

  async listMine(req: Request, res: Response) {
    const userId = req.headers['x-user-id']?.toString();
    if (!userId) return res.status(BAD_REQUEST).json({ msg: 'Invalid user identifier' });

    const result = await this.todoRepository.listByOwnerId(userId);
    return res.json(result.map(r => r.toJSON()));
  }
}

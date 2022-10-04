import { Request, Response } from 'express';
import TodoService from '../../../../application/services/todo';
import { BAD_REQUEST } from '../../../enumerators/http/status-codes';

export default class TodoController {
  private readonly todoService: TodoService;

  constructor(props: { todoService: TodoService }) {
    this.todoService = props.todoService;
  }

  async create(req: Request, res: Response) {
    const { title } = req.body;
    if (!title) return res.status(BAD_REQUEST).json({ msg: 'Invalid to-do title' });

    const id = await this.todoService.createTodo({ title });
    return res.json({ id, title });
  }
}

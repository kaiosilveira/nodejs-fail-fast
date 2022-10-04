export default interface TodoService {
  createTodo(props: { title: string }): Promise<number>;
}

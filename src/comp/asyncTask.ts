export const asyncTask = <T>() => {
  let tasks: (() => Promise<T>)[] = [];
  const insert = (task: () => Promise<T>) => {
    tasks.push(task);
    return this;
  };
  const run = async () => {
    console.log(tasks, "tasks");
    for (const i of tasks) {
      await i();
    }
    return this;
  };

  const clear = () => {
    tasks = [];
  };
  return { insert, run, clear };
};

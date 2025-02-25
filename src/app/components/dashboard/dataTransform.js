const transformData = (data) => {
  const tasks = {};
  const columns = {};
  const columnOrder = [];
  data?.forEach((column) => {
    const taskIds = column?.tasks?.map((task) => {
      tasks[task?.id?.toString()] = { ...task };
      return task.id?.toString();
    });
    columns[column.id] = {
      id: column?.id?.toString(),
      title: column.name,
      showData: true,
      taskIds,
      is_defalut: column.is_defalut,
      defalut_name: column.defalut_name,
      column: column?.column_ids,
      total_length: column?.total_tasks,
      is_private: columnOrder?.is_private,
    };

    columnOrder.push(column?.id?.toString());
  });

  return {
    tasks,
    columns,
    columnOrder,
  };
};

export default transformData;

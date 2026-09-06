// CORE MODEL OF THIS PROJECT
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskQueryParams {
  completed?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number;
}

export interface PaginatedTasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

import { http } from "@/api/httpClient";

// TYPES

export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "PENDING" | "COMPLETE";

// UI INPUT
export type TaskPayload = {
    title: string;
    description?: string;
    priority: Priority;
    status?: Status;
    dueDate?: Date | null;
};

// API RESPONSE
export type Task = {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    dueDate?: string | null;
};

// HELPERS
const formatDate = (date?: Date | null): string | null => {
    return date ? date.toISOString().split("T")[0] : null;
};

// TASK API

export const getTasks = async (params?: {
    status?: string;
    priority?: string;
    keyword?: string;
}): Promise<Task[]> => {
    const query = new URLSearchParams();

    if (params?.status && params.status !== "ALL") {
        query.append("status", params.status);
    }

    if (params?.priority && params.priority !== "ALL") {
        query.append("priority", params.priority);
    }

    if (params?.keyword) {
        query.append("keyword", params.keyword);
    }

    const qs = query.toString();
    const url = qs ? `/api/v1/tasks?${qs}` : `/api/v1/tasks`;

    const data = await http.get(url);
    return data.content;
};

export const createTask = async (task: TaskPayload): Promise<Task> => {
    return http.post("/api/v1/tasks", {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: formatDate(task.dueDate),
    });
};

export const updateTask = async (
    id: string,
    task: TaskPayload
): Promise<Task> => {
    return http.put(`/api/v1/tasks/${id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: formatDate(task.dueDate),
    });
};

export const deleteTask = async (id: string): Promise<void> => {
    return http.del(`/api/v1/tasks/${id}`);
};
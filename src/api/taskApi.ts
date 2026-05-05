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

// PAGINATION RESPONSE
export type PageResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

// HELPERS
const formatDate = (date?: Date | null): string | null => {
    return date ? date.toISOString().split("T")[0] : null;
};

// TASK API

export const getTasks = async (params?: {
    page?: number;
    size?: number;
    status?: string;
    priority?: string;
    keyword?: string;
}): Promise<PageResponse<Task>> => {

    const query = new URLSearchParams();

    // pagination (the part you forgot existed)
    query.append("page", String(params?.page ?? 0));
    query.append("size", String(params?.size ?? 10));

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
    const url = `/api/v1/tasks?${qs}`;

    const data = await http.get(url);

    // STOP discarding metadata
    return data;
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
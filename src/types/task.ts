export type Task = {
    id: string
    title: string
    description?: string
    priority: "LOW" | "MEDIUM" | "HIGH"
    status: "PENDING" | "COMPLETE"
    dueDate?: string | null
}

export type TaskForm = {
    id?: string
    title: string
    description?: string
    priority: "LOW" | "MEDIUM" | "HIGH"
    status: "PENDING" | "COMPLETE"
    dueDate?: Date | null
}
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import AddTaskDialog from "@/components/add-task-dialog"
import TaskItem from "@/components/task-item"
import { InputInline } from "@/components/input-inline"

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "@/api/taskApi"

import { clearTokens, getAccessToken } from "@/api/authApi"
import type { Task, TaskForm } from "@/types/task"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
} from "@/components/ui/empty"

import { CirclePlus, ClipboardListIcon } from "lucide-react"

export default function Dashboard() {
    const navigate = useNavigate()

    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [open, setOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "PENDING" | "COMPLETE">("ALL")

    const [priorityFilter, setPriorityFilter] =
        useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL")

    const [keyword, setKeyword] = useState("")
    const [searchTrigger, setSearchTrigger] = useState(0)

    // ERROR HANDLER

    const showError = (err: any, fallback: string) => {
        console.error(err)

        if (err?.message?.includes("Session expired")) {
            clearTokens()
            navigate("/login")
            return
        }

        toast.error(err?.message || fallback)
    }

    // MAPPERS

    const toApiTask = (form: TaskForm) => ({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate ?? null,
    })

    const toFormTask = (task: Task): TaskForm => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
    })

    // FETCH

    useEffect(() => {
        const token = getAccessToken()

        if (!token) {
            navigate("/login")
            return
        }

        const loadTasks = async () => {
            try {
                setLoading(true)

                const data = await getTasks({
                    status: statusFilter,
                    priority: priorityFilter,
                    keyword: keyword.trim(),
                })

                setTasks(data)
                setError(null)
            } catch (err: any) {
                if (err?.message?.includes("Session expired")) {
                    clearTokens()
                    navigate("/login")
                } else {
                    setError(err?.message || "Failed to load tasks")
                }
            } finally {
                setLoading(false)
            }
        }

        loadTasks()
    }, [statusFilter, priorityFilter, searchTrigger, navigate])

    // ACTIONS

    const handleEdit = (task: Task) => {
        setEditingTask(task)
        setOpen(true)
    }

    const handleDelete = async (id: string) => {
        const t = toast.loading("Deleting task...")

        try {
            await deleteTask(id)
            setTasks((prev) => prev.filter((t) => t.id !== id))
            toast.success("Task deleted", { id: t })
        } catch (err) {
            showError(err, "Failed to delete task")
        }
    }

    const handleSave = async (form: TaskForm) => {
        try {
            const payload = toApiTask(form)

            if (editingTask) {
                const updated = await updateTask(editingTask.id, payload)

                setTasks((prev) =>
                    prev.map((t) => (t.id === updated.id ? updated : t))
                )

                toast.success("Task updated")
                setEditingTask(null)
            } else {
                const created = await createTask(payload)
                setTasks((prev) => [created, ...prev])

                toast.success("Task created")
            }

            setOpen(false)
        } catch (err) {
            showError(err, "Failed to save task")
        }
    }

    const handleToggleComplete = async (task: Task) => {
        try {
            const updated = await updateTask(task.id, {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status:
                    task.status === "COMPLETE" ? "PENDING" : "COMPLETE",
                dueDate: task.dueDate
                    ? new Date(task.dueDate)
                    : null,
            })

            setTasks((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            )
        } catch (err) {
            showError(err, "Failed to update task")
        }
    }

    // RENDER

    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
            />

            <SidebarInset>
                <header className="flex h-16 items-center justify-between px-4 gap-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4" />

                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    Your Tasks
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex-1 max-w-md mx-4">
                        <InputInline
                            value={keyword}
                            onChange={setKeyword}
                            onSearch={() => setSearchTrigger((p) => p + 1)}
                        />
                    </div>

                    <Button
                        onClick={() => {
                            setEditingTask(null)
                            setOpen(true)
                        }}
                    >
                        <CirclePlus /> Add Task
                    </Button>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {loading ? (
                        <p className="text-sm text-muted-foreground">
                            Loading tasks...
                        </p>
                    ) : tasks.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ClipboardListIcon />
                                </EmptyMedia>
                                <EmptyTitle>No tasks found</EmptyTitle>
                                <EmptyDescription>
                                    Nothing here yet. Try adjusting your filters or add a new task.
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <Button
                                    onClick={() => {
                                        setEditingTask(null)
                                        setOpen(true)
                                    }}
                                    >
                                    <CirclePlus />
                                    Add Task
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                onToggleComplete={handleToggleComplete}
                            />
                        ))
                    )}
                </div>

                <AddTaskDialog
                    open={open}
                    setOpen={setOpen}
                    onAdd={handleSave}
                    initialData={
                        editingTask ? toFormTask(editingTask) : undefined
                    }
                />
            </SidebarInset>
        </SidebarProvider>
    )
}
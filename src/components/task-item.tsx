import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemHeader,
    ItemFooter,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { CheckCircle2, Circle, Trash2, SquarePen } from "lucide-react";

// types
import type { Task } from "@/types/task"

type Props = {
    task: Task;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    onToggleComplete: (task: Task) => void;
};

export default function TaskItem({
    task,
    onDelete,
    onEdit,
    onToggleComplete,
}: Props) {
    const isComplete = task.status === "COMPLETE";

    return (
        <Item variant="outline">

            {/* Header */}
            <ItemHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">

                    {/* Quick Toggle */}
                    <button
                        onClick={() => onToggleComplete(task)}
                        className="transition hover:scale-110"
                    >
                        {isComplete ? (
                            <CheckCircle2 className="size-5 text-green-500" />
                        ) : (
                            <Circle className="size-5 text-muted-foreground" />
                        )}
                    </button>

                    <ItemTitle
                        className={
                            isComplete
                                ? "line-through opacity-60"
                                : ""
                        }
                    >
                        {task.title}
                    </ItemTitle>
                </div>

                <span className="text-xs px-2 py-1 rounded bg-muted">
                    {task.status}
                </span>
            </ItemHeader>

            {/* Content */}
            <ItemContent>
                <ItemDescription>
                    {task.description || "No description"}
                </ItemDescription>
            </ItemContent>

            {/* Footer */}
            <ItemFooter>
                <div className="text-xs text-muted-foreground flex gap-4">
                    <span>Priority: {task.priority}</span>

                    {task.dueDate && (
                        <span>
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <ItemActions>

                    {/* Toggle Button */}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onToggleComplete(task)}
                    >
                        {isComplete ? "Undo" : "Complete"}
                    </Button>

                    {/* Edit */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(task)}
                    >
                        <SquarePen />
                    </Button>

                    {/* Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 />
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete this task?
                                </AlertDialogTitle>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(task.id)}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </ItemActions>
            </ItemFooter>

        </Item>
    );
}
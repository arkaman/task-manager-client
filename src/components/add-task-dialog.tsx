import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "./date-picker";

import type { TaskForm } from "@/types/task"

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (task: TaskForm) => void;
    initialData?: TaskForm;
};

export default function AddTaskDialog({
    open,
    setOpen,
    onAdd,
    initialData,
}: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
    const [status, setStatus] = useState<"PENDING" | "COMPLETE">("PENDING");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description ?? "");
            setPriority(initialData.priority);
            setStatus(initialData.status);
            setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : undefined);
        } else {
            setTitle("");
            setDescription("");
            setPriority("LOW");
            setStatus("PENDING");
            setDueDate(undefined);
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const baseTask = {
            ...(initialData?.id && { id: initialData.id }),
            title,
            description,
            priority,
            dueDate,
        };

        const task = initialData
            ? { ...baseTask, status } // edit
            : baseTask; // create

        onAdd(task as TaskForm);

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Task" : "Add Task"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="flex gap-4">
                        <Select
                        value={priority}
                        onValueChange={(value) =>
                            setPriority(value as "LOW" | "MEDIUM" | "HIGH")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Priority</SelectLabel>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <DatePicker value={dueDate} onChange={setDueDate} />
                    </div>

                    {initialData && (
                        <Select
                            value={status}
                            onValueChange={(value) =>
                                setStatus(value as "PENDING" | "COMPLETE")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETE">Complete</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}

                    <Button onClick={handleSubmit} disabled={!title.trim()}>
                        {initialData ? "Update Task" : "Add Task"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}
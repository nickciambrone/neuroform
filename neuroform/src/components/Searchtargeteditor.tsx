"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SearchTargetEditor({ targets, setTargets, setTab }) {
    const [confirmDelete, setConfirmDelete] = useState({ open: false, index: null });

    const handleChange = (index, key, value) => {
        const updated = [...targets];
        updated[index][key] = value;
        setTargets(updated);
    };

    const confirmRemove = (index) => {
        setConfirmDelete({ open: true, index });
    };

    const removeTarget = () => {
        const updated = targets.filter((_, i) => i !== confirmDelete.index);
        setTargets(updated);
        setConfirmDelete({ open: false, index: null });
    };

    const addTarget = () => setTargets([...targets, { name: "", description: "" }]);

    return (
        <>
            <Card>
                <div className="flex justify-between items-start">
                    <CardHeader>
                        <CardTitle>Search Targets</CardTitle>
                        <CardDescription>Tell us what you're looking for in the PDF files.</CardDescription>
                    </CardHeader>
                    <div className="mt-4 mr-5">
                        <button
                            onClick={() => setTab("process")}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                        >
                            Continue to Process
                        </button>
                    </div>
                </div>

                <CardContent className="space-y-4">
                    {targets.map((target, index) => (
                        <div
                            key={index}
                            className="relative space-y-2 border rounded-lg p-4 bg-gray-50 dark:bg-zinc-800"
                        >
                            <Input
                                placeholder="Name of field (e.g., Invoice Number)"
                                value={target.name}
                                onChange={(e) => handleChange(index, "name", e.target.value)}
                            />
                            <Textarea
                                placeholder="Describe what you're trying to extract..."
                                value={target.description}
                                onChange={(e) => handleChange(index, "description", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => confirmRemove(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                                aria-label="Delete target"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addTarget}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Target
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={confirmDelete.open} onOpenChange={(open) => !open && setConfirmDelete({ open: false, index: null })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Search Target?</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">
                        Are you sure you want to remove this search target? This action can’t be undone.
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setConfirmDelete({ open: false, index: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={removeTarget}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

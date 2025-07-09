"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  createTarget,
  updateTarget,
  deleteTarget,
} from "@/lib/firebase/searchTargets";
import { useAuth } from "@/components/AuthContext";

import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

export default function SearchTargetEditor({ targets, setTargets, setTab, user }) {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, index: null });

  useEffect(() => {
    if (!user) return; // only do Firebase create if signed in

    const initTargets = async () => {
      const updated = [...targets];
      let modified = false;

      for (let i = 0; i < updated.length; i++) {
        const target = updated[i];
        const hasNoId = !target.id;
        const hasContent = target.name || target.description || target.tags;

        if (hasNoId && hasContent) {
          const ref = await createTarget(user.uid, target);
          updated[i] = ref;
          modified = true;
        } else if (hasNoId && !hasContent) {
          const ref = await createTarget(user.uid, { name: "", description: "", tags: "" });
          updated[i] = ref;
          modified = true;
        }
      }

      if (modified) {
        setTargets(updated);
      }
    };

    initTargets();
  }, [user]);

  const isDuplicate = (input, indexToIgnore = -1) => {
    const normalized = (str) => str.trim().toLowerCase();
    const targetKey = `${normalized(input.name)}|${normalized(input.description)}|${normalized(input.tags)}`;
    return targets.some((t, i) => {
      if (i === indexToIgnore) return false;
      const key = `${normalized(t.name)}|${normalized(t.description)}|${normalized(t.tags)}`;
      return key === targetKey && key !== "||";
    });
  };

  const handleChange = async (index, key, value) => {
    const updated = [...targets];
    updated[index][key] = value;
    setTargets(updated);

    const target = updated[index];
    const hasContent = target.name || target.description || target.tags;

    if (hasContent && isDuplicate(target, index)) {
      toast({
        title: "Duplicate search target",
        description: "This search target is identical to another one.",
        variant: "destructive",
      });
      return;
    }

    if (user && target.id) {
      await updateTarget(user.uid, target.id, target);
    }
  };

  const confirmRemove = (index) => {
    setConfirmDelete({ open: true, index });
  };

  const removeTarget = async (index) => {
    if (user && targets[index].id) {
      await deleteTarget(user.uid, targets[index].id);
    }
    const updated = targets.filter((_, i) => i !== index);
    setTargets(updated);
    setConfirmDelete({ open: false, index: null });
  };

  const addTarget = async () => {
    if (user) {
      const newTarget = { name: "", description: "", tags: "" };
      const ref = await createTarget(user.uid, newTarget);
      setTargets([...targets, ref]);
    } else {
      // anon: just add blank target locally
      setTargets([...targets, { id: null, name: "", description: "", tags: "" }]);
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-start">
          <CardHeader>
            <CardTitle>Search Targets</CardTitle>
            <CardDescription>
              Tell us what you're looking for in the PDF files.
            </CardDescription>
          </CardHeader>
          <div className="mt-4 mr-5">
            <button
              onClick={() => setTab("process")}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Continue to Process PDF
            </button>
          </div>
        </div>

        <CardContent className="space-y-4">
          {targets.map((target, index) => (
            <div
              key={target.id || index}
              className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 dark:bg-zinc-800"
            >
              <div className="flex-1 space-y-2 mb-2">
                <Input
                  placeholder="Name of field (e.g., Invoice Number)"
                  value={target.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
                <Textarea
                  placeholder="Describe what you're trying to extract... (optional)"
                  value={target.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-zinc-400 hover:text-red-500 transition"
                      aria-label="Delete search target"
                      onClick={() => confirmRemove(index)}
                    >
                      <Trash size={20} />
                    </button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          ))}

          <Button variant="secondary" onClick={addTarget}>
            <Plus className="mr-2 h-4 w-4" />
            Add Target
          </Button>
        </CardContent>
      </Card>

      {/* Global delete confirmation dialog */}
      <Dialog
        open={confirmDelete.open}
        onOpenChange={(open) => !open && setConfirmDelete({ open: false, index: null })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Search Target?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Are you sure you want to remove this search target? This action can’t be undone.
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete({ open: false, index: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeTarget(confirmDelete.index)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

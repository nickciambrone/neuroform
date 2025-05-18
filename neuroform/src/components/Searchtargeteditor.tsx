// components/SearchTargetEditor.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export default function SearchTargetEditor({ targets, setTargets, setTab }) {
    const handleChange = (index, key, value) => {
        const updated = [...targets];
        updated[index][key] = value;
        setTargets(updated);
    };

    const addTarget = () => setTargets([...targets, { name: "", description: "" }]);
    const removeTarget = (index) => setTargets(targets.filter((_, i) => i !== index));

    return (
        <Card>
            <div style={{display:'flex'}}>     <CardHeader>
                <CardTitle>Search Targets</CardTitle>
                <CardDescription>Tell us what you're looking for in the PDF files.</CardDescription>
             
            </CardHeader><div style={{marginLeft:'auto'}}><button
                    onClick={() => setTab("process")}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                >
                    Continue to Process
                </button></div> </div>
         
            <CardContent className="space-y-4">
                {targets.map((target, index) => (
                    <div key={index} className="space-y-2 border rounded-lg p-4 relative bg-gray-50 dark:bg-zinc-800">
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
                            onClick={() => removeTarget(index)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
                <Button variant="secondary" onClick={addTarget}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Target
                </Button>
            </CardContent>
        </Card>
    );
}

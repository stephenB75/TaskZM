import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export interface TagDefinition {
  id: string;
  text: string;
  bgColor: string;
  textColor: string;
  fontWeight: "bold" | "medium";
}

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: TagDefinition[];
  onAddTag: (tag: Omit<TagDefinition, "id">) => void;
  onEditTag: (
    id: string,
    tag: Omit<TagDefinition, "id">,
  ) => void;
  onDeleteTag: (id: string) => void;
}

const colorPresets = [
  { bg: "#fbe6fc", text: "#ff00b8", name: "Pink" },
  { bg: "#e1f6ff", text: "#2c62b4", name: "Blue" },
  { bg: "#d9f4f8", text: "#268fb0", name: "Cyan" },
  { bg: "#e8f5e8", text: "#0d7f0d", name: "Green" },
  { bg: "#dcfce7", text: "#16a34a", name: "Light Green" },
  { bg: "#fef3c7", text: "#d97706", name: "Yellow" },
  { bg: "#f3e8ff", text: "#7c3aed", name: "Purple" },
  { bg: "#fee2e2", text: "#dc2626", name: "Red" },
  { bg: "#e5e7eb", text: "#374151", name: "Gray" },
  { bg: "#fef3c7", text: "#92400e", name: "Amber" },
];

export default function TagManager({
  isOpen,
  onClose,
  tags,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState({
    text: "",
    bgColor: colorPresets[0].bg,
    textColor: colorPresets[0].text,
    fontWeight: "bold" as "bold" | "medium",
  });

  const resetForm = () => {
    setFormData({
      text: "",
      bgColor: colorPresets[0].bg,
      textColor: colorPresets[0].text,
      fontWeight: "bold",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.text.trim()) return;

    if (editingId) {
      onEditTag(editingId, formData);
    } else {
      onAddTag(formData);
    }

    resetForm();
  };

  const startEdit = (tag: TagDefinition) => {
    setFormData({
      text: tag.text,
      bgColor: tag.bgColor,
      textColor: tag.textColor,
      fontWeight: tag.fontWeight,
    });
    setEditingId(tag.id);
    setIsAdding(true);
  };

  const handleColorSelect = (
    preset: (typeof colorPresets)[0],
  ) => {
    setFormData((prev) => ({
      ...prev,
      bgColor: preset.bg,
      textColor: preset.text,
    }));
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      onDeleteTag(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            onClose();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Create, edit, and organize your task tags
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add/Edit Tag Form */}
            {isAdding && (
              <form
                onSubmit={handleSubmit}
                className="p-4 bg-[#f8f9fa] rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[#313131]">
                    {editingId ? "Edit Tag" : "New Tag"}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tag Name *</Label>
                  <Input
                    id="tag-name"
                    value={formData.text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Enter tag name"
                    required
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Weight</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        formData.fontWeight === "medium"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fontWeight: "medium",
                        }))
                      }
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.fontWeight === "bold"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fontWeight: "bold",
                        }))
                      }
                    >
                      Bold
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          handleColorSelect(preset)
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.bgColor === preset.bg &&
                          formData.textColor === preset.text
                            ? "border-[#3300ff] ring-2 ring-[#3300ff] ring-opacity-50"
                            : "border-transparent hover:border-[#e3e3e3]"
                        }`}
                        style={{ backgroundColor: preset.bg }}
                        title={preset.name}
                      >
                        <div
                          className="w-full h-4 rounded"
                          style={{
                            backgroundColor: preset.text,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="p-3 bg-white rounded-lg border border-[#e3e3e3]">
                    <div
                      className="inline-block px-3 py-1 rounded text-xs"
                      style={{
                        backgroundColor: formData.bgColor,
                        color: formData.textColor,
                        fontWeight:
                          formData.fontWeight === "bold"
                            ? "bold"
                            : "500",
                      }}
                    >
                      {formData.text || "Preview"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    {editingId ? "Save Changes" : "Add Tag"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Add New Tag Button */}
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Tag
              </Button>
            )}

            {/* Existing Tags */}
            <div className="space-y-2">
              <Label>Your Tags ({tags.length})</Label>
              <div className="space-y-2">
                {tags.length === 0 ? (
                  <p className="text-[#828282] text-sm text-center py-6">
                    No tags yet. Create your first tag above!
                  </p>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#e3e3e3] hover:border-[#3300ff] transition-colors"
                    >
                      <div
                        className="px-3 py-1 rounded text-xs"
                        style={{
                          backgroundColor: tag.bgColor,
                          color: tag.textColor,
                          fontWeight:
                            tag.fontWeight === "bold"
                              ? "bold"
                              : "500",
                        }}
                      >
                        {tag.text}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(tag)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirmId(tag.id)
                          }
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) =>
          !open && setDeleteConfirmId(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? This
              won't affect tasks that already have this tag, but
              you won't be able to use it for new tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Check, X, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: string;
  relationTarget?: string; // For relationship fields
}

interface Model {
  id: string;
  name: string;
  fields: Field[];
}

interface FieldEditorProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
  availableModels?: Model[]; // Optional: for relationship fields
  currentModelId?: string; // To exclude self-references
}

const fieldTypes = [
  { value: "text", label: "Text", color: "bg-blue-100 text-blue-800" },
  { value: "number", label: "Number", color: "bg-green-100 text-green-800" },
  { value: "boolean", label: "Boolean", color: "bg-purple-100 text-purple-800" },
  { value: "date", label: "Date", color: "bg-yellow-100 text-yellow-800" },
  { value: "email", label: "Email", color: "bg-pink-100 text-pink-800" },
  { value: "url", label: "URL", color: "bg-indigo-100 text-indigo-800" },
  { value: "relation", label: "Relationship", color: "bg-red-100 text-red-800" },
];

export function FieldEditor({ fields, onFieldsChange, availableModels = [], currentModelId }: FieldEditorProps) {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'text', required: false, relationTarget: '' });

  const addField = () => {
    if (!newField.name.trim()) return;
    
    const field: Field = {
      id: Date.now().toString(),
      name: newField.name.trim(),
      type: newField.type,
      required: newField.required,
      ...(newField.type === 'relation' && newField.relationTarget && {
        relationTarget: newField.relationTarget
      })
    };
    
    onFieldsChange([...fields, field]);
    setNewField({ name: '', type: 'text', required: false, relationTarget: '' });
    setIsAddingField(false);
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onFieldsChange(updatedFields);
    setEditingFieldId(null);
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    onFieldsChange(updatedFields);
  };

  const getFieldTypeColor = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-3">
      {/* Existing Fields */}
      {fields.map((field) => (
        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
          {editingFieldId === field.id ? (
            <EditingFieldRow
              field={field}
              onSave={(updates) => updateField(field.id, updates)}
              onCancel={() => setEditingFieldId(null)}
              availableModels={availableModels}
              currentModelId={currentModelId}
            />
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <span className="font-medium">{field.name}</span>
                <Badge className={getFieldTypeColor(field.type)}>
                  {field.type}
                </Badge>
                {field.type === 'relation' && field.relationTarget && (
                  <div className="flex items-center space-x-1">
                    <Link className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      → {availableModels.find(m => m.id === field.relationTarget)?.name || 'Unknown'}
                    </span>
                  </div>
                )}
                {field.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEditingFieldId(field.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteField(field.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add New Field */}
      {isAddingField ? (
        <div className="p-3 border rounded-lg border-dashed">
          <div className="space-y-3">
            <div>
              <Label>Field Name</Label>
              <Input
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="e.g. name, email, price"
                autoFocus
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value, relationTarget: '' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newField.type === 'relation' && availableModels.length > 0 && (
              <div>
                <Label>Related Model</Label>
                <Select value={newField.relationTarget} onValueChange={(value) => setNewField({ ...newField, relationTarget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model to relate to" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels
                      .filter(model => model.id !== currentModelId) // Don't allow self-references
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: !!checked })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addField} size="sm">
                <Check className="w-4 h-4 mr-2" />
                Add Field
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingField(false);
                  setNewField({ name: '', type: 'text', required: false, relationTarget: '' });
                }}
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setIsAddingField(true)}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      )}
    </div>
  );
}

// Separate component for editing existing fields
function EditingFieldRow({ 
  field, 
  onSave, 
  onCancel,
  availableModels = [],
  currentModelId
}: { 
  field: Field; 
  onSave: (updates: Partial<Field>) => void; 
  onCancel: () => void; 
  availableModels?: Model[];
  currentModelId?: string;
}) {
  const [editValues, setEditValues] = useState({
    name: field.name,
    type: field.type,
    required: field.required,
    relationTarget: field.relationTarget || ''
  });

  const handleSave = () => {
    if (!editValues.name.trim()) return;
    onSave(editValues);
  };

  return (
    <div className="flex-1 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={editValues.name}
          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
          placeholder="Field name"
        />
        <Select value={editValues.type} onValueChange={(value) => setEditValues({ ...editValues, type: value, relationTarget: '' })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {editValues.type === 'relation' && availableModels.length > 0 && (
        <div>
          <Select value={editValues.relationTarget} onValueChange={(value) => setEditValues({ ...editValues, relationTarget: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select model to relate to" />
            </SelectTrigger>
            <SelectContent>
              {availableModels
                .filter(model => model.id !== currentModelId)
                .map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`required-${field.id}`}
            checked={editValues.required}
            onCheckedChange={(checked) => setEditValues({ ...editValues, required: !!checked })}
          />
          <Label htmlFor={`required-${field.id}`}>Required</Label>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave} size="sm">
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onCancel} size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

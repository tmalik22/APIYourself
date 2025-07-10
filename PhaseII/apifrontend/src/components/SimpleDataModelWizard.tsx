import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight, ArrowLeft, CheckCircle, Lightbulb, Zap, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleDataModelWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (models: any[]) => void;
}

interface SimpleField {
  name: string;
  type: string;
}

interface SimpleModel {
  name: string;
  fields: SimpleField[];
}

const commonModels = [
  {
    name: "User",
    description: "People who use your app",
    fields: [
      { name: "name", type: "text" },
      { name: "email", type: "email" },
      { name: "createdAt", type: "date" }
    ],
    icon: "👤"
  },
  {
    name: "Product",
    description: "Items you're selling",
    fields: [
      { name: "name", type: "text" },
      { name: "price", type: "number" },
      { name: "description", type: "text" },
      { name: "inStock", type: "boolean" }
    ],
    icon: "📦"
  },
  {
    name: "Post",
    description: "Blog posts or articles",
    fields: [
      { name: "title", type: "text" },
      { name: "content", type: "text" },
      { name: "publishedAt", type: "date" },
      { name: "isPublished", type: "boolean" }
    ],
    icon: "📝"
  },
  {
    name: "Order",
    description: "Customer purchases",
    fields: [
      { name: "total", type: "number" },
      { name: "status", type: "text" },
      { name: "orderDate", type: "date" }
    ],
    icon: "🛒"
  },
  {
    name: "Task",
    description: "Todo items or tasks",
    fields: [
      { name: "title", type: "text" },
      { name: "description", type: "text" },
      { name: "isCompleted", type: "boolean" },
      { name: "dueDate", type: "date" }
    ],
    icon: "✅"
  }
];

const fieldTypeLabels: { [key: string]: string } = {
  text: "Text",
  number: "Number", 
  email: "Email",
  date: "Date",
  boolean: "True/False"
};

export function SimpleDataModelWizard({ isOpen, onClose, onComplete }: SimpleDataModelWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedModels, setSelectedModels] = useState<SimpleModel[]>([]);
  const [customModel, setCustomModel] = useState<SimpleModel>({ name: "", fields: [] });

  const toggleModel = (model: any) => {
    const exists = selectedModels.find(m => m.name === model.name);
    if (exists) {
      setSelectedModels(selectedModels.filter(m => m.name !== model.name));
    } else {
      setSelectedModels([...selectedModels, {
        name: model.name,
        fields: model.fields
      }]);
    }
  };

  const addCustomField = () => {
    setCustomModel({
      ...customModel,
      fields: [...customModel.fields, { name: "", type: "text" }]
    });
  };

  const updateCustomField = (index: number, field: SimpleField) => {
    const newFields = [...customModel.fields];
    newFields[index] = field;
    setCustomModel({ ...customModel, fields: newFields });
  };

  const removeCustomField = (index: number) => {
    const newFields = customModel.fields.filter((_, i) => i !== index);
    setCustomModel({ ...customModel, fields: newFields });
  };

  const handleComplete = () => {
    const allModels = [...selectedModels];
    if (customModel.name && customModel.fields.length > 0) {
      allModels.push(customModel);
    }
    onComplete(allModels);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Zap className="w-6 h-6 mr-2 text-blue-500" />
            Quick Data Model Setup
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Choose Your Starting Models</h3>
              <p className="text-gray-600 text-sm">
                Pick common data types for your API. You can always add more or customize later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonModels.map((model) => {
                const isSelected = selectedModels.find(m => m.name === model.name);
                return (
                  <Card 
                    key={model.name}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'hover:border-gray-400 hover:shadow-md'
                    }`}
                    onClick={() => toggleModel(model)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-sm">
                        <span className="text-2xl mr-2">{model.icon}</span>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-gray-500 font-normal">{model.description}</div>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {model.fields.slice(0, 3).map((field, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {fieldTypeLabels[field.type]}
                            </Badge>
                            <span className="text-gray-600">{field.name}</span>
                          </div>
                        ))}
                        {model.fields.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{model.fields.length - 3} more fields
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Pro tip:</strong> Start with 1-2 models to keep it simple. You can always add more complex relationships and fields later in the visual editor.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Skip Setup
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Add Custom Model
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={selectedModels.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create API ({selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''})
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Create Custom Model</h3>
              <p className="text-gray-600 text-sm">
                Add your own data type with custom fields.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="model-name">Model Name</Label>
                <Input
                  id="model-name"
                  value={customModel.name}
                  onChange={(e) => setCustomModel({ ...customModel, name: e.target.value })}
                  placeholder="e.g., Event, Comment, Review"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Fields</Label>
                <div className="space-y-2 mt-2">
                  {customModel.fields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={field.name}
                        onChange={(e) => updateCustomField(index, { ...field, name: e.target.value })}
                        placeholder="Field name"
                        className="flex-1"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(index, { ...field, type: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                        <option value="boolean">True/False</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomField(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomField}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={selectedModels.length === 0 && (!customModel.name || customModel.fields.length === 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create API
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Edit, Trash2, Link, Save, X, Info, HelpCircle, BookOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { usePluginSystem } from "@/hooks/usePluginSystem";
import { FieldEditor } from "./FieldEditor";
import { RelationshipVisualizer } from "./RelationshipVisualizer";
import { TemplateSelector } from "./TemplateSelector";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: string;
  relationTarget?: string;
}

interface Model {
  id: string;
  name: string;
  fields: Field[];
  position: { x: number; y: number };
}

interface DragState {
  isDragging: boolean;
  modelId: string | null;
  offset: { x: number; y: number };
}

const fieldTypes = [
  { value: "text", label: "Text", description: "Any text content (names, descriptions, etc.)", example: "John Doe" },
  { value: "number", label: "Number", description: "Numeric values (age, price, quantity)", example: "25" },
  { value: "boolean", label: "Boolean", description: "True/False values (active, published)", example: "true" },
  { value: "date", label: "Date", description: "Date and time values", example: "2024-01-15" },
  { value: "email", label: "Email", description: "Email addresses with validation", example: "user@example.com" },
  { value: "url", label: "URL", description: "Web addresses", example: "https://example.com" },
  { value: "relation", label: "Relationship", description: "Links to other models", example: "User → Posts" },
];

// Example templates to help users understand
const mockModels: Model[] = [
  {
    id: "1",
    name: "User",
    fields: [
      { id: "1", name: "id", type: "number", required: true },
      { id: "2", name: "email", type: "email", required: true },
      { id: "3", name: "name", type: "text", required: true },
      { id: "4", name: "avatar", type: "url", required: false },
      { id: "5", name: "isActive", type: "boolean", required: true },
    ],
    position: { x: 50, y: 50 }
  },
  {
    id: "2",
    name: "Post",
    fields: [
      { id: "6", name: "id", type: "number", required: true },
      { id: "7", name: "title", type: "text", required: true },
      { id: "8", name: "content", type: "text", required: true },
      { id: "9", name: "publishedAt", type: "date", required: false },
      { id: "10", name: "isPublished", type: "boolean", required: true },
      { id: "11", name: "author", type: "relation", required: true, relationTarget: "1" },
    ],
    position: { x: 400, y: 50 }
  }
];

interface DataModelBuilderProps {
  project: any;
  onBackToDashboard?: () => void;
}

export function DataModelBuilder({ project, onBackToDashboard }: DataModelBuilderProps) {
  const { enabledPlugins, executeHook } = usePluginSystem();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFromPlugin, setImportFromPlugin] = useState<string | null>(null);
  
  const getInitialModels = () => {
    if (project?.id) {
      try {
        const savedModels = localStorage.getItem(`api-builder-models-${project.id}`);
        if (savedModels) {
          return JSON.parse(savedModels);
        }
      } catch (error) {
        console.warn('Failed to load models from localStorage:', error);
      }
    }
    return project?.modelDefinitions || mockModels;
  };

  const [models, setModels] = useState<Model[]>(getInitialModels);
  
  // Save models to localStorage whenever they change
  useEffect(() => {
    if (project?.id) {
      try {
        localStorage.setItem(`api-builder-models-${project.id}`, JSON.stringify(models));
        // Execute plugin hooks when models change
        executeHook('onDataModelChange', { projectId: project.id, models });
      } catch (error) {
        console.warn('Failed to save models to localStorage:', error);
      }
    }
  }, [models, project?.id, executeHook]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showNewModelDialog, setShowNewModelDialog] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, modelId: null, offset: { x: 0, y: 0 } });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddModel = () => {
    if (!newModelName.trim()) {
      toast.error("Please enter a model name");
      return;
    }
    
    const newModel: Model = {
      id: Date.now().toString(),
      name: newModelName,
      fields: [
        { id: Date.now().toString(), name: "id", type: "number", required: true }
      ],
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 }
    };
    
    setModels([...models, newModel]);
    setNewModelName("");
    setShowNewModelDialog(false);
    toast.success(`Model "${newModelName}" created successfully!`);
  };

  const handleDeleteModel = (modelId: string) => {
    const modelToDelete = models.find(m => m.id === modelId);
    setModels(models.filter(m => m.id !== modelId));
    if (selectedModel?.id === modelId) {
      setSelectedModel(null);
    }
    toast.success(`Model "${modelToDelete?.name}" deleted successfully!`);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, modelId: string) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const model = models.find(m => m.id === modelId);
    if (!model) return;

    const offsetX = e.clientX - rect.left - model.position.x;
    const offsetY = e.clientY - rect.top - model.position.y;

    setDragState({
      isDragging: true,
      modelId,
      offset: { x: offsetX, y: offsetY }
    });
  }, [models]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.modelId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = Math.max(0, Math.min(rect.width - 250, e.clientX - rect.left - dragState.offset.x));
    const newY = Math.max(0, Math.min(rect.height - 200, e.clientY - rect.top - dragState.offset.y));

    setModels(prev => prev.map(model => 
      model.id === dragState.modelId 
        ? { ...model, position: { x: newX, y: newY } }
        : model
    ));
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, modelId: null, offset: { x: 0, y: 0 } });
  }, []);

  const handleFieldsChange = (modelId: string, newFields: Field[]) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, fields: newFields }
        : model
    ));

    if (selectedModel?.id === modelId) {
      setSelectedModel(prev => prev ? {
        ...prev,
        fields: newFields
      } : null);
    }
  };

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: "bg-blue-100 text-blue-800",
      number: "bg-green-100 text-green-800",
      boolean: "bg-purple-100 text-purple-800",
      date: "bg-yellow-100 text-yellow-800",
      email: "bg-pink-100 text-pink-800",
      url: "bg-indigo-100 text-indigo-800",
      relation: "bg-red-100 text-red-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Add state for help and templates
  const [showHelp, setShowHelp] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const loadTemplate = (template: any) => {
    if (template.id === 'blank') {
      setModels([]);
      setShowTemplates(false);
      toast.success('Started with blank project!');
      return;
    }

    const newModels = template.models.map((modelTemplate: any, index: number) => ({
      id: (Date.now() + index).toString(),
      name: modelTemplate.name,
      fields: modelTemplate.fields.map((field: any, fieldIndex: number) => ({
        id: (Date.now() + index * 100 + fieldIndex).toString(),
        name: field.name,
        type: field.type,
        required: field.required,
        validation: field.description,
        ...(field.type === 'relation' && { relationTarget: '' }) // Will be set up later
      })),
      position: { x: 50 + (index * 350), y: 50 + (Math.floor(index / 3) * 250) }
    }));
    
    setModels(newModels);
    setShowTemplates(false);
    toast.success(`Loaded ${template.name} template with ${newModels.length} models!`);
  };

  // Add state for relationship creation
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    fromModelId: '',
    fieldName: '',
    toModelId: '',
    required: false
  });

  const handleAddRelationship = () => {
    if (!newRelationship.fromModelId || !newRelationship.fieldName.trim() || !newRelationship.toModelId) {
      toast.error("Please fill in all relationship fields");
      return;
    }

    const fromModel = models.find(m => m.id === newRelationship.fromModelId);
    const toModel = models.find(m => m.id === newRelationship.toModelId);
    
    if (!fromModel || !toModel) {
      toast.error("Invalid model selection");
      return;
    }

    const relationshipField: Field = {
      id: Date.now().toString(),
      name: newRelationship.fieldName.trim(),
      type: 'relation',
      required: newRelationship.required,
      relationTarget: newRelationship.toModelId
    };

    setModels(prev => prev.map(model => 
      model.id === newRelationship.fromModelId 
        ? { ...model, fields: [...model.fields, relationshipField] }
        : model
    ));

    setNewRelationship({ fromModelId: '', fieldName: '', toModelId: '', required: false });
    setShowRelationshipDialog(false);
    toast.success(`Created relationship: ${fromModel.name} → ${toModel.name}`);
  };

  // Helper function to suggest relationship field names
  const suggestRelationshipName = (fromModelId: string, toModelId: string) => {
    const toModel = models.find(m => m.id === toModelId);
    if (!toModel) return '';
    
    // Generate a sensible field name based on the target model
    const modelName = toModel.name.toLowerCase();
    
    // Common relationship patterns
    const suggestions = [
      modelName, // e.g., "user"
      `${modelName}Id`, // e.g., "userId" 
      `owner${toModel.name}`, // e.g., "ownerUser"
      `related${toModel.name}` // e.g., "relatedUser"
    ];
    
    return suggestions[0]; // Return the simplest suggestion
  };

  const handleImportPluginModel = () => {
    if (!importFromPlugin) return;
    // Simulate fetching schema from plugin
    const pluginModel: Model = {
      id: `plugin_${importFromPlugin}_${Date.now()}`,
      name: importFromPlugin === 'google-sheets' ? 'SheetData' : importFromPlugin,
      fields: [
        { id: '1', name: 'id', type: 'number', required: true },
        { id: '2', name: 'value', type: 'text', required: false }
      ],
      position: { x: 100, y: 100 }
    };
    setModels(prev => [...prev, pluginModel]);
    toast.success(`Imported model from ${importFromPlugin.replace('-', ' ')}`);
    setShowImportDialog(false);
    executeHook('onDataModelChange', { projectId: project.id, models: [...models, pluginModel] });
  };

  return (
    <div className="space-y-6" id="data-model-builder-top">
      {/* Help and Getting Started Section */}
      {models.length === 0 && (
        <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-900 text-lg mb-2">🎯 Welcome to Data Models!</h3>
                <p className="text-blue-800">Design your database structure visually - each model becomes a database table with API endpoints.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong className="text-blue-900">What are Data Models?</strong></p>
                  <p className="text-blue-700">The "things" in your app - like Users, Posts, Products, Orders. Think of them as database tables.</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-blue-900">What are Fields?</strong></p>
                  <p className="text-blue-700">The properties each thing has - like a User has name, email, password.</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">💡 Quick Start Options:</h4>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setShowTemplates(true)} variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                  <Button onClick={() => setShowNewModelDialog(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Model
                  </Button>
                  <Button onClick={() => setShowImportDialog(true)} variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Plugin
                  </Button>
                  <Button onClick={() => setShowHelp(true)} variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template to Get Started</DialogTitle>
          </DialogHeader>
          <TemplateSelector onSelectTemplate={loadTemplate} />
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Understanding Data Models</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="fields">Field Types</TabsTrigger>
              <TabsTrigger value="relationships">Relations</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What are Data Models?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Data models represent the "things" or "entities" in your application. They define what information you want to store and how it's structured.
                </p>
                
                <h3 className="font-semibold mb-2">Key Concepts:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Model:</strong> A blueprint for a type of data (e.g., "User", "Product", "Order")</li>
                  <li><strong>Field:</strong> A single piece of information in a model (e.g., "name", "price", "date")</li>
                  <li><strong>Required:</strong> Whether this field must have a value</li>
                  <li><strong>Type:</strong> What kind of data is stored (text, number, date, etc.)</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="fields" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Field Types Explained:</h3>
                <div className="space-y-3">
                  {fieldTypes.map((field) => (
                    <div key={field.value} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-sm">{field.label}</strong>
                        <Badge variant="outline" className={getFieldTypeColor(field.value)}>
                          {field.value}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{field.description}</p>
                      <p className="text-xs text-gray-500">Example: <code className="bg-gray-100 px-1 rounded">{field.example}</code></p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="relationships" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Connecting Models Together</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Relationships let you connect different types of data. For example, connecting a "Post" to its "Author" (a User).
                </p>
                
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <h4 className="font-medium">One-to-Many</h4>
                    <p className="text-sm text-gray-600">One User can have many Posts</p>
                    <p className="text-xs text-gray-500">Most common type of relationship</p>
                  </div>
                  <div className="border rounded p-3">
                    <h4 className="font-medium">Many-to-Many</h4>
                    <p className="text-sm text-gray-600">Posts can have many Tags, Tags can be on many Posts</p>
                    <p className="text-xs text-gray-500">For complex associations</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Real-World Examples:</h3>
                
                <div className="space-y-4">
                  <div className="border rounded p-4">
                    <h4 className="font-medium mb-2">📝 Blog System</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>User Model:</strong>
                        <ul className="text-gray-600 mt-1">
                          <li>• name (text, required)</li>
                          <li>• email (email, required)</li>
                          <li>• avatar (url, optional)</li>
                          <li>• isActive (boolean)</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Post Model:</strong>
                        <ul className="text-gray-600 mt-1">
                          <li>• title (text, required)</li>
                          <li>• content (text, required)</li>
                          <li>• publishedAt (date)</li>
                          <li>• author (relation to User)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded p-4">
                    <h4 className="font-medium mb-2">🛒 E-commerce Store</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>Product Model:</strong>
                        <ul className="text-gray-600 mt-1">
                          <li>• name (text, required)</li>
                          <li>• price (number, required)</li>
                          <li>• description (text)</li>
                          <li>• inStock (boolean)</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Order Model:</strong>
                        <ul className="text-gray-600 mt-1">
                          <li>• total (number, required)</li>
                          <li>• status (text, required)</li>
                          <li>• orderDate (date)</li>
                          <li>• customer (relation to User)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Data Models
            {project && <span className="text-lg font-normal text-gray-600 ml-2">- {project.name}</span>}
          </h1>
          <p className="text-gray-600 mt-2">Design your database structure - each model becomes a database table with API endpoints</p>
          {project && (
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{project.template}</Badge>
              <span className="text-sm text-gray-500">{models.length} models defined</span>
              {enabledPlugins.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {enabledPlugins.length} plugins active
                </Badge>
              )}
            </div>
          )}
          {models.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              💡 <strong>Tip:</strong> Drag models to organize them. Each model gets CRUD endpoints automatically.
              {models.length >= 2 && (
                <span className="ml-2">
                  💫 <strong>Create relationships</strong> between models using the "Add Relationship" button!
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {models.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setShowHelp(true)}
              className="flex items-center"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          )}
          {onBackToDashboard && (
            <Button 
              variant="outline" 
              onClick={onBackToDashboard}
              className="flex items-center"
            >
              ← Back to Dashboard
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => toast.success("Models saved successfully!")}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Dialog open={showNewModelDialog} onOpenChange={setShowNewModelDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Model</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input
                    id="model-name"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g., Product, Order, Customer"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddModel()}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewModelDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddModel}>Create Model</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Add Relationship Button - Only show if we have 2+ models */}
          {models.length >= 2 && (
            <Dialog open={showRelationshipDialog} onOpenChange={setShowRelationshipDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Link className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Model Relationship</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">💡 What is a relationship?</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Relationships connect your data models together, just like in real life. 
                      For example: "A blog post has an author" or "An order belongs to a customer".
                    </p>
                    <div className="space-y-1 text-xs text-blue-600">
                      <p>• <strong>User → Post:</strong> "Which user wrote this post?"</p>
                      <p>• <strong>Order → Customer:</strong> "Who placed this order?"</p>
                      <p>• <strong>Comment → Post:</strong> "Which post is this comment on?"</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Step 1: Which model needs the connection?</Label>
                      <Select value={newRelationship.fromModelId} onValueChange={(value) => setNewRelationship({ ...newRelationship, fromModelId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose the model that will store the relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        This model will get a new field that connects to another model
                      </p>
                    </div>
                    
                    <div>
                      <Label>Step 2: What should it connect to?</Label>
                      <Select value={newRelationship.toModelId} onValueChange={(value) => setNewRelationship({ ...newRelationship, toModelId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose what it connects to" />
                        </SelectTrigger>
                        <SelectContent>
                          {models
                            .filter(model => model.id !== newRelationship.fromModelId)
                            .map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        The model that the first model will be connected to
                      </p>
                    </div>
                    
                    <div>
                      <Label>Step 3: What should we call this connection?</Label>
                      <Input
                        value={newRelationship.fieldName}
                        onChange={(e) => setNewRelationship({ ...newRelationship, fieldName: e.target.value })}
                        placeholder={`e.g., ${models.find(m => m.id === newRelationship.toModelId)?.name.toLowerCase() || 'user'}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        A name that describes the relationship (like "author", "customer", "owner")
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="relationship-required"
                      checked={newRelationship.required}
                      onCheckedChange={(checked) => setNewRelationship({ ...newRelationship, required: !!checked })}
                    />
                    <Label htmlFor="relationship-required">This connection is required</Label>
                    <p className="text-xs text-gray-500">
                      (Every record must have this relationship)
                    </p>
                  </div>
                  
                  {newRelationship.fromModelId && newRelationship.toModelId && newRelationship.fieldName && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✨ What you're creating:</h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {models.find(m => m.id === newRelationship.fromModelId)?.name}
                        </Badge>
                        <span className="text-sm">will have a</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          {newRelationship.fieldName}
                        </Badge>
                        <span className="text-sm">field that connects to</span>
                        <Badge className="bg-green-100 text-green-800">
                          {models.find(m => m.id === newRelationship.toModelId)?.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>In plain English:</strong> Each {models.find(m => m.id === newRelationship.fromModelId)?.name} 
                        can have one {models.find(m => m.id === newRelationship.toModelId)?.name} as its {newRelationship.fieldName}.
                      </p>
                      <p className="text-xs text-green-600">
                        Your API will automatically be able to fetch the related {models.find(m => m.id === newRelationship.toModelId)?.name} 
                        data when you get a {models.find(m => m.id === newRelationship.fromModelId)?.name}.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowRelationshipDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRelationship}>Create Relationship</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Plugin Import Button */}
      {enabledPlugins.length > 0 && (
        <div className="p-4">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                Import Model from Plugin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Plugin Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {enabledPlugins.map((pl) => (
                  <div key={pl.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={pl.id}
                      name="plugin"
                      value={pl.id}
                      onChange={() => setImportFromPlugin(pl.id)}
                    />
                    <label htmlFor={pl.id} className="cursor-pointer">
                      {pl.name}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button disabled={!importFromPlugin} onClick={handleImportPluginModel}>
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Main content area */}
      <div className="flex space-x-6">
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm min-h-[600px] relative overflow-hidden select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
            </defs>
            {/* Draw actual relationship lines */}
            {models.flatMap(model => 
              model.fields
                .filter(field => field.type === 'relation' && field.relationTarget)
                .map(field => {
                  const targetModel = models.find(m => m.id === field.relationTarget);
                  if (!targetModel) return null;
                  
                  const fromX = model.position.x + 250; // Right edge of source model
                  const fromY = model.position.y + 80;  // Middle of source model
                  const toX = targetModel.position.x;   // Left edge of target model
                  const toY = targetModel.position.y + 80; // Middle of target model
                  
                  return (
                    <g key={`${model.id}-${field.id}`}>
                      {/* Connection line */}
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke="#10b981"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                        strokeDasharray="5,5"
                      />
                      {/* Relationship label */}
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 5}
                        textAnchor="middle"
                        className="text-xs fill-green-700"
                        style={{ fontSize: '10px' }}
                      >
                        {field.name}
                      </text>
                    </g>
                  );
                })
                .filter(Boolean)
            )}
          </svg>

          {/* Model Cards */}
          {models.map((model) => (
            <div
              key={model.id}
              className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 min-w-[250px] transition-all duration-200 ${
                dragState.isDragging && dragState.modelId === model.id 
                  ? 'cursor-grabbing shadow-2xl scale-105 z-10' 
                  : 'cursor-grab hover:shadow-xl'
              } ${selectedModel?.id === model.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{ left: model.position.x, top: model.position.y }}
              onMouseDown={(e) => handleMouseDown(e, model.id)}
              onClick={() => setSelectedModel(model)}
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold select-none">{model.name}</h3>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white hover:bg-white/20 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModel(model);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white hover:bg-white/20 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModel(model.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                {model.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{field.name}</span>
                      {field.required && <span className="text-red-500 text-xs">*</span>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge className={`text-xs ${getFieldTypeColor(field.type)}`}>
                        {field.type}
                      </Badge>
                      {field.type === 'relation' && <Link className="w-3 h-3 text-gray-400" />}
                    </div>
                  </div>
                ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModel(model);
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Edit fields
                  </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Selected Model/Field Editor */}
        <div className="w-96 bg-white/80 backdrop-blur-sm border rounded-lg p-4 shadow-sm overflow-y-auto">
          {selectedModel ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{selectedModel.name} Model</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedModel(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Model Name</Label>
                  <Input 
                    value={selectedModel.name} 
                    onChange={(e) => {
                      const newName = e.target.value;
                      setModels(prev => prev.map(model => 
                        model.id === selectedModel.id ? { ...model, name: newName } : model
                      ));
                      setSelectedModel(prev => prev ? { ...prev, name: newName } : null);
                    }}
                  />
                </div>
                <div>
                  <Label>Fields ({selectedModel.fields.length})</Label>
                  <div className="mt-2">
                    <FieldEditor 
                      fields={selectedModel.fields}
                      onFieldsChange={(newFields) => handleFieldsChange(selectedModel.id, newFields)}
                      availableModels={models}
                      currentModelId={selectedModel.id}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-2">Select a model to view or edit its details</p>
              <Button 
                onClick={() => setShowNewModelDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Model
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

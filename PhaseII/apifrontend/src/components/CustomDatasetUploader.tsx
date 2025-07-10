import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CustomDatasetUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetAnalyzed: (schema: any, name: string) => void;
}

export function CustomDatasetUploader({ isOpen, onClose, onDatasetAnalyzed }: CustomDatasetUploaderProps) {
  const [jsonData, setJsonData] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const sampleData = {
    users: [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "isActive": true,
        "joinDate": "2024-01-15"
      },
      {
        "id": 2,
        "name": "Jane Smith", 
        "email": "jane@example.com",
        "age": 25,
        "isActive": false,
        "joinDate": "2024-02-20"
      }
    ],
    products: [
      {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "category": "Electronics",
        "inStock": true
      }
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setJsonData(content);
        setDatasetName(file.name.replace(/\.[^/.]+$/, ""));
        toast.success('File uploaded successfully!');
      } catch (error) {
        toast.error('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  const analyzeDataset = async () => {
    if (!jsonData.trim()) {
      toast.error('Please provide JSON data');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Validate JSON first
      JSON.parse(jsonData);
      
      const response = await fetch('/api/datasets/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonData: JSON.parse(jsonData),
          name: datasetName || 'Custom Dataset'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysisResult(result.schema);
        setActiveTab('preview');
        toast.success('Dataset analyzed successfully!');
      } else {
        toast.error(result.error || 'Analysis failed');
      }
    } catch (error: any) {
      toast.error('Invalid JSON format');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const importDataset = () => {
    if (analysisResult) {
      onDatasetAnalyzed(analysisResult, datasetName || 'Custom Dataset');
      toast.success('Dataset imported successfully!');
      handleClose();
    }
  };

  const handleClose = () => {
    setJsonData('');
    setDatasetName('');
    setAnalysisResult(null);
    setActiveTab('upload');
    onClose();
  };

  const loadSampleData = () => {
    setJsonData(JSON.stringify(sampleData, null, 2));
    setDatasetName('Sample E-commerce Data');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Custom Dataset Importer
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="preview" disabled={!analysisResult}>Preview & Import</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 overflow-y-auto space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload JSON data to automatically generate API endpoints. Supports arrays of objects, nested structures, and various data types.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Upload JSON File</CardTitle>
                  <CardDescription>Select a .json file from your computer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="mb-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadSampleData}
                    className="w-full"
                  >
                    Load Sample Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Dataset Name</CardTitle>
                  <CardDescription>Give your dataset a descriptive name</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="My Custom Dataset"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>JSON Data</Label>
              <Textarea
                placeholder="Paste your JSON data here..."
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="h-64 font-mono text-sm"
              />
            </div>

            <Button 
              onClick={analyzeDataset} 
              disabled={isAnalyzing || !jsonData.trim()}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Dataset'}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto space-y-4">
            {analysisResult && (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Dataset analyzed successfully! Review the detected structure below.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Dataset Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {analysisResult.recordCount} records
                      </Badge>
                      <Badge variant="secondary">
                        {analysisResult.fields?.length || 0} fields
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {analysisResult.fields && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResult.fields.map((field: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{field.name}</span>
                              {field.required && <Badge variant="destructive" className="ml-2">Required</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{field.type}</Badge>
                              {field.sample && (
                                <span className="text-sm text-muted-foreground truncate max-w-32">
                                  {JSON.stringify(field.sample)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analysisResult.sampleData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(analysisResult.sampleData, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={importDataset} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Import Dataset & Create API
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

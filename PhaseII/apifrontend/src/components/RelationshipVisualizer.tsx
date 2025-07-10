import React from 'react';
import { ArrowRight, Link, Plus, Users, FileText, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  relationTarget?: string;
}

interface Model {
  id: string;
  name: string;
  fields: Field[];
}

interface RelationshipVisualizerProps {
  models: Model[];
  onAddRelationship?: () => void; // Add callback for adding relationships
}

export function RelationshipVisualizer({ models, onAddRelationship }: RelationshipVisualizerProps) {
  // Extract all relationships from the models
  const relationships = models.flatMap(model => 
    model.fields
      .filter(field => field.type === 'relation' && field.relationTarget)
      .map(field => ({
        fromModel: model,
        fromField: field,
        toModel: models.find(m => m.id === field.relationTarget),
        relationshipType: 'belongs_to' // Could be extended for different types
      }))
  );

  if (relationships.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Link className="w-4 h-4 mr-2" />
            Model Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Link className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-600 mb-2">No relationships yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect your models to show how they relate to each other
            </p>
            
            {/* Educational examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-medium text-blue-800 mb-2">💡 What are relationships?</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>A <strong>User</strong> can write many <strong>Posts</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>An <strong>Order</strong> belongs to one <strong>Customer</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>A <strong>Comment</strong> is on one <strong>Post</strong></span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                These connections let your API automatically link data together!
              </p>
            </div>
            
            {onAddRelationship && models.length >= 2 && (
              <Button 
                onClick={onAddRelationship}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Relationship
              </Button>
            )}
            {models.length < 2 && (
              <p className="text-xs text-gray-400">
                You need at least 2 models to create relationships
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <Link className="w-4 h-4 mr-2" />
          Model Relationships ({relationships.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relationships.map((rel, index) => {
            const explanation = getRelationshipExplanation(rel.fromModel.name, rel.fromField.name, rel.toModel?.name || 'Unknown');
            
            return (
              <div key={index} className="border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                {/* Visual relationship with proper arrows */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 mb-1">
                        {rel.fromModel.name}
                      </Badge>
                      <div className="text-xs text-gray-500">has a</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="h-px bg-gray-400 w-8"></div>
                      <div className="text-center bg-white border rounded px-2 py-1">
                        <div className="text-sm font-medium text-purple-700">{rel.fromField.name}</div>
                        <div className="text-xs text-gray-500">field</div>
                      </div>
                      <div className="h-px bg-gray-400 w-8"></div>
                      <ArrowRight className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 mb-1">
                        {rel.toModel?.name || 'Unknown'}
                      </Badge>
                      <div className="text-xs text-gray-500">connects to</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {rel.fromField.required && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Required</Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      belongs_to
                    </Badge>
                  </div>
                </div>
                
                {/* Plain English explanation */}
                <div className="bg-white/70 border border-blue-200 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <strong>📝 What this means:</strong> {explanation.meaning}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>🔧 In your API:</strong> {explanation.apiExplanation}
                  </p>
                  {explanation.example && (
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>💡 Example:</strong> {explanation.example}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> These relationships will automatically create foreign key constraints 
            and join queries in your API endpoints.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to explain relationships in plain English
function getRelationshipExplanation(fromModel: string, fieldName: string, toModel: string) {
  const examples = {
    'User-Post': {
      meaning: `Each ${fromModel} can have a ${fieldName} that points to a specific ${toModel}. This creates a connection between them.`,
      apiExplanation: `When you get a ${fromModel}, you can automatically fetch the related ${toModel} data.`,
      example: `If User "John" creates a Post, that Post's "${fieldName}" field will contain John's information.`
    },
    'Post-User': {
      meaning: `Each ${fromModel} belongs to one ${toModel}. The "${fieldName}" field stores which ${toModel} it belongs to.`,
      apiExplanation: `When you fetch a ${fromModel}, you can see who the ${fieldName} is and get their details.`,
      example: `A blog post has an "author" field that tells you which User wrote it.`
    },
    'Order-Customer': {
      meaning: `Each ${fromModel} is connected to one ${toModel}. The "${fieldName}" field shows who the ${fromModel} belongs to.`,
      apiExplanation: `When you view an ${fromModel}, you can see the ${toModel} details automatically.`,
      example: `An order shows which customer placed it, including their name and contact info.`
    },
    'Comment-Post': {
      meaning: `Each ${fromModel} is attached to one ${toModel}. This groups ${fromModel}s under their ${toModel}.`,
      apiExplanation: `You can fetch all ${fromModel}s for a specific ${toModel}, or see which ${toModel} a ${fromModel} belongs to.`,
      example: `Comments on a blog post are linked to that specific post.`
    }
  };

  // Try to find a specific example pattern
  const key = `${fromModel}-${toModel}` as keyof typeof examples;
  if (examples[key]) {
    return examples[key];
  }

  // Generic explanation
  return {
    meaning: `Each ${fromModel} has a "${fieldName}" field that connects it to a specific ${toModel}.`,
    apiExplanation: `Your API can automatically fetch the related ${toModel} data when you get a ${fromModel}.`,
    example: `When you view a ${fromModel}, you'll see information about its related ${toModel}.`
  };
}

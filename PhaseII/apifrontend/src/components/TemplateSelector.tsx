import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface TemplateModel {
  name: string;
  description: string;
  fields: TemplateField[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  models: TemplateModel[];
}

interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: "blog",
    name: "Blog System",
    description: "A typical blog with users, posts, and comments",
    models: [
      {
        name: "User",
        description: "People who can write posts and comments",
        fields: [
          { name: "name", type: "text", required: true, description: "User's full name" },
          { name: "email", type: "email", required: true, description: "Login email address" },
          { name: "avatar", type: "url", required: false, description: "Profile picture URL" },
          { name: "isActive", type: "boolean", required: true, description: "Can the user log in?" }
        ]
      },
      {
        name: "Post",
        description: "Blog articles written by users",
        fields: [
          { name: "title", type: "text", required: true, description: "Post headline" },
          { name: "content", type: "text", required: true, description: "Full article text" },
          { name: "publishedAt", type: "date", required: false, description: "When was it published?" },
          { name: "isPublished", type: "boolean", required: true, description: "Is it visible to readers?" },
          { name: "author", type: "relation", required: true, description: "Which user wrote this?" }
        ]
      }
    ]
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    description: "Products, orders, and customers",
    models: [
      {
        name: "Product",
        description: "Items for sale in your store",
        fields: [
          { name: "name", type: "text", required: true, description: "Product name" },
          { name: "price", type: "number", required: true, description: "Price in cents" },
          { name: "description", type: "text", required: false, description: "Product details" },
          { name: "inStock", type: "boolean", required: true, description: "Available for purchase?" },
          { name: "category", type: "text", required: false, description: "Product category" }
        ]
      },
      {
        name: "Customer",
        description: "People who buy from your store",
        fields: [
          { name: "name", type: "text", required: true, description: "Customer name" },
          { name: "email", type: "email", required: true, description: "Contact email" },
          { name: "phone", type: "text", required: false, description: "Phone number" },
          { name: "address", type: "text", required: false, description: "Shipping address" }
        ]
      }
    ]
  },
  {
    id: "task",
    name: "Task Management",
    description: "Projects, tasks, and team members",
    models: [
      {
        name: "Project",
        description: "Collections of related tasks",
        fields: [
          { name: "name", type: "text", required: true, description: "Project name" },
          { name: "description", type: "text", required: false, description: "What is this project about?" },
          { name: "deadline", type: "date", required: false, description: "When is it due?" },
          { name: "isCompleted", type: "boolean", required: true, description: "Is the project finished?" }
        ]
      },
      {
        name: "Task",
        description: "Individual work items",
        fields: [
          { name: "title", type: "text", required: true, description: "What needs to be done?" },
          { name: "description", type: "text", required: false, description: "Additional details" },
          { name: "priority", type: "text", required: false, description: "High, Medium, or Low" },
          { name: "isCompleted", type: "boolean", required: true, description: "Is it done?" },
          { name: "project", type: "relation", required: true, description: "Which project does this belong to?" }
        ]
      }
    ]
  },
  {
    id: "crm",
    name: "CRM System",
    description: "Manage contacts, companies, and interactions.",
    models: [
      {
        name: "Contact",
        description: "Individual people you interact with.",
        fields: [
          { name: "name", type: "text", required: true, description: "Full name" },
          { name: "email", type: "email", required: true, description: "Primary email" },
          { name: "phone", type: "text", required: false, description: "Phone number" },
          { name: "company", type: "relation", required: false, description: "Which company they work for" }
        ]
      },
      {
        name: "Company",
        description: "Organizations or businesses.",
        fields: [
          { name: "name", type: "text", required: true, description: "Company\'s legal name" },
          { name: "website", type: "url", required: false, description: "Company website" },
          { name: "address", type: "text", required: false, description: "Physical address" }
        ]
      },
      {
        name: "Interaction",
        description: "Records of communication with contacts.",
        fields: [
          { name: "type", type: "text", required: true, description: "e.g., Call, Email, Meeting" },
          { name: "date", type: "date", required: true, description: "When it happened" },
          { name: "notes", type: "text", required: false, description: "Summary of the interaction" },
          { name: "contact", type: "relation", required: true, description: "Who you interacted with" }
        ]
      }
    ]
  },
  {
    id: "social",
    name: "Social Media App",
    description: "Users, posts, comments, and followers.",
    models: [
      {
        name: "User",
        description: "App users with profiles.",
        fields: [
          { name: "username", type: "text", required: true, description: "Unique public name" },
          { name: "email", type: "email", required: true, description: "Login email" },
          { name: "bio", type: "text", required: false, description: "User\'s profile biography" },
        ]
      },
      {
        name: "Post",
        description: "Content shared by users.",
        fields: [
          { name: "content", type: "text", required: true, description: "The text of the post" },
          { name: "imageUrl", type: "url", required: false, description: "Optional image for the post" },
          { name: "author", type: "relation", required: true, description: "The user who created the post" }
        ]
      },
      {
        name: "Comment",
        description: "Replies to posts.",
        fields: [
          { name: "text", type: "text", required: true, description: "The content of the comment" },
          { name: "author", type: "relation", required: true, description: "The user who wrote the comment" },
          { name: "post", type: "relation", required: true, description: "The post this comment is on" }
        ]
      }
    ]
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Services, customers, and appointments.",
    models: [
      {
        name: "Customer",
        description: "People who book appointments.",
        fields: [
          { name: "name", type: "text", required: true, description: "Customer\'s full name" },
          { name: "email", type: "email", required: true, description: "Contact email" },
          { name: "phone", type: "text", required: false, description: "Contact phone number" }
        ]
      },
      {
        name: "Service",
        description: "The services offered for booking.",
        fields: [
          { name: "name", type: "text", required: true, description: "Name of the service" },
          { name: "duration", type: "number", required: true, description: "Duration in minutes" },
          { name: "price", type: "number", required: true, description: "Price of the service" }
        ]
      },
      {
        name: "Booking",
        description: "A scheduled appointment.",
        fields: [
          { name: "startTime", type: "date", required: true, description: "When the booking starts" },
          { name: "status", type: "text", required: true, description: "e.g., Confirmed, Canceled" },
          { name: "customer", type: "relation", required: true, description: "Who made the booking" },
          { name: "service", type: "relation", required: true, description: "Which service was booked" }
        ]
      }
    ]
  }
];

export function TemplateSelector({ onSelectTemplate }: Omit<TemplateSelectorProps, 'templates'>) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <BookOpen className="w-12 h-12 mx-auto text-blue-500 mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose a Template</h3>
        <p className="text-gray-600 text-sm">
          Start with a pre-built data model or create your own from scratch
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="h-full hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                </div>
                <Badge variant="secondary">{template.models.length} Models</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-1">Models included:</div>
                {template.models.map((model, index) => (
                  <div key={index} className="text-xs">
                    <Badge variant="outline" className="mr-2 mb-1">
                      {model.name}
                    </Badge>
                    <span className="text-gray-500">({model.fields.length} fields)</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full mt-4"
                size="sm"
              >
                <Play className="w-3 h-3 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button variant="outline" onClick={() => onSelectTemplate({ id: 'blank', name: 'Blank', description: 'Start from scratch', models: [] })}>
          Start with Blank Project
        </Button>
      </div>
    </div>
  );
}

export default TemplateSelector;

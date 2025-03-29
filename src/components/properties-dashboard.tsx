"use client";

import { useState } from "react";
import { PropertyTable } from "@/components/property-table";
import { PropertyForm } from "@/components/property-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types";

export function PropertiesDashboard() {
  const [activeTab, setActiveTab] = useState("list");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setActiveTab("form");
  };

  const handleCreateNew = () => {
    setEditingProperty(null);
    setActiveTab("form");
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Management</h1>
        <Button onClick={handleCreateNew}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Properties List</TabsTrigger>
          <TabsTrigger value="form">
            {editingProperty ? "Edit Property" : "Add New Property"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <PropertyTable onEdit={handleEdit} />
        </TabsContent>
        <TabsContent value="form">
          <PropertyForm
            property={editingProperty}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

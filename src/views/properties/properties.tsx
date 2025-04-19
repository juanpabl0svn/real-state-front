import { useState } from "react";
import { PropertyTable } from "@/components/properties/property-table";
import { PropertyForm } from "@/components/properties/property-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPropertyForm, Property, ReturnTypeHandler } from "@/types";
import { useAppStore } from "@/stores/app-store";
import { createProperty, updateProperty } from "@/lib/actions";

export function PropertiesPage() {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const { tab, setTab } = useAppStore();

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setTab("form");
  };

  const handleCreateNew = () => {
    setEditingProperty(null);
    setTab("form");
  };

  const handleSubmit = async (property: IPropertyForm) =>
    editingProperty
      ? updateProperty(editingProperty.id, property)
      : createProperty(property);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Management</h1>
        <Button onClick={handleCreateNew}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>
      <Tabs value={tab ?? "list"} onValueChange={setTab} className="w-full">
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
            handleSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

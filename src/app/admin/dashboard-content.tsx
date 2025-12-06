"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubjectManager } from "./components/subject-manager";
import { ResourceManager } from "./components/resource-manager";

export function AdminDashboardContent() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="subjects">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subjects" className="cursor-pointer">
            Manage Subjects
          </TabsTrigger>
          <TabsTrigger value="resources" className="cursor-pointer">
            Manage Resources
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subjects">
          <SubjectManager />
        </TabsContent>
        <TabsContent value="resources">
          <ResourceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

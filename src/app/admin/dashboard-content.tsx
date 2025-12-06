"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubjectManager } from "./components/subject-manager";
import { ResourceManager } from "./components/resource-manager";

export function AdminDashboardContent() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="resources">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources" className="cursor-pointer">
            Resources
          </TabsTrigger>
          <TabsTrigger value="subjects" className="cursor-pointer">
            Subjects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <ResourceManager />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

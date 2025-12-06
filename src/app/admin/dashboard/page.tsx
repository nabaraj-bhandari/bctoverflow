import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubjectManager } from "./components/subject-manager";
import { ResourceManager } from "./components/resource-manager";
import { BookMarked, FilePlus } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage subjects and resources.</p>
      </header>
      <Tabs defaultValue="subjects">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subjects">
            <BookMarked className="mr-2 h-4 w-4" />
            Manage Subjects
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FilePlus className="mr-2 h-4 w-4" />
            Manage Resources
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subjects" className="mt-4">
          <SubjectManager />
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <ResourceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use server";

import { prisma } from "@/lib/prisma";
import { Resource } from "@/lib/types";

export async function getAllResources(): Promise<Resource[]> {
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
    });
    console.log("[getAllResources] All subject codes in DB:", new Set(resources.map(r => r.subjectCode)));
    return resources;
}

export async function getResourcesBySubjectCode(subjectCode: string): Promise<Resource[]> {
    console.log(`[getResourcesBySubjectCode] Querying for subjectCode: "${subjectCode}" (length: ${subjectCode.length})`);
    const resources = await prisma.resource.findMany({
        where: { subjectCode },
        orderBy: { createdAt: "desc" },
    });
    console.log(`[getResourcesBySubjectCode] Found ${resources.length} resources for ${subjectCode}`);

    // Debug: show all available subject codes
    if (resources.length === 0) {
        const allResources = await prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
        const uniqueCodes = new Set(allResources.map(r => r.subjectCode));
        console.log(`[getResourcesBySubjectCode] Available codes in DB:`, Array.from(uniqueCodes));
    }

    return resources;
}

export async function createResourceAction(data: {
    title: string;
    url: string;
    subjectCode: string;
    category: string;
}): Promise<{ success: boolean; error?: string; resource?: Resource }> {
    try {
        const resource = await prisma.resource.create({
            data,
        });
        return { success: true, resource };
    } catch (error) {
        console.error("Error creating resource:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create resource",
        };
    }
}

export async function updateResourceAction(
    id: string,
    data: {
        title?: string;
        url?: string;
        category?: string;
    }
): Promise<{ success: boolean; error?: string; resource?: Resource }> {
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data,
        });
        return { success: true, resource };
    } catch (error) {
        console.error("Error updating resource:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update resource",
        };
    }
}

export async function deleteResourceAction(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.resource.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting resource:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete resource",
        };
    }
}

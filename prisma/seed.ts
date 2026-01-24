import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping of subject UUIDs to subject codes
const subjectUUIDToCode: Record<string, string> = {
    "8891a7b8-39b9-4b9a-a433-3ee89176af17": "ENSH_202",
    "dd783dac-daf1-47b8-83d5-0da900e390db": "ENCT_201",
    "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd": "ENSH_101",
    "e3d32c47-5cec-45bf-9729-aec58aade402": "ENCT_203",
    "565e8236-4cf4-4b9b-b3b5-d893be03fc2b": "ENCT_202",
    "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e": "ENCT_201",
    "e76bdb45-b679-4198-9f42-3bcbff709fb7": "ENSH_204",
};

// All resources data from your resources.ts file
const resourcesData = [
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Python for Data Analysis", url: "13MhaFv9kT4kKdJXzuBwqpU8k5yPUKjVs" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "notes", title: "Handwritten Notes", url: "1w3i1sOSAjNLapJq0-N24yvG3yPqUYAxw" },
    { subjectId: "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd", category: "exam", title: "Syllabus", url: "1dvUsQTKpWaajhbkTMpeZgpy_TFnxDQYO" },
    { subjectId: "e3d32c47-5cec-45bf-9729-aec58aade402", category: "notes", title: "Example Regular Expression, Pumping lemma, Closure Properties", url: "1LfpcPBx3Y3UPWJS5ZKop460yz0Oz6wz-" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "books", title: "Insights", url: "1ds2_Si58GhB5-a4YmaUOZskulFDcZ58G" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "exam", title: "Assessments 2", url: "13nOWmRmxHFqbPDt1Jp1fIRhQw3YqnEm-" },
    { subjectId: "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd", category: "exam", title: "Chapterwise Old Questions", url: "1IwjUud_r_GHXNQs3ETyF4OT8U4g4o4cR" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Mastering Python for Data Science", url: "1otywgJTLT_q_5QFmxKzCsvofDwZC0g68" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "books", title: "Insights 1", url: "1mzLrkUEbhkt9AL2UKxUsYmvwsOhp4Q1U" },
    { subjectId: "e76bdb45-b679-4198-9f42-3bcbff709fb7", category: "pyqs", title: "81 Chaitra (R)", url: "1BiItnAeSH5w-jMuF3G_a_KSLRr3S0Ckj" },
    { subjectId: "e3d32c47-5cec-45bf-9729-aec58aade402", category: "books", title: "Insights", url: "1iniNDqBv0dJSNVcyEFcf_9AdG5EBjB-1" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "exam", title: "micro syllabus", url: "1vvTLpoh-Tcxsu6hmEdm8eq86M42C4MlF" },
    { subjectId: "e3d32c47-5cec-45bf-9729-aec58aade402", category: "pyqs", title: "80 Bhadra - 79 Bhadra", url: "1Tm3GBIXVl3dF2fLmzkQFvPuoFq4tuBV9" },
    { subjectId: "e3d32c47-5cec-45bf-9729-aec58aade402", category: "books", title: "Introduction to TOC", url: "1HT_at0UqHzogJ7zrXAy9wD1dudomfKM7" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Data Science for Dummies (3rd ed.)", url: "1GkyaRvVxTNLjBmhucho7ryWgUF7JeO7D" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Mathematics for Machine Learning", url: "1gT1c0NxA59J1RPpxtXJnWqSgv_RoUtV9" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Python Data Science Handbook", url: "1_a-xjfvnohdNj57nVRsTc6CRtux_V8yS" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "pyqs", title: "81 Chaitra (R)", url: "1wMDSR_tpaI4BC3VVI6Z5-1VgJ6f7_wAE" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Introduction to Data Science", url: "1x2utc2_iyW1LUppCOHE5216-rqFZxli3" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "pyqs", title: "81 Chaitra (R)", url: "1tC0A8rWMH_tfLYV2CzJwBtPn195bGtLN" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "books", title: "CG by Hearn and  Pauline Baker", url: "1tpL9kTVY4wWtdW3h9PoGjFA_a1MYXtui" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "books", title: "Manual v1", url: "1hGxoY5h_qt-D5iRAmro-hVw2lqScZ1KZ" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Data Science from Scratch (1st ed.)", url: "1TsPyECi8aRWh84j16iu9DbptqHBkyraO" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Pattern Recognition and Machine Learning", url: "1FABfezt1LLiuJWjE9h7lSkGofB9vUmQ5" },
    { subjectId: "e3d32c47-5cec-45bf-9729-aec58aade402", category: "pyqs", title: "81 Chaitra (R)", url: "1KgMIpEp9qenH_dBggtk7IRhylwdHwM2B" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Practical Statistics for Data Scientists", url: "1Lc9mygLhduOYF2fPv_bsbGNYQHRyIAGV" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Data Science for Dummies", url: "1sTTTa_Ko2oG0Omv21W3GP3U_1RjmrO_E" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "pyqs", title: "PYQ solution regular", url: "10A3HAgTzY-5zxvdU_MV2XKv9xnOWAga2" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "exam", title: "Microsyllabus", url: "1xWobYceJ-W7RGbMbhPWDt7pUQgNf3CCl" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "exam", title: "micro syllabus", url: "1btESys7WW8gQEfj3pZ4wh0ljDDelsxQB" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "pyqs", title: "80 Ashwin - 77 Chaitra", url: "1-7_dNg-Fsjbt_rBVEKaWzdm9A2DhqzVw" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "pyqs", title: "79 Ashwin - 63 Kartik", url: "12U8uhcfR5vJsYNXdPNuPkNSphrzECQA3" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Introduction to Functional Data Analysis", url: "1T5BL8A4G7lasU_VfXZfNDRkcTsSYjqlK" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Principles of Data Science", url: "1QNISZwd6egjuPVQjIztFY_zwu0kQF285" },
    { subjectId: "e76bdb45-b679-4198-9f42-3bcbff709fb7", category: "exam", title: "Model Question", url: "10itRaxK6-Aec7rblOaO3RHGOdkfRUnHf" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "exam", title: "Assessments 3", url: "1TOEDkBd0jg_gj4j0vG4srbj5NGDQrjhT" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "exam", title: "micro syllaubs", url: "1zX1ro_Eqn2l8iANaWGiMrVKrgb7_ZmiA" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 1", url: "11fwxssIeCWJFQxWcJQeSsvbIToQXBgbA" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 3", url: "1Lc3qkYyV3yo1Q1HgmnL4jodqyQdUbffv" },
    { subjectId: "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd", category: "exam", title: "Micro Syllabus", url: "1DMew9XF9_uNdPAtGVVfcdv59VTh8N6zi" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "books", title: "Manual v2", url: "1dmX0TEBOifJqQ-QKqvwYS_qsUeyuPu9v" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 6", url: "1j-KcXrJwgdSCvfOQixipYkzxd0bHxqF1" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "exam", title: "Chapterwise Questions", url: "1Z_qrelq1c_zPZ1FpOwAw2SAwewXQmg26" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 4", url: "1w0QIGGCLgOIV0h8gDWK-JzVpDpDAHxzf" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "books", title: "Data Science from Scratch (2nd ed.)", url: "1kiFD_k7KxgMf1C9nCAlJ51FMpGlcc09b" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "exam", title: "Syllabus", url: "1FTTYledr1yL6ITAAh-ExTMH-VKnZcBy3" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "pyqs", title: "81 Chaitra (R)", url: "1UaTvTRwN0txeGLp0P4DOoCt2OxLRDJqq" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 7", url: "1Xah5-KZIwhOKQVG_yTqoiFNxJyPZRO_E" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "books", title: "Manual v3", url: "1KRp-gkv9-qV6oek9G8sbAUPnaxH_GWji" },
    { subjectId: "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd", category: "pyqs", title: "81 Chaitra (R)", url: "1cCZ4ToDT2A0NgltLlZ90CzvBnt9FTVuf" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "pyqs", title: "PYQ solution back", url: "15pcuUDzUlat7lIOb0P4wxEV1n5YfdI_H" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "pyqs", title: "82 Baisakh - 76 Ashwin", url: "1olFI0It6poeR9AJ0h2ytkhxKdXS8mAsf" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 5", url: "1W9OKTZZ5ONYFNXlENt3dVjWK9chx4da0" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "pyqs", title: "81 Chaitra (R)", url: "1c8hVZfO2NwWviUjwthjn5aEabt4ilkq-" },
    { subjectId: "73f5ddf5-8ada-4ea3-b450-1c056eaf79bd", category: "pyqs", title: "81 Baisakh (R)", url: "1DFh92gPidz75D78yQ4V4qaGwNGZH4qwo" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "notes", title: "Unit 2", url: "1e_dhBm3p9V2Is-w5u9madeaB8ph_aNfG" },
    { subjectId: "d2426b72-c621-4ed9-ad9b-b25fe0a3e23e", category: "books", title: "Insights 2", url: "15kd_N7W-A9kac1iVoZG6ojm3Z5QvmJ4G" },
    { subjectId: "565e8236-4cf4-4b9b-b3b5-d893be03fc2b", category: "pyqs", title: "79 Chaitra - 66 Magh", url: "15DqO-jr6dETYdvaIv-SNDNiCinI-zPCx" },
    { subjectId: "dd783dac-daf1-47b8-83d5-0da900e390db", category: "pyqs", title: "75 Ashwin - 68 Baisakh", url: "1xESd7Pu_pzQ2SUcZGSj8_hpIhWrA48Tk" },
    { subjectId: "8891a7b8-39b9-4b9a-a433-3ee89176af17", category: "exam", title: "Assessments 1", url: "1sP4ayLpkdlQzWwltXhpq2b6quwuwGh3u" },
];

async function main() {
    console.log("Start seeding resources...");

    // Clear existing resources
    await prisma.resource.deleteMany({});
    console.log("Cleared existing resources");

    let createdCount = 0;

    for (const resource of resourcesData) {
        const subjectCode = subjectUUIDToCode[resource.subjectId];

        if (!subjectCode) {
            console.warn(`Skipping: No mapping for ${resource.subjectId}`);
            continue;
        }

        try {
            const result = await prisma.resource.create({
                data: {
                    subjectCode,
                    title: resource.title,
                    category: resource.category,
                    url: resource.url,
                },
            });
            console.log(`✓ Created: ${result.title}`);
            createdCount++;
        } catch (err) {
            console.error(`✗ Error creating ${resource.title}:`, err);
        }
    }

    console.log(`\n✅ Seeding completed. Created ${createdCount}/${resourcesData.length} resources.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Seeding error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });

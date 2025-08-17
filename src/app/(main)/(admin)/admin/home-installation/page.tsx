// import AdminInstallations from "@/components/AdminInstallations";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function AllInstallationsPage({
//   searchParams,
// }: {
//   searchParams: { page?: string; q?: string };
// }) {
//   const page = parseInt(searchParams.page || "1");
//   const q = searchParams.q || "";
//   const status = "all";
//   const limit = 10;
//   const skip = (page - 1) * limit;

//   try {
//     const validStatuses = ["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
//     const whereClause: any = {};

//     if (validStatuses.includes(q.toUpperCase())) {
//       whereClause.status = q.toUpperCase();
//     } else if (q) {
//       // Use raw SQL-like conditions to handle case-insensitive search without 'mode'
//       whereClause.OR = [
//         { userName: { contains: q /* Remove mode: "insensitive" */ } },
//         { mobileNumber: { contains: q /* Remove mode: "insensitive" */ } },
//       ];
//     }

//     // const installations = await prisma.installation.findMany({
//     //   where: whereClause,
//     //   skip,
//     //   take: limit,
//     //   orderBy: { createdAt: "desc" },
//     // });
//     // const totalCount = await prisma.installation.count({ where: whereClause });



//     return (
//       <AdminInstallations
//         installations={installations}
//         meta={{
//           total: totalCount,
//           page,
//           limit,
//           totalPages: Math.ceil(totalCount / limit),
//         }}
//         searchQuery={q}
//         status={status}
//       />
//     );
//   } catch (error) {
//     console.error("Error fetching installations:", error);
//     return (
//       <AdminInstallations
//         installations={[]}
//         meta={{ total: 0, page: 1, limit: 10, totalPages: 1 }}
//         searchQuery={q}
//         status={status}
//         error="Failed to fetch installation requests"
//       />
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

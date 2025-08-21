// import AdminInstallations from "@/components/AdminInstallations";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function StatusInstallations({
//   params,
//   searchParams,
// }: {
//   params: { status: string };
//   searchParams: { page?: string; q?: string };
// }) {
//   const { status } = params;
//   const page = parseInt(searchParams.page || "1");
//   const q = searchParams.q || "";
//   const limit = 10;
//   const skip = (page - 1) * limit;

//   try {
//     const whereClause = {
//       status: status.toUpperCase(),
//       OR: [
//         { userName: { contains: q, mode: "insensitive" } },
//         { mobileNumber: { contains: q, mode: "insensitive" } },
//       ],
//     };
//     const installations = await prisma.installation.findMany({
//       where: whereClause,
//       skip,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//     });
//     const totalCount = await prisma.installation.count({ where: whereClause });

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

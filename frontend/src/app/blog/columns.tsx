"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AllBlog } from "@/lib/features/blogSlice";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";

export const columns: ColumnDef<AllBlog>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt={row.original.title}
        className="h-20 w-20 rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "isPublic",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 w-full h-full">
          {row.original.isPublic ? "Public" : "Private"}
        </div>
      );
    },
  },
];

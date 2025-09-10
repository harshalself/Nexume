import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { JD } from "../services/jobDescription.service";
import JobDescriptionCard from "./JobDescriptionCard";

type Props = {
  jobDescriptions: JD[];
  onView: (jd: JD) => void;
  onEdit: (jd: JD) => void;
  onDelete: (id: number) => void;
};

const JobDescriptionGrid: React.FC<Props> = ({
  jobDescriptions,
  onView,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const filteredJobs = useMemo(() => {
    return jobDescriptions.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobDescriptions, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search job titles or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
            }
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredJobs.length} of {jobDescriptions.length} job
        descriptions
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No job descriptions found</div>
          {searchTerm || statusFilter !== "All" ? (
            <div className="mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="mt-2 text-gray-400">
              Create your first job description to get started
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((jd) => (
            <JobDescriptionCard
              key={jd.id}
              jobDescription={jd}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDescriptionGrid;

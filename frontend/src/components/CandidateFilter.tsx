import React from "react";
import { JD } from "../interfaces/jobDescription.interface";

type Props = {
  jobDescriptions: JD[];
  selectedId: number | null;
  onChange: (id: number) => void;
};

const CandidateFilter: React.FC<Props> = ({
  jobDescriptions,
  selectedId,
  onChange,
}) => (
  <div className="mb-4">
    <label htmlFor="job-filter" className="block text-sm font-medium mb-1">
      Filter by Job Description
    </label>
    <select
      id="job-filter"
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 bg-white"
      value={selectedId ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Filter candidates by job description">
      <option value="">All Job Descriptions</option>
      {jobDescriptions.map((jd) => (
        <option key={jd.id} value={jd.id}>
          {jd.title}
        </option>
      ))}
    </select>
  </div>
);

export default CandidateFilter;

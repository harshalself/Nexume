import React from "react";
import { JD } from "../services/jobDescription.service";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { FileText, Edit, Trash2, Eye, MapPin, Building } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  jobDescription: JD;
  onView: (jd: JD) => void;
  onEdit: (jd: JD) => void;
  onDelete: (id: number) => void;
};

const JobDescriptionCard: React.FC<Props> = ({
  jobDescription,
  onView,
  onEdit,
  onDelete,
}) => (
  <Card
    className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
    tabIndex={0}
    aria-label={`View job description: ${jobDescription.title}`}
    onClick={() => onView(jobDescription)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") onView(jobDescription);
    }}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-blue-50 group-hover:scale-110 transition-transform duration-200">
          <FileText className="h-6 w-6 text-blue-700" />
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            jobDescription.status === "Active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-gray-700"
          }`}>
          {jobDescription.status}
        </span>
      </div>
      <CardTitle className="text-lg text-card-foreground group-hover:text-primary transition-colors duration-200">
        {jobDescription.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 mb-4">
        {/* Company and Location - if available in future */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Building className="h-3 w-3" />
          <span>Company</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-3 w-3" />
          <span>Location</span>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-2">
          {jobDescription.description.length > 100
            ? `${jobDescription.description.substring(0, 100)}...`
            : jobDescription.description}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs text-muted-foreground">Created: </span>
        <span className="text-sm text-muted-foreground">
          {new Date(jobDescription.created).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          variant="ghost"
          size="icon"
          title="View"
          aria-label="View"
          onClick={(e) => {
            e.stopPropagation();
            onView(jobDescription);
          }}>
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Edit"
          aria-label="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(jobDescription);
          }}>
          <Edit className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Delete"
          aria-label="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(jobDescription.id);
          }}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default JobDescriptionCard;

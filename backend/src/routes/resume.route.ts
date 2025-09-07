import { Router } from "express";
import multer, { MulterError } from "multer";
import Route from "../interfaces/route.interface";
import { ResumeController } from "../controllers/resume.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import { ResumeUploadDto, ResumeUpdateDto } from "../dtos/resume.dto";
import HttpException from "../exceptions/HttpException";
import { Request, Response, NextFunction } from "express";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF, DOC, and DOCX files
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
        )
      );
    }
  },
});

// Middleware to handle multer errors
const handleMulterError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(
        new HttpException(400, "File size too large. Maximum size is 5MB.")
      );
    }
    return next(new HttpException(400, error.message));
  } else if (error) {
    // Handle other multer errors (like file type validation)
    return next(new HttpException(400, error.message));
  }
  next();
};

class ResumeRoute implements Route {
  public path = "/resumes";
  public router = Router();
  public resumeController = new ResumeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Upload resume
    this.router.post(
      `${this.path}`,
      upload.single("resume"),
      handleMulterError,
      validationMiddleware(ResumeUploadDto, "body", false, []),
      this.resumeController.uploadResume
    );

    // Get all resumes for user
    this.router.get(`${this.path}`, this.resumeController.getResumes);

    // Get specific resume by ID
    this.router.get(`${this.path}/:id`, this.resumeController.getResumeById);

    // Update resume metadata
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(ResumeUpdateDto, "body", true, []),
      this.resumeController.updateResume
    );

    // Soft delete resume
    this.router.delete(`${this.path}/:id`, this.resumeController.deleteResume);
  }
}

export default ResumeRoute;

import { Resume, ResumeUploadData } from "../interfaces/resume.interface";

const STORAGE_KEY = "mockResumes";

const initialMockResumes: Resume[] = [
  {
    id: 1,
    filename: "john_doe_resume.pdf",
    uploadedAt: "2024-06-01",
    status: "Uploaded",
  },
  {
    id: 2,
    filename: "jane_smith_cv.docx",
    uploadedAt: "2024-06-02",
    status: "Uploaded",
  },
];

// Always read from and write to localStorage as the source of truth
function loadResumes(): Resume[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data) as Resume[];
    } catch {
      return [...initialMockResumes];
    }
  }
  return [...initialMockResumes];
}

function saveResumes(resumes: Resume[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

// Get all resumes
export const getResumes = async (): Promise<Resume[]> => {
  return Promise.resolve(loadResumes());
};

// Upload a new resume
export const uploadResume = async (data: ResumeUploadData): Promise<Resume> => {
  await new Promise((res) => setTimeout(res, 1000));
  const resumes = loadResumes();
  const newResume: Resume = {
    id: Date.now(),
    filename: data.file.name,
    uploadedAt: new Date().toISOString().slice(0, 10),
    status: "Uploaded",
  };
  resumes.push(newResume);
  saveResumes(resumes);
  return Promise.resolve(newResume);
};

// Delete a resume by id
export const deleteResume = async (id: number): Promise<boolean> => {
  const resumes = loadResumes();
  const idx = resumes.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  resumes.splice(idx, 1);
  saveResumes(resumes);
  return Promise.resolve(true);
};

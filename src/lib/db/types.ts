export type Profile = {
  id: string;
  role: "USER" | "ADMIN";
  credits_balance: number;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  original_image_url: string;
};

export type Job = {
  id: string;
  project_id: string;
  user_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  prompt: string;
  ai_model: string;
  result_image_url?: string | null;
  credits_used: number;
  error_message?: string | null;
};

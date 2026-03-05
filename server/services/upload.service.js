import Upload from "../models/Upload.js";

export const getLatestCompletedUpload = async (workspaceId) => {
  return await Upload.findOne({
    workspace: workspaceId,
    status: "completed",
    isActive: true, 
  }).sort({ createdAt: -1 });
};
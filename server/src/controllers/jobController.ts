```ts
import { Job } from '../models/Job';
import { User } from '../models/User';

interface JobListFilter {
  page: number;
  limit: number;
  status?: string;
  type?: string;
}

interface JobListResult {
  jobs: any[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Get list of jobs
 */
export const getJobList = async (filter: JobListFilter): Promise<JobListResult> => {
  try {
    const { page, limit, status, type } = filter;
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }

    const total = await Job.countDocuments(query);
    const pages = Math.ceil(total / limit);
    
    const jobs = await Job.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
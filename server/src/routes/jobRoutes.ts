```ts
import { Router } from 'express';
import { protect, admin } from '../middleware/auth';
import { getJobStatus, getJobResult, cancelJob, getJobList } from '../controllers/jobController';

const router = Router();

/**
 * GET /api/admin/jobs
 * Get list of all jobs
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    
    const jobs = await getJobList({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      status: status as string,
      type: type as string
    });

    res.json(jobs);
  } catch (error: any) {
    console.error('Get job list error:', error);
    res.status(500).json({ 
      message: 'Failed to get job list',
      error: error.message 
    });
  }
});

/**
 * GET /api/admin/jobs/:id
 * Get job status
 */
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobStatus(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error: any) {
    console.error('Get job status error:', error);
    res.status(500).json({ 
      message: 'Failed to get job status',
      error: error.message 
    });
  }
});

/**
 * GET /api/admin/jobs/:id/result
 * Get job result
 */
router.get('/:id/result', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getJobResult(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Job result not found' });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Get job result error:', error);
    res.status(500).json({ 
      message: 'Failed to get job result',
      error: error.message 
    });
  }
});

/**
 * POST /api/admin/jobs/:id/cancel
 * Cancel a job
 */
router.post('/:id/cancel', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cancelJob(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Cancel job error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel job',
      error: error.message 
    });
  }
});

export default router;
```
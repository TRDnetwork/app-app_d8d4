import { Router } from 'express';
import { createJob, getJob, getJobs, cancelJob } from '../controllers/jobController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Admin routes only
router.use(protect, authorize('admin'));

// Job routes
router.route('/')
  .post(createJob)
  .get(getJobs);

router.route('/:id')
  .get(getJob)
  .delete(cancelJob);

export default router;
```
```typescript
import Queue from 'bull';
import { processProductImportJob, handleImportJobCompleted, handleImportJobFailed } from '../jobs/productImportJob';
import { REDIS_URL } from '../config/env';

// Create import queue
const importQueue
// src/routes/task.routes.ts
import { Router } from 'express';
import * as taskController from '../controllers/task.controller';

const router = Router();

// IMPORTANT: /stats must be registered before /:id,
// or Express will treat "stats" as an :id value and it'll never be reached.
router.get('/stats', taskController.getStats);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id', taskController.patchTask);
router.delete('/:id', taskController.deleteTask);

export default router;
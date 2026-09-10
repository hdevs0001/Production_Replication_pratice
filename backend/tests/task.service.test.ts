// tests/task.service.test.ts
import * as taskModel from '../src/models/task.model';
import * as taskService from '../src/services/task.service';
import { NotFoundError, ValidationError } from '../src/utils/error';

jest.mock('../src/models/task.model');
const mockedModel = taskModel as jest.Mocked<typeof taskModel>;

const fakeTask = {
  id: '1',
  title: 'Test task',
  description: '',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('task.service', () => {
  describe('createTask', () => {
    it('creates a task when title is valid', async () => {
      mockedModel.create.mockResolvedValue(fakeTask);

      const result = await taskService.createTask({ title: 'Test task' });

      expect(result).toEqual(fakeTask);
      expect(mockedModel.create).toHaveBeenCalledWith({
        title: 'Test task',
        description: '',
      });
    });

    it('throws ValidationError when title is empty', async () => {
      await expect(taskService.createTask({ title: '   ' })).rejects.toThrow(
        ValidationError
      );
      expect(mockedModel.create).not.toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('returns the task when it exists', async () => {
      mockedModel.findById.mockResolvedValue(fakeTask);

      const result = await taskService.getTaskById('1');

      expect(result).toEqual(fakeTask);
    });

    it('throws NotFoundError when the task does not exist', async () => {
      mockedModel.findById.mockResolvedValue(undefined);

      await expect(taskService.getTaskById('missing')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('patchTask', () => {
    it('throws NotFoundError before attempting an update on a missing task', async () => {
      mockedModel.findById.mockResolvedValue(undefined);

      await expect(
        taskService.patchTask('missing', { completed: true })
      ).rejects.toThrow(NotFoundError);
      expect(mockedModel.update).not.toHaveBeenCalled();
    });

    it('throws ValidationError when title is patched to an empty string', async () => {
      mockedModel.findById.mockResolvedValue(fakeTask);

      await expect(
        taskService.patchTask('1', { title: '   ' })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteTask', () => {
    it('throws NotFoundError when nothing was deleted', async () => {
      mockedModel.remove.mockResolvedValue(false);

      await expect(taskService.deleteTask('missing')).rejects.toThrow(
        NotFoundError
      );
    });

    it('resolves successfully when the task was deleted', async () => {
      mockedModel.remove.mockResolvedValue(true);

      await expect(taskService.deleteTask('1')).resolves.toBeUndefined();
    });
  });
});
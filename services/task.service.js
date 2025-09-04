const Task = require('../models/task.model');

/**
 * Get all tasks
 * @returns {Promise<Array>} Array of task documents
 */
async function findAll() {
  const tasks = await Task.find().exec();
  return tasks.map(task => task.toObject());
}

/**
 * Find one task by its ID
 * @param {string} taskId
 * @returns {Promise<Object|null>} Task document or null
 */
async function findOneById(taskId) {
  const task = await Task.findById(taskId).exec();
  return task ? task.toObject() : null;
}

/**
 * Create a new task
 * @param {Object} taskData - task fields like title, description, stage, etc.
 * @returns {Promise<Object>} Newly created task object
 */
async function createTask(taskData) {
  const task = new Task(taskData);
  await task.save();
  return task.toObject();
}

/**
 * Update a task by ID
 * @param {string} taskId
 * @param {Object} updateData - fields to update
 * @returns {Promise<Object|null>} Updated task object or null if not found
 */
async function updateTask(taskId, updateData) {
  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return updatedTask ? updatedTask.toObject() : null;
}

/**
 * Soft delete task by setting isTrashed flag
 * @param {string} taskId
 * @returns {Promise<Object|null>} Updated task object or null
 */
async function deleteTask(taskId) {
  const deletedTask = await Task.findByIdAndUpdate(
    taskId,
    { isTrashed: true },
    { new: true }
  ).exec();
  return deletedTask ? deletedTask.toObject() : null;
}

module.exports = {
  findAll,
  findOneById,
  createTask,
  updateTask,
  deleteTask,
};

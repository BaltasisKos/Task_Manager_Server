import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'API documentation for Task Manager app',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserRegister: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      UserProfileUpdate: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'newemail@example.com' },
          // add other fields user can update
        },
      },
      ChangePassword: {
        type: 'object',
        required: ['oldPassword', 'newPassword'],
        properties: {
          oldPassword: { type: 'string' },
          newPassword: { type: 'string' },
        },
      },
      Task: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Complete backend API' },
          description: { type: 'string', example: 'Write endpoints and controllers' },
          status: { type: 'string', enum: ['todo', 'inprogress', 'completed', 'archived'], example: 'todo' },
          // add other fields your task has
        },
      },
      TaskStageUpdate: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'inprogress' },
        },
      },
      TaskActivity: {
        type: 'object',
        properties: {
          activity: { type: 'string', example: 'Changed status to completed' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // User routes
    '/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Email already in use' },
          500: { description: 'Server error' },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['Users'],
        summary: 'User login',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          400: { description: 'Invalid credentials' },
          500: { description: 'Server error' },
        },
      },
    },
    '/users/logout': {
      post: {
        tags: ['Users'],
        summary: 'Logout current user',
        responses: {
          200: { description: 'Logout successful' },
        },
      },
    },
    '/users/get-team': {
      get: {
        tags: ['Users'],
        summary: 'Get team list (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Team list returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/notifications': {
      get: {
        tags: ['Users'],
        summary: 'Get notifications list',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Notification list returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/get-status': {
      get: {
        tags: ['Users'],
        summary: 'Get user task status (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User task status returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/profile': {
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserProfileUpdate' } },
          },
        },
        responses: {
          200: { description: 'User profile updated' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/read-noti': {
      put: {
        tags: ['Users'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Notification marked as read' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/change-password': {
      put: {
        tags: ['Users'],
        summary: 'Change user password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChangePassword' } },
          },
        },
        responses: {
          200: { description: 'Password changed successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Activate user profile (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'User profile activated' },
          401: { description: 'Unauthorized' },
          404: { description: 'User not found' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user profile (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'User profile deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'User not found' },
        },
      },
    },

    // Task routes
    '/tasks/create': {
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Task' } },
          },
        },
        responses: {
          201: { description: 'Task created successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/tasks/duplicate/{id}': {
      post: {
        tags: ['Tasks'],
        summary: 'Duplicate task by ID (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Task duplicated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/tasks/activity/{id}': {
      post: {
        tags: ['Tasks'],
        summary: 'Post task activity',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TaskActivity' } },
          },
        },
        responses: {
          200: { description: 'Activity posted' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/tasks/dashboard': {
      get: {
        tags: ['Tasks'],
        summary: 'Get dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard statistics returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'Get all tasks',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of tasks' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get task by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Task found' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Trash a task (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Task trashed/restored' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/tasks/create-subtask/{id}': {
      put: {
        tags: ['Tasks'],
        summary: 'Create subtask (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Subtask example' },
                  // add other subtask properties here
                },
                required: ['title'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Subtask created' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/tasks/update/{id}': {
      put: {
        tags: ['Tasks'],
        summary: 'Update task (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Task' } },
          },
        },
        responses: {
          200: { description: 'Task updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/tasks/change-stage/{id}': {
      put: {
        tags: ['Tasks'],
        summary: 'Change task stage',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TaskStageUpdate' } },
          },
        },
        responses: {
          200: { description: 'Task stage updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/tasks/change-status/{taskId}/{subTaskId}': {
      put: {
        tags: ['Tasks'],
        summary: 'Change subtask status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'subTaskId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SubTaskStageUpdate' } },
          },
        },
        responses: {
          200: { description: 'Subtask status updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task or Subtask not found' },
        },
      },
    },
    '/tasks/delete-restore/{id}': {
      delete: {
        tags: ['Tasks'],
        summary: 'Delete or restore a task (admin only). ID is optional.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: false,
            schema: { type: 'string' },
            description: 'Task ID (optional)',
          },
        ],
        responses: {
          200: { description: 'Task deleted or restored' },
          401: { description: 'Unauthorized' },
          404: { description: 'Task not found' },
        },
      },
    },
  },
  tags: [
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Tasks', description: 'Task management endpoints' },
  ],
};

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

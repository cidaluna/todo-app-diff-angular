import { Task } from '../../core/models/task.model';

export const TASK_MOCK: { type: string; data: Task[] }[] = [
  {
    type: 'mockBefore',
    data: [
      {
        id: '101',
        title: 'Estudar Angular',
        description: 'Revisar conceitos básicos e avançados do Angular',
        channels: ['API', 'WEB'],
        subtasks: [
          {
            subtitle: 'Revisar Componentes',
            done: false,
            transaction: [
              {
                label: 'Criar Componente',
                location: ['src/app/components', 'src/app/shared'],
              },
              {
                label: 'Refatorar Componente',
                // removido location,
              },
            ],
          },
          {
            subtitle: 'Revisar Services',
            done: false,
            transaction: [],
          },
        ],
        status: 'PENDENTE',
        pendingChange: null,
      },
    ],
  },
  {
    type: 'mockAfter',
    data: [
      {
        id: '101',
        title: 'Estudar Angular',
        description: 'Revisar tópicos avançados do Angular, incluindo RxJS e NgRx',
        channels: ['API'],
        subtasks: [
          {
            subtitle: 'Revisar Componentes',
            done: false,
            // Removido o campo "transaction"
          },
          {
            subtitle: 'Revisar Services',
            // Removido o campo "done"
            // Removido o campo "transaction"
          },
        ],
        status: 'PENDENTE',
        pendingChange: null,
      },
    ],
  },
];

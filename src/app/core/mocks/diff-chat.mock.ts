export const diffMock = {
  diffBefore: {
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
    verify: {
      name: 'Verificação',
      info: 'Informação de verificação',
    }
  },
  diffAfter: {
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
    test: {
      name: 'Teste',
      detail: 'Detalhe do teste',
    }
  }
}

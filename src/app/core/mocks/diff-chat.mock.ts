export const diffMock = {
  diffBefore: {
    id: '101',
    title: 'Estudar Angular',
    description: 'Revisar conceitos básicos e avançados do Angular',
    channels: ['API', 'WEB'],
    transfer: 'valor ok',
    subtasks: [
      {
        subtitle: 'Revisar Componentes',
        done: false,
        zero: 'novo campo',
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
        zero: 'novo campo',
      },
    ],
    status: 'PENDENTE',
    pendingChange: '',
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
        zero: 'novo campo',
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
    verify: {
      name: 'Verificação',
    },
    pendingChange: null,
    test: {
      name: 'Teste',
      detail: 'Detalhe do teste',
      idFamily: 'TF38',
    }
  }
}

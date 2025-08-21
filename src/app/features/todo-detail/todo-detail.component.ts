import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITodo } from '../../core/models/todo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.scss'
})
export class TodoDetailComponent {
  @Input() selectedTodo: ITodo | null = null; // propriedade de entrada do todo selecionado
  @Output() fechar = new EventEmitter<void>(); // evento para fechar o modal

  fecharModal() {
    this.fechar.emit();
  }
}

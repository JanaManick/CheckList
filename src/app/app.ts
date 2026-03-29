import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('checklist');
  newTaskName = signal('');

  constructor(public taskService: TaskService) {}

  addTask(): void {
    if (this.newTaskName().trim()) {
      this.taskService.addTask(this.newTaskName());
      this.newTaskName.set('');
    }
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  toggleTask(id: string): void {
    this.taskService.toggleTaskCompletion(id);
  }

  getCompletedCount(): number {
    return this.taskService.tasks().filter(t => t.completed).length;
  }

  getTotalCount(): number {
    return this.taskService.tasks().length;
  }
}

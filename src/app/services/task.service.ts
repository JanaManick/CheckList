import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks = signal<Task[]>([]);
  private readonly STORAGE_KEY = 'checklist_tasks';
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadTasks();
  }

  addTask(name: string): void {
    if (!name.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      name: name.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    this.tasks.update(prevTasks => [...prevTasks, newTask]);
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasks.update(prevTasks => prevTasks.filter(task => task.id !== id));
    this.saveTasks();
  }

  toggleTaskCompletion(id: string): void {
    this.tasks.update(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    this.saveTasks();
  }

  private saveTasks(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const tasksJson = JSON.stringify(this.tasks());
    localStorage.setItem(this.STORAGE_KEY, tasksJson);
  }

  private loadTasks(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedTasks = JSON.parse(stored) as Task[];
        this.tasks.set(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }

  clearAllTasks(): void {
    this.tasks.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { Button } from '@exhaustive-ui/core/button';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Select } from '@exhaustive-ui/core/select';
import { TableModule } from '@exhaustive-ui/core/table';
import { Tag } from '@exhaustive-ui/core/tag';
import { Toast } from '@exhaustive-ui/core/toast';

type Status = 'To do' | 'In progress' | 'Done';

const SEVERITIES = { 'To do': 'secondary', 'In progress': 'info', Done: 'success' } as const;

interface Task {
  id: number;
  title: string;
  status: Status;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, Button, InputText, Select, TableModule, Tag, Toast],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly messages = inject(MessageService);

  protected readonly statuses: Status[] = ['To do', 'In progress', 'Done'];
  protected readonly title = signal('');
  protected readonly status = signal<Status | null>(null);
  protected readonly tasks = signal<Task[]>([
    { id: 1, title: 'Read AGENTS.md', status: 'Done' },
    { id: 2, title: 'Pick a theme preset', status: 'In progress' },
    { id: 3, title: 'Build the first page', status: 'To do' },
  ]);
  protected readonly visibleTasks = computed(() => {
    const status = this.status();
    return status ? this.tasks().filter((task) => task.status === status) : this.tasks();
  });

  protected severity(status: Status) {
    return SEVERITIES[status];
  }

  protected add() {
    const title = this.title().trim();
    if (!title) return;
    this.tasks.update((tasks) => [...tasks, { id: tasks.length + 1, title, status: 'To do' }]);
    this.title.set('');
    this.messages.add({ severity: 'success', summary: 'Task added', detail: title });
  }
}

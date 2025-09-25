import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dataset-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dataset-config-modal.component.html',
  styleUrl: './dataset-config-modal.component.scss'
})
export class DatasetConfigModalComponent {
  @Input() reportId!: string;
  @Input() datasetId!: string;
  @Output() saved = new EventEmitter<{ reportId: string; datasetId: string }>();
  @Output() close = new EventEmitter<void>();

  // Simule campos de configuração
  configField: string = '';

  onSave() {
    // aqui você poderia mandar salvar no backend
    this.saved.emit({ reportId: this.reportId, datasetId: this.datasetId });
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}

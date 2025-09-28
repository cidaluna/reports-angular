import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalstorageService } from '../../core/services/localstorage.service';

@Component({
  selector: 'app-dataset-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dataset-config-modal.component.html',
  styleUrl: './dataset-config-modal.component.scss',
})
export class DatasetConfigModalComponent {
  @Input() reportId!: string;
  @Input() datasetId!: string;
  @Output() saved = new EventEmitter<{ reportId: string; datasetId: string }>();
  @Output() close = new EventEmitter<void>();

  reportName: string = '';
  datasetName: string = '';

  // Simule campos de configuração
  configField: string = '';

  constructor(private readonly localstorageService: LocalstorageService) {}

  // ngOnInit() {
  //   // Supondo que você tenha um método para buscar os dados dos relatórios
  //   const reports = this.localstorageService.getListArgsEdit();
  //   const report = reports.find((r) => r.id === this.reportId);
  //   if (report) {
  //     this.reportName = report.name;
  //     const dataset = report.datasets.find((d: any) => d.id === this.datasetId);
  //     if (dataset) {
  //       this.datasetName = dataset.name;
  //     }
  //   }
  // }

  ngOnInit() {
    // Tenta achar primeiro na lista de editados
    let reports = this.localstorageService.getListArgsEdit();
    let report = reports.find((r) => r.id === this.reportId);

    // Se não encontrar, busca nos não editados
    if (!report) {
      reports = this.localstorageService.getListArgsNotEdit();
      report = reports.find((r) => r.id === this.reportId);
    }

    if (report) {
      this.reportName = report.name;
      const dataset = report.datasets.find((d: any) => d.id === this.datasetId);
      if (dataset) {
        this.datasetName = dataset.name;
        if (dataset.config) {
          this.configField = dataset.config; // se já tiver config, carrega
        }
      }
    }
  }

  // onSave() {
  //   // Busca lista atual
  //   const reports = this.localstorageService.getListArgsEdit();
  //   const report = reports.find((r) => r.id === this.reportId);

  //   let reportName = '';
  //   let datasetName = '';

  //   if (report) {
  //     reportName = report.name;
  //     const dataset = report.datasets.find((d: any) => d.id === this.datasetId);
  //     if (dataset) {
  //       datasetName = dataset.name;
  //     }
  //   }

  //   const updatedReport = {
  //     id: this.reportId,
  //     name: reportName,
  //     datasets: [
  //       {
  //         id: this.datasetId,
  //         name: datasetName,
  //         config: this.configField,
  //       },
  //     ],
  //   };

  //   this.localstorageService.saveReportToListArgsEdit(updatedReport);

  //   // aqui você poderia mandar salvar no backend
  //   this.saved.emit({ reportId: this.reportId, datasetId: this.datasetId });
  //   this.close.emit();
  // }

  onSave() {
    // Primeiro tenta achar no editados
    let reports = this.localstorageService.getListArgsEdit();
    let report = reports.find((r) => r.id === this.reportId);

    // Se não achar, pega nos não editados
    if (!report) {
      reports = this.localstorageService.getListArgsNotEdit();
      report = reports.find((r) => r.id === this.reportId);
    }

    if (!report) return;

    // Atualiza apenas o dataset configurado
    const updatedReport = {
      ...report,
      datasets: report.datasets.map((ds: any) =>
        ds.id === this.datasetId ? { ...ds, config: this.configField } : ds
      ),
    };

    // Salva no listArgsEdit
    this.localstorageService.saveReportToListArgsEdit(updatedReport);

    // Remove do listArgsNotEdit
    this.localstorageService.removeReportFromListArgsNotEdit(this.reportId);

    // Dispara eventos
    this.saved.emit({ reportId: this.reportId, datasetId: this.datasetId });
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class DatasetConfigModalComponent implements OnInit {
  @Input() reportId!: string;
  @Input() datasetId!: string;
  @Output() saved = new EventEmitter<{ reportId: string; datasetId: string }>();
  @Output() close = new EventEmitter<void>();

  reportName: string = '';
  datasetName: string = '';

  // Simule campos de configuração
  configField: string = '';

  constructor(private readonly localstorageService: LocalstorageService) {}

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
          this.configField = dataset.config.field ?? ''; // se já tiver config, carrega
        }
      }
    }
  }

  onSave() {
    // Salva/atualiza dataset editado em listArgsEdit
    let editList = JSON.parse(localStorage.getItem('listArgsEdit') || '[]');
    let reportEdit = editList.find((r: any) => r.id === this.reportId);

    // Se não achar, cria novo
    if (!reportEdit) {
      // Garante que o nome do relatório está preenchido
      let reportName = this.reportName;
      if (!reportName) {
        // Tenta buscar na lista de editados
        let reports = JSON.parse(localStorage.getItem('listArgsEdit') || '[]');
        let report = reports.find((r: any) => r.id === this.reportId);
        if (!report) {
          // Tenta buscar na lista de não editados
          reports = JSON.parse(localStorage.getItem('listArgsNotEdit') || '[]');
          report = reports.find((r: any) => r.id === this.reportId);
        }
        if (report) {
          reportName = report.name;
        }
      }

      reportEdit = {
        id: this.reportId,
        name: reportName,
        datasets: [],
      };
      editList.push(reportEdit);
    } else if (!reportEdit.name) {
      // Se já existe mas o nome está vazio, tenta preencher
      let reportName = this.reportName;
      if (!reportName) {
        let reports = JSON.parse(localStorage.getItem('listArgsEdit') || '[]');
        let report = reports.find((r: any) => r.id === this.reportId);
        if (!report) {
          reports = JSON.parse(localStorage.getItem('listArgsNotEdit') || '[]');
          report = reports.find((r: any) => r.id === this.reportId);
        }
        if (report) {
          reportName = report.name;
        }
      }
      reportEdit.name = reportName;
    }

    // Atualiza ou adiciona dataset configurado
    const dsIdx = reportEdit.datasets.findIndex(
      (d: any) => d.id === this.datasetId
    );
    const updatedDataset = {
      id: this.datasetId,
      name: this.datasetName,
      config: { field: this.configField }, // exemplo de config
    };

    if (dsIdx > -1) {
      reportEdit.datasets[dsIdx] = updatedDataset;
    } else {
      reportEdit.datasets.push(updatedDataset);
    }
    // Salva no listArgsEdit
    localStorage.setItem('listArgsEdit', JSON.stringify(editList));

    // Remove dataset editado da lista de não editados
    let notEditList = JSON.parse(
      localStorage.getItem('listArgsNotEdit') || '[]'
    );
    const reportNotEdit = notEditList.find((r: any) => r.id === this.reportId);

    if (reportNotEdit) {
      reportNotEdit.datasets = reportNotEdit.datasets.filter(
        (d: any) => d.id !== this.datasetId
      );
      // Se não sobrar nenhum dataset não editado, pode remover o relatório inteiro da lista
      if (reportNotEdit.datasets.length === 0) {
        notEditList = notEditList.filter((r: any) => r.id !== this.reportId);
      }
      localStorage.setItem('listArgsNotEdit', JSON.stringify(notEditList));
    }

    console.log(
      `Alterado dataset de nome ${this.datasetName} no relatório de nome ${this.reportName}`
    );

    // Dispara eventos
    alert('Configuração do dataset salva com sucesso!');
    this.saved.emit({ reportId: this.reportId, datasetId: this.datasetId });
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}

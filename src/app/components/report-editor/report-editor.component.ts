import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { DatasetConfigModalComponent } from '../dataset-config-modal/dataset-config-modal.component';
import { Report, ReportState} from '../../shared/models/report.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, DatasetConfigModalComponent],
  templateUrl: './report-editor.component.html',
  styleUrl: './report-editor.component.scss',
})
export class ReportEditorComponent implements OnInit {
  reports: Report[] = [];
  reportStates: ReportState[] = [];

  modalVisible = false;
  modalReportId: string | null = null;
  modalDatasetId: string | null = null;

  // para controlar qual relatório está “ativo” (tab ou card)
  activeReportId: string | null = null;

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getReports().subscribe((reps) => {
      this.reports = reps;
      this.initializeReportStates(reps);

      if (reps.length > 0) {
        this.activeReportId = reps[0].id;
      }
    });
  }

  initializeReportStates(reports: Report[]): void {
    this.reportStates = reports.map((rep) => ({
      reportId: rep.id,
      billingTypeSelected: '',
      transactionCode: '',
    }));
  }

  getReportState(reportId: string): any {
    return this.reportStates.find(rs => rs.reportId === reportId);
  }

  // dropdown tipo de faturamento
  onBillingTypeSelected(reportId: string, value: any) {
    const rs = this.getReportState(reportId);
    if (rs) rs.billingTypeSelected = value;
  }


  onTransactionCodeChanged(reportId: string, code: string) {
    const rs = this.getReportState(reportId);
    if (rs) rs.transactionCode = code;
  }


  isReportReady(reportId: string): boolean {
    const rs = this.getReportState(reportId);
    if (!rs) return false;
    return !!rs.billingTypeSelected && !!rs.transactionCode;
  }

  areAllReportsReady(): boolean {
    return this.reportStates.every((rs) => this.isReportReady(rs.reportId));
  }

  onAssociate(reportId: string) {
    const rs = this.getReportState(reportId);
    if (!rs) return;

    // monte o payload do que for necessário
    const payload = {
      billingTypeSelected: rs.billingTypeSelected,
      transactionCode: rs.transactionCode,
    };

    this.reportService.associateReport(reportId, payload).subscribe((res) => {
      console.log('Associado com sucesso', res);
      // talvez mostrar mensagem, bloquear edição, etc.
    });
  }

  // trocar aba / relatório ativo
  setActiveReport(reportId: string) {
    this.activeReportId = reportId;
  }


  onDatasetSaved(reports: string, datasetId: string) {
    console.log('Datasets salvos:', datasetId, ' para relatório ', reports);
    if (!this.reports) return;
    if (!this.modalReportId) return;
    const rs = this.getReportState(this.modalReportId);
    if (rs) rs.datasets = datasetId ? [datasetId] : [];
    this.modalVisible = false;
    this.modalReportId = null;
    this.modalDatasetId = null; // resetar após fechar o modal
  }


  openDatasetModal(reportId: string, datasetId: string) {
    console.log('Abrindo modal para dataset', datasetId, ' do relatório', reportId);
    this.modalReportId = reportId;
    this.modalDatasetId = datasetId;
    this.modalVisible = true;

    // também marcar status como “OPENED” para mostrar que usuário abriu
    const rs = this.getReportState(reportId);

  }

  onCancel(reportId: string) {
    console.log('Clicou no cancelar para relatório', reportId);
    const rs = this.getReportState(reportId);
    if (!rs) return;
    rs.billingTypeSelected = '';
    rs.transactionCode = '';
  }
}

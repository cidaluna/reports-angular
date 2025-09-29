import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { DatasetConfigModalComponent } from '../dataset-config-modal/dataset-config-modal.component';
import { Report, ReportState } from '../../shared/models/report.model';
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
    return this.reportStates.find((rs) => rs.reportId === reportId);
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

  // qdo os 2 campos estiverem preenchidos, habilita botão Associar
  isReportReady(reportId: string): boolean {
    const rs = this.getReportState(reportId);
    if (!rs) return false;
    return !!rs.billingTypeSelected && !!rs.transactionCode;
  }

  areAllReportsReady(): boolean {
    return this.reportStates.every((rs) => this.isReportReady(rs.reportId));
  }

  onAssociate(reportId: string) {
    // relatorio completo no listArgsNotEdit
    console.log('Clicou em associar relatório', reportId);
    const rs = this.getReportState(reportId);
    if (!rs) return;

    // Busca o relatório completo
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return;

    // Monta o objeto conforme a interface Report
    const reportToSave = {
      id: report.id,
      name: report.name,
      datasets: report.datasets.map((ds) => ({
        id: ds.id,
        name: ds.name,
        //config: {}, // sem edição
      })),
    };

    // Salva ou atualiza no localStorage
    let list = JSON.parse(localStorage.getItem('listArgsNotEdit') || '[]');
    const idx = list.findIndex((r: any) => r.id === reportToSave.id);

    if (idx > -1) {
      list[idx] = reportToSave;
    } else {
      list.push(reportToSave);
    }
    localStorage.setItem('listArgsNotEdit', JSON.stringify(list));

    // Aqui pode chamar o serviço ou mostrar mensagem de sucesso
    alert('Relatório associado com sucesso!');
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

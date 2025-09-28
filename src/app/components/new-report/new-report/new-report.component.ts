import { Component } from '@angular/core';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-report.component.html',
  styleUrl: './new-report.component.scss'
})
export class NewReportComponent {
relatorio = {
    id: 'r1',
    name: 'Relatório A',
    datasets: [
      { id: 'd1', name: 'Dataset 1' },
      { id: 'd2', name: 'Dataset 2' }
    ]
  };

  // cópia temporária para edição
  relatorioTemp: any;

  constructor(private readonly localStorage: LocalstorageService) {}

  editar() {
    // criar um clone para edição temporária
    this.relatorioTemp = JSON.parse(JSON.stringify(this.relatorio));
  }

  confirmarEdicao() {
    // salva no localStorage a estrutura já editada
    this.localStorage.saveOrUpdate(this.relatorioTemp);

    // substitui o original pelo editado
    this.relatorio = this.relatorioTemp;
    this.relatorioTemp = null;
  }

  cancelarEdicao() {
    // simplesmente descarta a cópia
    this.relatorioTemp = null;
  }
}

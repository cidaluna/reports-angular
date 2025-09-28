import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private readonly keyEdit = 'listArgsEdit';
  private readonly keyNotEdit = 'listArgsNotEdit';

  getListArgsEdit(): any[] {
    console.log('Edit - Chamou o método getListArgsEdit');
    const data = localStorage.getItem(this.keyEdit);
    return data ? JSON.parse(data) : [];
  }

  getListArgsNotEdit(): any[] {
    console.log('Not edit - Chamou o método getListArgsNotEdit');
    const data = localStorage.getItem(this.keyNotEdit);
    return data ? JSON.parse(data) : [];
  }

  saveReportToListArgsEdit(report: any): void {
    const list = this.getListArgsEdit();
    const index = list.findIndex((r: any) => r.id === report.id);
    if (index > -1) {
      list[index] = report;
    } else {
      list.push(report);
    }
    localStorage.setItem(this.keyEdit, JSON.stringify(list));
  }

  removeReportFromListArgsNotEdit(reportId: string): void {
    const list = this.getListArgsNotEdit().filter(
      (r: any) => r.id !== reportId
    );
    localStorage.setItem(this.keyNotEdit, JSON.stringify(list));
  }

  // saveOrUpdate(key: string, item: any): void {
  //   const list = this.getList(key);
  //   // procura se já existe id e name do relatorio
  //   const index = list.findIndex(
  //     (x: any) => x.id === item.id && x.name === item.name
  //   );

  //   if (index > -1) {
  //     // já existe → atualizar
  //     list[index] = item;
  //   } else {
  //     // não existe → adicionar
  //     list.push(item);
  //   }

  //   localStorage.setItem(key, JSON.stringify(list));
  // }

  // clear(key: string): void {
  //   localStorage.removeItem(key);
  // }

  // novo
  // saveReportToListArgsEdit(report: {
  //   id: string;
  //   name: string;
  //   datasets: any[];
  // }) {
  //   const key = 'listArgsEdit';
  //   let list: any[] = JSON.parse(localStorage.getItem(key) || '[]');

  //   // Procura pelo relatório com mesmo id e name
  //   const idx = list.findIndex(
  //     (r) => r.id === report.id && r.name === report.name
  //   );

  //   if (idx > -1) {
  //     // Atualiza o relatório existente
  //     list[idx] = report;
  //   } else {
  //     // Adiciona novo relatório
  //     list.push(report);
  //   }

  //   localStorage.setItem(key, JSON.stringify(list));
  // }

  // getListArgsEdit(): any[] {
  //   return JSON.parse(localStorage.getItem('listArgsEdit') || '[]');
  // }
}

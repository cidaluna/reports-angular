import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../../shared/models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly baseUrl = 'http://localhost:3000';  // o json-server vai rodar na porta 3000

  constructor(private readonly http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reports`);
  }

  // Simula o salvamento das escolhas do usuário para um relatório
  associateReport(reportId: string, payload: any): Observable<any> {
    // poderia fazer PUT ou POST num endpoint
    return this.http.post(`${this.baseUrl}/associations/${reportId}`, payload);
  }
}

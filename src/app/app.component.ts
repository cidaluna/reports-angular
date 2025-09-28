import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReportEditorComponent } from './components/report-editor/report-editor.component';
import { NewReportComponent } from "./components/new-report/new-report/new-report.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReportEditorComponent, NewReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reports-angular';
}

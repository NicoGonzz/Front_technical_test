import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-c',
  templateUrl: './dashboard-c.component.html',
  styleUrls: ['./dashboard-c.component.scss']
})
export class DashboardCComponent {
  fileChoosen: File | null = null;
  parsedData: any[] = [];

  choosenFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileChoosen = inputElement.files[0];
    }
  }

  clearFile() {
    this.fileChoosen = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


}

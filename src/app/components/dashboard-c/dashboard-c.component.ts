import { Component } from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-dashboard-c',
  templateUrl: './dashboard-c.component.html',
  styleUrls: ['./dashboard-c.component.scss']
})
export class DashboardCComponent {
  fileChoosen: File | null = null;
  parsedData: any[] = [];
  ExcelData:any[] = []; //Guardamos los datos del excel



  choosenFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileChoosen = inputElement.files[0];
      this.ReadExcel(event);
    }
  }

ReadExcel(event:any){
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsBinaryString(file);

        fileReader.onload = (e) =>{
          var workBook = XLSX.read(fileReader.result,{type:'binary'});
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
          console.log(this.ExcelData)
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

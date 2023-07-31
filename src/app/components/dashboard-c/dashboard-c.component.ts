import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface CityState { //Interfaz para encontrar estado con mayor acumulado y menor acumulado
  city: string;
  state: string;
}

@Component({
  selector: 'app-dashboard-c',
  templateUrl: './dashboard-c.component.html',
  styleUrls: ['./dashboard-c.component.scss']
})
export class DashboardCComponent {
  fileChoosen: File | null = null;
  parsedData: any[] = [];
  ExcelData:any[] = []; //Guardamos los datos del excel

  leastRepeatedData: CityState | undefined;
  mostRepeatedData: CityState | undefined;

  chartData: any[] = [];

// Se leen los datos del archivo seleccionado
  choosenFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileChoosen = inputElement.files[0];
      this.ReadExcel(event);
    }
  }
//Guarda datos del archivo seleccionado
ReadExcel(event:any){
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsBinaryString(file); //Convertimos todos los datos del .csv a binarios

        fileReader.onload = (e) =>{
          var workBook = XLSX.read(fileReader.result,{type:'binary'});
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]); //Convertimmos los datos a JSON
          console.log(this.ExcelData);
          this.findLeastRepeatedData();
          this.findMostRepeatedData();
          this.prepareChartData();
        }
   }
//Se elimina el archivo de ser necesario
  clearFile() {
    this.fileChoosen = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
//Funciones del estado que mas afectado esta y el que menos
  findLeastRepeatedData() {
    if (this.ExcelData.length > 0) {   //Confimamos que tenga datos
      const occurrencesMap: Map<string, number> = new Map(); //Se almaacenan las combinaciones estado-ciudad

      this.ExcelData.forEach((row) => { //lee cada fila
        const key = `${row['Province_State']}-${row['Admin']}`; //cada nombre se vuelve unico
        occurrencesMap.set(key, (occurrencesMap.get(key) || 0) + 1);
      });

      let minOccurrences = Number.MAX_VALUE; //Empezamos por el estado que mas se repita y vamos comparando con los anteriores
      let leastRepeatedKey = '';

      occurrencesMap.forEach((count, key) => {
        if (count < minOccurrences) {  //se comparan valores para ver si es mayor o menor
          minOccurrences = count; //Si es mayor se actualiza
          leastRepeatedKey = key;
        }
      });

      if (leastRepeatedKey) {
        const [state, city] = leastRepeatedKey.split('-');//Se separa cada dato
        this.leastRepeatedData = { state, city }; //Se asigna el nuevo valor

      }
    }
  }


  findMostRepeatedData() {
    if (this.ExcelData.length > 0) {
      const occurrencesMap: Map<string, number> = new Map();

      this.ExcelData.forEach((row) => {
        const key = `${row['Province_State']}-${row['Admin2']}`;
        occurrencesMap.set(key, (occurrencesMap.get(key) || 0) + 1);
      });

      let maxOccurrences = Number.MIN_VALUE;
      let mostRepeatedKey = '';

      occurrencesMap.forEach((count, key) => {
        if (count > maxOccurrences) {
          maxOccurrences = count;
          mostRepeatedKey = key;
        }
      });

      if (mostRepeatedKey) {
        const [state, city] = mostRepeatedKey.split('-');
        this.mostRepeatedData = { state, city };
      }
    }
  }
  //Grafica

  prepareChartData() {
    if (this.ExcelData.length > 0) {
      const totalDeathsSum = this.ExcelData.reduce(
        (sum, row) => sum + row['TotalDeaths'],
        0
      );

      this.chartData = this.ExcelData.map((row) => {
        const state = row['Province_State'];
        const city = row['Admin2'];
        const deaths = row['TotalDeaths'];
        const population = row['Population'];

        const percentage = (deaths / population) * 100;

        return {
          name: `${state} - ${city}`,
          value: percentage,
        };
      });
    }
  }

}

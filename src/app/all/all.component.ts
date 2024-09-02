import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CtlapiService } from '../ctlapi.service';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all.component.html',
  styleUrl: '../../styles.css'
})
export class AllComponent {
  apiservice = inject(CtlapiService);

  totalcount : number = 0;
  countarr = <any>[];
  jsonItems = [];
  rows : any[][] = [];
  currentpage : number = 0;
  showPreview: boolean = false;
  previewIMG: string = "";
  constructor() {
    
  }
  ngOnInit() {
    this.getcount();
    setInterval(() => this.getcount(), 90000);
  }

  getcount(){
    this.apiservice.getcount().subscribe({
      next: (totalresult:any) => {
        if(totalresult[0].total > this.totalcount){
          this.totalcount = totalresult[0].total; 
          this.countarr = Array(Math.ceil(totalresult[0].total/105));
          this.getGenerations();
        }
      },
      error: (err) => {console.log(err);}
    });
  }

  changePage( newpage : number){
    console.log(newpage);
    this.currentpage = newpage;
    this.getGenerations();
  }

  getGenerations(){
    let index = this.totalcount - this.currentpage*105;
    console.log(index);
    this.apiservice.getGenerations(index).subscribe({
      next: (data:any) => {
        this.jsonItems = data;
        this.getRows();
      },
      error: (err) => {console.log(err);}
    });
  }

  getRows(){
    let itemsPerRow;
    switch (true) {
      case window.innerWidth > 2000:
        itemsPerRow = 7;
        break;
      case window.innerWidth > 1000:
        itemsPerRow = 5;
        break;
      case window.innerWidth > 0:
        itemsPerRow = 3;
        break;
      default:
        itemsPerRow = 7;
    }
    this.rows =  [];
    for (let i = 0; i < this.jsonItems.length; i += itemsPerRow) {
      this.rows.push(this.jsonItems.slice(i, i + itemsPerRow));
    }
  }

  openImg(imgID : string){
    this.apiservice.getFullGeneration(imgID).subscribe({
      next: (data:any) => {
        //window.open(this.base64toURL(data.img), '_blank');
        this.previewIMG = "data:image/jpeg;base64," + data.img;
        this.showPreview = true;
      },
      error: (err) => {console.log(err);}
    });
  }
  disablePreview(){
    this.previewIMG = "";
    this.showPreview = false;
  }
  base64toURL(b64:string): string{
    const mimeType = 'image/jpeg'; // Adjust the MIME type according to your image format
        const byteCharacters = atob(b64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new Blob([byteArray], { type: mimeType + ';base64' });
        return URL.createObjectURL(file);
  }
  searchByID(id: string) {
    this.apiservice.searchFilter(id).subscribe({
      next: (data:any) => {
        this.jsonItems = data;
        this.getRows();
      },
      error: (err) => {console.log(err);}
    });
  }
}

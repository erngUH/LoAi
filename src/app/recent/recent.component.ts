import { Component, inject, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SdapiService } from '../sdapi.service';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent.component.html',
  styleUrl: '../../styles.css'
})
export class RecentComponent {
  apiservice = inject(SdapiService);
  @Input() recentEvent!: EventEmitter<void> ;

  recentImgs = <any>[];
  innerWidth : number = 0;
  ngOnInit() {
    this.getRecent();
    this.recentEvent.subscribe(() => {
      this.getRecent();
    });
    setInterval(() => this.getRecent(), 300000); 
  }

  getRecent(){
    this.apiservice.getRecentGens().subscribe({
      next: (result:any) => {
        this.recentImgs = result;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  openImg(img : string){
    const byteCharacters = atob(img);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: 'image/jpeg;base64' });
    window.open(URL.createObjectURL(file), '_blank');
  }
}

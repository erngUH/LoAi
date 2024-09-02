import { Component, inject, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SdapiService } from '../sdapi.service';
import { RecentComponent } from '../recent/recent.component';
import { TipComponent } from '../tip/tip.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RecentComponent, TipComponent],
  templateUrl: './main.component.html',
  styleUrl: '../../styles.css'
})
export class MainComponent {
  apiservice = inject(SdapiService);
  @Output() notifyRecent = new EventEmitter<void>();
  
  verified = true;        //set to true for dev 
  inMaintenance = false;
  sStatus : string = "Checking";
  loadpercent : number = 0;
  uuip = "0";

  msg = ""; // Error message
  url : string = "";
  urlOut : string = "";
  denoise: number = 3;
  enableExtra : boolean = true;
  extraPrompts : string = "";
  facePromts : string = "";
  isWaiting : boolean = false;
  constructor() {
    document.addEventListener('paste', this.handlePaste.bind(this));
  }
  ngOnInit() {
    this.verify();
    this.getServerStatus();
    setInterval(() => this.getServerStatus(), 3000); 
  }
  updateStrength(event: any) {
    this.denoise = event.target.value;
    console.log(this.denoise)
  }
  verify(){
    this.apiservice.verifyConnection().subscribe({
      next: (result:any) => {
        if(result.id){
          console.log(result.id);
          this.apiservice.saveCookie(result.id);
          this.apiservice.setHeader(result.id);
        }
        this.verified = true; 
        this.getServerStatus();
      },
      error: (e) => {
        this.verified = false; 
        this.sStatus = "UNAVAILABLE";
        document.title = "LoAi - SEVER UNAVAILABLE";
        this.inMaintenance = true;
        console.error(e);
      }
    });
  }
  getServerStatus(){
    if(this.verified){
      this.apiservice.getServerStatus().subscribe({
        next: (status:any) => {
          this.sStatus =  "Online - Queue: "+status.state.job_count+" - Estimate: "+String(status.eta_relative).split(".")[0]+" sec";
          if(status.progress != 0){
            let pernum = Number(parseFloat(status.progress).toFixed(2))*100;
            let prog = "Progress: "+ pernum +"%"
            document.title = "LoAi - " + prog; 
            this.loadpercent = Number(pernum);
          }
          else if (status.state.job_count == 0) document.title = "LoAi";
          this.inMaintenance = false;
        },
        error: (err) => {
          this.sStatus = "UNAVAILABLE";
          document.title = "LoAi - SEVER UNAVAILABLE";
          console.log(err);
          this.inMaintenance = true;
        }
      });
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
        this.msg = 'You must select an image';
        return;
    }
    const mimeType = event.target.files[0].type;
    if (!mimeType.match(/image\/*/)) {
        this.msg = "Only images are supported";
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
        this.msg = "";
        this.url = reader.result as string;
    };
  }
  handlePaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of Array.from(items)) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (_event) => {
              this.msg = "";
              this.url = reader.result as string;
            };
          }
        }
      }
    }
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.indexOf('image') !== -1) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
          this.msg = "";
          this.url = reader.result as string;
      };
    }
  }
  public onExtraChange(event: Event): void {
    const value = (event.target as any).value;
    this.extraPrompts = value;
  }
  public onFaceChange(event: Event): void {
    const value = (event.target as any).value;
    this.facePromts = value;
  }

  submitApplication( mode: number): void{
    if(this.url){
      this.msg = "";
      this.isWaiting = true;
      this.apiservice.calli2i(mode, this.url, this.extraPrompts, this.facePromts, this.denoise).subscribe({
        next: (outputImg : any) => this.urlOut = 'data:image/jpeg;base64,'+outputImg["apiData"],
        error: (e) => {
          if(e.status == 413) this.msg = "File size larger than limit of 5MB!";
          else this.msg = "Connection error! Your request is in queue and will appear in history section once done. Do not spam!";
          console.error(e.error);
          this.isWaiting = false;
          this.loadpercent = 0;
          document.title = "LoAi"
        },
        complete: () => {
          this.isWaiting = false;
          this.loadpercent = 0;
          document.title = "LoAi"
          this.notifyRecent.emit(); 
        }
      });
    }
    else{
      this.msg = "No image selected!"
    }
  }
  
  saveOutput(){
    if(this.urlOut){
      const link = document.createElement('a');
      link.href = this.urlOut;
      let date = new Date();
      let today = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      link.download = today+'-loai.jpeg'; // Set file name
      link.click();
    }
    else{
      this.msg = "No output image!";
    }
  }

  previewEnabled = false;
  showPreview() {
    if(this.urlOut){
      this.previewEnabled = true;
    }
  }
  zoomState : boolean = false;
  disablePreview() {
    this.previewEnabled = false;
    this.zoomState = false;
  }
  zoomImage(){
    this.zoomState = !this.zoomState;
  }
  errConfirm(){
    this.msg="";
  }
}

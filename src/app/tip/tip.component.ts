import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tip.component.html',
  styleUrl: '../../styles.css'
})
export class TipComponent {
  startIndex = 0;
  Imagedata = [
    "../../assets/images/slides/0.jpg",
    "../../assets/images/slides/1.jpg",
    "../../assets/images/slides/2.jpg",
    "../../assets/images/slides/3.jpg"
  ];
  Imagedata2 = [
    "../../assets/images/slides2/0.jpg",
    "../../assets/images/slides2/1.jpg",
    "../../assets/images/slides2/2.jpg",
    "../../assets/images/slides2/3.jpg"
  ];
  ngOnInit(){
    this.startSlides();
    setInterval(() => this.startSlides(), 4000);  
  }

  startSlides() {
    const slides = Array.from(document.querySelectorAll('#slideshow1'));
    const slides2 = Array.from(document.querySelectorAll('#slideshow2'));
    if (slides.length == 0) {return;} //exit if not rendered
    for (const x of slides) {
      const y = x as HTMLElement;
      y.style.display = 'none';
    }
    for (const x of slides2) {
      const y = x as HTMLElement;
      y.style.display = 'none';
    }
    const slide = slides[this.startIndex] as HTMLElement;
    const slide2 = slides2[this.startIndex] as HTMLElement;
    slide.style.display = 'block';
    slide2.style.display = 'block';
    if (this.startIndex == slides.length-1) {
      this.startIndex = 0;
    }
    else {
      this.startIndex++;
    }
  }
}

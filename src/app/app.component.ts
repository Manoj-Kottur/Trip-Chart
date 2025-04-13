import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trip-map';

  trip1: string = '';
  trip2: string = '';

  tripArr: any[] = [];

  canvas: any;
  ctx: any;

  pointsCoordinates: any = [];

  constructor() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    // this.genHeightForCanvas();
  }

  submitTrip() {
    console.log(this.trip1);
    console.log(this.trip2);
    this.createPoint(this.trip1, this.trip2, this.tripArr.length)
    this.tripArr.push([this.trip1, this.trip2]);
    this.trip1 = '';
    this.trip2 = '';
    this.genHeightForCanvas();
    this.iterateNodesAndGenLines();
  }

  createPoint(trip1: string, trip2: string, idx: number) {
    const span = document.createElement('span');
    span.classList.add('wholeSpan');
    const dotDivContainer = document.createElement('div');
    dotDivContainer.classList.add('dotDivContainer');
    const dotSpan = document.createElement('span');
    dotSpan.classList.add('dotSpan');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('labelDiv');
    trip1 = trip1.slice(0, 3).toUpperCase();
    trip2 = trip2.slice(0, 3).toUpperCase();
    labelDiv.innerHTML = trip1 + '-' + trip2;
    dotDivContainer.appendChild(dotSpan);
    span.appendChild(dotDivContainer);
    span.appendChild(labelDiv);
    span.classList.add('marginRight');
    span.classList.add('node-'+idx);
    if (idx > 1 && trip1.toLowerCase() === this.tripArr[idx - 1][0].toLowerCase() && trip2.toLowerCase() === this.tripArr[idx - 1][1].toLowerCase()) {
      span.classList.add('moveToLittleTop');
      document.getElementsByClassName('wholeSpan')[idx - 1].classList.add('moveToLittleTop');

    }
    document.getElementsByClassName('chartDiv')[0].appendChild(span);
  }


  genHeightForCanvas() {
    const ht = document.getElementsByClassName('chartDiv')[0].clientHeight;
    const wdt = document.getElementsByClassName('chartDiv')[0].clientWidth;
    document.getElementById('myCanvas')!.setAttribute('height', ''+ht);
    document.getElementById('myCanvas')!.setAttribute('width', String(wdt));
    // this.drawLine();
  }

  iterateNodesAndGenLines() {
    this.pointsCoordinates = [];
    const arrowLength = 10;
    if (this.tripArr.length > 1) {
      for (let i = 0; i < this.tripArr.length; i++) {
        const div = document.getElementsByClassName('node-' + i)[0];
        let x1, y1;
        if (i>0) {
          for (let j = 0; j < 2; j++) {
            if (j === 0) {
              x1 = div.getBoundingClientRect().x;
              y1 = div.getBoundingClientRect().y + (div.clientHeight / 2);
            } else {
              x1 = div.getBoundingClientRect().x + div.clientWidth;
              y1 = div.getBoundingClientRect().y + (div.clientHeight / 2);
            }
            this.pointsCoordinates.push([x1, y1, j === 0 ? this.tripArr[i][0] : this.tripArr[i][1]]);
          }
        } else {
          x1 = div.getBoundingClientRect().x + div.clientWidth;
          y1 = div.getBoundingClientRect().y + (div.clientHeight / 2);
          this.pointsCoordinates.push([x1, y1, this.tripArr[i][1]]);
        }
      }
      this.pointsCoordinates.forEach((points: any, idx: number) => {
        if (idx === 0 || idx % 2 === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(points[0], points[1]);
        } else {
          const div = document.getElementsByClassName('node-' + idx)[0];
          this.ctx.lineTo(points[0], points[1]);
          this.ctx.strokeStyle = 'red';
          this.ctx.lineWidth = 2;
          this.ctx.stroke();

          if (idx > 0 && this.pointsCoordinates[idx-1][2] !== this.pointsCoordinates[idx][2]) {
            const arrowAngle = Math.PI / 6;
            const angle = Math.atan2(points[1] - this.pointsCoordinates[idx - 1][1], points[0] - this.pointsCoordinates[idx - 1][0]);
            this.ctx.beginPath();
            this.ctx.moveTo(points[0], points[1]);
            this.ctx.lineTo(
              points[0] - arrowLength * Math.cos(angle - arrowAngle),
              points[1] - arrowLength * Math.sin(angle - arrowAngle)
            );
            this.ctx.moveTo(points[0], points[1]);
            this.ctx.lineTo(
              points[0] - arrowLength * Math.cos(angle + arrowAngle),
              points[1] - arrowLength * Math.sin(angle + arrowAngle)
            );
            this.ctx.stroke();
          }

        }
      });


    }
  }
}

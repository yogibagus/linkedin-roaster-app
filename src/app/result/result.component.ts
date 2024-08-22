import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  @Input() data: any;
  @Input() type = 'roasting';
  receivedData: any;

  ngOnInit() {
    this.receivedData = this.data;
    console.log(this.receivedData);
  }

  print(){
    window.print();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() message: string
  @Output() close = new EventEmitter<void>()

  constructor() { }

  ngOnInit(): void {
  }

  onCloseModal() {
    this.close.emit()
  }

}

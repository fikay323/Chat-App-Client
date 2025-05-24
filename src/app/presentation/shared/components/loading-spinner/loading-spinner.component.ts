import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-loading-spinner',
    styleUrls: ['./loading-spinner.component.css'],
    template: `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
})
export class LoadingSpinnerComponent {

}
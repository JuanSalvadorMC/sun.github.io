import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';




@NgModule({
    imports:[
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatStepperModule,
        MatTabsModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatTableModule
        
    ],
    exports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatStepperModule,
        MatTabsModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatTableModule
       ],
    providers: [
        {
            provide: MatFormFieldControl,
            useValue : {}
          },
      ],
})

export class MaterialModule{
    NgModule: MaterialModule;
}

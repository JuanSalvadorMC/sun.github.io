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
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatSliderModule} from '@angular/material/slider';



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
        MatTableModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatDialogModule,
        MatListModule,
        MatSliderModule
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
        MatTableModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatDialogModule,
        MatListModule,
        MatSliderModule
        
       ],
    providers: [
        {
            provide: MatFormFieldControl,
            useValue : {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
})

export class MaterialModule{
    NgModule: MaterialModule;
}

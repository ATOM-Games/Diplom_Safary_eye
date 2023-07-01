import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { userComponent } from './Views/user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './service/token.interceptor';
import { IndComponent } from './Views/ind/ind.component';
import { NeyrosComponent } from './Views/neyros/neyros.component';
import { NeuroModuleComponent } from './Views/neuro-module/neuro-module.component';
import { AdminPanelListenersComponent } from './Views/admin_panel_listeners/admin_panel_listeners.component';

@NgModule({
  declarations: [
    AppComponent,
    userComponent,
    IndComponent,
    NeyrosComponent,
    NeuroModuleComponent,
    AdminPanelListenersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      multi : true,
      useClass : TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

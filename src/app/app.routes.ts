import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DeliveryStatusComponent } from './pages/delivery-status/delivery-status.component';
import { LoginComponent } from './pages/login/login.component';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { MisEntregasComponent } from './pages/mis-entregas/mis-entregas.component';
import { ProfileComponent } from './pages/profile/profile.component';



export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    // {path: 'home', component: HomeComponent},
    {path: 'home', component: DriverHomeComponent},
    {path: 'delivery-home', component: DriverHomeComponent},
    {path: 'delivery-status', component: DeliveryStatusComponent},
    {path: 'mapa-page', component: MapaComponent},
    {path: 'order-detail', component: OrderDetailComponent},
    {path: 'mis-entregas', component: MisEntregasComponent},
    {path: 'myprofile', component: ProfileComponent},
    // {path: 'profile-view/:id', component: ViewComponent},
    // {path: 'myprofile/:id', component: EditComponent},
    // {path: 'profile-gallery', component: GaleriaComponent},
    // {path: 'profile-contac/:id', component: GaleriaComponent},
    // {path: 'analizer', component: AnalizadorComponent},
    // {path: 'tracking', component: TrackingComponent},
    // {path: 'chat', component: ChatComponent},
    // {path: 'chat/:id', component: ChatComponent},
    

    {path: '**', redirectTo: '', pathMatch: 'full'},
];

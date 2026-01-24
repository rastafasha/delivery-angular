import { Tienda } from "./tienda.model";
import { Usuario } from "./usuario.model";
import { Venta } from "./ventas.model";


export class Asignacion {
     constructor(
        public driver : Usuario,
        public tienda : Tienda,
        public venta: Venta,
        public status: string,
        public _id?: string
    
      ){
      }
}
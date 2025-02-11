// PARAM
export const PARAM = {
    ACTIVO: '1',
    INACTIVO: '0',
    SI: '1',
    NO: '0',
    UNDEFINED: '-1',
    VACIO: '',
};

export const SI = '1';
export const NO = '0';

// HTTP RESPONSE
export const HTTP_RESPONSE = {
    SUCCESS: '1',
    WARNING: '2',
    ERROR: '3',
    INFO: '4',
    HTTP_200_OK: 200,
    HTTP_CREATED: 201,
    BAD_REQUEST: 400,
    PERMISION_ERROR: '401',
    CODE_NOT_DEFINED: '601',
    MALFORMED_JSON: '701',
    ACCESS_DENIED: '403'
};

export enum ACTION_CRUD {
    CREATE = '1',
    READ = '2',
    UPDATE = '3',
    DELETE = '4',
}

export enum ORDER_ARRAY {
    ASC = 0,
    DESC = 1,
}


export const TIPO_PAGO_EFECTIVO = 1;
export const TIPO_PAGO_TARJETA = 2;
export const TIPO_PAGO_YAPE = 3;
export const TIPO_PAGO_PLIN = 4;
export const TIPO_PAGO_TRANSFERENCIA = 5;

export const TIPOS_PAGO = [
    { id: TIPO_PAGO_EFECTIVO, descripcion: 'Efectivo' },
    { id: TIPO_PAGO_TARJETA, descripcion: 'Tarjeta' },
    // { id: TIPO_PAGO_YAPE, descripcion: 'Yape' },
    { id: TIPO_PAGO_PLIN, descripcion: 'Plin' },
    { id: TIPO_PAGO_TRANSFERENCIA, descripcion: 'Transferencia' },
];

export const TIPO_BANCO_BCP = "1";
export const TIPO_BANCO_CAJAPIURA = "2";

export const BANCOS = [
    { id: TIPO_BANCO_BCP, descripcion: 'BCP' },
    { id: TIPO_BANCO_CAJAPIURA, descripcion: 'CAJA PIURA' },
];


export const COMPROBANTES = {
    BOLETA: 1,
    FACTURA: 2,
    NOTA_DE_VENTA: 3,
}

export const CONDICION_PAGO_CONTADO = 1;
export const CONDICION_PAGO_CREDITO = 2;

export const CONDICIONES_PAGO = [
    { id: CONDICION_PAGO_CONTADO, descripcion: 'Contado' },
    { id: CONDICION_PAGO_CREDITO, descripcion: 'Crédito' },
];


export const COMISION_POR_VENTA = "1";
export const COMISION_POR_COBRANZA = "2";

export const TIPOS_COMISIONES = [   
    { id: COMISION_POR_VENTA, descripcion: 'Comisión por venta' },
    { id: COMISION_POR_COBRANZA, descripcion: 'Comisión por cobranza' },
]


export const CARGO_ADMINISTRADOR = "1";
export const CARGO_CAJERO = "2";
export const CARGO_ALMACEN = "3";
export const CARGO_VENDEDOR = "4";


export const CARGOS = [
    { id: CARGO_ADMINISTRADOR, descripcion: 'Administrador' },
    { id: CARGO_CAJERO, descripcion: 'Cajero' },
    { id: CARGO_ALMACEN, descripcion: 'Almacén' },
    { id: CARGO_VENDEDOR, descripcion: 'Vendedor' },
];


export const ORDENCOMPRA_ESTADO = {
    PENDIENTE: 1,
    PROCESADO: 2
}
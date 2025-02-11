import {MainMapper} from './main.mapper';
import { IResponse } from '@shared/interfaces/IResponse';
import {HTTP_RESPONSE} from "@shared/constants/app.const";

export class ParseDataResponseMapper extends MainMapper<any, IResponse> {
    protected map(responseBackend: any): IResponse {
        let dataObj: IResponse = {
            code: HTTP_RESPONSE.MALFORMED_JSON,
            message: 'JSON mal formado',
            data: null
        };
        if (responseBackend !== null && typeof responseBackend === 'object') {
            if (responseBackend.data !== null && typeof responseBackend.data === 'object') {
                dataObj = responseBackend;
            } else {
                /**
                 * Si la respuesta es pura sin tipo ni message seteo data a la respuesta
                 */
                if (responseBackend.data && responseBackend.code && responseBackend.message) {
                    dataObj = responseBackend;
                } else if (!responseBackend.data && responseBackend.code && (responseBackend.message || responseBackend.mensaje)) {
                    dataObj = responseBackend;
                } else {
                    if (!responseBackend.code && !responseBackend.message) {
                        dataObj = {code: HTTP_RESPONSE.HTTP_200_OK, message: '', data: responseBackend};
                        if (responseBackend.message && Array.isArray(responseBackend.message)) {
                            dataObj = {
                                code: HTTP_RESPONSE.HTTP_200_OK,
                                message: responseBackend.message,
                                data: responseBackend
                            };
                        }
                        if (responseBackend.message && !Array.isArray(responseBackend.message)) {
                            dataObj = {
                                code: HTTP_RESPONSE.HTTP_200_OK,
                                message: responseBackend.message,
                                data: responseBackend
                            };
                        }
                    } else {
                        if (responseBackend.code === HTTP_RESPONSE.PERMISION_ERROR) {
                            dataObj = responseBackend;
                        }
                        if (responseBackend.code === HTTP_RESPONSE.HTTP_200_OK) {
                            if (responseBackend.message && Array.isArray(responseBackend.message)) {
                                dataObj = {
                                    code: responseBackend.code,
                                    message: responseBackend.message,
                                    data: responseBackend
                                };
                            } else {
                                dataObj = {
                                    code: responseBackend.code,
                                    message: responseBackend.message,
                                    data: responseBackend
                                };
                            }
                        }
                        if (responseBackend.code === HTTP_RESPONSE.BAD_REQUEST) {
                            if (responseBackend.message && Array.isArray(responseBackend.message)) {
                                dataObj = {code: responseBackend.code, message: '', data: responseBackend};
                            } else {
                                dataObj = {
                                    code: responseBackend.code,
                                    message: responseBackend.message,
                                    data: responseBackend
                                };
                            }
                        }
                    }
                }
            }
        }
        return dataObj;
    }

}

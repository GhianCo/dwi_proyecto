import {Injectable, isDevMode} from '@angular/core';
import {isArray, keys as ObjectKeys} from 'lodash-es';

export interface PersistenceOptions {
    session: boolean;
}

@Injectable({providedIn: 'root'})
export class PersistenceService {
    localStorePrefix = 'dipafar_st_';
    cookiePrefix = 'dipafar_ck_';

    private setPersistenceValue(key: string, value: unknown, options?: PersistenceOptions) {
        if (undefined !== value) {
            key = `${this.localStorePrefix}${key}`;
            const data = JSON.stringify(value);

            if (options && options.session) {
                return sessionStorage.setItem(key, data);
            }
            return localStorage.setItem(key, data);
        }
    }

    private getPersistenceValue(key: string, options?: PersistenceOptions) {
        key = `${this.localStorePrefix}${key}`;
        let value = void 0;

        try {
            const store = options && options.session ? sessionStorage : localStorage;
            value = JSON.parse(store.getItem(key) as any);
        } catch (error) {
            if (isDevMode()) {
                console.error(error);
            }
        }

        return value;
    }

    private escapeRegExp(e: string) {
        return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    set(key: string | { [key: string]: unknown }, value: unknown, options?: PersistenceOptions): void {
        try {
            const data = 'string' === typeof key ? {[key]: value} : key;
            for (let keys = ObjectKeys(data), i = 0, len = keys.length; i < len; i++) {
                this.setPersistenceValue(keys[i], data[keys[i]], options);
            }
        } catch {
            return this.setCookie(key, value);
        }
    }

    get(key: string | string[], options?: PersistenceOptions): any {
        try {
            const data: any = {};
            for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length; i < len; i++) {
                data[keys[i]] = this.getPersistenceValue(keys[i], options);
            }
            return isArray(key) ? data : data[key];
        } catch {
            return this.getCookie(key);
        }
    }

    has(key: string, options?: PersistenceOptions): boolean {
        return !!this.get(key, options);
    }

    remove(key: string | string[], options?: PersistenceOptions) {
        try {
            for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length; i < len; i++) {
                if (options && options.session) {
                    sessionStorage.removeItem(this.localStorePrefix + keys[i]);
                } else {
                    localStorage.removeItem(this.localStorePrefix + keys[i]);
                }
            }
        } catch {
            return this.removeCookie(key);
        }
    }

    // Cookies

    setCookie(key: string | { [key: string]: any }, value?: any): void {
        const data = 'string' === typeof key ? {[key]: value} : key;
        for (let keys = ObjectKeys(data), i = 0, len = keys.length; i < len; i++) {
            document.cookie = encodeURIComponent(this.cookiePrefix + keys[i]) + '=' + encodeURIComponent(JSON.stringify(data[keys[i]]));
        }
    }

    getCookie(key: string | string[]): any {
        const cookies = ';' + document.cookie + ';';
        const data: any = {};
        for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length, k: any = void 0, s: any = void 0, d: any = void 0; i < len; i++) {
            k = this.escapeRegExp(encodeURIComponent(this.cookiePrefix + keys[i]));
            s = new RegExp(';\\s*' + k + '\\s*=\\s*([^;]+)\\s*;');
            d = cookies.match(s);
            data[keys[i]] = d ? JSON.parse(decodeURIComponent(d[1])) : null;
        }
        return isArray(key) ? data : data[key];
    }

    removeCookie(key: string | string[], usePrefix = true) {
        const o = isArray(key) ? key : [key];
        for (let r = 0, s = o.length; r < s; r++) {
            document.cookie = this.escapeRegExp(encodeURIComponent((usePrefix ? this.cookiePrefix : '') + o[r])) + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
}


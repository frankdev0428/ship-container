/* tslint:disable */
/* eslint-disable */
/**
 * Aeler demo
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface LeaseRateInput
 */
export interface LeaseRateInput {
    /**
     * 
     * @type {string}
     * @memberof LeaseRateInput
     */
    customerId: string;
    /**
     * 
     * @type {Date}
     * @memberof LeaseRateInput
     */
    validFrom: Date;
    /**
     * 
     * @type {number}
     * @memberof LeaseRateInput
     */
    dailyRate: number;
    /**
     * 
     * @type {string}
     * @memberof LeaseRateInput
     */
    currency: LeaseRateInputCurrencyEnum;
    /**
     * 
     * @type {Date}
     * @memberof LeaseRateInput
     */
    validUntil?: Date;
    /**
     * bla
     * @type {string}
     * @memberof LeaseRateInput
     */
    orderId?: string;
}

/**
* @export
* @enum {string}
*/
export enum LeaseRateInputCurrencyEnum {
    Afn = 'AFN',
    All = 'ALL',
    Dzd = 'DZD',
    Adp = 'ADP',
    Aoa = 'AOA',
    Ara = 'ARA',
    Ars = 'ARS',
    Amd = 'AMD',
    Awg = 'AWG',
    Aud = 'AUD',
    Ats = 'ATS',
    Azn = 'AZN',
    Bsd = 'BSD',
    Bhd = 'BHD',
    Bdt = 'BDT',
    Bbd = 'BBD',
    Byn = 'BYN',
    Bef = 'BEF',
    Bec = 'BEC',
    Bel = 'BEL',
    Bzd = 'BZD',
    Bmd = 'BMD',
    Btn = 'BTN',
    Bob = 'BOB',
    Bov = 'BOV',
    Bop = 'BOP',
    Bam = 'BAM',
    Bwp = 'BWP',
    Brl = 'BRL',
    Gbp = 'GBP',
    Bnd = 'BND',
    Bgl = 'BGL',
    Bgn = 'BGN',
    Bgm = 'BGM',
    Buk = 'BUK',
    Bif = 'BIF',
    Xpf = 'XPF',
    Khr = 'KHR',
    Cad = 'CAD',
    Cve = 'CVE',
    Kyd = 'KYD',
    Xaf = 'XAF',
    Cle = 'CLE',
    Clp = 'CLP',
    Clf = 'CLF',
    Cnx = 'CNX',
    Cny = 'CNY',
    Cop = 'COP',
    Cou = 'COU',
    Kmf = 'KMF',
    Cdf = 'CDF',
    Crc = 'CRC',
    Hrd = 'HRD',
    Hrk = 'HRK',
    Cuc = 'CUC',
    Cup = 'CUP',
    Cyp = 'CYP',
    Czk = 'CZK',
    Csk = 'CSK',
    Dkk = 'DKK',
    Djf = 'DJF',
    Dop = 'DOP',
    Nlg = 'NLG',
    Xcd = 'XCD',
    Ddm = 'DDM',
    Ecs = 'ECS',
    Ecv = 'ECV',
    Egp = 'EGP',
    Gqe = 'GQE',
    Ern = 'ERN',
    Eek = 'EEK',
    Etb = 'ETB',
    Eur = 'EUR',
    Xeu = 'XEU',
    Fkp = 'FKP',
    Fjd = 'FJD',
    Fim = 'FIM',
    Frf = 'FRF',
    Xfo = 'XFO',
    Xfu = 'XFU',
    Gmd = 'GMD',
    Gek = 'GEK',
    Gel = 'GEL',
    Dem = 'DEM',
    Ghs = 'GHS',
    Gip = 'GIP',
    Grd = 'GRD',
    Gtq = 'GTQ',
    Gwp = 'GWP',
    Gnf = 'GNF',
    Gns = 'GNS',
    Gyd = 'GYD',
    Htg = 'HTG',
    Hnl = 'HNL',
    Hkd = 'HKD',
    Huf = 'HUF',
    Isk = 'ISK',
    Inr = 'INR',
    Idr = 'IDR',
    Irr = 'IRR',
    Iqd = 'IQD',
    Iep = 'IEP',
    Ils = 'ILS',
    Ilp = 'ILP',
    Itl = 'ITL',
    Jmd = 'JMD',
    Jpy = 'JPY',
    Jod = 'JOD',
    Kzt = 'KZT',
    Kes = 'KES',
    Kwd = 'KWD',
    Kgs = 'KGS',
    Lak = 'LAK',
    Lvl = 'LVL',
    Lvr = 'LVR',
    Lbp = 'LBP',
    Lsl = 'LSL',
    Lrd = 'LRD',
    Lyd = 'LYD',
    Ltl = 'LTL',
    Ltt = 'LTT',
    Lul = 'LUL',
    Luc = 'LUC',
    Luf = 'LUF',
    Mop = 'MOP',
    Mkd = 'MKD',
    Mga = 'MGA',
    Mgf = 'MGF',
    Mwk = 'MWK',
    Myr = 'MYR',
    Mvr = 'MVR',
    Mlf = 'MLF',
    Mtl = 'MTL',
    Mtp = 'MTP',
    Mro = 'MRO',
    Mur = 'MUR',
    Mxv = 'MXV',
    Mxn = 'MXN',
    Mdc = 'MDC',
    Mdl = 'MDL',
    Mcf = 'MCF',
    Mnt = 'MNT',
    Mad = 'MAD',
    Maf = 'MAF',
    Mze = 'MZE',
    Mzn = 'MZN',
    Mmk = 'MMK',
    Nad = 'NAD',
    Npr = 'NPR',
    Ang = 'ANG',
    Twd = 'TWD',
    Nzd = 'NZD',
    Nio = 'NIO',
    Ngn = 'NGN',
    Kpw = 'KPW',
    Nok = 'NOK',
    Omr = 'OMR',
    Pkr = 'PKR',
    Pab = 'PAB',
    Pgk = 'PGK',
    Pyg = 'PYG',
    Pei = 'PEI',
    Pen = 'PEN',
    Php = 'PHP',
    Pln = 'PLN',
    Pte = 'PTE',
    Gwe = 'GWE',
    Qar = 'QAR',
    Xre = 'XRE',
    Rhd = 'RHD',
    Ron = 'RON',
    Rub = 'RUB',
    Rwf = 'RWF',
    Svc = 'SVC',
    Wst = 'WST',
    Sar = 'SAR',
    Rsd = 'RSD',
    Scr = 'SCR',
    Sll = 'SLL',
    Sgd = 'SGD',
    Skk = 'SKK',
    Sit = 'SIT',
    Sbd = 'SBD',
    Sos = 'SOS',
    Zar = 'ZAR',
    Zal = 'ZAL',
    Krw = 'KRW',
    Ssp = 'SSP',
    Sur = 'SUR',
    Esp = 'ESP',
    Esa = 'ESA',
    Esb = 'ESB',
    Lkr = 'LKR',
    Shp = 'SHP',
    Sdg = 'SDG',
    Srd = 'SRD',
    Srg = 'SRG',
    Szl = 'SZL',
    Sek = 'SEK',
    Chf = 'CHF',
    Syp = 'SYP',
    Std = 'STD',
    Tjr = 'TJR',
    Tjs = 'TJS',
    Tzs = 'TZS',
    Thb = 'THB',
    Tpe = 'TPE',
    Top = 'TOP',
    Ttd = 'TTD',
    Tnd = 'TND',
    Try = 'TRY',
    Tmt = 'TMT',
    Usd = 'USD',
    Usn = 'USN',
    Uss = 'USS',
    Ugx = 'UGX',
    Uah = 'UAH',
    Uak = 'UAK',
    Aed = 'AED',
    Uyu = 'UYU',
    Uyi = 'UYI',
    Uzs = 'UZS',
    Vuv = 'VUV',
    Vef = 'VEF',
    Vnd = 'VND',
    Che = 'CHE',
    Chw = 'CHW',
    Xof = 'XOF',
    Ydd = 'YDD',
    Yer = 'YER',
    Zmw = 'ZMW',
    Zwr = 'ZWR',
    Zwl = 'ZWL'
}

export function LeaseRateInputFromJSON(json: any): LeaseRateInput {
    return LeaseRateInputFromJSONTyped(json, false);
}

export function LeaseRateInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): LeaseRateInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'customerId': json['customerId'],
        'validFrom': (new Date(json['validFrom'])),
        'dailyRate': json['dailyRate'],
        'currency': json['currency'],
        'validUntil': !exists(json, 'validUntil') ? undefined : (new Date(json['validUntil'])),
        'orderId': !exists(json, 'orderId') ? undefined : json['orderId'],
    };
}

export function LeaseRateInputToJSON(value?: LeaseRateInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'customerId': value.customerId,
        'validFrom': (value.validFrom.toISOString()),
        'dailyRate': value.dailyRate,
        'currency': value.currency,
        'validUntil': value.validUntil === undefined ? undefined : (value.validUntil.toISOString()),
        'orderId': value.orderId,
    };
}



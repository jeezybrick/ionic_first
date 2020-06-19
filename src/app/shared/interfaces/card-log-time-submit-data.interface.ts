export type CardLogTimeSuffixType = 'm' | 'h';

export interface CardLogTimeSubmitDataInterface {
    date: string;
    workedValue: number;
    workedSuffix: CardLogTimeSuffixType;
    estimateValue: number;
    estimateSuffix: CardLogTimeSuffixType;
}

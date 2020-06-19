export type CardLogTimeSuffixType = 'm' | 'h';

export interface CardLogTimeSubmitDataInterface {
    date: string;
    value: number;
    suffix: CardLogTimeSuffixType;
}

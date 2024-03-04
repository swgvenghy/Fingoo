import { Indicator } from '../get-indicator/indicator.dto';
import { IndicatorValue } from '../get-fluctuatingIndicator/fluctuatingIndicator.dto';

export type HistoryIndicatorValue = {
  date: Date;
  close: string;
  compare: string;
  fluctuation: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  tradingValue: string;
  marketCapitalization: string;
  outstandingShares: string;
};

export class HistoryIndicatorDto {
  indicator: Indicator;
  values: IndicatorValue[];

  public constructor(indicator: Indicator, values: IndicatorValue[]) {
    this.indicator = indicator;
    this.values = values;
  }

  static create(indicator: Indicator, values: IndicatorValue[]): HistoryIndicatorDto {
    return new HistoryIndicatorDto(indicator, values);
  }
}

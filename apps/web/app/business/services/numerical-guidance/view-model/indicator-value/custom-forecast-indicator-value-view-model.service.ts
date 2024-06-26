import {
  CustomForecastIndicatorResponse,
  CustomForecastIndicatorValueResponse,
  ForecastType,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { FormatOptions, FormattedItem, IndicatorValue, IndicatorValueItem } from './indicator-value-view-model.service';
import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { formatDate } from '@/app/utils/date-formatter';
import { IndicatorValueItemResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';

type CustomForecastIndicator = {
  customForecastIndicatorName: string;
  targetIndicatorValues: IndicatorValueItemResponse[];
};

export class CustomForecastIndicatorValue extends IndicatorValue {
  readonly customForecastIndicatorId: string;
  readonly targetIndicatorId: string;
  readonly ticker: string;
  readonly type: string;
  readonly customForecastIndicatorValues: IndicatorValueItem[];
  readonly customForecastIndicatorName: string;
  readonly targetIndicatorValues: IndicatorValueItem[];
  readonly forecastType: ForecastType;

  constructor({
    customForecastIndicatorId,
    targetIndicatorId,
    ticker,
    type,
    customForecastIndicatorName,
    customForecastIndicatorValues,
    targetIndicatorValues,
    forecastType,
  }: CustomForecastIndicatorValueResponse & CustomForecastIndicator) {
    const customForecastIndicatorValueItems = customForecastIndicatorValues
      .map((item) => new IndicatorValueItem(item))
      .reverse();
    const targetIndicatorValueItems = targetIndicatorValues.map((item) => new IndicatorValueItem(item));
    const mergedValueItems = [...customForecastIndicatorValueItems, ...targetIndicatorValueItems];
    super(customForecastIndicatorId, mergedValueItems);
    this.customForecastIndicatorId = customForecastIndicatorId;
    this.targetIndicatorId = targetIndicatorId;
    this.ticker = ticker;
    this.type = type;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.customForecastIndicatorValues = customForecastIndicatorValueItems;
    this.targetIndicatorValues = targetIndicatorValueItems;
    this.forecastType = forecastType;
  }

  get identifier() {
    return `${this.customForecastIndicatorName}-${this.id.slice(0, 4)}`;
  }

  formatItemsByDate(options?: FormatOptions): FormattedItem {
    const { isValueWithIndexUnit } = options || { isValueWithIndexUnit: false };
    return this.caculateItemsValue(isValueWithIndexUnit ?? false).reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [formatDate(item.date)]: {
          [this.identifier]: {
            value: item.value,
            displayValue: item.displayValue,
          },
        },
      };
    }, {});
  }
}

export const convertCustomForecastIndicatorsValue = (
  customForecastIndicatorsValue: (CustomForecastIndicatorValueResponse & CustomForecastIndicator)[],
) => {
  return customForecastIndicatorsValue.map((item) => new CustomForecastIndicatorValue(item));
};

export const convertCustomForecastHistoryIndicatorsValueViewModel = (
  customForecastHistoryIndicatorsValue: HistoryIndicatorValueResponse[],
  selectedCustomForeacastIndicators: CustomForecastIndicatorResponse[],
) => {
  let memorizedCustomForecastIndicators = [...selectedCustomForeacastIndicators];
  return customForecastHistoryIndicatorsValue.reduce<CustomForecastIndicatorValue[]>((acc, item) => {
    const index = memorizedCustomForecastIndicators.findIndex(
      (customForecastIndicator) => customForecastIndicator.targetIndicator.id === item.indicator.id,
    );

    if (index === -1) return acc;
    const customForecastIndicator = memorizedCustomForecastIndicators[index];
    memorizedCustomForecastIndicators.splice(index, 1);

    return [
      ...acc,
      new CustomForecastIndicatorValue({
        customForecastIndicatorId: customForecastIndicator.id,
        targetIndicatorId: customForecastIndicator.targetIndicator.id,
        ticker: item.indicator.symbol,
        type: item.indicator.type,
        customForecastIndicatorName: customForecastIndicator.customForecastIndicatorName,
        customForecastIndicatorValues: [],
        targetIndicatorValues: item.values,
        forecastType: 'multi',
      }),
    ];
  }, []);
};

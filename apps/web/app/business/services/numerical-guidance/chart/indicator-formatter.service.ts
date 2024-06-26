import { FormattedItem, IndicatorValue } from '../view-model/indicator-value/indicator-value-view-model.service';
import { UnitType } from './unit-calculator/unit-calculator-factory.service';
import { addOneDay, formatDate } from '@/app/utils/date-formatter';
import { getBigestDateInArray, getSmallestDateInArray } from '@/app/utils/date-formatter';

export type FormattedIndicatorValue = {
  value: number;
  displayValue: number;
};

export type FormattedRowType = {
  [ticker: string]: FormattedIndicatorValue | string;
};

function isFormattedIndicatorValue(value: any): value is FormattedIndicatorValue {
  return typeof value === 'object' && value !== null && 'value' in value && 'displayValue' in value;
}

export class IndicatorFormatter {
  private unitType: UnitType;
  constructor(private indicatorsValue: IndicatorValue[]) {
    this.unitType = indicatorsValue.length > 1 ? 'index' : 'default';
  }

  get formattedIndicatorsInRow(): FormattedRowType[] {
    const formmatedItems = this.indicatorsValue.map((indicator) =>
      indicator.formatItemsByDate({
        isValueWithIndexUnit: this.unitType === 'index',
      }),
    );

    const iteratorCallback = (date: string) => {
      const isHasDate = formmatedItems.some((items) => date in items);

      if (!isHasDate) {
        return;
      }

      return {
        date,
        ...formmatedItems.reduce<FormattedRowType>((acc, item) => {
          return {
            ...acc,
            ...item[date],
          };
        }, {}),
      };
    };

    return this.iterateSmallestToBiggestDate(iteratorCallback);
  }

  get formmatedIndicatorsToCSV() {
    return this.formattedIndicatorsInRow.map((row) => {
      return Object.keys(row).reduce<{ [key: string]: string | number }>((acc, key) => {
        const value = row[key];
        if (isFormattedIndicatorValue(value)) {
          acc[key] = value.displayValue;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
    });
  }

  iterateSmallestToBiggestDate(callback: (date: string) => FormattedRowType | undefined): FormattedRowType[] {
    const biggestDate = getBigestDateInArray(this.indicatorsValue.map((indicator) => indicator.lastDate));
    const smallestDate = getSmallestDateInArray(this.indicatorsValue.map((indicator) => indicator.startDate));

    if (biggestDate === 'Invalid Date' || smallestDate === 'Invalid Date') {
      return [];
    }

    let currentDate = smallestDate;
    let result = [];
    while (currentDate <= biggestDate) {
      const callbackResult = callback(currentDate);
      if (callbackResult) {
        result.push(callbackResult);
      }
      currentDate = addOneDay(currentDate);
    }
    return result;
  }

  get columns() {
    return this.indicatorsValue.map((indicator) => indicator.identifier);
  }

  getIdentifierById(id: string) {
    return this.indicatorsValue.find((indicator) => indicator.id === id)?.identifier;
  }

  getIdentifiersByIds(ids: string[]) {
    return ids.map((id) => ({
      identifier: this.getIdentifierById(id) ?? '',
      indicatorId: id,
    }));
  }
}

export const createIndicatorFormatter = (...indicatorsValue: IndicatorValue[][]) => {
  return new IndicatorFormatter(indicatorsValue.flat());
};

export function chartValueFormatterFactory(categories: string[]) {
  if (categories.length === 1) {
    return (data: FormattedIndicatorValue) => data.displayValue;
  }

  return (data: FormattedIndicatorValue) => data.value;
}

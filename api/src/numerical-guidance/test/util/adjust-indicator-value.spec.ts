import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import * as fs from 'fs';
import { IndicatorValue } from '../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { Interval } from '../../../utils/type/type-definition';

const filePath = './src/numerical-guidance/test/data/history-indicator.json';
const data = fs.readFileSync(filePath, 'utf8');
const mockHistoryIndicatorValues = JSON.parse(data);

describe('AdjustIndicatorValue(extends IndicatorValueManager)', () => {
  it('Day interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'day';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    expect(resultIndicatorValues).toEqual(historyIndicatorValues);
  });

  it('Week interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'week';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '72.00',
      },
      {
        date: '20240223',
        value: '72.80',
      },
      {
        date: '20240216',
        value: '73.50',
      },
      {
        date: '20240208',
        value: '74.25',
      },
      {
        date: '20240202',
        value: '73.60',
      },
      {
        date: '20240126',
        value: '74.20',
      },
      {
        date: '20240119',
        value: '72.20',
      },
      {
        date: '20240112',
        value: '73.80',
      },
      {
        date: '20240105',
        value: '77.00',
      },
      {
        date: '20231228',
        value: '77.33',
      },
      {
        date: '20231222',
        value: '75.00',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });

  it('Month interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'month';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '73.44',
      },
      {
        date: '20240131',
        value: '74.05',
      },
      {
        date: '20231228',
        value: '76.40',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });

  it('Year interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'year';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '73.79',
      },
      {
        date: '20231228',
        value: '76.40',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });
});
'use client';
import { EventProps } from '@tremor/react';
import LineChart from './line-chart';
import { useState } from 'react';
import { ChartTooltip } from './chart-tooltip';
import {
  FormattedRowType,
  chartValueFormatterFactory,
} from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { cn } from '@/app/utils/style';

type MultiLineChartProps = {
  data: FormattedRowType[];
  categories: string[];
  syncId?: string;
  noDataText?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function MultiLineChart({
  data,
  categories,
  noDataText,
  syncId,
  className,
  ...props
}: MultiLineChartProps) {
  const [value, setValue] = useState<EventProps>(null);
  const index = 'date';

  const formatteedData = formmatData(data, categories);
  return (
    <>
      <LineChart
        {...props}
        syncId={syncId}
        className={cn('h-full ', className)}
        data={formatteedData}
        index={index}
        categories={categories}
        // colors={['indigo-300', 'indigo-300', 'indigo-300', 'green-300', 'violet-400']}
        colors={['yellow-400', 'rose-300', 'green-300', 'blue-400', 'violet-400', 'red-400', 'red-400']}
        yAxisWidth={60}
        onValueChange={(v) => setValue(v)}
        showAnimation={true}
        animationDuration={600}
        autoMinValue={true}
        enableLegendSlider={true}
        curveType={'linear'}
        noDataText={noDataText}
        customTooltip={ChartTooltip}
        tickGap={50}
      />
    </>
  );
}

function formmatData(data: FormattedRowType[], categories: string[]) {
  const caculateChartValue = chartValueFormatterFactory(categories);

  return data.map((d) => {
    return {
      ...Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: caculateChartValue(
            d[key] as {
              value: number;
              displayValue: number;
            },
          ),
        };
      }, {}),
      displayValue: Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: (
            d[key] as {
              value: number;
              displayValue: number;
            }
          ).displayValue,
        };
      }, {}),
    };
  });
}

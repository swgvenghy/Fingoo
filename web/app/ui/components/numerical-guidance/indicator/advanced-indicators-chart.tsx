import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';

export default function AdvancedIndicatorsChart() {
  const { formattedHistoryIndicatorsRows, setPaginationData } = useHistoryIndicatorsValueViewModel();
  const { formattedIndicatorsRows } = useLiveIndicatorsValueViewModel();

  const formattedAdvencedIndicatorsRows = [
    ...(formattedHistoryIndicatorsRows || []),
    ...(formattedIndicatorsRows || []),
  ];

  const handleLoadData = (rowsToDownload: number, initialIndex: number) => {
    setPaginationData({
      rowsToDownload,
    });
  };

  return <AdvancedMultiLineChart onLoadData={handleLoadData} data={formattedAdvencedIndicatorsRows || []} />;
}

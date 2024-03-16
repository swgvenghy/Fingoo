import { useMemo } from 'react';
import { useFetchLiveIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertLiveIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useLiveIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const interval = useWorkspaceStore((state) => state.interval);
  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValue(
    selectedMetadata?.indicatorIds,
    interval,
  );

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertLiveIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  const formattedIndicatorsRows = useMemo(
    () => convertedIndciatorsValue?.formattedIndicatorsInRow,
    [convertedIndciatorsValue],
  );

  const startDate = formattedIndicatorsRows?.[0]?.date as string;

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
    formattedIndicatorsRows,
    startDate,
  };
};

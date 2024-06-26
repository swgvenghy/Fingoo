import {
  CustomForecastIndicatorResponse,
  useFetchCustomForecastIndicatorList,
  useUpdateCustomForecastIndicatorName,
  useUpdateSourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../../services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
import { useEffect, useMemo } from 'react';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useSelectedCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/custom-forecast-indicator/selected-custom-forecast-indicator.store';
import { usePending } from '@/app/utils/hooks/usePending.hook';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';

export const useSelectedCustomForecastIndicatorViewModel = () => {
  const selectedCustomForecastIndicatorId = useWorkspaceStore((state) => state.selectedCustomForecastIndicatorId);
  const { selectCustomForecastIndicatorById } = useWorkspaceStore((state) => state.actions);

  const { selectedCustomForecastIndicator, isUpdated } = useSelectedCustomForecastIndicatorStore((state) => state);
  const selectedCustomerForecastIndicatorActions = useSelectedCustomForecastIndicatorStore((state) => state.actions);

  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();

  const { trigger: updateSourceIndicatorTrigger, isMutating: isUpdateSourceIndicatorMutating } =
    useUpdateSourceIndicator(selectedCustomForecastIndicatorId);
  const { trigger: updateCustomForecastIndicatorNameTrigger } = useUpdateCustomForecastIndicatorName(
    selectedCustomForecastIndicatorId,
  );

  const { isPending } = usePending(isValidating, isUpdateSourceIndicatorMutating);

  const foundCustomForecastIndicator = customForecastIndicatorList?.find(
    (customForecastIndicator) => customForecastIndicator.id === selectedCustomForecastIndicatorId,
  );

  useEffect(() => {
    if (!foundCustomForecastIndicator) return;
    if (selectedCustomForecastIndicator.id === foundCustomForecastIndicator.id) return;

    selectedCustomerForecastIndicatorActions.enroll(foundCustomForecastIndicator);
  }, [foundCustomForecastIndicator]);

  const convertedSelectedCustomForecastIndicator = useMemo(() => {
    if (!foundCustomForecastIndicator) return;
    return convertCustomForecastIndicatorViewModel({
      ...foundCustomForecastIndicator,
      sourceIndicatorsInformation: selectedCustomForecastIndicator.sourceIndicatorsInformation,
      sourceIndicators: selectedCustomForecastIndicator.sourceIndicators,
    });
  }, [foundCustomForecastIndicator, selectedCustomForecastIndicator]);

  const sourceIndicatorList = useMemo(() => {
    if (!convertedSelectedCustomForecastIndicator) return [];

    return convertedSelectedCustomForecastIndicator.sourceIndicatorsInformation.map((sourceIndicator) => {
      const sourceIndicatorInfo = convertedSelectedCustomForecastIndicator.sourceIndicatorsInfo.find(
        (indicator) => indicator.id === sourceIndicator.sourceIndicatorId,
      );

      return {
        id: sourceIndicator.sourceIndicatorId,
        disabled: !convertedSelectedCustomForecastIndicator.checkGrantedVerificationBySourceIndicatorId(
          sourceIndicator.sourceIndicatorId,
        ),
        weight: sourceIndicator.weight,
        name: sourceIndicatorInfo?.name ?? '',
        symbol: sourceIndicatorInfo?.symbol ?? '',
        exchange: sourceIndicatorInfo?.exchange ?? '',
        indicatorType: sourceIndicatorInfo?.indicatorType ?? 'stocks',
      };
    });
  }, [convertedSelectedCustomForecastIndicator]);

  const addSourceIndicator = (indicator: Indicator) => {
    selectedCustomerForecastIndicatorActions.addSourceIndicator(indicator.formattedIndicator);
  };

  const deleteSourceIndicator = (indicatorId: string) => {
    selectedCustomerForecastIndicatorActions.deleteSourceIndicator(indicatorId);
  };

  const updateSourceIndicatorWeight = (indicatorId: string, weight: number) => {
    selectedCustomerForecastIndicatorActions.updateSourceIndicatorWeight(indicatorId, weight);
  };

  const applyUpdatedSourceIndicator = async () => {
    if (!convertedSelectedCustomForecastIndicator) return;

    await updateSourceIndicatorTrigger(
      {
        sourceIndicatorsInformation: convertedSelectedCustomForecastIndicator.sourceIndicatorsInformation,
      },
      {
        onSuccess: () => {
          selectedCustomerForecastIndicatorActions.initialize();
        },
      },
    );
  };

  const updateCustomForecastIndicatorName = (name: string) => {
    updateCustomForecastIndicatorNameTrigger(
      {
        name,
      },
      {
        optimisticData: (data) => {
          const currentData = data as unknown as CustomForecastIndicatorResponse[];
          return currentData.map((customForecastIndicator) => {
            if (customForecastIndicator.id === selectedCustomForecastIndicatorId) {
              return {
                ...customForecastIndicator,
                customForecastIndicatorName: name,
              };
            }
            return customForecastIndicator;
          });
        },
      },
    );
  };

  return {
    selectedCustomForecastIndicator: convertedSelectedCustomForecastIndicator,
    sourceIndicatorList,
    isUpdated,
    isPending,
    selectCustomForecastIndicatorById,
    addSourceIndicator,
    deleteSourceIndicator,
    updateSourceIndicatorWeight,
    applyUpdatedSourceIndicator,
    updateCustomForecastIndicatorName,
  };
};

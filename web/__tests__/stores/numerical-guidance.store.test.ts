import { act, renderHook } from '@testing-library/react';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

describe('useWorkspaceStore', () => {
  beforeEach(() => {
    resetAllStore();
  });

  it('초기 설정을 확인한다.', () => {
    // given
    const { result } = renderHook(() => useWorkspaceStore());

    // when
    // then
    expect(result.current.selectedMetadataId).toBeUndefined();
    expect(result.current.interval).toBe('day');
  });

  it('메타데이터를 선택하면, 선택된 메타데이터 ID를 가진다', () => {
    // given
    const { result } = renderHook(() => useWorkspaceStore());

    // when
    act(() => result.current.actions.selectMetadata('1'));

    // then
    expect(result.current.selectedMetadataId).toBe('1');
  });
});

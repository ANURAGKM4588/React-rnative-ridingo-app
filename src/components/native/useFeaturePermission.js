import React, { useState, useCallback } from 'react';
import PermissionPromptModal from './PermissionPromptModal';
import {
  PERMISSION_TYPES,
  PERMISSION_RESULTS,
  checkAppPermission,
  requestAppPermission,
} from '../../services/nativePermissionsService';

/**
 * Custom hook to easily integrate pre-permission prompts into any component
 * 
 * Usage:
 * const { requestPermissionWithPrompt, PermissionModalComponent } = useFeaturePermission('driver', isDark);
 * 
 * // Trigger right before action:
 * const handleTakePhoto = () => {
 *   requestPermissionWithPrompt(PERMISSION_TYPES.CAMERA, () => {
 *     launchCamera();
 *   });
 * };
 */
export function useFeaturePermission(role = 'user', isDarkMode = false) {
  const [modalState, setModalState] = useState({
    visible: false,
    feature: PERMISSION_TYPES.LOCATION_FOREGROUND,
    isBlocked: false,
    pendingAction: null
  });

  const requestPermissionWithPrompt = useCallback(
    async (feature, onGrantedAction) => {
      // 1. Check existing permission status
      const status = await checkAppPermission(feature, role);

      // If already granted, proceed immediately without prompting
      if (status === PERMISSION_RESULTS.GRANTED || status === PERMISSION_RESULTS.LIMITED) {
        if (onGrantedAction) onGrantedAction();
        return;
      }

      // If previously blocked, show Open Settings prompt
      if (status === PERMISSION_RESULTS.BLOCKED) {
        setModalState({
          visible: true,
          feature,
          isBlocked: true,
          pendingAction: null
        });
        return;
      }

      // If denied (can show prompt), show custom pre-prompt explanation dialog
      setModalState({
        visible: true,
        feature,
        isBlocked: false,
        pendingAction: async () => {
          setModalState((prev) => ({ ...prev, visible: false }));
          // Request native system-level prompt
          const reqStatus = await requestAppPermission(feature, role, { showAlertOnBlocked: false });

          if (reqStatus === PERMISSION_RESULTS.GRANTED || reqStatus === PERMISSION_RESULTS.LIMITED) {
            if (onGrantedAction) onGrantedAction();
          } else if (reqStatus === PERMISSION_RESULTS.BLOCKED) {
            // User selected "Don't ask again" / permanently denied
            setModalState({
              visible: true,
              feature,
              isBlocked: true,
              pendingAction: null
            });
          }
        }
      });
    },
    [role]
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  const ModalComponent = (
    <PermissionPromptModal
      visible={modalState.visible}
      feature={modalState.feature}
      role={role}
      isBlocked={modalState.isBlocked}
      isDarkMode={isDarkMode}
      onProceed={() => {
        if (modalState.pendingAction) modalState.pendingAction();
      }}
      onCancel={closeModal}
    />
  );

  return {
    requestPermissionWithPrompt,
    PermissionModalComponent: ModalComponent,
    closeModal
  };
}

export default useFeaturePermission;

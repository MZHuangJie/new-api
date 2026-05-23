/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  API,
  getTodayStartTimestamp,
  showError,
  timestamp2string,
} from '../../helpers';

const emptySummary = {
  user_id: 0,
  username: '',
  count: 0,
  quota: 0,
  prompt_tokens: 0,
  completion_tokens: 0,
  token_used: 0,
  models: [],
};

export const useUserUsageData = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [formApi, setFormApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [summary, setSummary] = useState(emptySummary);
  const [selectedUser, setSelectedUser] = useState(null);

  const now = new Date();
  const formInitValues = {
    userId: null,
    dateRange: [
      timestamp2string(getTodayStartTimestamp()),
      timestamp2string(now.getTime() / 1000 + 3600),
    ],
  };

  const modelsWithPercent = useMemo(() => {
    const models = summary.models || [];
    const totalCount = summary.count || 0;
    const totalQuota = summary.quota || 0;
    return models.map((item) => ({
      ...item,
      countPercent:
        totalCount > 0
          ? Number(((item.count / totalCount) * 100).toFixed(2))
          : 0,
      quotaPercent:
        totalQuota > 0
          ? Number(((item.quota / totalQuota) * 100).toFixed(2))
          : 0,
    }));
  }, [summary]);

  const loadUserById = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await API.get(`/api/user/${userId}`);
      if (res.data.success) {
        setSelectedUser(res.data.data);
        formApi?.setValue('userId', userId);
      }
    } catch (error) {
      showError(t('加载用户信息失败'));
    }
  }, [formApi, t]);

  useEffect(() => {
    const userIdParam = searchParams.get('user_id');
    if (userIdParam) {
      const userId = parseInt(userIdParam, 10);
      if (!Number.isNaN(userId) && userId > 0) {
        loadUserById(userId);
      }
    }
  }, [searchParams, loadUserById]);

  const fetchUsage = useCallback(async () => {
    if (!formApi) return;

    const values = formApi.getValues();
    const userId = values.userId ?? selectedUser?.id;
    const dateRange = values.dateRange;

    if (!userId) {
      showError(t('请选择用户'));
      return;
    }
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
      showError(t('请提供有效的时间范围'));
      return;
    }

    const startTimestamp = Date.parse(dateRange[0]) / 1000;
    const endTimestamp = Date.parse(dateRange[1]) / 1000;
    if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
      showError(t('请提供有效的时间范围'));
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(
        `/api/log/user/usage?user_id=${userId}&start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}`,
      );
      const { success, message, data } = res.data;
      if (success) {
        setSummary(data || emptySummary);
        setHasQueried(true);
        if (data?.user_id && (!selectedUser || selectedUser.id !== data.user_id)) {
          setSelectedUser({
            id: data.user_id,
            username: data.username,
          });
        }
      } else {
        showError(message);
      }
    } catch (error) {
      showError(t('查询用户用量失败'));
    } finally {
      setLoading(false);
    }
  }, [formApi, selectedUser, t]);

  const handleUserChange = (user) => {
    setSelectedUser(user);
    formApi?.setValue('userId', user?.id ?? null);
  };

  return {
    t,
    formApi,
    setFormApi,
    formInitValues,
    loading,
    hasQueried,
    summary,
    modelsWithPercent,
    selectedUser,
    fetchUsage,
    handleUserChange,
  };
};

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

import React, { useMemo } from 'react';
import { Card, Empty, Skeleton, Tabs, TabPane } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';
import { PieChart } from 'lucide-react';
import {
  CARD_PROPS,
  CHART_CONFIG,
  DEFAULT_CHART_SPECS,
} from '../../../constants/dashboard.constants';
import { modelToColor } from '../../../helpers';

const buildPieSpec = (data, colors) => ({
  ...DEFAULT_CHART_SPECS.PIE,
  data: [{ id: 'pieData', values: data }],
  color: {
    specified: colors,
  },
});

const UserUsageCharts = ({ modelsWithPercent, loading, hasQueried, t }) => {
  const countPieData = useMemo(
    () =>
      (modelsWithPercent || []).map((item) => ({
        type: item.model_name || '-',
        value: item.count,
      })),
    [modelsWithPercent],
  );

  const quotaPieData = useMemo(
    () =>
      (modelsWithPercent || []).map((item) => ({
        type: item.model_name || '-',
        value: item.quota,
      })),
    [modelsWithPercent],
  );

  const countColors = useMemo(() => {
    const colors = {};
    countPieData.forEach((item) => {
      colors[item.type] = modelToColor(item.type);
    });
    return colors;
  }, [countPieData]);

  const quotaColors = useMemo(() => {
    const colors = {};
    quotaPieData.forEach((item) => {
      colors[item.type] = modelToColor(item.type);
    });
    return colors;
  }, [quotaPieData]);

  const countSpec = useMemo(
    () => buildPieSpec(countPieData, countColors),
    [countPieData, countColors],
  );
  const quotaSpec = useMemo(
    () => buildPieSpec(quotaPieData, quotaColors),
    [quotaPieData, quotaColors],
  );

  if (!hasQueried) {
    return null;
  }

  if (!loading && modelsWithPercent.length === 0) {
    return (
      <Card {...CARD_PROPS} className='!rounded-2xl mb-4'>
        <Empty description={t('暂无数据')} />
      </Card>
    );
  }

  return (
    <Skeleton loading={loading} active placeholder={<div className='h-96' />}>
      <Card
        {...CARD_PROPS}
        className='!rounded-2xl mb-4'
        title={
          <div className='flex items-center gap-2'>
            <PieChart size={16} />
            {t('模型调用分布')}
          </div>
        }
        bodyStyle={{ padding: 0 }}
      >
        <Tabs type='line'>
          <TabPane tab={t('调用次数分布')} itemKey='count'>
            <div className='h-96 p-2'>
              <VChart spec={countSpec} option={CHART_CONFIG} />
            </div>
          </TabPane>
          <TabPane tab={t('消耗金额分布')} itemKey='quota'>
            <div className='h-96 p-2'>
              <VChart spec={quotaSpec} option={CHART_CONFIG} />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </Skeleton>
  );
};

export default UserUsageCharts;

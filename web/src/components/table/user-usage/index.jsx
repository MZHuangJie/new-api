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

import React from 'react';
import { Empty } from '@douyinfe/semi-ui';
import CardPro from '../../common/ui/CardPro';
import UserUsageFilters from './UserUsageFilters';
import UserUsageSummary from './UserUsageSummary';
import UserUsageCharts from './UserUsageCharts';
import UserUsageTable from './UserUsageTable';
import { useUserUsageData } from '../../../hooks/user-usage/useUserUsageData';

const UserUsagePage = () => {
  const userUsageData = useUserUsageData();
  const {
    t,
    loading,
    hasQueried,
    summary,
    modelsWithPercent,
  } = userUsageData;

  return (
    <CardPro
      type='type2'
      searchArea={<UserUsageFilters {...userUsageData} />}
      t={t}
    >
      {!hasQueried && !loading ? (
        <Empty description={t('请选择用户和时间范围后查询')} className='py-12' />
      ) : (
        <>
          <UserUsageSummary {...userUsageData} />
          <UserUsageCharts
            modelsWithPercent={modelsWithPercent}
            loading={loading}
            hasQueried={hasQueried}
            t={t}
          />
          <UserUsageTable
            modelsWithPercent={modelsWithPercent}
            loading={loading}
            hasQueried={hasQueried}
            summary={summary}
            t={t}
          />
        </>
      )}
    </CardPro>
  );
};

export default UserUsagePage;

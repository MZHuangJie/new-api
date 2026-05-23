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
import { Table, Typography } from '@douyinfe/semi-ui';
import { renderNumber, renderQuota } from '../../../helpers';

const { Text } = Typography;

const UserUsageTable = ({ modelsWithPercent, loading, hasQueried, t }) => {
  const columns = useMemo(
    () => [
      {
        title: t('模型'),
        dataIndex: 'model_name',
        render: (text) => text || '-',
      },
      {
        title: t('调用次数'),
        dataIndex: 'count',
        render: (text) => renderNumber(text),
      },
      {
        title: t('输入 Token'),
        dataIndex: 'prompt_tokens',
        render: (text) => renderNumber(text),
      },
      {
        title: t('输出 Token'),
        dataIndex: 'completion_tokens',
        render: (text) => renderNumber(text),
      },
      {
        title: t('总 Token'),
        dataIndex: 'token_used',
        render: (text) => renderNumber(text),
      },
      {
        title: t('消耗金额'),
        dataIndex: 'quota',
        render: (text) => renderQuota(text),
      },
      {
        title: t('次数占比'),
        dataIndex: 'countPercent',
        render: (text) => `${text}%`,
      },
      {
        title: t('金额占比'),
        dataIndex: 'quotaPercent',
        render: (text) => `${text}%`,
      },
    ],
    [t],
  );

  if (!hasQueried) {
    return null;
  }

  return (
    <div>
      <div className='mb-3'>
        <Text strong>{t('模型用量明细')}</Text>
      </div>
      <Table
        columns={columns}
        dataSource={modelsWithPercent}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.model_name || 'unknown'}
        size='small'
        bordered
      />
    </div>
  );
};

export default UserUsageTable;

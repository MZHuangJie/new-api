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
import { Card, Skeleton, Tag } from '@douyinfe/semi-ui';
import { renderNumber, renderQuota } from '../../../helpers';
import { CARD_PROPS } from '../../../constants/dashboard.constants';

const UserUsageSummary = ({ summary, loading, hasQueried, t }) => {
  if (!hasQueried) {
    return null;
  }

  const placeholder = (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {[1, 2, 3].map((key) => (
        <Skeleton.Title key={key} style={{ width: '100%', height: 72 }} />
      ))}
    </div>
  );

  return (
    <Skeleton loading={loading} active placeholder={placeholder}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        <Card {...CARD_PROPS} className='!rounded-2xl'>
          <div className='text-sm text-gray-500 mb-1'>{t('总 Token 消耗')}</div>
          <div className='text-2xl font-semibold'>
            {renderNumber(summary.token_used || 0)}
          </div>
          <div className='text-xs text-gray-400 mt-2'>
            {t('输入')}: {renderNumber(summary.prompt_tokens || 0)} / {t('输出')}:{' '}
            {renderNumber(summary.completion_tokens || 0)}
          </div>
        </Card>

        <Card {...CARD_PROPS} className='!rounded-2xl'>
          <div className='text-sm text-gray-500 mb-1'>{t('总消耗金额')}</div>
          <div className='text-2xl font-semibold'>
            {renderQuota(summary.quota || 0)}
          </div>
        </Card>

        <Card {...CARD_PROPS} className='!rounded-2xl'>
          <div className='text-sm text-gray-500 mb-1'>{t('总调用次数')}</div>
          <div className='text-2xl font-semibold'>
            {renderNumber(summary.count || 0)}
          </div>
          {summary.username && (
            <Tag color='blue' className='mt-2'>
              {summary.username}
            </Tag>
          )}
        </Card>
      </div>
    </Skeleton>
  );
};

export default UserUsageSummary;

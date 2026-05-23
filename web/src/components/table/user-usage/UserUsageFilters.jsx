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
import { Button, Form } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { DATE_RANGE_PRESETS } from '../../../constants/console.constants';
import UserSearchSelect from './UserSearchSelect';

const UserUsageFilters = ({
  formInitValues,
  setFormApi,
  fetchUsage,
  selectedUser,
  handleUserChange,
  loading,
  t,
}) => {
  return (
    <Form
      initValues={formInitValues}
      getFormApi={(api) => setFormApi(api)}
      onSubmit={fetchUsage}
      allowEmpty={true}
      autoComplete='off'
      layout='vertical'
      trigger='change'
      stopValidateWithError={false}
    >
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          <Form.Slot label={t('用户')}>
            <UserSearchSelect
              value={selectedUser?.id ?? null}
              selectedUser={selectedUser}
              onChange={handleUserChange}
              t={t}
            />
          </Form.Slot>

          <div className='col-span-1 lg:col-span-2'>
            <Form.DatePicker
              field='dateRange'
              label={t('时间范围')}
              className='w-full'
              type='dateTimeRange'
              placeholder={[t('开始时间'), t('结束时间')]}
              showClear
              size='small'
              presets={DATE_RANGE_PRESETS.map((preset) => ({
                text: t(preset.text),
                start: preset.start(),
                end: preset.end(),
              }))}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            htmlType='submit'
            theme='solid'
            type='primary'
            icon={<IconSearch />}
            loading={loading}
            size='small'
          >
            {t('查询')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default UserUsageFilters;

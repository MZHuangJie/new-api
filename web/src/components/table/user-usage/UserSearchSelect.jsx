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

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Select } from '@douyinfe/semi-ui';
import { API } from '../../../helpers';

const UserSearchSelect = ({ value, selectedUser, onChange, t }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimerRef = useRef(null);

  const optionList = useMemo(() => {
    const list = options.map((user) => ({
      label: `${user.username} (ID: ${user.id})`,
      value: user.id,
      user,
    }));

    if (
      selectedUser?.id &&
      !list.some((item) => item.value === selectedUser.id)
    ) {
      list.unshift({
        label: `${selectedUser.username} (ID: ${selectedUser.id})`,
        value: selectedUser.id,
        user: selectedUser,
      });
    }

    return list;
  }, [options, selectedUser]);

  const searchUsers = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/api/user/search?keyword=${encodeURIComponent(keyword || '')}&group=&p=0&page_size=20`,
      );
      if (res.data.success) {
        setOptions(res.data.data?.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (inputValue) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      searchUsers(inputValue);
    }, 300);
  };

  const handleChange = (userId) => {
    const matched =
      optionList.find((item) => item.value === userId)?.user ||
      (selectedUser?.id === userId ? selectedUser : null);
    onChange(matched);
  };

  return (
    <Select
      className='w-full'
      filter
      remote
      value={value}
      placeholder={t('请选择用户')}
      optionList={optionList}
      loading={loading}
      onSearch={handleSearch}
      onChange={handleChange}
      onFocus={() => {
        if (options.length === 0) {
          searchUsers('');
        }
      }}
      showClear
      size='small'
    />
  );
};

export default UserSearchSelect;

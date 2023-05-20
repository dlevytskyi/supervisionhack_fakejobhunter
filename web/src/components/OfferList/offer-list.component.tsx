import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OfferDto {
  id: BigInteger;
  title: string;
  url: string;
  content: string;
  date: Date;
}

const columns: ColumnsType<OfferDto> | null = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Offer Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Content',
    key: 'content',
    dataIndex: 'content',
  },
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'date',
  },
];

// const data: DataType[] = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
// ];

const OfferList: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/offers')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return <Table columns={columns} dataSource={data} />;
};

export default OfferList;

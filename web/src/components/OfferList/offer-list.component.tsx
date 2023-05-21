import React, { useEffect, useState } from 'react';
import { Button, Dropdown, MenuProps, Modal, PaginationProps, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './offer-list.styles.css';

interface OfferDto {
  id: BigInteger;
  title: string;
  url: string;
  content: any;
  model_decision: string;
  analyst_decision: string;
  date: Date;
}

const columns: ColumnsType<OfferDto> | null = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <a>{id}</a>,
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
    title: 'Model Decision',
    dataIndex: 'model_decision',
    key: 'model_decision',
    render: (model_decision) => <Tag>{model_decision || 'NONE'}</Tag>,
  },
  {
    title: 'Analyst Decision',
    dataIndex: 'analyst_decision',
    key: 'analyst_decision',
    render: (analyst_decision) => <Tag>{analyst_decision || 'NONE'}</Tag>,
  },
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'date',
    render: (date) => new Date(date).toLocaleDateString(),
  },
];

const decisionStatuses: MenuProps['items'] = [
  {
    key: '1',
    label: 'POSITIVE',
  },
  {
    key: '0',
    label: 'NEGATIVE',
  },
];

const OfferList: React.FC = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OfferDto | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const successUpdateAnalystNotificationMsg = () => {
    console.log('success', 'Analyst decision updated successfully');
    messageApi.open({
      type: 'success',
      content: 'Analyst decision updated successfully',
    });
  };

  const errorUpdateAnalystNotificationMsg = () => {
    messageApi.open({
      type: 'error',
      content: 'Error during updating analyst decision',
    });
  };

  const getOffers = () => {
    fetch(
      'http://localhost:3000/offers?' + new URLSearchParams({ page: '' + current, limit: '10' })
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        setTotal(data.total);
      });
  };

  const updateOfferDecision = () => {
    fetch(`http://localhost:3000/offers/${selectedRecord?.id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision: selectedRecord?.analyst_decision }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.text())
      .then((data) => {
        successUpdateAnalystNotificationMsg();
      })
      .catch((err) => {
        errorUpdateAnalystNotificationMsg();
      });
  };

  useEffect(() => {
    console.log('useEffect');
    getOffers();
  }, []);

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('onChange:', pageNumber);
    setCurrent(pageNumber);
    getOffers();
  };

  const showModal = (record: OfferDto | null) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleChangeDecisionStatus = () => {
    setIsModalOpen(false);
    updateOfferDecision();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDecisionStatusClick: MenuProps['onClick'] = (e) => {
    if (selectedRecord) {
      selectedRecord.analyst_decision = e.key === '1' ? 'POSITIVE' : 'NEGATIVE';
      setSelectedRecord({ ...selectedRecord });
    }
  };

  return (
    <>
      {contextHolder}
      <Table
        style={{ width: '100%' }}
        columns={columns}
        dataSource={data}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          total,
          onChange,
          showSizeChanger: false,
        }}
        rowKey={(record) => String(record.id)}
        onRow={(record) => {
          return {
            onClick: () => {
              showModal(record);
            },
          };
        }}
        rowClassName={(record, index) => 'offer-row'}
      />
      <Modal
        title={selectedRecord?.title}
        open={isModalOpen}
        onOk={handleChangeDecisionStatus}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={handleChangeDecisionStatus}>
            Change decision
          </Button>,
        ]}
        style={{ minWidth: '50%' }}
      >
        {' '}
        <h4 style={{ marginBottom: 0 }}>Description:</h4>
        <p style={{ margin: 0 }}>{selectedRecord?.content?.content}</p>
        <h4 style={{ marginBottom: 0 }}>URL:</h4>
        <a href={selectedRecord?.url}>{selectedRecord?.url}</a>
        <h4 style={{ marginBottom: 0 }}>DecisionStatus:</h4>
        <Dropdown
          menu={{ items: decisionStatuses, onClick: handleDecisionStatusClick }}
          placement="bottomLeft"
          // disabled={selectedRecord?.analyst_decision === 'NONE'}
        >
          <Button>{selectedRecord?.analyst_decision || 'NONE'}</Button>
        </Dropdown>
      </Modal>
    </>
  );
};

export default OfferList;

import { Descriptions, Row, Col, Button, message, Spin } from 'antd';
import React, { useState } from 'react';

const Scrapper: React.FC = () => {
  const [isScrapperRunning, setIsScrapperRunning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const successScrapped = () => {
    console.log('success', 'Analyst decision updated successfully');
    messageApi.open({
      type: 'success',
      content: 'Scrapper finished successfully',
    });
  };

  const errorScrapped = () => {
    messageApi.open({
      type: 'error',
      content: 'Error while scrapping',
    });
  };

  const startScrapper = () => {
    setIsScrapperRunning(true);
    fetch('http://localhost:3000/scrapper/offers')
      .then((response) => response.text())
      .then((data) => {
        setIsScrapperRunning(false);
        successScrapped();
      })
      .catch((err) => {
        setIsScrapperRunning(false);
        errorScrapped();
      });
  };

  return (
    <>
      {contextHolder}
      <Row align="middle" justify="center" style={{ marginTop: '24px' }}>
        <Col span={8}>
          <Descriptions title="Scrapper Info">
            <Descriptions.Item label="Websites">OLX, OGLOSZENIA24, SPRZEDAJEMY</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row align="middle" justify="center" style={{ marginTop: '10px' }}>
        <Button onClick={startScrapper}>Run Scrapper</Button>
      </Row>
      <Row align="middle" justify="center" style={{ marginTop: '10px' }}>
        {isScrapperRunning && <Spin size="large" />}
      </Row>
    </>
  );
};

export default Scrapper;

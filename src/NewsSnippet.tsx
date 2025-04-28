// NewsSnippet.tsx
import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import {
  GlobalOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { IData_SnippetNews, IData_TagItem } from './interfaces';
import './NewsSnippet.scss';
import Link from 'antd/es/typography/Link';

const { Text, Title } = Typography;

const FranceFlag: React.FC = () => (
  <svg className="flag-icon" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
    <rect width="1" height="2" fill="#0055A4" />
    <rect x="1" width="1" height="2" fill="#fff" />
    <rect x="2" width="1" height="2" fill="#EF4135" />
  </svg>
);

interface NewsSnippetProps {
  data: IData_SnippetNews;
}

const renderHighlights = (highlights: string[]): React.ReactNode =>
  highlights.map((item, idx) => {
    const parts = item.split(/(<kw>.*?<\/kw>)/g).map((part, i) => {
      if (part.startsWith('<kw>') && part.endsWith('</kw>')) {
        const inner = part.slice(4, -5);
        return (
          <span className="highlight" key={`kw-${idx}-${i}`}>
            {inner}
          </span>
        );
      }
      return <React.Fragment key={`txt-${idx}-${i}`}>{part}</React.Fragment>;
    });
    return (
      <p className="ellipsis-text" key={`hl-${idx}`}>
        {parts}
      </p>
    );
  });

const NewsSnippet: React.FC<NewsSnippetProps> = ({ data }) => {
  const {
    TI, AB, URL, DOM, DP, LANG,
    REACH, KW, CNTR, CNTR_CODE, AU,
    SENT, TRAFFIC, FAV, HIGHLIGHTS,
  } = data;

  moment.locale(LANG || 'en');
  const day = moment(DP).format('D');
  const restDate = moment(DP).format(' MMM YYYY');
  const sentimentColor =
    SENT === 'positive' ? 'green'
      : SENT === 'negative' ? 'red'
      : 'gray';

  return (
    <Card className="news-snippet">
      <div className="news-header">
        <Space style={{ width: '100%', justifyContent: 'space-between' }} size="small">
          <Space size="small" align="center">
            <Text className="date"><span className="white-number">{day}</span>{restDate}</Text>
            <Text className="reach"><span className="white-number">{REACH}</span> Reach</Text>
            <Text className="traffic">
              Top Traffic:
              {TRAFFIC.map((t, i) => (
                <React.Fragment key={i}>
                  {' '}<span>{t.value}</span>{' '}
                  <span className="white-number">{Math.round(t.count * 1000) / 10}%</span>
                </React.Fragment>
              ))}
            </Text>
          </Space>
          <Tag color={sentimentColor}>{SENT}</Tag>
        </Space>
      </div>

      <Title level={5} style={{ marginTop: '10px' , fontWeight: '400'}}>
       <Link href={URL}  style={{ fontSize: '18px' }} target="_blank" rel="noopener noreferrer">{TI}</Link>
      </Title>

      <div className="news-source">
        <span className="source-item">
          <GlobalOutlined src={FAV} size={18} /> 
          <Link strong href={URL} target="_blank" rel="noopener noreferrer">{DOM}</Link>
        </span>
        <span className="source-item">
          <FranceFlag />
          <Text className="country">{CNTR}</Text>
        </span>
        <span className="source-item">
          <TranslationOutlined />
          <Text className="lang">{CNTR_CODE}</Text>
        </span>
        <span className="source-item">
          <UserOutlined />
          <Text className="author">{AU}</Text>
        </span>
      </div>

      <div className="news-body">
        {HIGHLIGHTS?.length
          ? renderHighlights(HIGHLIGHTS)
          : <p className="ellipsis-text">{AB}</p>}
      </div>

      <div className="news-tags">
        <Space wrap size={[0, 8]}>
          {KW.map((tag: IData_TagItem) => (
            <Tag key={tag.value}>
              {tag.value} <span>{tag.count}</span>
            </Tag>
          ))}
        </Space>
      </div>
    </Card>
  );
};

export default NewsSnippet;

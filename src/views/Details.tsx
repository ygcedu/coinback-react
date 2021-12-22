import Layout from '../components/Layout';
import React, {useState} from 'react';
import {CategorySection} from './Money/CategorySection';
import styled from 'styled-components';
import {RecordItem, useRecords} from '../hooks/useRecords';
import {useTags} from '../hooks/useTags';
import day from 'dayjs';
import Icon from '../components/Icon';

const CategoryWrapper = styled.div`
  background: white;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  background: white;
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;

  > .note {
    margin-right: auto;
    margin-left: 16px;
    color: #999;
  }

  > .tag,
  > .note,
  > .amount {
    display: flex;
    align-items: center;
  }

  > .tag {
    justify-content: center;
    width: 1.8em;
    height: 1.8em;
    border-radius: 50%;
    background: #ffda44;
  }
`;

const Header = styled.h3`
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
`;

function Details() {
  const [category, setCategory] = useState<'-' | '+'>('-');
  const {records} = useRecords();
  const {getName} = useTags();
  const hash: { [K: string]: RecordItem[] } = {};
  const selectedRecords = records.filter(r => r.category === category);

  selectedRecords.forEach(r => {
    const key = day(r.createdAt).format('YYYY年MM月DD');
    if (!(key in hash)) {
      hash[key] = [];
    }
    hash[key].push(r);
  });

  // Object.entries 把对象变成数组
  const array = Object.entries(hash).sort((a, b) => {
    if (a[0] === b[0]) return 0;
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });

  return (
    <Layout>
      <CategoryWrapper>
        <CategorySection value={category}
                         onChange={value => setCategory(value)}/>
      </CategoryWrapper>
      {array.map(([date, records], i) =>
        <div key={i}>
          <Header>{date}</Header>
          <div>
            {records.map((r, index) => {
              return <Item key={index}>
                <div className="tag">
                  <Icon name={getName(r.tagId)} size={24}/>
                </div>
                {r.note && <div className="note">
                  {r.note}
                </div>}
                <div className="amount">￥{r.amount}</div>
              </Item>;
            })}
          </div>
        </div>)}
    </Layout>
  );
}

export default Details;
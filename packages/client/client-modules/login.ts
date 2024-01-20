import { gql } from '@apollo/client';

const GET_USER_INFO = gql(/* GraphQL */ `
  query GetRocketInventory {
    tableMap {
      id
      model
      year
      stock
    }
  }
`);

//假设我有两个表格tableA，tableB
//
//每次保存的时候会将两个tableA，tableB合并

const tableA = `  
      year
      stock

`;
const tableB = ` 
      id
      model
`;
const GET_USER_INFO = gql(/* GraphQL */ `
  query GetRocketInventory {
    tableMap {
      ${tableA}
      ${tableB}
    }
  }
`);

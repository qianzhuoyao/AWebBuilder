//获取，合并，处理，分发
//请求,响应，
/**
 * useQueryByCommand/useMutationByCommand/useSubscriptionByCommand/
 * 收到命令-》执行命令-》收到结果-》分配结果
 * 创建模块并生效
 * const server = useClient(blockId)
 *
 *
 */
export * from './login';
import {
  ApolloClient,
  ApolloError,
  DocumentNode,
  InMemoryCache,
  OperationVariables,
  useLazyQuery,
  useQuery,
} from '@apollo/client';

export const client = (uri: string, other: { [k: string]: any }) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: uri,
    ...other,
  });

interface IClientQuery<T> {
  gql: DocumentNode;
  variables: T;
  onCompleted: (data: any) => void;
  onError: (error: ApolloError) => void;
}

/**
 * 触发请求
 * @param params
 */
export const useClientQuery = <T extends OperationVariables | undefined>(
  params: IClientQuery<T>
) => {
  const { gql, variables, onCompleted, onError } = params;
  return useQuery(gql, { variables, onCompleted, onError });
};

export const useLazyByEventQuery = <T extends OperationVariables | undefined>(
  params: IClientQuery<T>
) => {
  const { gql, variables, onCompleted, onError } = params;
  return useLazyQuery(gql, { variables, onCompleted, onError });
};

export { ApolloConsumer, ApolloProvider } from '@apollo/client';

import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '<URL_OF_YOUR_GRAPHQL_API>',
  documents: ['modules/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;

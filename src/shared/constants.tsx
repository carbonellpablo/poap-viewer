const api = {
  graphql: {
    xdai: process.env.REACT_APP_POAP_API_GRAPHQL_XDAI_URL as string,
    eth: process.env.REACT_APP_POAP_API_GRAPHQL_ETH_URL as string,
  },
  rest: process.env.REACT_APP_POAP_API_REST_URL as string,
};

const ens = {
  infura: {
    projectID: process.env.REACT_APP_POAP_ENS_INFURA_PROJECTID as string,
    key: process.env.REACT_APP_POAP_ENS_INFURA_KEY as string,
  },
};

export { api, ens };

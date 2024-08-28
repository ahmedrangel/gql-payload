import { GqlPayloadOptions } from "./";

export interface IMutationAdapter {
  mutationBuilder: () => { variables: any, query: string };
  mutationsBuilder: (options: GqlPayloadOptions[]) => {
    variables: any;
    query: string;
  };
}

export interface IQueryAdapter {
  queryBuilder: () => { variables: any, query: string };
  queriesBuilder: (options: GqlPayloadOptions[]) => {
    variables: any;
    query: string;
  };
}

export interface ISubscriptionAdapter {
  subscriptionBuilder: () => { variables: any, query: string };
  subscriptionsBuilder: (options: GqlPayloadOptions[]) => {
    variables: any;
    query: string;
  };
}
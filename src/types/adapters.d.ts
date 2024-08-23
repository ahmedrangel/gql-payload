import { IQueryBuilderOptions } from "./";

export interface IMutationAdapter {
  mutationBuilder: () => { variables: any, query: string };
  mutationsBuilder: (options: IQueryBuilderOptions[]) => {
    variables: any;
    query: string;
  };
}

export interface IQueryAdapter {
  queryBuilder: () => { variables: any, query: string };
  queriesBuilder: (options: IQueryBuilderOptions[]) => {
    variables: any;
    query: string;
  };
}

export interface ISubscriptionAdapter {
  subscriptionBuilder: () => { variables: any, query: string };
  subscriptionsBuilder: (options: IQueryBuilderOptions[]) => {
    variables: any;
    query: string;
  };
}
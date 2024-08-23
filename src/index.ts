import adapters from "./adapters";
import DefaultMutationAdapter from "./adapters/DefaultMutationAdapter";
import DefaultQueryAdapter from "./adapters/DefaultQueryAdapter";
import DefaultSubscriptionAdapter from "./adapters/DefaultSubscriptionAdapter";
import type { Config, IQueryBuilderOptions } from "./types";
import type { IMutationAdapter, IQueryAdapter, ISubscriptionAdapter } from "./types/adapters";

export const { DefaultAppSyncQueryAdapter, DefaultAppSyncMutationAdapter } = adapters;
export const gqlQuery = (
  options: IQueryBuilderOptions | IQueryBuilderOptions[],
  config?: Config | null,
  adapter?: any
) => {
  let defaultAdapter: IQueryAdapter;
  if (Array.isArray(options)) {
    if (adapter) {
      const customAdapter: IQueryAdapter = new adapter(options, config);
      return customAdapter.queriesBuilder(options);
    }
    defaultAdapter = new DefaultQueryAdapter(options, config);
    return defaultAdapter.queriesBuilder(options);
  }
  if (adapter) {
    const customAdapter: IQueryAdapter = new adapter(options, config);
    return customAdapter.queryBuilder();
  }
  defaultAdapter = new DefaultQueryAdapter(options, config);
  return defaultAdapter.queryBuilder();
};

export const gqlMutation = (
  options: IQueryBuilderOptions | IQueryBuilderOptions[],
  config?: Config | null,
  adapter?: IMutationAdapter
) => {
  let customAdapter: IMutationAdapter;
  let defaultAdapter: IMutationAdapter;
  if (Array.isArray(options)) {
    if (adapter) {
      // @ts-ignore
      customAdapter = new adapter(options, config);
      return customAdapter.mutationsBuilder(options);
    }
    defaultAdapter = new DefaultMutationAdapter(options, config);
    return defaultAdapter.mutationsBuilder(options);
  }
  if (adapter) {
    // @ts-ignore
    customAdapter = new adapter(options, config);
    return customAdapter.mutationBuilder();
  }
  defaultAdapter = new DefaultMutationAdapter(options, config);
  return defaultAdapter.mutationBuilder();
};

export const gqlSubscription = (
  options: IQueryBuilderOptions | IQueryBuilderOptions[],
  adapter?: ISubscriptionAdapter
) => {
  let customAdapter: ISubscriptionAdapter;
  let defaultAdapter: ISubscriptionAdapter;
  if (Array.isArray(options)) {
    if (adapter) {
      // @ts-ignore
      customAdapter = new adapter(options);
      return customAdapter.subscriptionsBuilder(options);
    }
    defaultAdapter = new DefaultSubscriptionAdapter(options);
    return defaultAdapter.subscriptionsBuilder(options);
  }
  if (adapter) {
    // @ts-ignore
    customAdapter = new adapter(options);
    return customAdapter.subscriptionBuilder();
  }
  defaultAdapter = new DefaultSubscriptionAdapter(options);
  return defaultAdapter.subscriptionBuilder();
};
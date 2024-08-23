export interface Variables {
  type?: string;
  name?: string;
  value: any;
  list?: boolean | [boolean];
  required?: boolean;
}

export type VariableOptions = Variables | { [k: string]: any };

export interface IOperation {
  name: string;
  alias: string;
}

export interface Fields extends Array<string | object | NestedOptions> {}

export interface IQueryBuilderOptions {
  operation: string | IOperation /* Operation name */;
  fields?: Fields /* Selection of fields to be returned by the operation */;
  variables?: VariableOptions;
  /* VariableOptions Interface or regular single key object */
}

export interface NestedOptions {
  operation: string;
  variables: IQueryBuilderOptions[];
  fields: Fields;
  inlineFragment?: boolean | null;
  namedFragment?: boolean | null;
}

export type FragmentFields = Array<string | { [key: string]: FragmentFields }>;

export interface Config {
  operationName?: string;
  fragment?: {
    name: string;
    on: string;
    fields: FragmentFields;
  }[];
}
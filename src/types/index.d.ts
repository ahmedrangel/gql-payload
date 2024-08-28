export interface VariablesProps {
  type?: string;
  name?: string;
  value: any;
  list?: boolean | [boolean];
  required?: boolean;
}

export type VariablesOption = { [k: string]: VariablesProps } | { [k: string]: any };

export interface OperationOption {
  name: string;
  alias: string;
}

export interface FieldsOption extends Array<string | object | NestedOptions> {}

export interface GqlPayloadOptions {
  operation: string | OperationOption /* Operation name */;
  fields?: FieldsOption /* Selection of fields to be returned by the operation */;
  variables?: VariablesOption;
  /* VariablesOption Interface or regular single key object */
}

export interface NestedOptions {
  operation: string;
  variables: VariablesOption;
  fields: FieldsOption;
  inlineFragment?: boolean | null;
  namedFragment?: boolean | null;
}

export type FragmentFields = string | { [key: string]: string[] };

export interface FragmentsConfig {
  name: string;
  on: string;
  fields: FragmentFields[];
}

export interface GqlPayloadConfig {
  operationName?: string;
  fragments?: FragmentsConfig[];
}
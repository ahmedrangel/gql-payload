import type { IQueryBuilderOptions, IOperation, Fields, Config, VariableOptions } from "../types";
import { ISubscriptionAdapter } from "../types/adapters";
import { OperationType } from "../enums";
import { getNestedVariables, queryDataNameAndArgumentMap, queryDataType, queryFieldsMap, queryVariablesMap, resolveVariables } from "../utils/helpers";

export default class DefaultSubscriptionAdapter implements ISubscriptionAdapter {
  private variables: any;
  private fields: Fields;
  private operation!: string | IOperation;
  private config: Config;

  constructor (
    options: IQueryBuilderOptions | IQueryBuilderOptions[],
    configuration?: Config
  ) {
    // Default configs
    this.config = {
      operationName: "",
      fragments: []
    };
    if (configuration) {
      for (const [key, value] of Object.entries(configuration)) {
        this.config[key] = value;
      }
    }

    if (Array.isArray(options)) {
      this.variables = resolveVariables(options);
    }
    else {
      this.variables = options.variables;
      this.fields = options.fields || [];
      this.operation = options.operation;
    }
  }

  public subscriptionBuilder () {
    return this.operationWrapperTemplate(this.operationTemplate(this.variables));
  }

  public subscriptionsBuilder (subscriptions: IQueryBuilderOptions[]) {
    const content = () => {
      const tmpl: string[] = [];
      for (const subscription of subscriptions) {
        if (subscription) {
          this.operation = subscription.operation;
          this.fields = subscription.fields;
          tmpl.push(this.operationTemplate(subscription.variables));
        }
      }
      return tmpl.join(" ");
    };
    return this.operationWrapperTemplate(content());
  }

  private queryDataArgumentAndTypeMap (): string {
    let variablesUsed: { [key: string]: unknown } = this.variables;

    if (this.fields && typeof this.fields === "object") {
      variablesUsed = {
        ...getNestedVariables(this.fields),
        ...variablesUsed
      };
    }
    return variablesUsed && Object.keys(variablesUsed).length > 0? `(${Object.keys(variablesUsed).reduce(
      (dataString, key, i) =>
        `${dataString}${i !== 0 ? ", " : ""}$${key}: ${queryDataType(variablesUsed[key]
        )}`,
      ""
    )})`: "";
  }

  // start of subscription building
  private operationWrapperTemplate (content: string) {
    let query = `${OperationType.Subscription} ${this.queryDataArgumentAndTypeMap()} { ${content} }`;

    if (this.config.operationName) {
      query = query.replace("subscription", `subscription ${this.config.operationName}`);
    }

    if (this.config.fragments.length && Array.isArray(this.config.fragments)) {
      const fragmentsArray = [];
      for (const fragment of this.config.fragments) {
        fragmentsArray.push(`fragment ${fragment.name} on ${fragment.on} { ${queryFieldsMap(fragment.fields)} }`);
      }
      query = `${query} ${fragmentsArray.join(" ")}`;
    }

    return {
      query: query.replace(/\n+/g, "").replace(/ +/g, " "),
      variables: queryVariablesMap(this.variables, this.fields)
    };
  }

  private operationTemplate (variables: VariableOptions | undefined) {
    const operation =
      typeof this.operation === "string"? this.operation: `${this.operation.alias}: ${this.operation.name}`;

    return `${operation} ${variables ? queryDataNameAndArgumentMap(variables) : ""} ${
      this.fields && this.fields.length > 0 ? `{ ${queryFieldsMap(this.fields)} }`: ""
    }`;
  }
}

import type { GqlPayloadOptions, OperationOption, FieldsOption, GqlPayloadConfig, VariablesOption } from "../types";
import { IQueryAdapter } from "../types/adapters";
import { OperationType } from "../enums";
import { getNestedVariables, queryDataNameAndArgumentMap, queryDataType, queryFieldsMap, queryVariablesMap, resolveVariables } from "../utils/helpers";

export default class DefaultQueryAdapter implements IQueryAdapter {
  private variables: any;
  private fields: FieldsOption;
  private operation!: string | OperationOption;
  private config: GqlPayloadConfig;

  constructor (
    options: GqlPayloadOptions | GqlPayloadOptions[],
    configuration?: GqlPayloadConfig
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
  // kicks off building for a single query
  public queryBuilder () {
    return this.operationWrapperTemplate(this.operationTemplate(this.variables));
  }
  // if we have an array of options, call this
  public queriesBuilder (queries: GqlPayloadOptions[]) {
    const content = () => {
      const tmpl: string[] = [];
      for (const query of queries) {
        if (query) {
          this.operation = query.operation;
          this.fields = query.fields;
          tmpl.push(this.operationTemplate(query.variables));
        }
      }
      return tmpl.join(" ");
    };
    return this.operationWrapperTemplate(content());
  }

  // Convert object to argument and type map. eg: ($id: Int)
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

  private operationWrapperTemplate (content: string) {
    let query = `${OperationType.Query} ${this.queryDataArgumentAndTypeMap()} { ${content} }`;

    if (this.config.operationName) {
      query = query.replace("query", `query ${this.config.operationName}`);
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

  // query
  private operationTemplate (variables: VariablesOption | undefined) {
    const operation =
      typeof this.operation === "string"? this.operation: `${this.operation.alias}: ${this.operation.name}`;

    return `${operation} ${variables ? queryDataNameAndArgumentMap(variables) : ""} ${
      this.fields && this.fields.length > 0 ? `{ ${queryFieldsMap(this.fields)} }`: ""
    }`;
  }
}

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * TypeScript interface describing a Universal Reference YAML documentation file,
 * as defined by typescript.schema.json.
 */
export interface IYamlApiFile {
  items: IYamlItem[];
  references?: IYamlReference[];
}

export interface IYamlDeprecatedNotice {
  content: string;
}

/**
 * Part of the IYamlApiFile structure.  Used to document exceptions that can be thrown
 * by a method, property, function, or constructor.
 */
export interface IYamlException {
  description?: string;
  tupe?: string;
}

/**
 * Part of the IYamlApiFile structure.  Represents the type of an IYamlItem.
 */
export type YamlTypeId = 'class' | 'constructor' | 'enum' | 'field' | 'function' | 'interface'
  | 'method' | 'package' | 'property' | 'event' | 'typealias' | 'variable';

/**
 * Part of the IYamlApiFile structure.  Represents basic API elements such as
 * classes, interfaces, members, etc.
 */
export interface IYamlItem {
  type: YamlTypeId;

  children?: string[];
  deprecated?: IYamlDeprecatedNotice;
  exceptions?: IYamlException[];
  extends?: string[];
  fullName?: string;
  implements?: string[];
  isPreview?: boolean;
  langs?: string[];
  name?: string;
  /**
   * NOTE: In TypeScript, enum members can be strings or integers.
   * If it is an integer, then enumMember.value will be a string representation of the integer.
   * If it is a string, then enumMember.value will include the quotation marks.
   */
  numericValue?: string;
  package?: string;
  source?: IYamlSource;
  summary?: string;
  remarks?: string;
  syntax?: IYamlSyntax;
  cljava?: object;
  clhtml?: object;
  importd?: object;
  uid: string;
}

/**
 * Part of the IYamlApiFile structure.  Represents a method or function parameter.
 */
export interface IYamlParameter {
  description?: string;
  id?: string;
  type?: string[];
}

/**
 * Part of the IYamlApiFile structure.  Represents a reference to an item that is
 * declared in a separate YAML file.
 */
export interface IYamlReference {
  uid?: string;
  name?: string;
  fullName?: string;
  'spec.typeScript'?: IYamlReferenceSpec[];
}

/**
 * Part of the IYamlApiFile structure.  Represents a text specification for a reference.
 */
export interface IYamlReferenceSpec {
  uid?: string;
  name?: string;
  fullName?: string;
}

/**
 * Part of the IYamlApiFile structure.  Indicates the open source Git repository
 * where an IYamlItem is defined.
 */
export interface IYamlRemote {
  branch?: string;
  path?: string;
  repo?: string;
}

/**
 * Part of the IYamlApiFile structure.  Documents the return value of a function
 * or method.
 */
export interface IYamlReturn {
  description?: string;
  type?: string[];
}

/**
 * Part of the IYamlApiFile structure.  Documents the source file where an IYamlItem is defined.
 */
export interface IYamlSource {
  id?: string;
  path?: string;
  remote?: IYamlRemote;
  startLine?: number;
}

/**
 * Part of the IYamlApiFile structure.  Documents the type signature for an IYamlItem.
 */
export interface IYamlSyntax {
  content?: string;
  parameters?: IYamlParameter[];
  typeParameters?: IYamlParameter[];
  return?: IYamlReturn;
}

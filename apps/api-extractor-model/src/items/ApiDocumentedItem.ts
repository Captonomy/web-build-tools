// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as tsdoc from '@microsoft/tsdoc';
import { ApiItem, IApiItemOptions, IApiItemJson } from './ApiItem';
import { AedocDefinitions } from '../aedoc/AedocDefinitions';
import { DeserializerContext } from '../model/DeserializerContext';
import {StringBuilder, TSDocEmitter} from "@microsoft/tsdoc";

/**
 * Constructor options for {@link ApiDocumentedItem}.
 * @public
 */
export interface IApiDocumentedItemOptions extends IApiItemOptions {
  docComment: tsdoc.DocComment | undefined;
  cljava?: {
    differs?: boolean,
    notexists?: boolean,
    text: string
  };
  clhtml?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };
  importd?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };
}

export interface IApiDocumentedItemJson extends IApiItemJson {
  docComment: string;
  cljava?: {
    differs?: boolean,
    notexists?: boolean,
    text: string
  };
  clhtml?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };
  importd?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };
}

/**
 * An abstract base class for API declarations that can have an associated TSDoc comment.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * @public
 */
export class ApiDocumentedItem extends ApiItem {
  private _tsdocComment: tsdoc.DocComment | undefined;
  cljava?: {
    differs?: boolean,
    notexists?: boolean,
    text: string
  };
  clhtml?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };
  importd?: {
    differs?: boolean;
    notexists?: boolean;
    text: string;
  };

  /** @override */
  public static onDeserializeInto(options: Partial<IApiDocumentedItemOptions>, context: DeserializerContext,
    jsonObject: IApiItemJson): void {

    super.onDeserializeInto(options,  context, jsonObject);

    const documentedJson: IApiDocumentedItemJson = jsonObject as IApiDocumentedItemJson;

    if (documentedJson.docComment) {
      const tsdocParser: tsdoc.TSDocParser = new tsdoc.TSDocParser(AedocDefinitions.tsdocConfiguration);

      // NOTE: For now, we ignore TSDoc errors found in a serialized .api.json file.
      // Normally these errors would have already been reported by API Extractor during analysis.
      // However, they could also arise if the JSON file was edited manually, or if the file was saved
      // using a different release of the software that used an incompatible syntax.
      const parserContext: tsdoc.ParserContext = tsdocParser.parseString(documentedJson.docComment);

      options.docComment = parserContext.docComment;

      options.cljava = documentedJson.cljava;
      options.clhtml = documentedJson.clhtml;
      options.importd = documentedJson.importd;
    }
  }

  public constructor(options: IApiDocumentedItemOptions) {
    super(options);
    this._tsdocComment = options.docComment;
    this.cljava = options.cljava;
    this.clhtml = options.clhtml;
    this.importd = options.importd;
  }

  public get tsdocComment(): tsdoc.DocComment | undefined {
    return this._tsdocComment;
  }

  /** @override */
  public serializeInto(jsonObject: Partial<IApiDocumentedItemJson>): void {
    super.serializeInto(jsonObject);
    if (this.tsdocComment !== undefined) {
      this.imagetrustCustomTags(jsonObject, this.tsdocComment.customBlocks);
      (this.tsdocComment as any)._customBlocks = []; // remove the custom blocks before emitting tsdoc comment
      jsonObject.docComment = this.tsdocComment.emitAsTsdoc();
    } else {
      jsonObject.docComment = '';
    }
  }

  private imagetrustCustomTags(jsonObject, customBlocks): void {
    customBlocks.forEach(block => {
      const stringBuilder = new StringBuilder();
      const emitter = new TSDocEmitter();
      (emitter as any)._renderCompleteObject(stringBuilder, block.content.nodes[0]);
      const tagName = block.blockTag.tagName.substring(1);
      let comment: string = stringBuilder.toString();
      // we do the following substring because .toString produces the text as a js comment like: /** \n * My Comment\n */\n
      comment = comment.substring(7, comment.length - 5);
      switch(tagName) {
        case "cljava":
        case "clhtml":
        case "importd":
          const tagObj: any = {};
          jsonObject[tagName] = tagObj;
          if(comment.indexOf("notexists") >= 0) {
            tagObj.notexists = true;
            comment = comment.substring("notexists ".length);
          } else if (comment.indexOf("differs") >= 0) {
            tagObj.differs = true;
            comment = comment.substring("differs ".length);
          }
          tagObj.text = comment;
          break;
        case "see":
          jsonObject[tagName] = comment;
          break;
        default:
          throw `Custom ImageTrust tag name ${tagName} is not supported properly!!!`;
      }
    });
  }
}

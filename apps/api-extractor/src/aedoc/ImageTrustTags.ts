/**
 * author: kpentaris
 * date: 23-Sep-19
 */
import {TSDocConfiguration, TSDocTagDefinition, TSDocTagSyntaxKind} from '@microsoft/tsdoc';

/**
 * @internal
 */
export class ImageTrustTags {

  public static readonly see: TSDocTagDefinition = new TSDocTagDefinition({
    tagName: '@see',
    syntaxKind: TSDocTagSyntaxKind.BlockTag
  });
  public static readonly clJava: TSDocTagDefinition = new TSDocTagDefinition({
    tagName: '@cljava',
    syntaxKind: TSDocTagSyntaxKind.BlockTag
  });

  public static readonly importD: TSDocTagDefinition = new TSDocTagDefinition({
    tagName: '@importd',
    syntaxKind: TSDocTagSyntaxKind.BlockTag
  });

  public static readonly clHtml: TSDocTagDefinition = new TSDocTagDefinition({
    tagName: '@clhtml',
    syntaxKind: TSDocTagSyntaxKind.BlockTag
  });

  public static addImageTrustTags(tsDocConfig: TSDocConfiguration): void {
    tsDocConfig.addTagDefinitions([
      ImageTrustTags.see,
      ImageTrustTags.clJava,
      ImageTrustTags.importD,
      ImageTrustTags.clHtml
    ], true);
  }

}
import { Node, NodePluginArgs } from 'gatsby'
import { FileSystemNode } from 'gatsby-source-filesystem';

type SharpMethod = 'fluid' | 'fixed' | 'resize';

export interface RemarkNode {
  type: string;
  [key: string]: any;
}

export interface Args extends NodePluginArgs {
  markdownAST: RemarkNode; 
  markdownNode: Node;
  files: FileSystemNode[];
}

export interface SharpResult {
  aspectRatio: number;
  src: string;
  srcSet?: string;
  srcWebp?: string;
  srcSetWebp?: string;
  base64?: string;
  tracedSVG?: string;
  
  // fixed, resize
  width?: number;
  height?: number;

  // fluid
  presentationHeight?: number;
  presentationWidth?: number;
  sizes?: string;
  originalImg?: string;
}


export interface CreateMarkupArgs extends SharpResult {
    sharpMethod: SharpMethod;
    originSrc: string;
    title?: string;
    alt?: string;
}

export interface MarkupOptions {
  loading: 'lazy' | 'eager' | 'auto';
  linkImagesToOriginal: boolean;
  showCaptions: boolean;
  wrapperStyle: string | Function;
  backgroundColor: string;
}

export type CreateMarkup = (args: CreateMarkupArgs, options?: MarkupOptions) => string;

export interface Options extends Partial<MarkupOptions> {
  plugins: unknown[];
  staticDir?: string;
  createMarkup?: CreateMarkup;
  sharpMethod: SharpMethod;
  [key: string]: unknown;
}
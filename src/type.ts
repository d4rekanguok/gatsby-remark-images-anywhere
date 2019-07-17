import { Node, NodePluginArgs } from 'gatsby'
import { FileSystemNode } from 'gatsby-source-filesystem';

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
  size?: string;
}


export interface CreateMarkupArgs extends SharpResult {
    originSrc: string;
    title?: string;
    alt?: string;
}

export type CreateMarkup = (args: CreateMarkupArgs) => string;

export interface Options {
  plugins: unknown[];
  publicDir?: string;
  createMarkup?: CreateMarkup;
  sharpMethod: 'fluid' | 'fixed' | 'resize';
  [key: string]: unknown;
}
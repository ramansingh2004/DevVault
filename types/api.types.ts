export type BlockType = 'heading' | 'paragraph' | 'code' | 'image' | 'link';

// Auth types
export interface UserCreate {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  message: string;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

// Container types
export interface ContainerCreate {
  title: string;
  icon?: string | null;
  parent_id?: string | null;
}

export interface ContainerUpdate {
  title?: string | null;
  icon?: string | null;
  order_index?: number | null;
}

export interface ContainerResponse {
  id: string;
  user_id: string;
  parent_id?: string | null;
  title: string;
  icon?: string | null;
  order_index: number;
  created_at: string;
}

export interface ContainerTreeResponse extends ContainerResponse {
  children: ContainerTreeResponse[];
}

// Block types
export interface BlockMeta {
  [key: string]: unknown;
}

export interface BlockResponse {
  id: string;
  container_id: string;
  type: BlockType;
  content: string;
  meta?: BlockMeta | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBlock {
  type: BlockType;
  content: string;
  order_index: number;
  meta?: BlockMeta | null;
}

export interface CreateBulkBlock {
  container_id: string;
  blocks: CreateBlock[];
}

export interface PatchBlock {
  block_id: string;
  content?: string | null;
  order_index?: number | null;
  meta?: BlockMeta | null;
}

export interface PatchBlocks {
  blocks: PatchBlock[];
}

// Error types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, never>;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

// Enums
export enum BlockTypeEnum {
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  CODE = 'code',
  IMAGE = 'image',
  LINK = 'link',
}
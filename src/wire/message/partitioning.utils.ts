
import { uint32ToBuf, uint64ToBuf } from '../number.utils.js';
import type { ValueOf } from '../../type.utils.js';


export const PartitionKind = {
  Balanced : 1,
  PartitionId : 2,
  MessageKey : 3
} as const;


export type PartitionKind = typeof PartitionKind;
export type PartitionKindId = keyof PartitionKind;
export type PartitionKindValue = ValueOf<PartitionKind>

export type Balanced = {
  kind: PartitionKind['Balanced'],
  value: null
};

export type PartitionId = {
  kind: PartitionKind['PartitionId'],
  value: number // uint32
};

// string | uint32/64/128
export type MessageKeyValue = string | number | bigint | Buffer;

export type MessageKey = {
  kind: PartitionKind['MessageKey'],
  value: MessageKeyValue
};

export type Partitioning = Balanced | PartitionId | MessageKey;

const Balanced: Balanced = {
  kind: PartitionKind.Balanced,
  value: null
};

const PartitionId = (id: number): PartitionId => ({
  kind: PartitionKind.PartitionId,
  value: id
});

const MessageKey = (key: MessageKeyValue): MessageKey => ({
  kind: PartitionKind.MessageKey,
  value: key
});

// Helper
export const Partitioning = {
  Balanced,
  PartitionId,
  MessageKey
};

export const serializeMessageKey = (v: MessageKeyValue) => {
  if (v instanceof Buffer) return v;
  if ('string' === typeof v) return Buffer.from(v);
  if ('number' === typeof v) return uint32ToBuf(v);
  if ('bigint' === typeof v) return uint64ToBuf(v);
  throw new Error(`cannot serialize messageKey ${v}, ${typeof v}`);
};

export const serializePartitioningValue = (part: Partitioning): Buffer => {
  const { kind, value } = part;
  switch (kind) {
    case PartitionKind.Balanced: return Buffer.alloc(0);
    case PartitionKind.PartitionId: return uint32ToBuf(value);
    case PartitionKind.MessageKey: return serializeMessageKey(value);
  }
};

export const default_partionning: Balanced = {
  kind: PartitionKind.Balanced,
  value: null
};

export const serializePartitioning = (p?: Partitioning) => {
  const part = p || default_partionning;
  const b = Buffer.alloc(2);
  const bValue = serializePartitioningValue(part);
  b.writeUint8(part.kind);
  b.writeUint8(bValue.length, 1);
  return Buffer.concat([
    b,
    bValue
  ]);
};


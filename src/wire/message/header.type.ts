import { type ValueOf, reverseRecord } from "../../type.utils.js";

export const HeaderKind = {
  Raw: 1,
  String: 2,
  Bool: 3,
  Int8: 4,
  Int16: 5,
  Int32: 6,
  Int64: 7,
  Int128: 8,
  Uint8: 9,
  Uint16: 10,
  Uint32: 11,
  Uint64: 12,
  Uint128: 13,
  Float: 14,
  Double: 15
} as const;

export type HeaderKind = typeof HeaderKind;
export type HeaderKindId = keyof HeaderKind;
export type HeaderKindValue = ValueOf<HeaderKind>;
export const ReverseHeaderKind = reverseRecord(HeaderKind);

export type HeaderValueRaw = {
  kind: HeaderKind['Raw'],
  value: Buffer
}

export type HeaderValueString = {
  kind: HeaderKind['String']
  value: string
}

export type HeaderValueBool = {
  kind: HeaderKind['Bool'],
  value: boolean
}

export type HeaderValueInt8 = {
  kind: HeaderKind['Int8'],
  value: number
}

export type HeaderValueInt16 = {
  kind: HeaderKind['Int16'],
  value: number
};

export type HeaderValueInt32 = {
  kind: HeaderKind['Int32'],
  value: number
}

export type HeaderValueInt64 = {
  kind: HeaderKind['Int64'],
  value: bigint
}

export type HeaderValueInt128 = {
  kind: HeaderKind['Int128'],
  value: Buffer // | ArrayBuffer // ?
}

export type HeaderValueUint8 = {
  kind: HeaderKind['Uint8'],
  value: number
}

export type HeaderValueUint16 = {
  kind: HeaderKind['Uint16'],
  value: number
}

export type HeaderValueUint32 = {
  kind: HeaderKind['Uint32'],
  value: number
}

export type HeaderValueUint64 = {
  kind: HeaderKind['Uint64'],
  value: bigint
}

export type HeaderValueUint128 = {
  kind: HeaderKind['Uint128'],
  value: Buffer // | ArrayBuffer // ?
}

export type HeaderValueFloat = {
  kind: HeaderKind['Float'],
  value: number
}

export type HeaderValueDouble = {
  kind: HeaderKind['Double'],
  value: number
}

// export type HeaderValue =
//   HeaderValueRaw |
//   HeaderValueString |
//   HeaderValueBool |
//   HeaderValueInt8 |
//   HeaderValueInt16 |
//   HeaderValueInt32 |
//   HeaderValueInt64 |
//   HeaderValueInt128 |
//   HeaderValueUint8 |
//   HeaderValueUint16 |
//   HeaderValueUint32 |
//   HeaderValueUint64 |
//   HeaderValueUint128 |
//   HeaderValueFloat |
//   HeaderValueDouble;

// export type Headers = Record<string, HeaderValue>;

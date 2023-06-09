type NullPointerType = number & { _null_pointer_marker: never };

/** @internal */
export type PointerType =
  | NullPointerType
  | (number & { _pointer_marker: never });

export type UniquePointerType<TMarker extends string> =
  | NullPointerType
  | (number & {
      _pointer_marker: never;
    } & {
      [P in TMarker]: never;
    });

export const INVALID_POINTER: NullPointerType = 0 as any as NullPointerType;
